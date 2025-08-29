-- Add fields for 3D model support to monuments table
ALTER TABLE public.monuments 
ADD COLUMN IF NOT EXISTS model_glb_url text,
ADD COLUMN IF NOT EXISTS model_usdz_url text;