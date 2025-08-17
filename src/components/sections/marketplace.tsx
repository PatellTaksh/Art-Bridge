import { useState, useMemo } from "react";
import ArtCard from "@/components/ui/art-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchFilter, FilterOptions } from "@/components/ui/search-filter";
import { useArtworks } from "@/hooks/useArtworks";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import artwork1 from "@/assets/artwork-1.jpg";
import artwork2 from "@/assets/artwork-2.jpg";
import artwork3 from "@/assets/artwork-3.jpg";
import artwork4 from "@/assets/artwork-4.jpg";

const Marketplace = () => {
  const { artworks, loading, error, fetchArtworks } = useArtworks();
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    category: 'all',
    priceRange: 'all',
    status: 'all',
    sortBy: 'newest'
  });

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    fetchArtworks(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      search: '',
      category: 'all',
      priceRange: 'all',
      status: 'all',
      sortBy: 'newest'
    };
    setFilters(clearedFilters);
    fetchArtworks(clearedFilters);
  };

  // Filter artworks by category for tabs
  const premiumArtworks = useMemo(() => 
    artworks.filter(artwork => artwork.category === 'Premium'), 
    [artworks]
  );
  
  const accessibleArtworks = useMemo(() => 
    artworks.filter(artwork => artwork.category === 'Accessible'), 
    [artworks]
  );

  // Fallback data for when no real artworks exist
  const fallbackPremiumArtworks = [
    {
      title: "The Starry Mountain",
      artist: "Vincent van Modern",
      price: "15.2",
      priceUSD: "45,240",
      image: artwork1,
      category: "Premium" as const,
      growth: "+12.5%"
    },
    {
      title: "Abstract Dreams", 
      artist: "Maya Chen",
      price: "8.7",
      priceUSD: "25,890",
      image: artwork2,
      category: "Premium" as const,
      growth: "+8.3%"
    },
    {
      title: "Digital Renaissance",
      artist: "Alessandro Pike", 
      price: "12.1",
      priceUSD: "36,050",
      image: artwork3,
      category: "Premium" as const,
      growth: "+15.2%"
    }
  ];

  const fallbackAccessibleArtworks = [
    {
      title: "Modern Sculpture",
      artist: "Elena Rodriguez",
      price: "2.3", 
      priceUSD: "6,840",
      image: artwork4,
      category: "Accessible" as const,
      growth: "+5.7%"
    },
    {
      title: "Urban Landscape",
      artist: "James Wilson",
      price: "1.8",
      priceUSD: "5,360", 
      image: artwork1,
      category: "Accessible" as const,
      growth: "+3.2%"
    },
    {
      title: "Color Symphony",
      artist: "Nina Petrov",
      price: "3.1",
      priceUSD: "9,230",
      image: artwork2,
      category: "Accessible" as const,
      growth: "+7.1%"
    }
  ];

  const displayPremiumArtworks = premiumArtworks.length > 0 ? 
    premiumArtworks.map(artwork => ({
      title: artwork.title,
      artist: artwork.artist || 'Unknown Artist',
      price: artwork.price_amount?.toString() || '0',
      priceUSD: (((artwork.price_amount || 0) * 2980).toLocaleString()),
      image: artwork.image_url || artwork1,
      category: "Premium" as const,
      growth: artwork.growth || '+0%'
    })) : fallbackPremiumArtworks;

  const displayAccessibleArtworks = accessibleArtworks.length > 0 ? 
    accessibleArtworks.map(artwork => ({
      title: artwork.title,
      artist: artwork.artist || 'Unknown Artist',
      price: artwork.price_amount?.toString() || '0',
      priceUSD: (((artwork.price_amount || 0) * 2980).toLocaleString()),
      image: artwork.image_url || artwork4,
      category: "Accessible" as const,
      growth: artwork.growth || '+0%'
    })) : fallbackAccessibleArtworks;

  if (error) {
    return (
      <section id="marketplace" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Error Loading Artworks</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => fetchArtworks(filters)}>Try Again</Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="marketplace" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-foreground">Marketplace</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover and invest in curated artworks from emerging and established artists
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 lg:max-w-xs">
          <SearchFilter
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="premium" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
            <TabsTrigger value="premium" className="text-lg">Premium Masterpieces</TabsTrigger>
            <TabsTrigger value="accessible" className="text-lg">Accessible Investments</TabsTrigger>
          </TabsList>

          {/* Premium Artworks */}
          <TabsContent value="premium" className="space-y-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-foreground mb-2">Premium Masterpieces</h3>
              <p className="text-muted-foreground">High-value artworks from renowned artists</p>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="space-y-4">
                    <Skeleton className="aspect-square w-full rounded-2xl" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayPremiumArtworks.map((artwork, index) => (
                  <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                    <ArtCard {...artwork} />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Accessible Artworks */}
          <TabsContent value="accessible" className="space-y-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-foreground mb-2">Accessible Investments</h3>
              <p className="text-muted-foreground">Entry-level investments for new collectors</p>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="space-y-4">
                    <Skeleton className="aspect-square w-full rounded-2xl" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayAccessibleArtworks.map((artwork, index) => (
                  <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                    <ArtCard {...artwork} />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="text-lg px-8 py-4">
            View All Artworks ({artworks.length})
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Marketplace;