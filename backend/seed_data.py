import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

async def seed_database():
    # Clear existing data
    await db.products.delete_many({})
    await db.events.delete_many({})
    await db.testimonials.delete_many({})
    
    # Products
    products = [
        {
            "id": "prod-1",
            "name": "Chemise Nike",
            "price": 45.99,
            "image": "https://images.unsplash.com/photo-1585032767761-878270336a0b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwxfHxuaWtlJTIwc2hpcnR8ZW58MHx8fHwxNzc1NDg5NzY0fDA&ixlib=rb-4.1.0&q=85",
            "stock": 25,
            "badge": None,
            "category": "Chemises",
            "description": "Chemise Nike élégante et confortable"
        },
        {
            "id": "prod-2",
            "name": "T-shirt Nike",
            "price": 29.99,
            "image": "https://images.pexels.com/photos/8386654/pexels-photo-8386654.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
            "stock": 40,
            "badge": "Nouveau",
            "category": "T-shirts",
            "description": "T-shirt Nike moderne et tendance"
        },
        {
            "id": "prod-3",
            "name": "Black Skate Air Force Nike",
            "price": 120.00,
            "image": "https://images.unsplash.com/photo-1643535170091-319c6fe2e191?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODR8MHwxfHNlYXJjaHwxfHxibGFjayUyMG5pa2UlMjBzbmVha2Vyc3xlbnwwfHx8fDE3NzU0ODk3NjR8MA&ixlib=rb-4.1.0&q=85",
            "stock": 15,
            "badge": None,
            "category": "Chaussures",
            "description": "Sneakers Nike Air Force noires"
        },
        {
            "id": "prod-4",
            "name": "Sweat beige oversize",
            "price": 65.00,
            "image": "https://images.unsplash.com/photo-1773747310659-9b331019c5c2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTV8MHwxfHNlYXJjaHwxfHxiZWlnZSUyMHN3ZWF0ZXJ8ZW58MHx8fHwxNzc1NDg5NzY0fDA&ixlib=rb-4.1.0&q=85",
            "stock": 30,
            "badge": "Nouveau",
            "category": "Sweats",
            "description": "Sweat oversize beige tendance"
        },
        {
            "id": "prod-5",
            "name": "Veste chic homme",
            "price": 89.99,
            "image": "https://images.unsplash.com/photo-1764593008673-af6056758b4a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MDV8MHwxfHNlYXJjaHwxfHxtZW5zJTIwZWxlZ2FudCUyMGphY2tldHxlbnwwfHx8fDE3NzU0ODk3NjR8MA&ixlib=rb-4.1.0&q=85",
            "stock": 20,
            "badge": None,
            "category": "Vestes",
            "description": "Veste élégante pour homme"
        },
        {
            "id": "prod-6",
            "name": "Robe moderne beige",
            "price": 75.00,
            "image": "https://images.unsplash.com/photo-1723284482895-6618d25b86f9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzF8MHwxfHNlYXJjaHwxfHxiZWlnZSUyMGRyZXNzfGVufDB8fHx8MTc3NTQ4OTc2NHww&ixlib=rb-4.1.0&q=85",
            "stock": 8,
            "badge": "Rupture imminente",
            "category": "Robes",
            "description": "Robe moderne beige élégante"
        }
    ]
    
    await db.products.insert_many(products)
    
    # Events
    events = [
        {
            "id": "event-1",
            "title": "Nouvelle Collection Printemps",
            "description": "Découvrez notre toute nouvelle collection printemps avec des designs exclusifs et modernes",
            "date": "15 Mars 2026",
            "image": None
        },
        {
            "id": "event-2",
            "title": "Promotion -30% sur tous les sweats",
            "description": "Profitez de notre grande promotion sur tous les sweats pendant 48h",
            "date": "28 Février 2026",
            "image": None
        }
    ]
    
    await db.events.insert_many(events)
    
    # Testimonials
    testimonials = [
        {
            "id": "test-1",
            "name": "Sophie Martin",
            "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
            "comment": "Qualité exceptionnelle ! Les vêtements sont élégants et très confortables. Je recommande vivement GenestLoula."
        },
        {
            "id": "test-2",
            "name": "Thomas Dubois",
            "avatar": "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80",
            "comment": "Un service impeccable et des produits de qualité premium. C'est devenu ma boutique favorite."
        },
        {
            "id": "test-3",
            "name": "Marie Laurent",
            "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
            "comment": "Je suis fan ! Les designs sont modernes et intemporels. Parfait pour toutes les occasions."
        }
    ]
    
    await db.testimonials.insert_many(testimonials)
    
    print("Database seeded successfully!")
    print(f"Added {len(products)} products")
    print(f"Added {len(events)} events")
    print(f"Added {len(testimonials)} testimonials")

if __name__ == "__main__":
    asyncio.run(seed_database())
