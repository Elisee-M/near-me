import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import logo from '@/assets/logo.jpg';
import kigaliBg from '@/assets/kigali-bg.jpg';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${kigaliBg})`, filter: 'blur(2px) brightness(0.4)', transform: 'scale(1.05)' }}
      />
      <div className="absolute inset-0 bg-background/60" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <img src={logo} alt="NearMe" className="h-24 w-24 rounded-2xl shadow-2xl mb-8 object-cover" />

          <h1 className="font-display text-5xl md:text-7xl font-bold mb-4">
            <span className="gradient-text">NearMe</span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg md:text-xl text-muted-foreground mb-10 font-light"
          >
            Everything around you, instantly.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Link
              to="/explore"
              className="gradient-primary inline-flex items-center gap-2 px-8 py-4 rounded-full text-primary-foreground font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Explore Near You
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
