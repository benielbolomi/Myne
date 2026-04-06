import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

const Navbar = () => {
  const cartCount = useCartStore((state) => state.getCartCount());

  const menuItems = [
    { label: 'Accueil', path: '/' },
    { label: 'Boutique', path: '/#boutique' },
    { label: 'Nouveautés', path: '/#nouveautes' },
    { label: 'Événements', path: '/#evenements' },
    { label: 'À propos', path: '/#apropos' },
    { label: 'Contact', path: '/#contact' },
  ];

  return (
    <header 
      className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-black/5"
      data-testid="navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center" data-testid="navbar-logo">
            <img 
              src="https://customer-assets.emergentagent.com/job_422ceee8-c422-4d81-b1a3-9d924ef95c00/artifacts/0d6z2xph_logo%20%281%29.jpg" 
              alt="GenestLoula" 
              className="h-12 w-auto"
            />
          </Link>

          {/* Navigation - Hidden on mobile */}
          <nav className="hidden lg:flex items-center space-x-8">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.path}
                className="text-sm font-medium text-text-primary hover:text-primary transition-colors duration-200"
                data-testid={`navbar-link-${item.label.toLowerCase()}`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <button 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              data-testid="navbar-profile-icon"
            >
              <User className="w-5 h-5 text-text-primary" />
            </button>
            
            <Link 
              to="/panier" 
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
              data-testid="navbar-cart-icon"
            >
              <ShoppingCart className="w-5 h-5 text-text-primary" />
              {cartCount > 0 && (
                <span 
                  className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold"
                  data-testid="cart-count-badge"
                >
                  {cartCount}
                </span>
              )}
            </Link>

            <Link
              to="/#boutique"
              className="hidden sm:block px-6 py-2.5 bg-primary text-white rounded-full font-medium hover:bg-primary-hover transform hover:scale-105 transition-all duration-200"
              data-testid="navbar-cta-button"
            >
              Voir la boutique
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
