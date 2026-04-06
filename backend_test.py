import requests
import sys
import json
from datetime import datetime

class GenestLoulaAPITester:
    def __init__(self, base_url="https://trend-minimal.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.session_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, params=params)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                except:
                    print(f"   Response: {response.text[:200]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")

            self.test_results.append({
                "name": name,
                "method": method,
                "endpoint": endpoint,
                "expected_status": expected_status,
                "actual_status": response.status_code,
                "success": success,
                "response": response.text[:500] if not success else "OK"
            })

            return success, response.json() if success and response.text else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.test_results.append({
                "name": name,
                "method": method,
                "endpoint": endpoint,
                "expected_status": expected_status,
                "actual_status": "ERROR",
                "success": False,
                "response": str(e)
            })
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test("Root API", "GET", "", 200)

    def test_get_products(self):
        """Test getting all products"""
        success, response = self.run_test("Get Products", "GET", "products", 200)
        if success and isinstance(response, list):
            print(f"   Found {len(response)} products")
            # Check if we have the expected 6 products
            expected_products = ["Chemise Nike", "T-shirt Nike", "Air Force", "Sweat beige", "Veste", "Robe"]
            found_products = [p.get('name', '') for p in response]
            print(f"   Products found: {found_products}")
            
            # Check for badges
            badges = [p.get('badge') for p in response if p.get('badge')]
            print(f"   Badges found: {badges}")
        return success, response

    def test_get_single_product(self, product_id):
        """Test getting a single product"""
        return self.run_test(f"Get Product {product_id}", "GET", f"products/{product_id}", 200)

    def test_create_cart(self):
        """Test creating a new cart"""
        success, response = self.run_test("Create Cart", "POST", "cart", 200)
        if success and 'session_id' in response:
            self.session_id = response['session_id']
            print(f"   Created cart with session_id: {self.session_id}")
        return success, response

    def test_get_cart(self, session_id):
        """Test getting cart by session_id"""
        return self.run_test(f"Get Cart", "GET", f"cart/{session_id}", 200)

    def test_add_to_cart(self, session_id, product_id, quantity=1):
        """Test adding item to cart"""
        data = {"product_id": product_id, "quantity": quantity}
        return self.run_test(f"Add to Cart", "POST", f"cart/{session_id}/add", 200, data=data)

    def test_update_cart_quantity(self, session_id, product_id, quantity):
        """Test updating cart item quantity"""
        return self.run_test(f"Update Quantity", "PUT", f"cart/{session_id}/item/{product_id}", 200, params={"quantity": quantity})

    def test_remove_from_cart(self, session_id, product_id):
        """Test removing item from cart"""
        return self.run_test(f"Remove from Cart", "DELETE", f"cart/{session_id}/item/{product_id}", 200)

    def test_get_events(self):
        """Test getting events"""
        success, response = self.run_test("Get Events", "GET", "events", 200)
        if success and isinstance(response, list):
            print(f"   Found {len(response)} events")
        return success, response

    def test_get_testimonials(self):
        """Test getting testimonials"""
        success, response = self.run_test("Get Testimonials", "GET", "testimonials", 200)
        if success and isinstance(response, list):
            print(f"   Found {len(response)} testimonials")
        return success, response

    def test_newsletter_subscription(self):
        """Test newsletter subscription"""
        test_email = f"test_{datetime.now().strftime('%H%M%S')}@example.com"
        return self.run_test("Newsletter Subscription", "POST", f"newsletter?email={test_email}", 200)

def main():
    print("🚀 Starting GenestLoula API Tests...")
    tester = GenestLoulaAPITester()
    
    # Test basic endpoints
    print("\n=== BASIC API TESTS ===")
    tester.test_root_endpoint()
    
    # Test products
    print("\n=== PRODUCT TESTS ===")
    success, products = tester.test_get_products()
    
    product_id = None
    if success and products:
        product_id = products[0].get('id')
        if product_id:
            tester.test_get_single_product(product_id)
    
    # Test cart functionality
    print("\n=== CART TESTS ===")
    success, cart_response = tester.test_create_cart()
    
    if success and tester.session_id:
        # Test getting cart
        tester.test_get_cart(tester.session_id)
        
        # Test adding to cart
        if product_id:
            add_success, _ = tester.test_add_to_cart(tester.session_id, product_id, 2)
            
            if add_success:
                # Test updating quantity
                tester.test_update_cart_quantity(tester.session_id, product_id, 3)
                
                # Test removing from cart
                tester.test_remove_from_cart(tester.session_id, product_id)
    
    # Test other endpoints
    print("\n=== OTHER ENDPOINT TESTS ===")
    tester.test_get_events()
    tester.test_get_testimonials()
    tester.test_newsletter_subscription()
    
    # Print final results
    print(f"\n📊 FINAL RESULTS:")
    print(f"Tests passed: {tester.tests_passed}/{tester.tests_run}")
    print(f"Success rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    # Print failed tests
    failed_tests = [test for test in tester.test_results if not test['success']]
    if failed_tests:
        print(f"\n❌ FAILED TESTS ({len(failed_tests)}):")
        for test in failed_tests:
            print(f"   - {test['name']}: {test['actual_status']} (expected {test['expected_status']})")
            if test['response'] != "OK":
                print(f"     Response: {test['response'][:100]}...")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())