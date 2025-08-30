-- Fix security warnings by setting proper search paths for the functions

-- Update get_3d_model_mime_type function with secure search path
CREATE OR REPLACE FUNCTION public.get_3d_model_mime_type(file_name TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    CASE 
        WHEN file_name ILIKE '%.glb' THEN RETURN 'model/gltf-binary';
        WHEN file_name ILIKE '%.usdz' THEN RETURN 'model/vnd.usdz+zip';
        WHEN file_name ILIKE '%.gltf' THEN RETURN 'model/gltf+json';
        ELSE RETURN 'application/octet-stream';
    END CASE;
END;
$$;

-- Update update_3d_model_mime_types function with secure search path
CREATE OR REPLACE FUNCTION public.update_3d_model_mime_types()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, storage
AS $$
BEGIN
    -- Update .glb files
    UPDATE storage.objects 
    SET metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object('mimetype', 'model/gltf-binary')
    WHERE bucket_id = '3d_model' 
    AND name ILIKE '%.glb'
    AND (metadata->>'mimetype' IS NULL OR metadata->>'mimetype' = 'application/octet-stream');
    
    -- Update .usdz files  
    UPDATE storage.objects 
    SET metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object('mimetype', 'model/vnd.usdz+zip')
    WHERE bucket_id = '3d_model' 
    AND name ILIKE '%.usdz'
    AND (metadata->>'mimetype' IS NULL OR metadata->>'mimetype' = 'application/octet-stream');
    
    -- Update .gltf files
    UPDATE storage.objects 
    SET metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object('mimetype', 'model/gltf+json')
    WHERE bucket_id = '3d_model' 
    AND name ILIKE '%.gltf'
    AND (metadata->>'mimetype' IS NULL OR metadata->>'mimetype' = 'application/octet-stream');
END;
$$;

-- Update set_3d_model_mime_type function with secure search path
CREATE OR REPLACE FUNCTION public.set_3d_model_mime_type()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NEW.bucket_id = '3d_model' THEN
        NEW.metadata = COALESCE(NEW.metadata, '{}'::jsonb) || 
                      jsonb_build_object('mimetype', public.get_3d_model_mime_type(NEW.name));
    END IF;
    RETURN NEW;
END;
$$;

-- Update update_updated_at_column function with secure search path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;