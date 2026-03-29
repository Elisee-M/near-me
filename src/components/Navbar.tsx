import { Link, useLocation } from 'react-router-dom';
import logo from '@/assets/logo.jpg';
import { MapPin, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const isLanding = location.pathname === '/';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isLanding ? 'glass' : 'bg-background/95 backdrop-blur-md border-b border-border'}`}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="NearMe" className="h-9 w-9 rounded-lg object-cover" />
          <span className="font-display font-bold text-lg text-foreground">NearMe</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/explore" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <MapPin className="inline h-4 w-4 mr-1" />Explore
          </Link>
          <Link to="/admin" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Admin
          </Link>
        </div>

        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden glass border-t border-border px-4 py-4 space-y-3">
          <Link to="/explore" onClick={() => setOpen(false)} className="block text-sm font-medium text-muted-foreground hover:text-foreground">Explore</Link>
          <Link to="/admin" onClick={() => setOpen(false)} className="block text-sm font-medium text-muted-foreground hover:text-foreground">Admin</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
