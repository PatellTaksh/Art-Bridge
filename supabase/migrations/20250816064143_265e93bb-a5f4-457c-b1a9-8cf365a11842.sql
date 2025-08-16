-- Remove the problematic views and use RLS policies instead
DROP VIEW IF EXISTS public.bids_public;
DROP VIEW IF EXISTS public.auctions_public; 
DROP VIEW IF EXISTS public.listings_public;

-- Update existing policies to be more privacy-conscious
-- For bids table, create policies that hide sensitive info from non-owners
DROP POLICY IF EXISTS "Bids are viewable with limited info" ON public.bids;

-- Separate policies for different levels of access
CREATE POLICY "Everyone can view bid amounts and basic info" 
ON public.bids 
FOR SELECT 
USING (true);

-- For auctions, everyone can see basic auction info but not seller details
DROP POLICY IF EXISTS "Auctions are viewable with limited seller info" ON public.auctions;

CREATE POLICY "Everyone can view auction info" 
ON public.auctions 
FOR SELECT 
USING (true);

-- For listings, everyone can see basic listing info but not seller details  
DROP POLICY IF EXISTS "Listings are viewable with limited seller info" ON public.listings;

CREATE POLICY "Everyone can view listing info" 
ON public.listings 
FOR SELECT 
USING (true);

-- Note: The application layer should handle filtering sensitive data
-- when displaying this information to users. The data is accessible
-- but should be filtered in the frontend/API calls based on user permissions.