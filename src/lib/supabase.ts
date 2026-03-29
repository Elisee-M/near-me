export { supabase } from '@/integrations/supabase/client';

export type Service = {
  id: string;
  name: string;
  category: string;
  description: string;
  image_url: string | null;
  latitude: number;
  longitude: number;
  contact: string;
  created_at: string;
};
