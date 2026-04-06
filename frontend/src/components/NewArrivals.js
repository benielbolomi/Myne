import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import ProductCard from './ProductCard';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const NewArrivals = () => {
  const [newProducts, setNewProducts] = useState([]);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await axios.get(`${API}/products`);
        const arrivals = response.data.filter(p => p.badge === 'Nouveau');
        setNewProducts(arrivals);
      } catch (error) {
        console.error('Error fetching new arrivals:', error);
      }
    };

    fetchNewArrivals();
  }, []);

  if (newProducts.length === 0) return null;

  return (
    <section 
      id="nouveautes"
      className="py-20 sm:py-32 px-4 sm:px-8 bg-white"
      data-testid="new-arrivals-section"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4">
            NOUVEAUTÉS
          </p>
          <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-text-primary font-heading">
            Nouvelles Arrivées
          </h2>
          <p className="text-base text-text-secondary mt-4 max-w-2xl mx-auto">
            Découvrez nos dernières nouveautés et restez à la pointe de la mode
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {newProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
