import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import logo from '@/assets/logo.jpg';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      
      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="NearMe" className="h-7 w-7 rounded-lg object-cover" />
            <span className="font-display font-semibold text-sm text-foreground">NearMe</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 NearMe. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
