import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Events = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API}/events`);
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <section 
      id="evenements"
      className="py-20 sm:py-32 px-4 sm:px-8"
      data-testid="events-section"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4">
            ÉVÉNEMENTS
          </p>
          <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-text-primary font-heading">
            Actualités & Promotions
          </h2>
        </div>

        <div className="space-y-6">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-secondary rounded-3xl p-10 sm:p-16 flex flex-col md:flex-row items-center justify-between gap-8"
              data-testid={`event-${event.id}`}
            >
              <div className="flex-1">
                <h3 className="text-2xl sm:text-3xl font-medium text-text-primary mb-4 font-heading">
                  {event.title}
                </h3>
                <p className="text-base text-text-secondary mb-4 leading-relaxed">
                  {event.description}
                </p>
                <div className="flex items-center gap-2 text-primary">
                  <Calendar className="w-5 h-5" />
                  <span className="font-medium">{event.date}</span>
                </div>
              </div>
              {event.image && (
                <div className="w-full md:w-64 h-64">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Events;
