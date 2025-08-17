-- Security Fix 6: Secure storage bucket policies
-- Clean up any existing permissive policies and create secure ones
-- Drop all existing policies for artworks bucket
DO $$
DECLARE
    policy_name text;
BEGIN
    -- Drop all existing policies on storage.objects for artworks bucket
    FOR policy_name IN 
        SELECT policyname FROM pg_policies 
        WHERE schemaname = 'storage' AND tablename = 'objects'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', policy_name);
    END LOOP;
END
$$;

-- Create secure storage policies
CREATE POLICY "Public can view artwork images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'artworks');

CREATE POLICY "Authenticated users can upload artworks" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (
  bucket_id = 'artworks' 
  AND auth.uid()::text = (storage.foldername(name))[1]
  AND (storage.extension(name)) IN ('jpg', 'jpeg', 'png', 'gif', 'webp')
);

CREATE POLICY "Users can update their own artwork images" 
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (
  bucket_id = 'artworks' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own artwork images" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (
  bucket_id = 'artworks' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Prevent anonymous users from modifying storage
CREATE POLICY "Prevent anonymous storage access" 
ON storage.objects 
FOR ALL 
TO anon 
USING (bucket_id = 'artworks' AND false);