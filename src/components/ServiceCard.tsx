import { Service } from '@/lib/supabase';
import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

type Props = {
  service: Service;
  distance?: number;
  onClick: () => void;
};

const ServiceCard = ({ service, distance, onClick }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="glass-card rounded-xl overflow-hidden cursor-pointer group transition-all duration-300 hover:border-primary/30"
      onClick={onClick}
    >
      <div className="aspect-video overflow-hidden">
        <img
          src={service.image_url || '/placeholder.svg'}
          alt={service.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium px-2.5 py-1 rounded-full gradient-primary text-primary-foreground">
            {service.category}
          </span>
          {distance !== undefined && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {distance.toFixed(1)} km
            </span>
          )}
        </div>
        <h3 className="font-display font-semibold text-foreground">{service.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{service.description}</p>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
