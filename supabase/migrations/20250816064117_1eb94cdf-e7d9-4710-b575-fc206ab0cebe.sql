-- Fix security definer view issues by recreating views properly
-- Drop the problematic views and recreate them without security definer issues

DROP VIEW IF EXISTS public.bids_public;
DROP VIEW IF EXISTS public.auctions_public; 
DROP VIEW IF EXISTS public.listings_public;

-- Create proper views that work with RLS instead of bypassing it
-- These views will respect the current user's permissions

CREATE VIEW public.bids_public AS
SELECT 
  id,
  auction_id,
  amount,
  created_at,
  -- Only show bidder info to the bidder themselves
  CASE 
    WHEN bidder_user_id = auth.uid() THEN bidder_user_id 
    ELSE NULL 
  END as bidder_user_id,
  CASE 
    WHEN bidder_user_id = auth.uid() THEN bidder_wallet 
    ELSE NULL 
  END as bidder_wallet,
  CASE 
    WHEN bidder_user_id = auth.uid() THEN tx_hash 
    ELSE NULL 
  END as tx_hash
FROM public.bids;

CREATE VIEW public.auctions_public AS
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
  -- Only show seller info to the seller themselves  
  CASE 
    WHEN seller_user_id = auth.uid() THEN seller_user_id 
    ELSE NULL 
  END as seller_user_id,
  CASE 
    WHEN seller_user_id = auth.uid() THEN seller_wallet 
    ELSE NULL 
  END as seller_wallet
FROM public.auctions;

CREATE VIEW public.listings_public AS
SELECT 
  id,
  nft_id,
  price_amount,
  price_denom,
  status,
  created_at,
  updated_at,
  -- Only show seller info to the seller themselves
  CASE 
    WHEN seller_user_id = auth.uid() THEN seller_user_id 
    ELSE NULL 
  END as seller_user_id,
  CASE 
    WHEN seller_user_id = auth.uid() THEN seller_wallet 
    ELSE NULL 
  END as seller_wallet
FROM public.listings;