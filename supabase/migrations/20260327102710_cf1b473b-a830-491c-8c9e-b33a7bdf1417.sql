-- Create services table
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  contact TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Anyone can read services
CREATE POLICY "Services are publicly readable"
ON public.services FOR SELECT
TO anon, authenticated
USING (true);

-- Only authenticated users can insert/update/delete (admin)
CREATE POLICY "Authenticated users can insert services"
ON public.services FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update services"
ON public.services FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete services"
ON public.services FOR DELETE
TO authenticated
USING (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.services;