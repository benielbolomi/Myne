// Cart Page JavaScript
const API_URL = 'https://trend-minimal.preview.emergentagent.com/api';

function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : { items: [] };
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.items.reduce((total, item) => total + item.quantity, 0);
    const cartCountBadge = document.getElementById('cart-count-header');
    
    if (cartCountBadge) {
        if (count > 0) {
            cartCountBadge.textContent = count;
            cartCountBadge.classList.remove('hidden');
        } else {
            cartCountBadge.classList.add('hidden');
        }
    }
}

function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    
    if (toast && toastMessage) {
        toastMessage.textContent = message;
        toast.classList.remove('hidden');
        
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    }
}

function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) return;
    
    const cart = getCart();
    const item = cart.items.find(i => i.product_id === productId);
    
    if (item) {
        item.quantity = newQuantity;
        saveCart(cart);
        renderCart();
        showToast('Quantité mise à jour');
    }
}

function removeItem(productId) {
    const cart = getCart();
    cart.items = cart.items.filter(item => item.product_id !== productId);
    saveCart(cart);
    renderCart();
    showToast('Article retiré du panier');
}

function getCartTotal() {
    const cart = getCart();
    return cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function renderCart() {
    const cart = getCart();
    const cartContent = document.getElementById('cart-content');
    
    if (!cartContent) return;
    
    if (cart.items.length === 0) {
        cartContent.innerHTML = `
            <div class="text-center py-20" data-testid="empty-cart">
                <p class="text-xl text-text-secondary mb-8">Votre panier est vide</p>
                <a href="/" 
                   class="inline-block px-8 py-4 bg-primary text-white rounded-full font-medium hover:bg-primary-hover transform hover:scale-105 transition-all"
                   data-testid="continue-shopping-button">
                    Continuer vos achats
                </a>
            </div>
        `;
        return;
    }
    
    const total = getCartTotal();
    
    cartContent.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <!-- Cart Items -->
            <div class="lg:col-span-2 space-y-6">
                ${cart.items.map(item => `
                    <div class="bg-white rounded-2xl p-6 shadow-sm border border-black/5 flex gap-6" data-testid="cart-item-${item.product_id}">
                        <img src="${item.image}" 
                             alt="${item.name}" 
                             class="w-24 h-24 object-cover rounded-xl">
                        <div class="flex-1">
                            <h3 class="text-xl font-medium text-text-primary mb-2">${item.name}</h3>
                            <p class="text-lg font-semibold text-primary mb-4">${item.price.toFixed(2)} €</p>
                            
                            <div class="flex items-center gap-4">
                                <!-- Quantity Controls -->
                                <div class="flex items-center gap-2">
                                    <button onclick="updateQuantity('${item.product_id}', ${item.quantity - 1})"
                                            class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                            data-testid="decrease-quantity-${item.product_id}">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                                        </svg>
                                    </button>
                                    <span class="w-12 text-center font-medium" data-testid="quantity-${item.product_id}">
                                        ${item.quantity}
                                    </span>
                                    <button onclick="updateQuantity('${item.product_id}', ${item.quantity + 1})"
                                            class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                            data-testid="increase-quantity-${item.product_id}">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                                        </svg>
                                    </button>
                                </div>
                                
                                <!-- Remove Button -->
                                <button onclick="removeItem('${item.product_id}')"
                                        class="ml-auto p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        data-testid="remove-item-${item.product_id}">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <!-- Order Summary -->
            <div class="lg:col-span-1">
                <div class="bg-white rounded-2xl p-8 shadow-sm border border-black/5 sticky top-24">
                    <h2 class="text-2xl font-medium text-text-primary mb-6 font-heading">
                        Résumé de la commande
                    </h2>
                    
                    <div class="space-y-4 mb-6">
                        <div class="flex justify-between">
                            <span class="text-text-secondary">Sous-total</span>
                            <span class="font-semibold">${total.toFixed(2)} €</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-text-secondary">Livraison</span>
                            <span class="font-semibold">Gratuite</span>
                        </div>
                        <div class="border-t border-border-light pt-4">
                            <div class="flex justify-between text-lg">
                                <span class="font-semibold text-text-primary">Total</span>
                                <span class="font-bold text-primary" data-testid="cart-total">${total.toFixed(2)} €</span>
                            </div>
                        </div>
                    </div>
                    
                    <button class="w-full py-4 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transform hover:scale-105 transition-all duration-200"
                            data-testid="checkout-button">
                        Procéder au paiement
                    </button>
                    
                    <p class="text-sm text-text-secondary text-center mt-4">
                        Le paiement Mobile Money sera disponible à l'étape suivante
                    </p>
                </div>
            </div>
        </div>
    `;
}

// Initialize cart page
function initCartPage() {
    updateCartCount();
    renderCart();
    
    // Set current year
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Run on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCartPage);
} else {
    initCartPage();
}
