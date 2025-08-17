import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Auction {
  id: string;
  nft_id: string;
  seller_user_id?: string;
  seller_wallet?: string;
  start_price: number;
  reserve_price?: number;
  status: string;
  starts_at?: string;
  ends_at?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  artwork?: {
    title: string;
    description?: string;
    image_url?: string;
    artist?: string;
  };
  current_bid?: number;
  bid_count?: number;
}

export interface Bid {
  id: string;
  auction_id: string;
  bidder_user_id?: string;
  bidder_wallet?: string;
  amount: number;
  tx_hash?: string;
  created_at: string;
  // Joined data
  bidder_name?: string;
}

export const useAuctions = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAuctions = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch auctions only
      const { data: auctionsData, error: fetchError } = await supabase
        .from('auctions')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      // Get bid statistics for each auction and fetch artwork data separately
      const auctionsWithBids = await Promise.all(
        (auctionsData || []).map(async (auction) => {
          // Fetch artwork data
          const { data: artworkData } = await supabase
            .from('artworks')
            .select('title, description, image_url')
            .eq('id', auction.nft_id)
            .single();

          // Fetch seller profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('display_name')
            .eq('user_id', auction.seller_user_id)
            .single();

          // Fetch bids
          const { data: bidsData, error: bidsError } = await supabase
            .from('bids')
            .select('amount')
            .eq('auction_id', auction.id)
            .order('amount', { ascending: false });

          const highestBid = bidsData?.[0]?.amount || auction.start_price;
          
          return {
            ...auction,
            artwork: {
              title: artworkData?.title || 'Unknown Artwork',
              description: artworkData?.description,
              image_url: artworkData?.image_url,
              artist: profileData?.display_name || 'Unknown Artist'
            },
            current_bid: highestBid,
            bid_count: bidsData?.length || 0
          };
        })
      );

      setAuctions(auctionsWithBids);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error fetching auctions",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  return {
    auctions,
    loading,
    error,
    refetch: fetchAuctions
  };
};

export const useBids = (auctionId: string) => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchBids = async () => {
    if (!auctionId) return;

    try {
      const { data, error } = await supabase
        .from('bids')
        .select('*')
        .eq('auction_id', auctionId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch profile data for each bid separately
      const transformedBids = await Promise.all(
        (data || []).map(async (bid) => {
          let bidder_name = 'Anonymous';
          if (bid.bidder_user_id) {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('display_name')
              .eq('user_id', bid.bidder_user_id)
              .single();
            bidder_name = profileData?.display_name || bid.bidder_wallet || 'Anonymous';
          }
          return {
            ...bid,
            bidder_name
          };
        })
      );

      setBids(transformedBids);
    } catch (err: any) {
      console.error('Error fetching bids:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const placeBid = async (amount: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to place a bid",
          variant: "destructive"
        });
        return { success: false };
      }

      const { error } = await supabase
        .from('bids')
        .insert({
          auction_id: auctionId,
          bidder_user_id: user.id,
          amount: amount
        });

      if (error) throw error;

      toast({
        title: "Bid placed successfully!",
        description: `Your bid of $${amount.toLocaleString()} has been placed.`
      });

      // Refetch bids to show the new bid
      fetchBids();
      return { success: true };
    } catch (err: any) {
      toast({
        title: "Error placing bid",
        description: err.message,
        variant: "destructive"
      });
      return { success: false };
    }
  };

  useEffect(() => {
    fetchBids();

    // Set up real-time subscription for bid updates
    const channel = supabase
      .channel(`bids-${auctionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bids',
          filter: `auction_id=eq.${auctionId}`
        },
        () => {
          fetchBids(); // Refetch when new bid is placed
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [auctionId]);

  return {
    bids,
    loading,
    placeBid,
    refetch: fetchBids
  };
};