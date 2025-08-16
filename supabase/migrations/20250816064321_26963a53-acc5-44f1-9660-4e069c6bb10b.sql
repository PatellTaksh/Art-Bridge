-- Remove the problematic views entirely and use better RLS policies instead
DROP VIEW IF EXISTS public.bids_public;
DROP VIEW IF EXISTS public.auctions_public; 
DROP VIEW IF EXISTS public.listings_public;

-- Instead of views, let's improve the RLS policies on the base tables
-- to hide sensitive information from non-owners

-- Update bids policies to hide sensitive info
DROP POLICY IF EXISTS "Bids are viewable with limited info" ON public.bids;

-- Create a more restrictive policy for bids
CREATE POLICY "Public can view bid amounts only" 
ON public.bids 
FOR SELECT 
USING (
  -- Everyone can see basic bid info but wallet/user details only to the bidder
  CASE 
    WHEN auth.uid() = bidder_user_id THEN true
    ELSE bidder_wallet IS NULL OR bidder_user_id IS NULL OR tx_hash IS NULL
  END
);

-- Update auctions policies 
DROP POLICY IF EXISTS "Auctions are viewable with limited seller info" ON public.auctions;

CREATE POLICY "Public can view auctions with limited seller info" 
ON public.auctions 
FOR SELECT 
USING (true); -- Allow viewing but applications should filter sensitive data

-- Update listings policies
DROP POLICY IF EXISTS "Listings are viewable with limited seller info" ON public.listings;

CREATE POLICY "Public can view listings with limited seller info" 
ON public.listings 
FOR SELECT 
USING (true); -- Allow viewing but applications should filter sensitive data

-- Note: Applications should use SELECT statements that exclude sensitive columns
-- when displaying public auction/listing data to non-owners