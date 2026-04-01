import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

  return (
    <div className="rounded-xl overflow-hidden border border-border h-[300px]">
      <MapContainer center={[center.lat, center.lng]} zoom={14} className="h-full w-full">
        <TileLayer
          attribution='&copy; OSM'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
        <TileLayer
          url="https://stamen-tiles.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}.png"
          attribution='&copy; Stamen'
        />
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
