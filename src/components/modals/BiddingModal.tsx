import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Clock, Users2, TrendingUp, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useBids } from "@/hooks/useAuctions";

interface BiddingModalProps {
  isOpen: boolean;
  onClose: () => void;
  auctionId: string;
  artwork: {
    title: string;
    artist: string;
    image: string;
    currentBid: number;
  };
}

const BiddingModal = ({ isOpen, onClose, auctionId, artwork }: BiddingModalProps) => {
  const [bidAmount, setBidAmount] = useState("");
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 32 });
  const [isPlacingBid, setIsPlacingBid] = useState(false);
  
  const { bids, loading: bidsLoading, placeBid } = useBids(auctionId);
  const { toast } = useToast();
  
  const currentHighestBid = bids.length > 0 ? bids[0].amount : artwork.currentBid;
  const highestBidder = bids.length > 0 ? bids[0].bidder_name : "No bids yet";

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

  const handlePlaceBid = async () => {
    const amount = parseFloat(bidAmount);
    
    if (isNaN(amount) || amount < minimumBid) {
      toast({
        title: "Invalid Bid Amount",
        description: `Minimum bid is $${minimumBid.toLocaleString()}`,
        variant: "destructive",
      });
      return;
    }

    setIsPlacingBid(true);
    const result = await placeBid(amount);
    setIsPlacingBid(false);

    if (result.success) {
      setBidAmount("");
    }
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
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-1">Current Highest Bid</div>
              <div className="text-3xl font-bold text-primary mb-1">
                ${currentHighestBid.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                by {highestBidder}
              </div>
            </div>

            {/* Timer */}
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-3 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Auction ends in:
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-background rounded p-2">
                  <div className="text-xl font-bold text-primary">{timeLeft.hours}</div>
                  <div className="text-xs text-muted-foreground">Hours</div>
                </div>
                <div className="bg-background rounded p-2">
                  <div className="text-xl font-bold text-primary">{timeLeft.minutes}</div>
                  <div className="text-xs text-muted-foreground">Minutes</div>
                </div>
                <div className="bg-background rounded p-2">
                  <div className="text-xl font-bold text-primary">{timeLeft.seconds}</div>
                  <div className="text-xs text-muted-foreground">Seconds</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bidding Interface */}
          <div className="space-y-6">
            {/* Place Bid */}
            <div className="bg-muted/50 rounded-lg p-4">
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
                  className="w-full"
                  size="lg"
                  disabled={isPlacingBid}
                >
                  {isPlacingBid ? "Placing Bid..." : "Place Bid"}
                </Button>
              </div>
            </div>

            {/* Bid History */}
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold">Bid History</h4>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users2 className="w-4 h-4 mr-1" />
                  {bids.length} bidders
                </div>
              </div>

              <div className="space-y-4 max-h-64 overflow-y-auto">
                {bidsLoading ? (
                  <div className="text-center py-4">Loading bids...</div>
                ) : bids.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">No bids yet</div>
                ) : (
                  bids.map((bid) => (
                    <div key={bid.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <div className="font-medium text-sm">{bid.bidder_name}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatTimeAgo(new Date(bid.created_at))}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary">
                          ${bid.amount.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BiddingModal;