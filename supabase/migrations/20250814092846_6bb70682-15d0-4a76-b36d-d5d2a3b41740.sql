-- Fix security issue: Restrict profile visibility to authenticated users only
-- This prevents public access to wallet addresses and personal data

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create a new policy that only allows authenticated users to view profiles
CREATE POLICY "Authenticated users can view profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (true);

-- Keep existing policies for insert/update unchanged as they are already secure
-- Users can still only insert/update their own profiles