import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ArtCard from "@/components/ui/art-card";
import { Clock, Gavel, Users2 } from "lucide-react";
import { useEffect, useState } from "react";
import auctionFeatured from "@/assets/auction-featured.jpg";
import artwork1 from "@/assets/artwork-1.jpg";
import artwork2 from "@/assets/artwork-2.jpg";
import artwork3 from "@/assets/artwork-3.jpg";
import artwork4 from "@/assets/artwork-4.jpg";

const Auction = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 32,
    seconds: 45
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const upcomingAuctions = [
    {
      title: "Ancient Wisdom",
      artist: "Marcus Stone",
      price: "18.5",
      priceUSD: "55,020",
      image: artwork1,
      category: "Premium" as const
    },
    {
      title: "Cosmic Journey",
      artist: "Luna Martinez",
      price: "14.2",
      priceUSD: "42,260",
      image: artwork2,
      category: "Premium" as const
    },
    {
      title: "Nature's Call",
      artist: "River Thompson",
      price: "22.7",
      priceUSD: "67,540",
      image: artwork3,
      category: "Premium" as const
    },
    {
      title: "Steel Dreams",
      artist: "Viktor Steele",
      price: "16.9",
      priceUSD: "50,310",
      image: artwork4,
      category: "Premium" as const
    }
  ];

  return (
    <section id="auction" className="py-24 bg-background-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-foreground">Auction</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Live bidding on exclusive artworks from master artists
          </p>
        </div>

        {/* Featured Auction */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <Badge className="bg-primary text-primary-foreground mb-4">
              <Gavel className="w-4 h-4 mr-2" />
              Now Running
            </Badge>
            <h3 className="text-3xl font-bold text-foreground mb-2">
              The Great Wave off Kanagawa by Hokusai
            </h3>
          </div>

          <div className="art-card max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Image */}
              <div className="relative overflow-hidden rounded-xl">
                <img 
                  src={auctionFeatured} 
                  alt="The Great Wave off Kanagawa"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-red-500 text-white animate-pulse">
                    Live Auction
                  </Badge>
                </div>
              </div>

              {/* Auction Details */}
              <div className="p-6 flex flex-col justify-between">
                <div>
                  <div className="mb-6">
                    <div className="text-sm text-muted-foreground mb-2">Current Bid</div>
                    <div className="text-4xl font-bold text-primary mb-2">127.5 ETH</div>
                    <div className="text-lg text-muted-foreground">$379,500 USD</div>
                  </div>

                  {/* Timer */}
                  <div className="mb-6">
                    <div className="text-sm text-muted-foreground mb-3 flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Auction ends in:
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="bg-background-tertiary rounded-lg p-3">
                        <div className="text-2xl font-bold text-primary">{timeLeft.days}</div>
                        <div className="text-xs text-muted-foreground">Days</div>
                      </div>
                      <div className="bg-background-tertiary rounded-lg p-3">
                        <div className="text-2xl font-bold text-primary">{timeLeft.hours}</div>
                        <div className="text-xs text-muted-foreground">Hours</div>
                      </div>
                      <div className="bg-background-tertiary rounded-lg p-3">
                        <div className="text-2xl font-bold text-primary">{timeLeft.minutes}</div>
                        <div className="text-xs text-muted-foreground">Minutes</div>
                      </div>
                      <div className="bg-background-tertiary rounded-lg p-3">
                        <div className="text-2xl font-bold text-primary">{timeLeft.seconds}</div>
                        <div className="text-xs text-muted-foreground">Seconds</div>
                      </div>
                    </div>
                  </div>

                  {/* Bid Stats */}
                  <div className="flex items-center text-sm text-muted-foreground mb-6">
                    <Users2 className="w-4 h-4 mr-2" />
                    <span>24 bidders • Last bid 2 minutes ago</span>
                  </div>
                </div>

                <Button size="lg" className="btn-hero w-full text-lg">
                  Place Bid
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Auctions */}
        <div>
          <h3 className="text-3xl font-bold text-foreground text-center mb-12">
            Upcoming Auctions
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {upcomingAuctions.map((artwork, index) => (
              <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <ArtCard {...artwork} />
              </div>
            ))}
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="text-lg px-8 py-4">
            View All Auctions
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Auction;