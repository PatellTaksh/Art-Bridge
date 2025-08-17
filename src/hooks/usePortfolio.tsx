import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface PortfolioStats {
  totalValue: number;
  totalInvested: number;
  totalGains: number;
  gainsPercentage: number;
  artworksOwned: number;
  activeTransactions: number;
}

interface PortfolioHolding {
  artwork_id: string;
  artwork_title: string;
  artwork_image?: string;
  artist_name: string;
  shares_owned: number;
  total_shares: number;
  ownership_percentage: number;
  current_value: number;
  purchase_price: number;
  gains: number;
  gains_percentage: number;
}

export const usePortfolio = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<PortfolioStats>({
    totalValue: 0,
    totalInvested: 0,
    totalGains: 0,
    gainsPercentage: 0,
    artworksOwned: 0,
    activeTransactions: 0
  });
  const [holdings, setHoldings] = useState<PortfolioHolding[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPortfolioData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Get user's transactions (purchases) and fetch artwork data separately
      const { data: transactions, error: transError } = await supabase
        .from('transactions')
        .select('*')
        .eq('buyer_user_id', user.id)
        .eq('status', 'completed');

      if (transError) throw transError;

      // Calculate portfolio stats
      let totalInvested = 0;
      let totalValue = 0;
      const artworkMap = new Map<string, PortfolioHolding>();

      for (const transaction of transactions || []) {
        // Fetch artwork data
        const { data: artwork } = await supabase
          .from('artworks')
          .select(`
            id,
            title,
            image_url,
            fractions_total,
            price_amount,
            owner_user_id
          `)
          .eq('id', transaction.artwork_id)
          .single();

        if (!artwork) continue;

        // Fetch artist profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('user_id', artwork.owner_user_id)
          .single();

        const artworkId = artwork.id;
        const purchasePrice = transaction.amount;
        
        // Simulate current market value (in real app, this would come from valuation service)
        const marketMultiplier = 1 + (Math.random() * 0.4 - 0.1); // -10% to +30% change
        const currentValue = purchasePrice * marketMultiplier;
        
        totalInvested += purchasePrice;
        totalValue += currentValue;

        // Group by artwork
        if (artworkMap.has(artworkId)) {
          const existing = artworkMap.get(artworkId)!;
          existing.shares_owned += 1; // Assuming 1 share per transaction
          existing.purchase_price += purchasePrice;
          existing.current_value += currentValue;
          existing.ownership_percentage = (existing.shares_owned / existing.total_shares) * 100;
          existing.gains = existing.current_value - existing.purchase_price;
          existing.gains_percentage = (existing.gains / existing.purchase_price) * 100;
        } else {
          artworkMap.set(artworkId, {
            artwork_id: artworkId,
            artwork_title: artwork.title,
            artwork_image: artwork.image_url,
            artist_name: profileData?.display_name || 'Unknown Artist',
            shares_owned: 1,
            total_shares: artwork.fractions_total || 1,
            ownership_percentage: (1 / (artwork.fractions_total || 1)) * 100,
            current_value: currentValue,
            purchase_price: purchasePrice,
            gains: currentValue - purchasePrice,
            gains_percentage: ((currentValue - purchasePrice) / purchasePrice) * 100
          });
        }
      }

      const totalGains = totalValue - totalInvested;
      const gainsPercentage = totalInvested > 0 ? (totalGains / totalInvested) * 100 : 0;

      setStats({
        totalValue,
        totalInvested,
        totalGains,
        gainsPercentage,
        artworksOwned: artworkMap.size,
        activeTransactions: transactions?.length || 0
      });

      setHoldings(Array.from(artworkMap.values()));

    } catch (err: any) {
      console.error('Error fetching portfolio:', err);
      toast({
        title: "Error loading portfolio",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolioData();
  }, [user]);

  return {
    stats,
    holdings,
    loading,
    refetch: fetchPortfolioData
  };
};