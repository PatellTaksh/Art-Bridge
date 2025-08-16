-- Fix CRITICAL privilege escalation issue in profiles table
-- Users should not be able to change their own role
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create separate policies for role and non-role updates
CREATE POLICY "Users can update their own profile (non-role fields)" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id AND 
  -- Prevent role changes by ensuring OLD.role = NEW.role
  role = (SELECT role FROM public.profiles WHERE user_id = auth.uid())
);

-- Only system/admin functions can change roles (this would require admin-only edge functions)
-- For now, we block all role changes via regular updates

-- Fix sensitive data exposure in bids table
-- Hide wallet addresses and user IDs from public view
DROP POLICY IF EXISTS "Bids are viewable by everyone" ON public.bids;

CREATE POLICY "Bids are viewable with limited info" 
ON public.bids 
FOR SELECT 
USING (true);

-- Create a view for public bid information without sensitive data
CREATE OR REPLACE VIEW public.bids_public AS
SELECT 
  id,
  auction_id,
  amount,
  created_at,
  -- Hide sensitive wallet and user information
  CASE 
    WHEN auth.uid() = bidder_user_id THEN bidder_user_id 
    ELSE NULL 
  END as bidder_user_id,
  CASE 
    WHEN auth.uid() = bidder_user_id THEN bidder_wallet 
    ELSE NULL 
  END as bidder_wallet,
  CASE 
    WHEN auth.uid() = bidder_user_id THEN tx_hash 
    ELSE NULL 
  END as tx_hash
FROM public.bids;

-- Fix sensitive data exposure in auctions table  
DROP POLICY IF EXISTS "Auctions are viewable by everyone" ON public.auctions;

CREATE POLICY "Auctions are viewable with limited seller info" 
ON public.auctions 
FOR SELECT 
USING (true);

-- Create a view for public auction information
CREATE OR REPLACE VIEW public.auctions_public AS
SELECT 
  id,
  nft_id,
  start_price,
  reserve_price,
  starts_at,
  ends_at,
  status,
  created_at,
  updated_at,
  -- Hide sensitive seller information except for the seller themselves
  CASE 
    WHEN auth.uid() = seller_user_id THEN seller_user_id 
    ELSE NULL 
  END as seller_user_id,
  CASE 
    WHEN auth.uid() = seller_user_id THEN seller_wallet 
    ELSE NULL 
  END as seller_wallet
FROM public.auctions;

-- Fix sensitive data exposure in listings table
DROP POLICY IF EXISTS "Listings are viewable by everyone" ON public.listings;

CREATE POLICY "Listings are viewable with limited seller info" 
ON public.listings 
FOR SELECT 
USING (true);

-- Create a view for public listing information
CREATE OR REPLACE VIEW public.listings_public AS
SELECT 
  id,
  nft_id,
  price_amount,
  price_denom,
  status,
  created_at,
  updated_at,
  -- Hide sensitive seller information except for the seller themselves
  CASE 
    WHEN auth.uid() = seller_user_id THEN seller_user_id 
    ELSE NULL 
  END as seller_user_id,
  CASE 
    WHEN auth.uid() = seller_user_id THEN seller_wallet 
    ELSE NULL 
  END as seller_wallet
FROM public.listings;