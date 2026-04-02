import { useState, useRef, useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { Search, X, Loader2 } from 'lucide-react';

type SearchResult = {
  display_name: string;
  lat: string;
  lon: string;
};

type MapSearchBarProps = {
  onSelect?: (lat: number, lng: number) => void;
  className?: string;
};

const MapSearchBar = ({ onSelect, className = '' }: MapSearchBarProps) => {
  const map = useMap();
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        if (!query) setExpanded(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [query]);

  useEffect(() => {
    if (expanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [expanded]);

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
    setExpanded(false);
  };

  const close = () => {
    setQuery('');
    setResults([]);
    setOpen(false);
    setExpanded(false);
  };

  return (
    <div
      ref={containerRef}
      className={`absolute top-3 left-3 z-[1000] ${className}`}
      onMouseDown={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
    >
      {!expanded ? (
        <button
          onClick={() => setExpanded(true)}
          className="bg-background/95 backdrop-blur border border-border rounded-lg p-2.5 shadow-lg hover:bg-accent transition-colors"
        >
          <Search className="h-4 w-4 text-muted-foreground" />
        </button>
      ) : (
        <>
          <div className="relative w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => search(e.target.value)}
              placeholder="Search location..."
              className="w-full pl-9 pr-9 py-2.5 rounded-lg bg-background/95 backdrop-blur border border-border text-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button onClick={close} className="absolute right-3 top-1/2 -translate-y-1/2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /> : <X className="h-4 w-4 text-muted-foreground" />}
            </button>
          </div>
          {open && (
            <ul className="mt-1 w-56 bg-background/95 backdrop-blur border border-border rounded-lg shadow-lg overflow-hidden max-h-52 overflow-y-auto">
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
        </>
      )}
    </div>
  );
};

export default MapSearchBar;
