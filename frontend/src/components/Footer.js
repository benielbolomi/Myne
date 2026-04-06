import React, { useState } from 'react';
import { Facebook, Instagram, Twitter, Mail } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Footer = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await axios.post(`${API}/newsletter?email=${email}`);
      toast.success('Merci pour votre inscription!');
      setEmail('');
    } catch (error) {
      toast.error('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer 
      id="contact"
      className="bg-bg-main border-t border-border-light py-20"
      data-testid="footer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <img 
              src="https://customer-assets.emergentagent.com/job_422ceee8-c422-4d81-b1a3-9d924ef95c00/artifacts/0d6z2xph_logo%20%281%29.jpg" 
              alt="GenestLoula" 
              className="h-16 w-auto mb-4"
            />
            <p className="text-text-secondary mb-6 max-w-md">
              GenestLoula propose des vêtements élégants et modernes pour sublimer votre style. 
              Qualité premium et designs intemporels.
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="#" 
                className="p-2 hover:bg-white rounded-full transition-colors"
                data-testid="footer-social-facebook"
              >
                <Facebook className="w-5 h-5 text-text-primary" />
              </a>
              <a 
                href="#" 
                className="p-2 hover:bg-white rounded-full transition-colors"
                data-testid="footer-social-instagram"
              >
                <Instagram className="w-5 h-5 text-text-primary" />
              </a>
              <a 
                href="#" 
                className="p-2 hover:bg-white rounded-full transition-colors"
                data-testid="footer-social-twitter"
              >
                <Twitter className="w-5 h-5 text-text-primary" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-text-primary mb-4">Navigation</h3>
            <ul className="space-y-3">
              <li><a href="/#boutique" className="text-text-secondary hover:text-primary transition-colors">Boutique</a></li>
              <li><a href="/#nouveautes" className="text-text-secondary hover:text-primary transition-colors">Nouveautés</a></li>
              <li><a href="/#evenements" className="text-text-secondary hover:text-primary transition-colors">Événements</a></li>
              <li><a href="/#apropos" className="text-text-secondary hover:text-primary transition-colors">À propos</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-text-primary mb-4">Newsletter</h3>
            <p className="text-text-secondary mb-4 text-sm">
              Restez informé de nos nouveautés et promotions exclusives
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre email"
                className="px-4 py-2 rounded-lg border border-border-light focus:outline-none focus:ring-2 focus:ring-primary"
                data-testid="newsletter-input"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50"
                data-testid="newsletter-submit"
              >
                {loading ? 'Envoi...' : 'S\'inscrire'}
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-border-light text-center">
          <p className="text-text-secondary text-sm">
            © {new Date().getFullYear()} GenestLoula. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
