import { useState, useRef, useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { Search, X, Loader2 } from 'lucide-react';

type SearchResult = {
  display_name: string;
  lat: string;
  lon: string;
};

const MapSearchBar = ({ onSelect }: { onSelect?: (lat: number, lng: number) => void }) => {
  const map = useMap();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const search = (q: string) => {
    clearTimeout(timerRef.current);
    setQuery(q);
    if (q.length < 3) { setResults([]); setOpen(false); return; }
    timerRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5`
        );
        const data: SearchResult[] = await res.json();
        setResults(data);
        setOpen(data.length > 0);
      } catch { setResults([]); }
      setLoading(false);
    }, 400);
  };

  const pick = (r: SearchResult) => {
    const lat = parseFloat(r.lat);
    const lng = parseFloat(r.lon);
    map.setView([lat, lng], 15);
    onSelect?.(lat, lng);
    setQuery(r.display_name.split(',').slice(0, 2).join(','));
    setOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className="absolute top-3 left-3 right-3 z-[1000]"
      onMouseDown={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
    >
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => search(e.target.value)}
          placeholder="Search location..."
          className="w-full pl-9 pr-9 py-2.5 rounded-lg bg-background/95 backdrop-blur border border-border text-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {query && (
          <button onClick={() => { setQuery(''); setResults([]); setOpen(false); }} className="absolute right-3 top-1/2 -translate-y-1/2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /> : <X className="h-4 w-4 text-muted-foreground" />}
          </button>
        )}
      </div>
      {open && (
        <ul className="mt-1 bg-background/95 backdrop-blur border border-border rounded-lg shadow-lg overflow-hidden max-h-52 overflow-y-auto">
          {results.map((r, i) => (
            <li
              key={i}
              onClick={() => pick(r)}
              className="px-3 py-2 text-sm cursor-pointer hover:bg-accent truncate"
            >
              {r.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MapSearchBar;
