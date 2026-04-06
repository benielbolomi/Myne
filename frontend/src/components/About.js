import React from 'react';
import { motion } from 'framer-motion';
import { Users, Package, TrendingUp } from 'lucide-react';

const About = () => {
  const stats = [
    { icon: Package, label: 'Produits', value: '200+' },
    { icon: Users, label: 'Clients satisfaits', value: '5000+' },
    { icon: TrendingUp, label: 'Nouvelles collections', value: '12/an' },
  ];

  return (
    <section 
      id="apropos"
      className="py-20 sm:py-32 px-4 sm:px-8 bg-white"
      data-testid="about-section"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            <img
              src="https://images.pexels.com/photos/3965551/pexels-photo-3965551.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
              alt="Boutique GenestLoula"
              className="w-full h-[500px] object-cover rounded-3xl shadow-xl"
              data-testid="about-image"
            />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4">
              À PROPOS
            </p>
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-text-primary mb-6 font-heading">
              GenestLoula, Votre Destination Mode
            </h2>
            <p className="text-base leading-relaxed text-text-secondary mb-8">
              GenestLoula est une jeune marque de vêtements qui propose des pièces élégantes, 
              modernes et de qualité premium. Notre mission est d'offrir à nos clients des vêtements 
              qui allient confort, style et sophistication pour toutes les occasions.
            </p>
            <p className="text-base leading-relaxed text-text-secondary mb-10">
              Chaque pièce est soigneusement sélectionnée pour garantir une qualité exceptionnelle 
              et un design intemporel qui traverse les saisons.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center" data-testid={`stat-${index}`}>
                    <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                    <p className="text-2xl font-semibold text-text-primary mb-1">
                      {stat.value}
                    </p>
                    <p className="text-sm text-text-secondary">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
