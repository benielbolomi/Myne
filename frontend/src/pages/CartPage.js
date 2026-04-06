import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCartStore();

  const handleQuantityChange = async (productId, currentQuantity, delta) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity < 1) return;
    await updateQuantity(productId, newQuantity);
  };

  const handleRemove = async (productId) => {
    await removeFromCart(productId);
  };

  return (
    <div className="min-h-screen flex flex-col" data-testid="cart-page">
      <Navbar />
      
      <main className="flex-1 py-20 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-primary hover:text-primary-hover mb-6 transition-colors"
              data-testid="back-to-shop-link"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour à la boutique
            </Link>
            <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-text-primary font-heading">
              Votre Panier
            </h1>
          </div>

          {cart.items.length === 0 ? (
            <div className="text-center py-20" data-testid="empty-cart">
              <p className="text-xl text-text-secondary mb-8">Votre panier est vide</p>
              <Link
                to="/#boutique"
                className="inline-block px-8 py-4 bg-primary text-white rounded-full font-medium hover:bg-primary-hover transform hover:scale-105 transition-all"
                data-testid="continue-shopping-button"
              >
                Continuer vos achats
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                {cart.items.map((item) => (
                  <div 
                    key={item.product_id} 
                    className="bg-white rounded-2xl p-6 shadow-sm border border-black/5 flex gap-6"
                    data-testid={`cart-item-${item.product_id}`}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-xl"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-medium text-text-primary mb-2">
                        {item.name}
                      </h3>
                      <p className="text-lg font-semibold text-primary mb-4">
                        {item.price.toFixed(2)} €
                      </p>
                      
                      <div className="flex items-center gap-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQuantityChange(item.product_id, item.quantity, -1)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            data-testid={`decrease-quantity-${item.product_id}`}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span 
                            className="w-12 text-center font-medium"
                            data-testid={`quantity-${item.product_id}`}
                          >
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.product_id, item.quantity, 1)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            data-testid={`increase-quantity-${item.product_id}`}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemove(item.product_id)}
                          className="ml-auto p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          data-testid={`remove-item-${item.product_id}`}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-black/5 sticky top-24">
                  <h2 className="text-2xl font-medium text-text-primary mb-6 font-heading">
                    Résumé de la commande
                  </h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Sous-total</span>
                      <span className="font-semibold">{getCartTotal().toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Livraison</span>
                      <span className="font-semibold">Gratuite</span>
                    </div>
                    <div className="border-t border-border-light pt-4">
                      <div className="flex justify-between text-lg">
                        <span className="font-semibold text-text-primary">Total</span>
                        <span className="font-bold text-primary" data-testid="cart-total">
                          {getCartTotal().toFixed(2)} €
                        </span>
                      </div>
                    </div>
                  </div>

                  <button 
                    className="w-full py-4 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transform hover:scale-105 transition-all duration-200"
                    data-testid="checkout-button"
                  >
                    Procéder au paiement
                  </button>
                  
                  <p className="text-sm text-text-secondary text-center mt-4">
                    Le paiement Mobile Money sera disponible à l'étape suivante
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;
