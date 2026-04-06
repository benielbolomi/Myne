// Configuration
const API_URL = 'https://trend-minimal.preview.emergentagent.com/api';

// Utility Functions
function generateSessionId() {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function getSessionId() {
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
        sessionId = generateSessionId();
        localStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
}

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
    const cartCountBadge = document.getElementById('cart-count');
    
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

function getBadgeColor(badge) {
    if (!badge) return '';
    if (badge === 'Nouveau') return 'bg-black text-white';
    if (badge === 'Promotion') return 'bg-primary text-white';
    if (badge === 'Rupture imminente') return 'bg-red-600 text-white';
    return 'bg-black text-white';
}

// API Functions
async function fetchProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

async function fetchEvents() {
    try {
        const response = await fetch(`${API_URL}/events`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching events:', error);
        return [];
    }
}

async function fetchTestimonials() {
    try {
        const response = await fetch(`${API_URL}/testimonials`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching testimonials:', error);
        return [];
    }
}

async function subscribeNewsletter(email) {
    try {
        const response = await fetch(`${API_URL}/newsletter?email=${email}`, {
            method: 'POST'
        });
        return response.ok;
    } catch (error) {
        console.error('Error subscribing to newsletter:', error);
        return false;
    }
}

// Cart Functions
function addToCart(product) {
    const cart = getCart();
    const existingItem = cart.items.find(item => item.product_id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.items.push({
            product_id: product.id,
            quantity: 1,
            name: product.name,
            price: product.price,
            image: product.image
        });
    }
    
    saveCart(cart);
    
    // Sync with backend
    syncCartWithBackend();
    
    showToast(`${product.name} ajouté au panier!`);
}

async function syncCartWithBackend() {
    const sessionId = getSessionId();
    const cart = getCart();
    
    try {
        // This would sync with backend if needed
        // For now we use localStorage
    } catch (error) {
        console.error('Error syncing cart:', error);
    }
}

// Render Functions
function renderProductCard(product, index) {
    return `
        <div class="bg-white rounded-2xl p-4 shadow-sm border border-black/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group" 
             data-testid="product-card-${product.id}">
            <div class="relative mb-4 overflow-hidden rounded-xl">
                <img src="${product.image}" 
                     alt="${product.name}" 
                     class="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-500">
                ${product.badge ? `
                    <span class="absolute top-3 right-3 px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full ${getBadgeColor(product.badge)}"
                          data-testid="product-badge-${product.id}">
                        ${product.badge}
                    </span>
                ` : ''}
            </div>
            
            <div>
                <h3 class="text-xl font-medium text-text-primary mb-2 font-heading" data-testid="product-name-${product.id}">
                    ${product.name}
                </h3>
                <div class="flex items-center justify-between mb-4">
                    <p class="text-2xl font-semibold text-primary" data-testid="product-price-${product.id}">
                        ${product.price.toFixed(2)} €
                    </p>
                    <p class="text-sm text-text-secondary" data-testid="product-stock-${product.id}">
                        Stock: ${product.stock}
                    </p>
                </div>
                
                <button onclick="addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})"
                        class="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                        data-testid="product-add-to-cart-${product.id}">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                    Commander
                </button>
            </div>
        </div>
    `;
}

function renderEvent(event) {
    return `
        <div class="bg-secondary rounded-3xl p-10 sm:p-16 flex flex-col md:flex-row items-center justify-between gap-8"
             data-testid="event-${event.id}">
            <div class="flex-1">
                <h3 class="text-2xl sm:text-3xl font-medium text-text-primary mb-4 font-heading">
                    ${event.title}
                </h3>
                <p class="text-base text-text-secondary mb-4 leading-relaxed">
                    ${event.description}
                </p>
                <div class="flex items-center gap-2 text-primary">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <span class="font-medium">${event.date}</span>
                </div>
            </div>
        </div>
    `;
}

function renderTestimonial(testimonial) {
    return `
        <div class="bg-bg-main rounded-2xl p-8 border border-border-light" data-testid="testimonial-${testimonial.id}">
            <svg class="w-10 h-10 text-primary mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
            <p class="text-base italic text-text-secondary mb-6 leading-relaxed">
                "${testimonial.comment}"
            </p>
            <div class="flex items-center gap-4">
                <img src="${testimonial.avatar}" 
                     alt="${testimonial.name}" 
                     class="w-12 h-12 rounded-full object-cover">
                <div>
                    <p class="font-semibold text-text-primary">${testimonial.name}</p>
                    <p class="text-sm text-text-secondary">Client vérifié</p>
                </div>
            </div>
        </div>
    `;
}

// Initialize Page
async function initHomePage() {
    // Update cart count
    updateCartCount();
    
    // Set current year in footer
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Load products
    const products = await fetchProducts();
    const productsGrid = document.getElementById('products-grid');
    if (productsGrid && products.length > 0) {
        productsGrid.innerHTML = products.map((product, index) => renderProductCard(product, index)).join('');
    }
    
    // Load new arrivals
    const newArrivals = products.filter(p => p.badge === 'Nouveau');
    const newArrivalsGrid = document.getElementById('new-arrivals-grid');
    if (newArrivalsGrid && newArrivals.length > 0) {
        newArrivalsGrid.innerHTML = newArrivals.map((product, index) => renderProductCard(product, index)).join('');
    }
    
    // Load events
    const events = await fetchEvents();
    const eventsContainer = document.getElementById('events-container');
    if (eventsContainer && events.length > 0) {
        eventsContainer.innerHTML = events.map(event => renderEvent(event)).join('');
    }
    
    // Load testimonials
    const testimonials = await fetchTestimonials();
    const testimonialsGrid = document.getElementById('testimonials-grid');
    if (testimonialsGrid && testimonials.length > 0) {
        testimonialsGrid.innerHTML = testimonials.map(testimonial => renderTestimonial(testimonial)).join('');
    }
    
    // Newsletter form
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('newsletter-email');
            const email = emailInput.value;
            
            const success = await subscribeNewsletter(email);
            if (success) {
                showToast('Merci pour votre inscription!');
                emailInput.value = '';
            } else {
                showToast('Une erreur est survenue. Veuillez réessayer.');
            }
        });
    }
}

// Run on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHomePage);
} else {
    initHomePage();
}
