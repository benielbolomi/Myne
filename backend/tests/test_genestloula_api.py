"""
GenestLoula E-commerce API Tests
Tests for products, events, testimonials, newsletter, cart, and admin endpoints
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestHealthAndBasicEndpoints:
    """Basic API health and root endpoint tests"""
    
    def test_api_root(self):
        """Test API root endpoint returns message"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert data["message"] == "GenestLoula API"
        print("PASS: API root endpoint working")


class TestProductsEndpoints:
    """Products CRUD tests"""
    
    def test_get_all_products(self):
        """Test GET /api/products returns at least 6 products"""
        response = requests.get(f"{BASE_URL}/api/products")
        assert response.status_code == 200
        products = response.json()
        assert isinstance(products, list)
        assert len(products) >= 6, f"Expected at least 6 products, got {len(products)}"
        print(f"PASS: GET /api/products returns {len(products)} products")
        
    def test_products_have_required_fields(self):
        """Test products have all required fields"""
        response = requests.get(f"{BASE_URL}/api/products")
        assert response.status_code == 200
        products = response.json()
        
        required_fields = ["id", "name", "price", "image", "stock", "category"]
        for product in products:
            for field in required_fields:
                assert field in product, f"Product missing field: {field}"
        print("PASS: All products have required fields")
        
    def test_get_single_product(self):
        """Test GET /api/products/{id} returns specific product"""
        response = requests.get(f"{BASE_URL}/api/products/prod-1")
        assert response.status_code == 200
        product = response.json()
        assert product["id"] == "prod-1"
        assert product["name"] == "Chemise Nike"
        print(f"PASS: GET /api/products/prod-1 returns {product['name']}")
        
    def test_get_nonexistent_product(self):
        """Test GET /api/products/{id} returns 404 for nonexistent product"""
        response = requests.get(f"{BASE_URL}/api/products/nonexistent-id")
        assert response.status_code == 404
        print("PASS: GET nonexistent product returns 404")
        
    def test_products_with_nouveau_badge(self):
        """Test products with 'Nouveau' badge exist"""
        response = requests.get(f"{BASE_URL}/api/products")
        assert response.status_code == 200
        products = response.json()
        nouveau_products = [p for p in products if p.get("badge") == "Nouveau"]
        assert len(nouveau_products) >= 2, f"Expected at least 2 products with 'Nouveau' badge, got {len(nouveau_products)}"
        print(f"PASS: Found {len(nouveau_products)} products with 'Nouveau' badge")


class TestEventsEndpoints:
    """Events endpoint tests"""
    
    def test_get_all_events(self):
        """Test GET /api/events returns at least 2 events"""
        response = requests.get(f"{BASE_URL}/api/events")
        assert response.status_code == 200
        events = response.json()
        assert isinstance(events, list)
        assert len(events) >= 2, f"Expected at least 2 events, got {len(events)}"
        print(f"PASS: GET /api/events returns {len(events)} events")
        
    def test_events_have_required_fields(self):
        """Test events have all required fields"""
        response = requests.get(f"{BASE_URL}/api/events")
        assert response.status_code == 200
        events = response.json()
        
        required_fields = ["id", "title", "description", "date"]
        for event in events:
            for field in required_fields:
                assert field in event, f"Event missing field: {field}"
        print("PASS: All events have required fields")


class TestTestimonialsEndpoints:
    """Testimonials endpoint tests"""
    
    def test_get_all_testimonials(self):
        """Test GET /api/testimonials returns at least 3 testimonials"""
        response = requests.get(f"{BASE_URL}/api/testimonials")
        assert response.status_code == 200
        testimonials = response.json()
        assert isinstance(testimonials, list)
        assert len(testimonials) >= 3, f"Expected at least 3 testimonials, got {len(testimonials)}"
        print(f"PASS: GET /api/testimonials returns {len(testimonials)} testimonials")
        
    def test_testimonials_have_required_fields(self):
        """Test testimonials have all required fields"""
        response = requests.get(f"{BASE_URL}/api/testimonials")
        assert response.status_code == 200
        testimonials = response.json()
        
        required_fields = ["id", "name", "avatar", "comment"]
        for testimonial in testimonials:
            for field in required_fields:
                assert field in testimonial, f"Testimonial missing field: {field}"
        print("PASS: All testimonials have required fields")


class TestNewsletterEndpoints:
    """Newsletter subscription tests"""
    
    def test_subscribe_newsletter(self):
        """Test POST /api/newsletter subscribes email"""
        test_email = f"test_{uuid.uuid4().hex[:8]}@example.com"
        response = requests.post(f"{BASE_URL}/api/newsletter?email={test_email}")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert data["message"] == "Subscribed successfully"
        print(f"PASS: Newsletter subscription works for {test_email}")


class TestCartEndpoints:
    """Cart CRUD tests"""
    
    def test_create_cart(self):
        """Test POST /api/cart creates new cart"""
        response = requests.post(f"{BASE_URL}/api/cart")
        assert response.status_code == 200
        cart = response.json()
        assert "session_id" in cart
        assert "items" in cart
        assert isinstance(cart["items"], list)
        print(f"PASS: Cart created with session_id: {cart['session_id'][:20]}...")
        
    def test_get_cart(self):
        """Test GET /api/cart/{session_id} returns cart"""
        # First create a cart
        create_response = requests.post(f"{BASE_URL}/api/cart")
        session_id = create_response.json()["session_id"]
        
        # Then get it
        response = requests.get(f"{BASE_URL}/api/cart/{session_id}")
        assert response.status_code == 200
        cart = response.json()
        assert cart["session_id"] == session_id
        print(f"PASS: GET cart returns correct session_id")
        
    def test_add_to_cart(self):
        """Test POST /api/cart/{session_id}/add adds item to cart"""
        # Create cart
        create_response = requests.post(f"{BASE_URL}/api/cart")
        session_id = create_response.json()["session_id"]
        
        # Add product to cart
        add_response = requests.post(
            f"{BASE_URL}/api/cart/{session_id}/add",
            json={"product_id": "prod-1", "quantity": 2}
        )
        assert add_response.status_code == 200
        data = add_response.json()
        assert "message" in data
        assert data["message"] == "Item added to cart"
        
        # Verify item in cart
        cart = data["cart"]
        assert len(cart["items"]) == 1
        assert cart["items"][0]["product_id"] == "prod-1"
        assert cart["items"][0]["quantity"] == 2
        print("PASS: Add to cart works correctly")
        
    def test_add_to_cart_nonexistent_product(self):
        """Test adding nonexistent product returns 404"""
        create_response = requests.post(f"{BASE_URL}/api/cart")
        session_id = create_response.json()["session_id"]
        
        response = requests.post(
            f"{BASE_URL}/api/cart/{session_id}/add",
            json={"product_id": "nonexistent", "quantity": 1}
        )
        assert response.status_code == 404
        print("PASS: Adding nonexistent product returns 404")
        
    def test_remove_from_cart(self):
        """Test DELETE /api/cart/{session_id}/item/{product_id} removes item"""
        # Create cart and add item
        create_response = requests.post(f"{BASE_URL}/api/cart")
        session_id = create_response.json()["session_id"]
        
        requests.post(
            f"{BASE_URL}/api/cart/{session_id}/add",
            json={"product_id": "prod-1", "quantity": 1}
        )
        
        # Remove item
        response = requests.delete(f"{BASE_URL}/api/cart/{session_id}/item/prod-1")
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Item removed from cart"
        print("PASS: Remove from cart works correctly")


class TestAdminStatsEndpoint:
    """Admin stats endpoint tests"""
    
    def test_get_admin_stats(self):
        """Test GET /api/admin/stats returns dashboard statistics"""
        response = requests.get(f"{BASE_URL}/api/admin/stats")
        assert response.status_code == 200
        stats = response.json()
        
        required_fields = ["products", "events", "testimonials", "newsletter_subscribers", "active_carts", "potential_revenue"]
        for field in required_fields:
            assert field in stats, f"Stats missing field: {field}"
            
        assert stats["products"] >= 6
        assert stats["events"] >= 2
        assert stats["testimonials"] >= 3
        print(f"PASS: Admin stats - Products: {stats['products']}, Events: {stats['events']}, Testimonials: {stats['testimonials']}")


class TestAdminProductsCRUD:
    """Admin products CRUD tests"""
    
    def test_create_product(self):
        """Test POST /api/admin/products creates new product"""
        test_product = {
            "name": "TEST_Product",
            "price": 99.99,
            "image": "https://example.com/test.jpg",
            "stock": 10,
            "badge": "Nouveau",
            "category": "Test",
            "description": "Test product description"
        }
        
        response = requests.post(f"{BASE_URL}/api/admin/products", json=test_product)
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Product created"
        assert "product" in data
        assert data["product"]["name"] == "TEST_Product"
        
        # Store product ID for cleanup
        product_id = data["product"]["id"]
        print(f"PASS: Product created with id: {product_id}")
        
        # Cleanup - delete the test product
        requests.delete(f"{BASE_URL}/api/admin/products/{product_id}")
        
    def test_update_product(self):
        """Test PUT /api/admin/products/{id} updates product"""
        # First create a test product
        test_product = {
            "name": "TEST_UpdateProduct",
            "price": 50.00,
            "image": "https://example.com/test.jpg",
            "stock": 5,
            "category": "Test"
        }
        create_response = requests.post(f"{BASE_URL}/api/admin/products", json=test_product)
        product_id = create_response.json()["product"]["id"]
        
        # Update the product
        updated_data = {
            "name": "TEST_UpdatedProduct",
            "price": 75.00,
            "image": "https://example.com/updated.jpg",
            "stock": 15,
            "category": "Updated"
        }
        response = requests.put(f"{BASE_URL}/api/admin/products/{product_id}", json=updated_data)
        assert response.status_code == 200
        assert response.json()["message"] == "Product updated"
        
        # Verify update
        get_response = requests.get(f"{BASE_URL}/api/products/{product_id}")
        assert get_response.status_code == 200
        product = get_response.json()
        assert product["name"] == "TEST_UpdatedProduct"
        assert product["price"] == 75.00
        print("PASS: Product updated successfully")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/admin/products/{product_id}")
        
    def test_delete_product(self):
        """Test DELETE /api/admin/products/{id} deletes product"""
        # Create a test product
        test_product = {
            "name": "TEST_DeleteProduct",
            "price": 25.00,
            "image": "https://example.com/test.jpg",
            "stock": 3,
            "category": "Test"
        }
        create_response = requests.post(f"{BASE_URL}/api/admin/products", json=test_product)
        product_id = create_response.json()["product"]["id"]
        
        # Delete the product
        response = requests.delete(f"{BASE_URL}/api/admin/products/{product_id}")
        assert response.status_code == 200
        assert response.json()["message"] == "Product deleted"
        
        # Verify deletion
        get_response = requests.get(f"{BASE_URL}/api/products/{product_id}")
        assert get_response.status_code == 404
        print("PASS: Product deleted successfully")
        
    def test_delete_nonexistent_product(self):
        """Test DELETE nonexistent product returns 404"""
        response = requests.delete(f"{BASE_URL}/api/admin/products/nonexistent-id")
        assert response.status_code == 404
        print("PASS: Delete nonexistent product returns 404")


class TestAdminEventsCRUD:
    """Admin events CRUD tests"""
    
    def test_create_event(self):
        """Test POST /api/admin/events creates new event"""
        test_event = {
            "title": "TEST_Event",
            "description": "Test event description",
            "date": "01 Janvier 2027"
        }
        
        response = requests.post(f"{BASE_URL}/api/admin/events", json=test_event)
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Event created"
        assert data["event"]["title"] == "TEST_Event"
        
        event_id = data["event"]["id"]
        print(f"PASS: Event created with id: {event_id}")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/admin/events/{event_id}")
        
    def test_update_event(self):
        """Test PUT /api/admin/events/{id} updates event"""
        # Create test event
        test_event = {
            "title": "TEST_UpdateEvent",
            "description": "Original description",
            "date": "01 Janvier 2027"
        }
        create_response = requests.post(f"{BASE_URL}/api/admin/events", json=test_event)
        event_id = create_response.json()["event"]["id"]
        
        # Update event
        updated_data = {
            "title": "TEST_UpdatedEvent",
            "description": "Updated description",
            "date": "15 Février 2027"
        }
        response = requests.put(f"{BASE_URL}/api/admin/events/{event_id}", json=updated_data)
        assert response.status_code == 200
        assert response.json()["message"] == "Event updated"
        print("PASS: Event updated successfully")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/admin/events/{event_id}")
        
    def test_delete_event(self):
        """Test DELETE /api/admin/events/{id} deletes event"""
        # Create test event
        test_event = {
            "title": "TEST_DeleteEvent",
            "description": "To be deleted",
            "date": "01 Janvier 2027"
        }
        create_response = requests.post(f"{BASE_URL}/api/admin/events", json=test_event)
        event_id = create_response.json()["event"]["id"]
        
        # Delete event
        response = requests.delete(f"{BASE_URL}/api/admin/events/{event_id}")
        assert response.status_code == 200
        assert response.json()["message"] == "Event deleted"
        print("PASS: Event deleted successfully")


class TestAdminTestimonialsCRUD:
    """Admin testimonials CRUD tests"""
    
    def test_create_testimonial(self):
        """Test POST /api/admin/testimonials creates new testimonial"""
        test_testimonial = {
            "name": "TEST_User",
            "avatar": "https://example.com/avatar.jpg",
            "comment": "Test comment"
        }
        
        response = requests.post(f"{BASE_URL}/api/admin/testimonials", json=test_testimonial)
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Testimonial created"
        assert data["testimonial"]["name"] == "TEST_User"
        
        testimonial_id = data["testimonial"]["id"]
        print(f"PASS: Testimonial created with id: {testimonial_id}")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/admin/testimonials/{testimonial_id}")
        
    def test_delete_testimonial(self):
        """Test DELETE /api/admin/testimonials/{id} deletes testimonial"""
        # Create test testimonial
        test_testimonial = {
            "name": "TEST_DeleteUser",
            "avatar": "https://example.com/avatar.jpg",
            "comment": "To be deleted"
        }
        create_response = requests.post(f"{BASE_URL}/api/admin/testimonials", json=test_testimonial)
        testimonial_id = create_response.json()["testimonial"]["id"]
        
        # Delete testimonial
        response = requests.delete(f"{BASE_URL}/api/admin/testimonials/{testimonial_id}")
        assert response.status_code == 200
        assert response.json()["message"] == "Testimonial deleted"
        print("PASS: Testimonial deleted successfully")


class TestAdminNewsletterAndCarts:
    """Admin newsletter and carts endpoint tests"""
    
    def test_get_newsletter_subscribers(self):
        """Test GET /api/admin/newsletter returns subscribers list"""
        response = requests.get(f"{BASE_URL}/api/admin/newsletter")
        assert response.status_code == 200
        subscribers = response.json()
        assert isinstance(subscribers, list)
        print(f"PASS: GET /api/admin/newsletter returns {len(subscribers)} subscribers")
        
    def test_get_active_carts(self):
        """Test GET /api/admin/carts returns active carts"""
        response = requests.get(f"{BASE_URL}/api/admin/carts")
        assert response.status_code == 200
        carts = response.json()
        assert isinstance(carts, list)
        print(f"PASS: GET /api/admin/carts returns {len(carts)} active carts")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
