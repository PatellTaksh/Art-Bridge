import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BuyFractionsModal from "@/components/modals/BuyFractionsModal";
import { Heart, TrendingUp } from "lucide-react";
import { useState } from "react";

interface ArtCardProps {
  title: string;
  artist: string;
  price: string;
  priceUSD: string;
  image: string;
  category: "Premium" | "Accessible";
  isLiked?: boolean;
  growth?: string;
}

const ArtCard = ({ 
  title, 
  artist, 
  price, 
  priceUSD, 
  image, 
  category, 
  isLiked = false,
  growth 
}: ArtCardProps) => {
  const [liked, setLiked] = useState(isLiked);
  const [showBuyModal, setShowBuyModal] = useState(false);

  const artwork = {
    id: '1', // Mock ID for demo
    title,
    artist,
    image,
    pricePerPercent: 150,
    totalValue: 15000
  };

  return (
    <div className="art-card group">
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Category Badge */}
        <Badge 
          className={`absolute top-4 left-4 ${
            category === "Premium" 
              ? "bg-primary text-primary-foreground" 
              : "bg-secondary text-secondary-foreground"
          }`}
        >
          {category}
        </Badge>

        {/* Like Button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 h-8 w-8 p-0 bg-background/20 backdrop-blur-sm hover:bg-background/40"
          onClick={() => setLiked(!liked)}
        >
          <Heart 
            className={`h-4 w-4 ${liked ? 'fill-red-500 text-red-500' : 'text-white'}`} 
          />
        </Button>

        {/* Growth Indicator */}
        {growth && (
          <div className="absolute bottom-4 right-4 flex items-center space-x-1 bg-green-500/20 backdrop-blur-sm rounded-full px-2 py-1 text-green-400">
            <TrendingUp className="h-3 w-3" />
            <span className="text-xs font-medium">{growth}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="font-semibold text-lg text-foreground mb-1 line-clamp-1">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm">
            by {artist}
          </p>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-2xl font-bold text-primary">
              {price} ETH
            </div>
            <div className="text-sm text-muted-foreground">
              ${priceUSD}
            </div>
          </div>
        </div>

        <Button 
          className="w-full btn-hero"
          onClick={() => setShowBuyModal(true)}
        >
          <TrendingUp className="w-4 h-4 mr-1" />
          Buy Fractions
        </Button>
        
        <BuyFractionsModal
          isOpen={showBuyModal}
          onClose={() => setShowBuyModal(false)}
          artwork={artwork}
        />
      </div>
    </div>
  );
};

export default ArtCard;