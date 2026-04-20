// Admin Configuration
const API_URL = 'https://trend-minimal.preview.emergentagent.com/api';
let currentTab = 'products';

// Toast
function showToast(message) {
    const toast = document.getElementById('toast');
    const msg = document.getElementById('toast-message');
    if (toast && msg) {
        msg.textContent = message;
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 3000);
    }
}

// Modal
function openModal(title, bodyHtml) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = bodyHtml;
    document.getElementById('modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modal').classList.add('hidden');
}

// Tabs
function switchTab(tab) {
    currentTab = tab;
    ['products', 'events', 'testimonials', 'newsletter', 'carts'].forEach(t => {
        const btn = document.getElementById('tab-' + t);
        btn.className = btn.className.replace(/tab-active|tab-inactive/g, '').trim();
        btn.classList.add(t === tab ? 'tab-active' : 'tab-inactive');
    });
    loadTabContent(tab);
}

// API Helpers
async function api(url, method = 'GET', body = null) {
    const opts = { method, headers: { 'Content-Type': 'application/json' } };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(url, opts);
    return res.json();
}

// ==========================================
// STATS
// ==========================================
async function loadStats() {
    const stats = await api(`${API_URL}/admin/stats`);
    const grid = document.getElementById('stats-grid');
    grid.innerHTML = `
        <div class="bg-white rounded-xl p-5 border border-border-light text-center">
            <p class="text-3xl font-bold text-primary">${stats.products}</p>
            <p class="text-sm text-text-secondary mt-1">Produits</p>
        </div>
        <div class="bg-white rounded-xl p-5 border border-border-light text-center">
            <p class="text-3xl font-bold text-primary">${stats.events}</p>
            <p class="text-sm text-text-secondary mt-1">Événements</p>
        </div>
        <div class="bg-white rounded-xl p-5 border border-border-light text-center">
            <p class="text-3xl font-bold text-primary">${stats.testimonials}</p>
            <p class="text-sm text-text-secondary mt-1">Témoignages</p>
        </div>
        <div class="bg-white rounded-xl p-5 border border-border-light text-center">
            <p class="text-3xl font-bold text-primary">${stats.newsletter_subscribers}</p>
            <p class="text-sm text-text-secondary mt-1">Abonnés</p>
        </div>
        <div class="bg-white rounded-xl p-5 border border-border-light text-center">
            <p class="text-3xl font-bold text-primary">${stats.active_carts}</p>
            <p class="text-sm text-text-secondary mt-1">Paniers actifs</p>
        </div>
        <div class="bg-white rounded-xl p-5 border border-border-light text-center">
            <p class="text-3xl font-bold text-primary">${stats.potential_revenue}</p>
            <p class="text-sm text-text-secondary mt-1">Revenu potentiel</p>
        </div>
    `;
}

// ==========================================
// PRODUCTS
// ==========================================
async function loadProducts() {
    const products = await api(`${API_URL}/products`);
    const content = document.getElementById('tab-content');
    
    content.innerHTML = `
        <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-heading font-medium text-text-primary">Gestion des Produits</h2>
            <button onclick="openProductForm()" class="px-5 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition-all" data-testid="add-product-btn">
                + Ajouter un produit
            </button>
        </div>
        <div class="bg-white rounded-2xl border border-border-light overflow-hidden">
            <table class="w-full">
                <thead class="bg-bg-main border-b border-border-light">
                    <tr>
                        <th class="text-left p-4 text-sm font-semibold text-text-secondary">Image</th>
                        <th class="text-left p-4 text-sm font-semibold text-text-secondary">Nom</th>
                        <th class="text-left p-4 text-sm font-semibold text-text-secondary hidden sm:table-cell">Prix</th>
                        <th class="text-left p-4 text-sm font-semibold text-text-secondary hidden md:table-cell">Stock</th>
                        <th class="text-left p-4 text-sm font-semibold text-text-secondary hidden md:table-cell">Badge</th>
                        <th class="text-left p-4 text-sm font-semibold text-text-secondary hidden lg:table-cell">Catégorie</th>
                        <th class="text-right p-4 text-sm font-semibold text-text-secondary">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${products.map(p => `
                        <tr class="border-b border-border-light hover:bg-bg-main/50 transition-colors" data-testid="product-row-${p.id}">
                            <td class="p-4"><img src="${p.image}" alt="${p.name}" class="w-14 h-14 rounded-lg object-cover"></td>
                            <td class="p-4 font-medium text-text-primary">${p.name}</td>
                            <td class="p-4 text-primary font-semibold hidden sm:table-cell">${p.price.toFixed(2)} &euro;</td>
                            <td class="p-4 hidden md:table-cell">${p.stock}</td>
                            <td class="p-4 hidden md:table-cell">${p.badge ? `<span class="px-2 py-1 text-xs rounded-full ${p.badge === 'Nouveau' ? 'bg-black text-white' : p.badge === 'Rupture imminente' ? 'bg-red-600 text-white' : 'bg-primary text-white'}">${p.badge}</span>` : '-'}</td>
                            <td class="p-4 text-text-secondary hidden lg:table-cell">${p.category}</td>
                            <td class="p-4 text-right">
                                <button onclick='editProduct(${JSON.stringify(p).replace(/'/g, "&#39;")})' class="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors" title="Modifier">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                </button>
                                <button onclick="deleteProduct('${p.id}')" class="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors" title="Supprimer">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            ${products.length === 0 ? '<p class="text-center py-10 text-text-secondary">Aucun produit</p>' : ''}
        </div>
    `;
}

function openProductForm(product = null) {
    const isEdit = !!product;
    openModal(isEdit ? 'Modifier le produit' : 'Ajouter un produit', `
        <form id="product-form" class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-text-primary mb-1">Nom</label>
                <input type="text" name="name" value="${product ? product.name : ''}" required class="w-full px-4 py-2.5 rounded-xl border border-border-light focus:outline-none focus:ring-2 focus:ring-primary">
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-text-primary mb-1">Prix</label>
                    <input type="number" name="price" step="0.01" value="${product ? product.price : ''}" required class="w-full px-4 py-2.5 rounded-xl border border-border-light focus:outline-none focus:ring-2 focus:ring-primary">
                </div>
                <div>
                    <label class="block text-sm font-medium text-text-primary mb-1">Stock</label>
                    <input type="number" name="stock" value="${product ? product.stock : ''}" required class="w-full px-4 py-2.5 rounded-xl border border-border-light focus:outline-none focus:ring-2 focus:ring-primary">
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium text-text-primary mb-1">URL Image</label>
                <input type="url" name="image" value="${product ? product.image : ''}" required class="w-full px-4 py-2.5 rounded-xl border border-border-light focus:outline-none focus:ring-2 focus:ring-primary">
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-text-primary mb-1">Catégorie</label>
                    <input type="text" name="category" value="${product ? product.category : ''}" required class="w-full px-4 py-2.5 rounded-xl border border-border-light focus:outline-none focus:ring-2 focus:ring-primary">
                </div>
                <div>
                    <label class="block text-sm font-medium text-text-primary mb-1">Badge</label>
                    <select name="badge" class="w-full px-4 py-2.5 rounded-xl border border-border-light focus:outline-none focus:ring-2 focus:ring-primary">
                        <option value="" ${!product || !product.badge ? 'selected' : ''}>Aucun</option>
                        <option value="Nouveau" ${product && product.badge === 'Nouveau' ? 'selected' : ''}>Nouveau</option>
                        <option value="Promotion" ${product && product.badge === 'Promotion' ? 'selected' : ''}>Promotion</option>
                        <option value="Rupture imminente" ${product && product.badge === 'Rupture imminente' ? 'selected' : ''}>Rupture imminente</option>
                    </select>
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium text-text-primary mb-1">Description</label>
                <textarea name="description" rows="2" class="w-full px-4 py-2.5 rounded-xl border border-border-light focus:outline-none focus:ring-2 focus:ring-primary">${product && product.description ? product.description : ''}</textarea>
            </div>
            <button type="submit" class="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition-all">
                ${isEdit ? 'Modifier' : 'Ajouter'}
            </button>
        </form>
    `);
    
    document.getElementById('product-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const data = {
            name: fd.get('name'),
            price: parseFloat(fd.get('price')),
            stock: parseInt(fd.get('stock')),
            image: fd.get('image'),
            category: fd.get('category'),
            badge: fd.get('badge') || null,
            description: fd.get('description') || null
        };
        
        if (isEdit) {
            await api(`${API_URL}/admin/products/${product.id}`, 'PUT', data);
            showToast('Produit modifié avec succès');
        } else {
            await api(`${API_URL}/admin/products`, 'POST', data);
            showToast('Produit ajouté avec succès');
        }
        closeModal();
        loadProducts();
        loadStats();
    });
}

function editProduct(product) {
    openProductForm(product);
}

async function deleteProduct(id) {
    if (!confirm('Supprimer ce produit ?')) return;
    await api(`${API_URL}/admin/products/${id}`, 'DELETE');
    showToast('Produit supprimé');
    loadProducts();
    loadStats();
}

// ==========================================
// EVENTS
// ==========================================
async function loadEvents() {
    const events = await api(`${API_URL}/events`);
    const content = document.getElementById('tab-content');
    
    content.innerHTML = `
        <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-heading font-medium text-text-primary">Gestion des Événements</h2>
            <button onclick="openEventForm()" class="px-5 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition-all" data-testid="add-event-btn">
                + Ajouter un événement
            </button>
        </div>
        <div class="space-y-4">
            ${events.map(e => `
                <div class="bg-white rounded-2xl p-6 border border-border-light flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" data-testid="event-row-${e.id}">
                    <div class="flex-1">
                        <h3 class="text-lg font-medium text-text-primary">${e.title}</h3>
                        <p class="text-sm text-text-secondary mt-1">${e.description}</p>
                        <p class="text-sm text-primary font-medium mt-2">${e.date}</p>
                    </div>
                    <div class="flex gap-2">
                        <button onclick='editEvent(${JSON.stringify(e).replace(/'/g, "&#39;")})' class="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                        </button>
                        <button onclick="deleteEvent('${e.id}')" class="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                    </div>
                </div>
            `).join('')}
            ${events.length === 0 ? '<p class="text-center py-10 text-text-secondary">Aucun événement</p>' : ''}
        </div>
    `;
}

function openEventForm(event = null) {
    const isEdit = !!event;
    openModal(isEdit ? 'Modifier' : 'Ajouter un événement', `
        <form id="event-form" class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-text-primary mb-1">Titre</label>
                <input type="text" name="title" value="${event ? event.title : ''}" required class="w-full px-4 py-2.5 rounded-xl border border-border-light focus:outline-none focus:ring-2 focus:ring-primary">
            </div>
            <div>
                <label class="block text-sm font-medium text-text-primary mb-1">Description</label>
                <textarea name="description" rows="3" required class="w-full px-4 py-2.5 rounded-xl border border-border-light focus:outline-none focus:ring-2 focus:ring-primary">${event ? event.description : ''}</textarea>
            </div>
            <div>
                <label class="block text-sm font-medium text-text-primary mb-1">Date</label>
                <input type="text" name="date" value="${event ? event.date : ''}" placeholder="ex: 15 Mars 2026" required class="w-full px-4 py-2.5 rounded-xl border border-border-light focus:outline-none focus:ring-2 focus:ring-primary">
            </div>
            <button type="submit" class="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition-all">
                ${isEdit ? 'Modifier' : 'Ajouter'}
            </button>
        </form>
    `);

    document.getElementById('event-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const data = { title: fd.get('title'), description: fd.get('description'), date: fd.get('date') };
        if (isEdit) {
            await api(`${API_URL}/admin/events/${event.id}`, 'PUT', data);
            showToast('Événement modifié');
        } else {
            await api(`${API_URL}/admin/events`, 'POST', data);
            showToast('Événement ajouté');
        }
        closeModal();
        loadEvents();
        loadStats();
    });
}

function editEvent(event) { openEventForm(event); }

async function deleteEvent(id) {
    if (!confirm('Supprimer cet événement ?')) return;
    await api(`${API_URL}/admin/events/${id}`, 'DELETE');
    showToast('Événement supprimé');
    loadEvents();
    loadStats();
}

// ==========================================
// TESTIMONIALS
// ==========================================
async function loadTestimonials() {
    const testimonials = await api(`${API_URL}/testimonials`);
    const content = document.getElementById('tab-content');
    
    content.innerHTML = `
        <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-heading font-medium text-text-primary">Gestion des Témoignages</h2>
            <button onclick="openTestimonialForm()" class="px-5 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition-all" data-testid="add-testimonial-btn">
                + Ajouter un témoignage
            </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ${testimonials.map(t => `
                <div class="bg-white rounded-2xl p-6 border border-border-light" data-testid="testimonial-row-${t.id}">
                    <div class="flex items-center gap-3 mb-4">
                        <img src="${t.avatar}" alt="${t.name}" class="w-10 h-10 rounded-full object-cover">
                        <p class="font-medium text-text-primary">${t.name}</p>
                    </div>
                    <p class="text-sm italic text-text-secondary mb-4">"${t.comment}"</p>
                    <div class="flex gap-2">
                        <button onclick='editTestimonial(${JSON.stringify(t).replace(/'/g, "&#39;")})' class="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                        </button>
                        <button onclick="deleteTestimonial('${t.id}')" class="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                    </div>
                </div>
            `).join('')}
            ${testimonials.length === 0 ? '<p class="text-center py-10 text-text-secondary col-span-3">Aucun témoignage</p>' : ''}
        </div>
    `;
}

function openTestimonialForm(testimonial = null) {
    const isEdit = !!testimonial;
    openModal(isEdit ? 'Modifier' : 'Ajouter un témoignage', `
        <form id="testimonial-form" class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-text-primary mb-1">Nom</label>
                <input type="text" name="name" value="${testimonial ? testimonial.name : ''}" required class="w-full px-4 py-2.5 rounded-xl border border-border-light focus:outline-none focus:ring-2 focus:ring-primary">
            </div>
            <div>
                <label class="block text-sm font-medium text-text-primary mb-1">URL Avatar</label>
                <input type="url" name="avatar" value="${testimonial ? testimonial.avatar : ''}" required class="w-full px-4 py-2.5 rounded-xl border border-border-light focus:outline-none focus:ring-2 focus:ring-primary">
            </div>
            <div>
                <label class="block text-sm font-medium text-text-primary mb-1">Commentaire</label>
                <textarea name="comment" rows="3" required class="w-full px-4 py-2.5 rounded-xl border border-border-light focus:outline-none focus:ring-2 focus:ring-primary">${testimonial ? testimonial.comment : ''}</textarea>
            </div>
            <button type="submit" class="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition-all">
                ${isEdit ? 'Modifier' : 'Ajouter'}
            </button>
        </form>
    `);

    document.getElementById('testimonial-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const data = { name: fd.get('name'), avatar: fd.get('avatar'), comment: fd.get('comment') };
        if (isEdit) {
            await api(`${API_URL}/admin/testimonials/${testimonial.id}`, 'PUT', data);
            showToast('Témoignage modifié');
        } else {
            await api(`${API_URL}/admin/testimonials`, 'POST', data);
            showToast('Témoignage ajouté');
        }
        closeModal();
        loadTestimonials();
        loadStats();
    });
}

function editTestimonial(t) { openTestimonialForm(t); }

async function deleteTestimonial(id) {
    if (!confirm('Supprimer ce témoignage ?')) return;
    await api(`${API_URL}/admin/testimonials/${id}`, 'DELETE');
    showToast('Témoignage supprimé');
    loadTestimonials();
    loadStats();
}

// ==========================================
// NEWSLETTER
// ==========================================
async function loadNewsletter() {
    const subs = await api(`${API_URL}/admin/newsletter`);
    const content = document.getElementById('tab-content');
    
    content.innerHTML = `
        <div class="mb-6">
            <h2 class="text-2xl font-heading font-medium text-text-primary">Abonnés Newsletter</h2>
            <p class="text-text-secondary mt-1">${subs.length} abonné(s)</p>
        </div>
        <div class="bg-white rounded-2xl border border-border-light overflow-hidden">
            <table class="w-full">
                <thead class="bg-bg-main border-b border-border-light">
                    <tr>
                        <th class="text-left p-4 text-sm font-semibold text-text-secondary">#</th>
                        <th class="text-left p-4 text-sm font-semibold text-text-secondary">Email</th>
                        <th class="text-left p-4 text-sm font-semibold text-text-secondary">Date</th>
                    </tr>
                </thead>
                <tbody>
                    ${subs.map((s, i) => `
                        <tr class="border-b border-border-light">
                            <td class="p-4 text-text-secondary">${i + 1}</td>
                            <td class="p-4 font-medium text-text-primary">${s.email || '-'}</td>
                            <td class="p-4 text-text-secondary">${s.subscribed_at || '-'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            ${subs.length === 0 ? '<p class="text-center py-10 text-text-secondary">Aucun abonné</p>' : ''}
        </div>
    `;
}

// ==========================================
// CARTS
// ==========================================
async function loadCarts() {
    const carts = await api(`${API_URL}/admin/carts`);
    const content = document.getElementById('tab-content');
    
    content.innerHTML = `
        <div class="mb-6">
            <h2 class="text-2xl font-heading font-medium text-text-primary">Paniers Actifs</h2>
            <p class="text-text-secondary mt-1">${carts.length} panier(s) avec des articles</p>
        </div>
        <div class="space-y-4">
            ${carts.map(c => {
                const total = c.items.reduce((t, i) => t + (i.price * i.quantity), 0);
                return `
                    <div class="bg-white rounded-2xl p-6 border border-border-light">
                        <div class="flex items-center justify-between mb-4">
                            <p class="text-sm text-text-secondary font-mono">${c.session_id}</p>
                            <p class="text-lg font-bold text-primary">${total.toFixed(2)} &euro;</p>
                        </div>
                        <div class="space-y-2">
                            ${c.items.map(item => `
                                <div class="flex items-center gap-3">
                                    <img src="${item.image}" alt="${item.name}" class="w-10 h-10 rounded-lg object-cover">
                                    <span class="flex-1 text-sm text-text-primary">${item.name}</span>
                                    <span class="text-sm text-text-secondary">x${item.quantity}</span>
                                    <span class="text-sm font-semibold">${(item.price * item.quantity).toFixed(2)} &euro;</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }).join('')}
            ${carts.length === 0 ? '<p class="text-center py-10 text-text-secondary">Aucun panier actif</p>' : ''}
        </div>
    `;
}

// ==========================================
// TAB ROUTER
// ==========================================
function loadTabContent(tab) {
    switch(tab) {
        case 'products': loadProducts(); break;
        case 'events': loadEvents(); break;
        case 'testimonials': loadTestimonials(); break;
        case 'newsletter': loadNewsletter(); break;
        case 'carts': loadCarts(); break;
    }
}

// Init
async function init() {
    await loadStats();
    loadProducts();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
