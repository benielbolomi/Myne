import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Products from '../components/Products';
import NewArrivals from '../components/NewArrivals';
import Events from '../components/Events';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';
import { useCartStore } from '../store/cartStore';

const HomePage = () => {
  const initializeSession = useCartStore((state) => state.initializeSession);

  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  return (
    <div className="min-h-screen" data-testid="homepage">
      <Navbar />
      <Hero />
      <About />
      <Products />
      <NewArrivals />
      <Events />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default HomePage;
