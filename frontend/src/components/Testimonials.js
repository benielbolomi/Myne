import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await axios.get(`${API}/testimonials`);
        setTestimonials(response.data);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <section 
      className="py-20 sm:py-32 px-4 sm:px-8 bg-white"
      data-testid="testimonials-section"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4">
            TÉMOIGNAGES
          </p>
          <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-text-primary font-heading">
            Ce Que Disent Nos Clients
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-bg-main rounded-2xl p-8 border border-border-light"
              data-testid={`testimonial-${testimonial.id}`}
            >
              <Quote className="w-10 h-10 text-primary mb-4" />
              <p className="text-base italic text-text-secondary mb-6 leading-relaxed">
                "{testimonial.comment}"
              </p>
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-text-primary">{testimonial.name}</p>
                  <p className="text-sm text-text-secondary">Client vérifié</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
