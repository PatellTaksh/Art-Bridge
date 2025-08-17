import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface PurchaseFractionsData {
  artworkId: string;
  ownershipPercentage: number;
  totalCost: number;
  currency: string;
}

export const useFractionalOwnership = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const purchaseFractions = async (data: PurchaseFractionsData) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to purchase fractions",
        variant: "destructive"
      });
      return { success: false, error: "Not authenticated" };
    }

    setLoading(true);
    try {
      // 1. Check if artwork exists and has available fractions
      const { data: artwork, error: artworkError } = await supabase
        .from('artworks')
        .select('*')
        .eq('id', data.artworkId)
        .single();

      if (artworkError || !artwork) {
        throw new Error('Artwork not found');
      }

      if (artwork.fractions_available < 1) {
        throw new Error('No fractions available for this artwork');
      }

      // 2. Create transaction record
      const { data: transaction, error: transactionError } = await supabase
        .from('transactions')
        .insert({
          buyer_user_id: user.id,
          seller_user_id: artwork.owner_user_id,
          artwork_id: data.artworkId,
          amount: data.totalCost,
          currency: data.currency,
          transaction_type: 'fraction_purchase',
          status: 'completed', // In real app, this would be 'pending' until payment confirmation
          metadata: {
            ownership_percentage: data.ownershipPercentage,
            fraction_count: 1, // Simplified - in real app this would be calculated
            purchase_price_per_fraction: data.totalCost
          }
        })
        .select()
        .single();

      if (transactionError) {
        throw new Error('Failed to create transaction');
      }

      // 3. Update artwork fractions (simplified logic)
      const { error: updateError } = await supabase
        .from('artworks')
        .update({
          fractions_available: artwork.fractions_available - 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', data.artworkId);

      if (updateError) {
        // Rollback transaction if artwork update fails
        await supabase.from('transactions').delete().eq('id', transaction.id);
        throw new Error('Failed to update artwork ownership');
      }

      toast({
        title: "Purchase Successful!",
        description: `You now own ${data.ownershipPercentage}% of this artwork`,
      });

      return { success: true, transaction };

    } catch (error: any) {
      console.error('Purchase error:', error);
      toast({
        title: "Purchase Failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const getFractionalOwnership = async (artworkId: string) => {
    if (!user) return { ownership: 0, transactions: [] };

    try {
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('buyer_user_id', user.id)
        .eq('artwork_id', artworkId)
        .eq('transaction_type', 'fraction_purchase')
        .eq('status', 'completed');

      if (error) throw error;

      const totalOwnership = transactions?.reduce((sum, transaction) => {
        const metadata = transaction.metadata as any;
        const ownership = metadata?.ownership_percentage || 0;
        return sum + ownership;
      }, 0) || 0;

      return { ownership: totalOwnership, transactions: transactions || [] };

    } catch (error: any) {
      console.error('Error fetching ownership:', error);
      return { ownership: 0, transactions: [] };
    }
  };

  return {
    purchaseFractions,
    getFractionalOwnership,
    loading
  };
};