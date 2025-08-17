import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Artwork {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  price_amount?: number;
  price_denom?: string;
  owner_user_id?: string;
  status: string;
  fractions_total?: number;
  fractions_available?: number;
  created_at: string;
  updated_at: string;
  // Computed fields
  artist?: string;
  category?: string;
  growth?: string;
}

export interface FilterOptions {
  search: string;
  category: string;
  priceRange: string;
  status: string;
  sortBy: string;
}

export const useArtworks = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchArtworks = async (filters?: FilterOptions) => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('artworks')
        .select(`
          *,
          profiles!artworks_owner_user_id_fkey(display_name)
        `);

      // Apply filters
      if (filters) {
        // Search filter
        if (filters.search) {
          query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
        }

        // Status filter
        if (filters.status && filters.status !== 'all') {
          query = query.eq('status', filters.status);
        }

        // Price range filter
        if (filters.priceRange && filters.priceRange !== 'all') {
          const [min, max] = filters.priceRange.split('-');
          if (max === '+') {
            query = query.gte('price_amount', parseFloat(min));
          } else {
            query = query
              .gte('price_amount', parseFloat(min))
              .lte('price_amount', parseFloat(max));
          }
        }

        // Sorting
        switch (filters.sortBy) {
          case 'newest':
            query = query.order('created_at', { ascending: false });
            break;
          case 'oldest':
            query = query.order('created_at', { ascending: true });
            break;
          case 'price-low':
            query = query.order('price_amount', { ascending: true });
            break;
          case 'price-high':
            query = query.order('price_amount', { ascending: false });
            break;
          case 'title':
            query = query.order('title', { ascending: true });
            break;
          default:
            query = query.order('created_at', { ascending: false });
        }
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      // Transform data to match ArtCard interface
      const transformedArtworks: Artwork[] = (data || []).map((artwork: any) => ({
        ...artwork,
        artist: artwork.profiles?.display_name || 'Unknown Artist',
        category: artwork.price_amount && artwork.price_amount > 10 ? 'Premium' : 'Accessible',
        growth: `+${(Math.random() * 20).toFixed(1)}%` // Mock growth data
      }));

      setArtworks(transformedArtworks);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error fetching artworks",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtworks();
  }, []);

  return {
    artworks,
    loading,
    error,
    refetch: fetchArtworks,
    fetchArtworks
  };
};