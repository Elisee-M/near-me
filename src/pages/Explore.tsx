import { useState, useEffect, useMemo } from 'react';
import { supabase, Service } from '@/lib/supabase';
import { useGeolocation, getDistance } from '@/hooks/useGeolocation';
import Navbar from '@/components/Navbar';
import ServiceCard from '@/components/ServiceCard';
import CategoryFilter from '@/components/CategoryFilter';
import ServiceDetails from '@/components/ServiceDetails';
import MapView from '@/components/MapView';
import { Loader2 } from 'lucide-react';

const Explore = () => {
  const { position } = useGeolocation();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState<Service | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await supabase.from('services').select('*');
      if (data) setServices(data);
      setLoading(false);
    };
    fetchServices();

    const channel = supabase
      .channel('services-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, () => {
        fetchServices();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const enriched = useMemo(() => {
    return services
      .map((s) => ({
        ...s,
        distance: position ? getDistance(position.lat, position.lng, s.latitude, s.longitude) : undefined,
      }))
      .filter((s) => category === 'All' || s.category === category)
      .sort((a, b) => (a.distance ?? 999) - (b.distance ?? 999));
  }, [services, position, category]);

  const selectedDistance = selected && position
    ? getDistance(position.lat, position.lng, selected.latitude, selected.longitude)
    : undefined;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-8 container mx-auto px-4">
        <h1 className="font-display text-3xl font-bold mb-2 gradient-text">Explore Nearby</h1>
        <p className="text-muted-foreground mb-6">Discover services around you</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <CategoryFilter selected={category} onChange={setCategory} />

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : enriched.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <p>No services found. Check back later!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {enriched.map((s) => (
                  <ServiceCard
                    key={s.id}
                    service={s}
                    distance={s.distance}
                    onClick={() => setSelected(s)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <MapView
                userPosition={position}
                services={enriched}
                onServiceClick={setSelected}
                className="h-[400px] lg:h-[calc(100vh-8rem)]"
              />
            </div>
          </div>
        </div>
      </div>

      <ServiceDetails service={selected} distance={selectedDistance} onClose={() => setSelected(null)} />
    </div>
  );
};

export default Explore;
