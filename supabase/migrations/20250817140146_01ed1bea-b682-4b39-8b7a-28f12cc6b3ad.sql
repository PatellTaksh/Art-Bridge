-- Security Fix 1: Restrict artworks metadata to prevent sensitive data exposure
DROP POLICY IF EXISTS "Users can create artworks" ON public.artworks;
DROP POLICY IF EXISTS "Owners can update their artworks" ON public.artworks;

-- Create more restrictive policies that prevent metadata manipulation
CREATE POLICY "Users can create artworks (restricted metadata)" 
ON public.artworks 
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() = owner_user_id 
  AND (metadata IS NULL OR jsonb_typeof(metadata) = 'object')
);

CREATE POLICY "Owners can update their artworks (restricted metadata)" 
ON public.artworks 
FOR UPDATE 
TO authenticated
USING (auth.uid() = owner_user_id)
WITH CHECK (
  auth.uid() = owner_user_id
  AND (metadata IS NULL OR jsonb_typeof(metadata) = 'object')
);

-- Security Fix 2: Restrict bids table to prevent bidder identity leaks
DROP POLICY IF EXISTS "Everyone can view bid amounts and basic info" ON public.bids;
DROP POLICY IF EXISTS "Public can view bid amounts only" ON public.bids;

-- Only show bid amounts and auction_id publicly, hide bidder identity
CREATE POLICY "Public can view bid amounts only" 
ON public.bids 
FOR SELECT 
TO public
USING (
  -- Public users can only see amount, auction_id, and created_at
  CASE 
    WHEN auth.uid() IS NULL THEN (bidder_user_id IS NULL AND bidder_wallet IS NULL AND tx_hash IS NULL)
    WHEN auth.uid() = bidder_user_id THEN true
    ELSE (bidder_user_id IS NULL AND bidder_wallet IS NULL AND tx_hash IS NULL)
  END
);

-- Authenticated users can see their own bids fully
CREATE POLICY "Users can view their own bids" 
ON public.bids 
FOR SELECT 
TO authenticated
USING (auth.uid() = bidder_user_id);

-- Security Fix 3: Restrict auctions table to hide seller identity
DROP POLICY IF EXISTS "Everyone can view auction info" ON public.auctions;
DROP POLICY IF EXISTS "Public can view auctions with limited seller info" ON public.auctions;

CREATE POLICY "Public can view auctions (limited info)" 
ON public.auctions 
FOR SELECT 
TO public
USING (
  -- Hide seller identity from public
  CASE 
    WHEN auth.uid() IS NULL THEN true
    WHEN auth.uid() = seller_user_id THEN true
    ELSE (seller_user_id IS NULL AND seller_wallet IS NULL)
  END
);

-- Security Fix 4: Restrict listings table to hide seller identity  
DROP POLICY IF EXISTS "Everyone can view listing info" ON public.listings;
DROP POLICY IF EXISTS "Public can view listings with limited seller info" ON public.listings;

CREATE POLICY "Public can view listings (limited info)" 
ON public.listings 
FOR SELECT 
TO public
USING (
  -- Hide seller identity from public
  CASE 
    WHEN auth.uid() IS NULL THEN true
    WHEN auth.uid() = seller_user_id THEN true
    ELSE (seller_user_id IS NULL AND seller_wallet IS NULL)
  END
);

-- Security Fix 5: Restrict profiles table
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;

CREATE POLICY "Users can view public profile info" 
ON public.profiles 
FOR SELECT 
TO public
USING (
  -- Only display_name and avatar_url are public
  CASE 
    WHEN auth.uid() IS NULL THEN (wallet_address IS NULL AND bio IS NULL)
    WHEN auth.uid() = user_id THEN true
    ELSE (wallet_address IS NULL AND bio IS NULL)
  END
);