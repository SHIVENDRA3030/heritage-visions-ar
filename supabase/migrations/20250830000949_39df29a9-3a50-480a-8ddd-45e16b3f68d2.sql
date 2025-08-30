-- Update storage configuration to handle proper MIME types for 3D model files

-- First, let's check if we need to update the 3d_model bucket configuration
-- Note: We cannot directly change MIME types of existing files through SQL,
-- but we can ensure future uploads use correct MIME types

-- Create a function to help with MIME type detection for 3D models
CREATE OR REPLACE FUNCTION public.get_3d_model_mime_type(file_name TEXT)
RETURNS TEXT
LANGUAGE plpgsql
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

-- Create a function to update metadata for existing 3D model files
-- This will help set correct MIME types for files already uploaded
CREATE OR REPLACE FUNCTION public.update_3d_model_mime_types()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Run the function to update existing files
SELECT public.update_3d_model_mime_types();

-- Create a trigger to automatically set correct MIME types for new uploads
CREATE OR REPLACE FUNCTION public.set_3d_model_mime_type()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.bucket_id = '3d_model' THEN
        NEW.metadata = COALESCE(NEW.metadata, '{}'::jsonb) || 
                      jsonb_build_object('mimetype', public.get_3d_model_mime_type(NEW.name));
    END IF;
    RETURN NEW;
END;
$$;

-- Apply trigger to storage.objects for automatic MIME type setting
DROP TRIGGER IF EXISTS set_3d_model_mime_type_trigger ON storage.objects;
CREATE TRIGGER set_3d_model_mime_type_trigger
    BEFORE INSERT ON storage.objects
    FOR EACH ROW
    EXECUTE FUNCTION public.set_3d_model_mime_type();