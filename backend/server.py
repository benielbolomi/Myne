from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    price: float
    image: str
    stock: int
    badge: Optional[str] = None
    category: str
    description: Optional[str] = None

class ProductCreate(BaseModel):
    name: str
    price: float
    image: str
    stock: int
    badge: Optional[str] = None
    category: str
    description: Optional[str] = None

class CartItem(BaseModel):
    product_id: str
    quantity: int
    name: str
    price: float
    image: str

class Cart(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    session_id: str
    items: List[CartItem] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AddToCartRequest(BaseModel):
    product_id: str
    quantity: int = 1

class Event(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    date: str
    image: Optional[str] = None

class Testimonial(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    avatar: str
    comment: str


# Routes
@api_router.get("/")
async def root():
    return {"message": "GenestLoula API"}

# Products
@api_router.get("/products", response_model=List[Product])
async def get_products():
    products = await db.products.find({}, {"_id": 0}).to_list(1000)
    return products

@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

# Cart
@api_router.post("/cart", response_model=Cart)
async def create_cart():
    session_id = str(uuid.uuid4())
    cart = Cart(session_id=session_id)
    doc = cart.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    await db.carts.insert_one(doc)
    return cart

@api_router.get("/cart/{session_id}", response_model=Cart)
async def get_cart(session_id: str):
    cart = await db.carts.find_one({"session_id": session_id}, {"_id": 0})
    if not cart:
        # Create new cart if not exists
        new_cart = Cart(session_id=session_id)
        doc = new_cart.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        doc['updated_at'] = doc['updated_at'].isoformat()
        await db.carts.insert_one(doc)
        return new_cart
    
    if isinstance(cart.get('created_at'), str):
        cart['created_at'] = datetime.fromisoformat(cart['created_at'])
    if isinstance(cart.get('updated_at'), str):
        cart['updated_at'] = datetime.fromisoformat(cart['updated_at'])
    return cart

@api_router.post("/cart/{session_id}/add")
async def add_to_cart(session_id: str, request: AddToCartRequest):
    # Get product
    product = await db.products.find_one({"id": request.product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Get or create cart
    cart = await db.carts.find_one({"session_id": session_id}, {"_id": 0})
    if not cart:
        cart = {
            "session_id": session_id,
            "items": [],
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        await db.carts.insert_one(cart)
    
    # Check if product already in cart
    item_exists = False
    for item in cart['items']:
        if item['product_id'] == request.product_id:
            item['quantity'] += request.quantity
            item_exists = True
            break
    
    if not item_exists:
        cart['items'].append({
            "product_id": product['id'],
            "quantity": request.quantity,
            "name": product['name'],
            "price": product['price'],
            "image": product['image']
        })
    
    cart['updated_at'] = datetime.now(timezone.utc).isoformat()
    await db.carts.update_one(
        {"session_id": session_id},
        {"$set": {"items": cart['items'], "updated_at": cart['updated_at']}}
    )
    
    return {"message": "Item added to cart", "cart": cart}

@api_router.delete("/cart/{session_id}/item/{product_id}")
async def remove_from_cart(session_id: str, product_id: str):
    cart = await db.carts.find_one({"session_id": session_id}, {"_id": 0})
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    
    cart['items'] = [item for item in cart['items'] if item['product_id'] != product_id]
    cart['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    await db.carts.update_one(
        {"session_id": session_id},
        {"$set": {"items": cart['items'], "updated_at": cart['updated_at']}}
    )
    
    return {"message": "Item removed from cart"}

@api_router.put("/cart/{session_id}/item/{product_id}")
async def update_cart_quantity(session_id: str, product_id: str, quantity: int):
    cart = await db.carts.find_one({"session_id": session_id}, {"_id": 0})
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    
    for item in cart['items']:
        if item['product_id'] == product_id:
            item['quantity'] = quantity
            break
    
    cart['updated_at'] = datetime.now(timezone.utc).isoformat()
    await db.carts.update_one(
        {"session_id": session_id},
        {"$set": {"items": cart['items'], "updated_at": cart['updated_at']}}
    )
    
    return {"message": "Quantity updated"}

# Events
@api_router.get("/events", response_model=List[Event])
async def get_events():
    events = await db.events.find({}, {"_id": 0}).to_list(1000)
    return events

# Testimonials
@api_router.get("/testimonials", response_model=List[Testimonial])
async def get_testimonials():
    testimonials = await db.testimonials.find({}, {"_id": 0}).to_list(1000)
    return testimonials

# Newsletter
@api_router.post("/newsletter")
async def subscribe_newsletter(email: str):
    doc = {
        "email": email,
        "subscribed_at": datetime.now(timezone.utc).isoformat()
    }
    await db.newsletter.insert_one(doc)
    return {"message": "Subscribed successfully"}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
