import { Service } from '@/lib/supabase';
import { X, MapPin, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Props = {
  service: Service | null;
  distance?: number;
  onClose: () => void;
};

const ServiceDetails = ({ service, distance, onClose }: Props) => {
  return (
    <AnimatePresence>
      {service && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-card rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img
                src={service.image_url || '/placeholder.svg'}
                alt={service.name}
                className="w-full aspect-video object-cover rounded-t-2xl"
              />
              <button
                onClick={onClose}
                className="absolute top-3 right-3 p-2 rounded-full glass text-foreground hover:bg-destructive/20 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium px-2.5 py-1 rounded-full gradient-primary text-primary-foreground">
                  {service.category}
                </span>
                {distance !== undefined && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />{distance.toFixed(1)} km away
                  </span>
                )}
              </div>

              <h2 className="font-display text-2xl font-bold text-foreground">{service.name}</h2>
              <p className="text-muted-foreground leading-relaxed">{service.description}</p>

              {service.contact && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 text-accent" />
                  <span>{service.contact}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{service.latitude.toFixed(4)}, {service.longitude.toFixed(4)}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ServiceDetails;
