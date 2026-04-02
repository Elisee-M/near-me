import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MapSearchBar from './MapSearchBar';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Service } from '@/lib/supabase';

// Fix leaflet default icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const serviceIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => { map.setView([lat, lng], 14); }, [lat, lng, map]);
  return null;
}

type Props = {
  userPosition: { lat: number; lng: number } | null;
  services: Service[];
  onServiceClick?: (service: Service) => void;
  onMapClick?: (lat: number, lng: number) => void;
  selectedPosition?: { lat: number; lng: number } | null;
  className?: string;
};

const MapView = ({ userPosition, services, onServiceClick, onMapClick, selectedPosition, className = '' }: Props) => {
  const center = userPosition || { lat: -1.9403, lng: 29.8739 };

  return (
    <div className={`rounded-xl overflow-hidden border border-border relative ${className}`}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={14}
        className="h-full w-full min-h-[300px]"
        style={{ minHeight: '300px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecenterMap lat={center.lat} lng={center.lng} />
        <MapSearchBar />

        {userPosition && (
          <Marker position={[userPosition.lat, userPosition.lng]} icon={userIcon}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {services.map((s) => (
          <Marker
            key={s.id}
            position={[s.latitude, s.longitude]}
            icon={serviceIcon}
            eventHandlers={{ click: () => onServiceClick?.(s) }}
          >
            <Popup>
              <strong>{s.name}</strong><br />{s.category}
            </Popup>
          </Marker>
        ))}

        {selectedPosition && (
          <Marker position={[selectedPosition.lat, selectedPosition.lng]}>
            <Popup>Selected location</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default MapView;
