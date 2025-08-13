import ArtCard from "@/components/ui/art-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import artwork1 from "@/assets/artwork-1.jpg";
import artwork2 from "@/assets/artwork-2.jpg";
import artwork3 from "@/assets/artwork-3.jpg";
import artwork4 from "@/assets/artwork-4.jpg";

const Marketplace = () => {
  const premiumArtworks = [
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

  const accessibleArtworks = [
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {premiumArtworks.map((artwork, index) => (
                <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                  <ArtCard {...artwork} />
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Accessible Artworks */}
          <TabsContent value="accessible" className="space-y-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-foreground mb-2">Accessible Investments</h3>
              <p className="text-muted-foreground">Entry-level investments for new collectors</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {accessibleArtworks.map((artwork, index) => (
                <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                  <ArtCard {...artwork} />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="text-lg px-8 py-4">
            View All Artworks
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Marketplace;