import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API}/products`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section 
      id="boutique"
      className="py-20 sm:py-32 px-4 sm:px-8"
      data-testid="products-section"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4">
            BOUTIQUE
          </p>
          <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-text-primary font-heading">
            Notre Collection
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-text-secondary">Chargement...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Products;
