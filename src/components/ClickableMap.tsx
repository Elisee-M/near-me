import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MapSearchBar from './MapSearchBar';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function ClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

type Props = {
  position: { lat: number; lng: number } | null;
  onPositionChange: (lat: number, lng: number) => void;
};

const ClickableMap = ({ position, onPositionChange }: Props) => {
  const center = position || { lat: -1.9403, lng: 29.8739 };
  const [satellite, setSatellite] = useState(false);

  return (
    <div className="rounded-xl overflow-hidden border border-border h-[300px] relative">
      <button
        onClick={() => setSatellite(!satellite)}
        className="absolute top-3 right-3 z-[1000] bg-background/95 backdrop-blur border border-border rounded-lg px-3 py-1.5 text-xs font-medium shadow-lg hover:bg-accent transition-colors"
      >
        {satellite ? 'Street' : 'Satellite'}
      </button>
      <MapContainer center={[center.lat, center.lng]} zoom={14} className="h-full w-full">
        <MapSearchBar onSelect={onPositionChange} />
        {satellite ? (
          <TileLayer
            attribution='&copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        ) : (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        )}
        <ClickHandler onClick={onPositionChange} />
        {position && (
          <Marker position={[position.lat, position.lng]}>
            <Popup>Service location</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default ClickableMap;
