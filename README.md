# GenestLoula - Site E-commerce

Site e-commerce moderne et élégant pour la marque de vêtements **GenestLoula**.

## 🛠️ Technologies

**Frontend :**
- HTML5
- CSS (Tailwind CSS via CDN)
- JavaScript Vanilla

**Backend :**
- Python 3.8+
- FastAPI
- MongoDB
- Motor (driver async MongoDB)

## 📁 Structure du Projet

```
genestloula/
├── backend/
│   ├── server.py          # API FastAPI
│   ├── seed_data.py       # Script pour peupler la DB
│   ├── requirements.txt   # Dépendances Python
│   └── .env              # Variables d'environnement
│
└── frontend/
    ├── public/
    │   ├── index.html    # Page principale
    │   ├── panier.html   # Page panier
    │   └── js/
    │       ├── app.js    # Logique principale
    │       └── cart.js   # Logique panier
    └── serve.py          # Serveur HTTP Python
```

## 🚀 Installation et Lancement

### Prérequis
- Python 3.8+
- MongoDB

### 1. Démarrer MongoDB
```bash
# Windows
mongod --dbpath C:\data\db

# Mac/Linux
sudo mongod
```

### 2. Backend
```bash
cd backend
pip install -r requirements.txt
python3 seed_data.py
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

### 3. Frontend
```bash
cd frontend/public
python3 -m http.server 3000
```

### 4. Accéder au site
Ouvrez votre navigateur : **http://localhost:3000**

## 📦 Fonctionnalités

✅ Design premium moderne (palette rose-doré #C4A18A)  
✅ 6 produits avec images et badges  
✅ Panier fonctionnel (ajout/suppression/quantité)  
✅ Session tracking automatique (localStorage)  
✅ Sections : Hero, About, Produits, Nouveautés, Événements, Témoignages  
✅ Newsletter  
✅ Responsive design (mobile, tablette, desktop)  

## 🎨 Design

- **Palette de couleurs :** Rose-doré (#C4A18A), Rose poudré (#FCE4EC), Beige (#FAF9F6)
- **Typographie :** Outfit (titres), Manrope (corps de texte)
- **Logo :** GenestLoula avec icône diamant

## 📝 API Endpoints

```
GET    /api/products              # Liste des produits
GET    /api/products/{id}         # Détail produit
GET    /api/events                # Événements/promotions
GET    /api/testimonials          # Témoignages clients
POST   /api/newsletter?email=     # Inscription newsletter
GET    /api/cart/{session_id}     # Panier par session
POST   /api/cart/{session_id}/add # Ajouter au panier
```

## 🔧 Configuration

### Backend (.env)
```
MONGO_URL="mongodb://localhost:27017"
DB_NAME="genestloula_db"
CORS_ORIGINS="*"
```

### Frontend (js/app.js & js/cart.js)
Modifier l'URL de l'API :
```javascript
const API_URL = 'http://localhost:8001/api';
```

## 📄 Licence

Projet GenestLoula - Tous droits réservés © 2026
