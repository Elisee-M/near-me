import { useState, useEffect } from 'react';
import { supabase, Service } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import ClickableMap from '@/components/ClickableMap';
import { Loader2, Plus, Pencil, Trash2, LogOut, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const DEFAULT_CATEGORIES = ['Restaurant', 'Hotel', 'Clothing Shop', 'Papeterie', 'Lounge'];

const Admin = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Dynamic categories from DB
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);

  // Form state
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (session) fetchServices();
  }, [session]);

  const fetchServices = async () => {
    const { data } = await supabase.from('services').select('*').order('created_at', { ascending: false });
    if (data) {
      setServices(data);
      // Extract unique categories from existing services and merge with defaults
      const dbCategories = [...new Set(data.map((s: Service) => s.category))];
      const merged = [...new Set([...DEFAULT_CATEGORIES, ...dbCategories])];
      setCategories(merged);
    }
  };

  const handleLogin = async () => {
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) toast.error(error.message);
    setAuthLoading(false);
  };

  const resetForm = () => {
    setEditId(null); setName(''); setCategory(''); setDescription('');
    setContact(''); setImageUrl(''); setImageFile(null); setImagePreview(null);
    setLat(null); setLng(null); setShowCustomCategory(false); setCustomCategory('');
  };

  const handleCategoryChange = (value: string) => {
    if (value === '__other__') {
      setShowCustomCategory(true);
      setCategory('');
    } else {
      setShowCustomCategory(false);
      setCustomCategory('');
      setCategory(value);
    }
  };

  const handleCustomCategoryConfirm = () => {
    const trimmed = customCategory.trim();
    if (!trimmed) return;
    if (!categories.includes(trimmed)) {
      setCategories(prev => [...prev, trimmed]);
    }
    setCategory(trimmed);
    setShowCustomCategory(false);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setImageUrl('');
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
    const { error } = await supabase.storage.from('service-images').upload(fileName, file);
    if (error) {
      toast.error('Image upload failed: ' + error.message);
      return null;
    }
    const { data: urlData } = supabase.storage.from('service-images').getPublicUrl(fileName);
    return urlData.publicUrl;
  };

  const handleSave = async () => {
    if (!name || !category || !lat || !lng) {
      toast.error('Please fill name, category, and select location on map');
      return;
    }
    setSaving(true);

    let finalImageUrl = imageUrl || null;
    if (imageFile) {
      const uploaded = await uploadImage(imageFile);
      if (uploaded) finalImageUrl = uploaded;
      else { setSaving(false); return; }
    }

    const payload = { name, category, description, contact, image_url: finalImageUrl, latitude: lat, longitude: lng };

    if (editId) {
      const { error } = await supabase.from('services').update(payload).eq('id', editId);
      if (error) toast.error(error.message); else toast.success('Service updated');
    } else {
      const { error } = await supabase.from('services').insert(payload);
      if (error) toast.error(error.message); else toast.success('Service added');
    }
    resetForm();
    fetchServices();
    setSaving(false);
  };

  const handleEdit = (s: Service) => {
    setEditId(s.id); setName(s.name); setCategory(s.category);
    setDescription(s.description); setContact(s.contact);
    setImageUrl(s.image_url || ''); setImageFile(null);
    setImagePreview(s.image_url || null);
    setLat(s.latitude); setLng(s.longitude);
    setShowCustomCategory(false); setCustomCategory('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this service?')) return;
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) toast.error(error.message); else { toast.success('Deleted'); fetchServices(); }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 flex items-center justify-center px-4">
          <div className="glass-card rounded-2xl p-8 w-full max-w-sm space-y-4">
            <h2 className="font-display text-2xl font-bold text-center gradient-text">Admin Login</h2>
            <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-secondary border-border" />
            <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-secondary border-border" />
            <Button onClick={handleLogin} disabled={authLoading} className="w-full gradient-primary border-0">
              {authLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign In'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-8 container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-3xl font-bold gradient-text">Admin Panel</h1>
          <Button variant="outline" size="sm" onClick={() => supabase.auth.signOut()}>
            <LogOut className="h-4 w-4 mr-1" /> Logout
          </Button>
        </div>

        {/* Form */}
        <div className="glass-card rounded-2xl p-6 mb-8 space-y-4">
          <h3 className="font-display font-semibold text-lg text-foreground">
            {editId ? 'Edit Service' : 'Add New Service'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input placeholder="Service name" value={name} onChange={(e) => setName(e.target.value)} className="bg-secondary border-border" />
            
            <div className="space-y-2">
              {showCustomCategory ? (
                <div className="flex gap-2">
                  <Input
                    placeholder="Type new category..."
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCustomCategoryConfirm()}
                    className="bg-secondary border-border flex-1"
                    autoFocus
                  />
                  <Button size="sm" onClick={handleCustomCategoryConfirm} className="gradient-primary border-0">Add</Button>
                  <Button size="sm" variant="outline" onClick={() => { setShowCustomCategory(false); setCustomCategory(''); }}>Cancel</Button>
                </div>
              ) : (
                <Select value={category} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="Category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    <SelectItem value="__other__">+ Other (type custom)</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>

            <Input placeholder="Contact" value={contact} onChange={(e) => setContact(e.target.value)} className="bg-secondary border-border" />
            
            {/* Image upload */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer bg-secondary border border-border rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Upload className="h-4 w-4" />
                {imageFile ? imageFile.name : 'Upload image'}
                <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
              </label>
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="h-16 w-16 rounded-lg object-cover" />
              )}
            </div>
          </div>
          <Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="bg-secondary border-border" />

          <p className="text-sm text-muted-foreground">Click on the map to set location{lat && lng ? `: ${lat.toFixed(4)}, ${lng.toFixed(4)}` : ''}</p>
          <ClickableMap position={lat && lng ? { lat, lng } : null} onPositionChange={(la, ln) => { setLat(la); setLng(ln); }} />

          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={saving} className="gradient-primary border-0">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus className="h-4 w-4 mr-1" />{editId ? 'Update' : 'Add'} Service</>}
            </Button>
            {editId && <Button variant="outline" onClick={resetForm}>Cancel</Button>}
          </div>
        </div>

        {/* Services list */}
        <div className="space-y-3">
          {services.map((s) => (
            <div key={s.id} className="glass-card rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {s.image_url && <img src={s.image_url} alt="" className="h-12 w-12 rounded-lg object-cover" />}
                <div>
                  <p className="font-semibold text-foreground">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.category}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => handleEdit(s)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon" onClick={() => handleDelete(s.id)} className="hover:border-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;
