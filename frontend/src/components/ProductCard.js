import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { toast } from 'sonner';

const ProductCard = ({ product, index }) => {
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = async () => {
    await addToCart(product);
    toast.success(`${product.name} ajouté au panier!`);
  };

  const getBadgeColor = (badge) => {
    if (!badge) return null;
    if (badge === 'Nouveau') return 'bg-badge-new text-white';
    if (badge === 'Promotion') return 'bg-badge-promo text-white';
    if (badge === 'Rupture imminente') return 'bg-badge-low-stock text-white';
    return 'bg-badge-new text-white';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-2xl p-4 shadow-sm border border-black/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
      data-testid={`product-card-${product.id}`}
    >
      {/* Image */}
      <div className="relative mb-4 overflow-hidden rounded-xl">
        <img
          src={product.image}
          alt={product.name}
          className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.badge && (
          <span 
            className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full ${getBadgeColor(product.badge)}`}
            data-testid={`product-badge-${product.id}`}
          >
            {product.badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div>
        <h3 
          className="text-xl font-medium text-text-primary mb-2 font-heading"
          data-testid={`product-name-${product.id}`}
        >
          {product.name}
        </h3>
        <div className="flex items-center justify-between mb-4">
          <p className="text-2xl font-semibold text-primary" data-testid={`product-price-${product.id}`}>
            {product.price.toFixed(2)} €
          </p>
          <p className="text-sm text-text-secondary" data-testid={`product-stock-${product.id}`}>
            Stock: {product.stock}
          </p>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
          data-testid={`product-add-to-cart-${product.id}`}
        >
          <ShoppingCart className="w-5 h-5" />
          Commander
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
