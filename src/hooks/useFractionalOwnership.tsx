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

      // 2. Simulate payment processing (since we don't have a real payment processor)
      // In a real app, this would integrate with Stripe, PayPal, etc.
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate payment processing time

      // For demo purposes, randomly succeed/fail 10% of the time to show error handling
      if (Math.random() < 0.1) {
        throw new Error('Payment processing failed. Please check your payment method and try again.');
      }

      // 3. Create transaction record (simplified - in real app this would be in a secure database table)
      const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Since we don't have a transactions table yet, we'll store this in artwork metadata
      const currentMetadata = (artwork.metadata as any) || {};
      const transactions = currentMetadata.transactions || [];
      
      const newTransaction = {
        id: transactionId,
        buyer_user_id: user.id,
        seller_user_id: artwork.owner_user_id,
        artwork_id: data.artworkId,
        amount: data.totalCost,
        currency: data.currency,
        transaction_type: 'fraction_purchase',
        status: 'completed',
        created_at: new Date().toISOString(),
        metadata: {
          ownership_percentage: data.ownershipPercentage,
          fraction_count: 1,
          purchase_price_per_fraction: data.totalCost
        }
      };

      transactions.push(newTransaction);

      // 4. Update artwork fractions and store transaction
      const { error: updateError } = await supabase
        .from('artworks')
        .update({
          fractions_available: Math.max(0, artwork.fractions_available - data.ownershipPercentage),
          metadata: {
            ...currentMetadata,
            transactions
          } as any,
          updated_at: new Date().toISOString()
        })
        .eq('id', data.artworkId);

      if (updateError) {
        console.error('Update error:', updateError);
        throw new Error('Failed to complete purchase. Please try again.');
      }

      toast({
        title: "Purchase Successful!",
        description: `You now own ${data.ownershipPercentage}% of this artwork`,
      });

      return { success: true, transaction: newTransaction };

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
      // Get artwork with transactions from metadata
      const { data: artwork, error } = await supabase
        .from('artworks')
        .select('metadata')
        .eq('id', artworkId)
        .single();

      if (error) throw error;

      const metadata = (artwork?.metadata as any) || {};
      const allTransactions = metadata.transactions || [];
      
      // Filter transactions for current user
      const userTransactions = allTransactions.filter((t: any) => 
        t.buyer_user_id === user.id && 
        t.transaction_type === 'fraction_purchase' && 
        t.status === 'completed'
      );

      const totalOwnership = userTransactions.reduce((sum: number, transaction: any) => {
        const ownership = transaction.metadata?.ownership_percentage || 0;
        return sum + ownership;
      }, 0);

      return { ownership: totalOwnership, transactions: userTransactions };

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