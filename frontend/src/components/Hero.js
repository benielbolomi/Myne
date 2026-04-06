import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section 
      className="relative min-h-[85vh] flex items-center justify-center overflow-hidden"
      data-testid="hero-section"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1617733401065-c7bdf0b33417?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2OTF8MHwxfHNlYXJjaHwyfHxmYXNoaW9uJTIwZWRpdG9yaWFsJTIwYmVpZ2V8ZW58MHx8fHwxNzc1NDg5NzY0fDA&ixlib=rb-4.1.0&q=85"
          alt="Fashion Collection"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 
            className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight text-white mb-6 font-heading"
            data-testid="hero-title"
          >
            Élégance Intemporelle
          </h1>
          <p 
            className="text-lg sm:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed"
            data-testid="hero-description"
          >
            Découvrez notre collection de vêtements modernes et raffinés, conçus pour sublimer votre style unique.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#boutique"
              className="px-8 py-4 bg-primary text-white rounded-full font-medium hover:bg-primary-hover transform hover:scale-105 transition-all duration-300 shadow-lg"
              data-testid="hero-cta-primary"
            >
              Découvrir la collection
            </a>
            <a
              href="#boutique"
              className="px-8 py-4 bg-white text-primary rounded-full font-medium hover:bg-gray-50 transform hover:scale-105 transition-all duration-300"
              data-testid="hero-cta-secondary"
            >
              Commander maintenant
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
