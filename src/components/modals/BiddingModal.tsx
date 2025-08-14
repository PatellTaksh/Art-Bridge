import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Clock, Users2, TrendingUp, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Bid {
  id: string;
  bidder: string;
  amount: number;
  timestamp: Date;
}

interface BiddingModalProps {
  isOpen: boolean;
  onClose: () => void;
  artwork: {
    title: string;
    artist: string;
    image: string;
    currentBid: number;
  };
}

const BiddingModal = ({ isOpen, onClose, artwork }: BiddingModalProps) => {
  const [bidAmount, setBidAmount] = useState("");
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 32 });
  const [bidHistory, setBidHistory] = useState<Bid[]>([
    { id: "1", bidder: "@ArtCollector23", amount: 4200, timestamp: new Date(Date.now() - 120000) },
    { id: "2", bidder: "@ModernArt_Fan", amount: 4100, timestamp: new Date(Date.now() - 300000) },
    { id: "3", bidder: "@GalleryMaster", amount: 4000, timestamp: new Date(Date.now() - 420000) },
    { id: "4", bidder: "@VisionaryBuyer", amount: 3900, timestamp: new Date(Date.now() - 600000) },
    { id: "5", bidder: "@ArtInvestor", amount: 3800, timestamp: new Date(Date.now() - 720000) },
  ]);
  const [currentHighestBid, setCurrentHighestBid] = useState(4200);
  const [highestBidder, setHighestBidder] = useState("@ArtCollector23");
  
  const { toast } = useToast();

  const minimumBid = Math.ceil(currentHighestBid * 1.05); // 5% increase

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simulate real-time bid updates
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      // 20% chance of new bid every 10 seconds
      if (Math.random() < 0.2) {
        const newBid = currentHighestBid + Math.floor(Math.random() * 200) + 100;
        const bidders = ["@NewCollector", "@ArtLover99", "@ModernInvestor", "@GalleryOwner"];
        const randomBidder = bidders[Math.floor(Math.random() * bidders.length)];
        
        const newBidEntry: Bid = {
          id: Date.now().toString(),
          bidder: randomBidder,
          amount: newBid,
          timestamp: new Date()
        };

        setBidHistory(prev => [newBidEntry, ...prev.slice(0, 4)]);
        setCurrentHighestBid(newBid);
        setHighestBidder(randomBidder);

        toast({
          title: "New Bid Placed!",
          description: `${randomBidder} bid $${newBid.toLocaleString()}`,
        });
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [isOpen, currentHighestBid, toast]);

  const handlePlaceBid = () => {
    const bid = parseInt(bidAmount);
    
    if (!bid || bid < minimumBid) {
      toast({
        title: "Invalid Bid",
        description: `Minimum bid is $${minimumBid.toLocaleString()}`,
        variant: "destructive",
      });
      return;
    }

    const newBidEntry: Bid = {
      id: Date.now().toString(),
      bidder: "@You",
      amount: bid,
      timestamp: new Date()
    };

    setBidHistory(prev => [newBidEntry, ...prev.slice(0, 4)]);
    setCurrentHighestBid(bid);
    setHighestBidder("@You");
    setBidAmount("");

    toast({
      title: "Bid Placed Successfully!",
      description: `You are now the highest bidder at $${bid.toLocaleString()}`,
    });
  };

  const formatTimeAgo = (timestamp: Date) => {
    const seconds = Math.floor((Date.now() - timestamp.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Live Auction</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Artwork Display */}
          <div className="space-y-4">
            <div className="relative rounded-xl overflow-hidden">
              <img 
                src={artwork.image} 
                alt={artwork.title}
                className="w-full h-64 object-cover"
              />
              <Badge className="absolute top-4 left-4 bg-red-500 text-white animate-pulse">
                Live Auction
              </Badge>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-foreground">{artwork.title}</h3>
              <p className="text-muted-foreground">by {artwork.artist}</p>
            </div>

            {/* Current Bid Display */}
            <div className="bg-background-secondary rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-1">Current Highest Bid</div>
              <div className="text-3xl font-bold text-primary mb-1">
                ${currentHighestBid.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                by {highestBidder} • {bidHistory[0] ? formatTimeAgo(bidHistory[0].timestamp) : ""}
              </div>
            </div>

            {/* Timer */}
            <div className="bg-background-secondary rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-3 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Auction ends in:
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-background-tertiary rounded p-2">
                  <div className="text-xl font-bold text-primary">{timeLeft.hours}</div>
                  <div className="text-xs text-muted-foreground">Hours</div>
                </div>
                <div className="bg-background-tertiary rounded p-2">
                  <div className="text-xl font-bold text-primary">{timeLeft.minutes}</div>
                  <div className="text-xs text-muted-foreground">Minutes</div>
                </div>
                <div className="bg-background-tertiary rounded p-2">
                  <div className="text-xl font-bold text-primary">{timeLeft.seconds}</div>
                  <div className="text-xs text-muted-foreground">Seconds</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bidding Interface */}
          <div className="space-y-6">
            {/* Place Bid */}
            <div className="bg-background-secondary rounded-lg p-4">
              <h4 className="text-lg font-semibold mb-4">Place Your Bid</h4>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">Bid Amount ($)</label>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Min: ${minimumBid.toLocaleString()}
                    </div>
                  </div>
                  <Input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder={`Enter at least $${minimumBid.toLocaleString()}`}
                    className="text-lg"
                  />
                </div>

                <Button 
                  onClick={handlePlaceBid}
                  className="btn-hero w-full text-lg"
                  disabled={!bidAmount || parseInt(bidAmount) < minimumBid}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Place Bid
                </Button>
              </div>
            </div>

            {/* Bid History */}
            <div className="bg-background-secondary rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold">Bid History</h4>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users2 className="w-4 h-4 mr-1" />
                  {bidHistory.length} bidders
                </div>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
                {bidHistory.map((bid, index) => (
                  <div 
                    key={bid.id}
                    className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                      index === 0 ? "bg-primary/10 border border-primary/20" : "bg-background-tertiary"
                    }`}
                  >
                    <div>
                      <div className="font-medium text-foreground">{bid.bidder}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatTimeAgo(bid.timestamp)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-foreground">
                        ${bid.amount.toLocaleString()}
                      </div>
                      {index === 0 && (
                        <Badge variant="outline" className="text-xs border-primary text-primary">
                          Highest
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BiddingModal;