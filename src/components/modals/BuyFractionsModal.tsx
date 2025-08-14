import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Percent, DollarSign, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BuyFractionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  artwork: {
    title: string;
    artist: string;
    image: string;
    pricePerPercent: number;
    totalValue: number;
  };
}

const BuyFractionsModal = ({ isOpen, onClose, artwork }: BuyFractionsModalProps) => {
  const [ownershipPercent, setOwnershipPercent] = useState([2]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean | null>(null);
  
  const { toast } = useToast();

  const totalCost = ownershipPercent[0] * artwork.pricePerPercent;

  const handleConfirmPurchase = () => {
    setShowConfirmation(true);
  };

  const handleProceedToPayment = () => {
    setShowConfirmation(false);
    setShowPayment(true);
    
    // Simulate payment processing
    setTimeout(() => {
      // 80% chance of success
      const success = Math.random() > 0.2;
      setPaymentSuccess(success);
      
      if (success) {
        toast({
          title: "Purchase Successful!",
          description: `You now own ${ownershipPercent[0]}% of "${artwork.title}"`,
        });
      } else {
        toast({
          title: "Payment Failed",
          description: "Please try again or use a different payment method",
          variant: "destructive",
        });
      }
    }, 3000);
  };

  const handleClose = () => {
    setShowConfirmation(false);
    setShowPayment(false);
    setPaymentSuccess(null);
    setOwnershipPercent([2]);
    onClose();
  };

  const PaymentPage = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">
          {paymentSuccess === null ? "Processing Payment..." : 
           paymentSuccess ? "Payment Successful!" : "Payment Failed"}
        </h3>
        
        {paymentSuccess === null && (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        )}
        
        {paymentSuccess === true && (
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        )}
        
        {paymentSuccess === false && (
          <XCircle className="w-16 h-16 text-red-500 mx-auto" />
        )}
      </div>

      <div className="bg-background-secondary rounded-lg p-6">
        <h4 className="font-semibold mb-4">Transaction Details</h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Artwork:</span>
            <span className="font-medium">{artwork.title}</span>
          </div>
          <div className="flex justify-between">
            <span>Ownership:</span>
            <span className="font-medium">{ownershipPercent[0]}%</span>
          </div>
          <div className="flex justify-between">
            <span>Amount:</span>
            <span className="font-medium">${totalCost.toLocaleString()}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold">
            <span>Status:</span>
            <span className={paymentSuccess === true ? "text-green-500" : 
                           paymentSuccess === false ? "text-red-500" : "text-primary"}>
              {paymentSuccess === null ? "Processing..." :
               paymentSuccess ? "Complete" : "Failed"}
            </span>
          </div>
        </div>
      </div>

      {paymentSuccess !== null && (
        <Button onClick={handleClose} className="w-full">
          {paymentSuccess ? "Continue" : "Try Again"}
        </Button>
      )}
    </div>
  );

  if (showPayment) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Stripe Payment</DialogTitle>
          </DialogHeader>
          <PaymentPage />
        </DialogContent>
      </Dialog>
    );
  }

  if (showConfirmation) {
    return (
      <Dialog open={isOpen} onOpenChange={() => setShowConfirmation(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Purchase</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-lg mb-4">
                Confirm purchase of <span className="font-bold text-primary">{ownershipPercent[0]}%</span> 
                {" "}for <span className="font-bold text-primary">${totalCost.toLocaleString()}</span>?
              </p>
            </div>

            <div className="bg-background-secondary rounded-lg p-4">
              <h4 className="font-semibold mb-3">Purchase Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Artwork:</span>
                  <span className="font-medium">{artwork.title}</span>
                </div>
                <div className="flex justify-between">
                  <span>Artist:</span>
                  <span className="font-medium">{artwork.artist}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ownership:</span>
                  <span className="font-medium">{ownershipPercent[0]}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Price per %:</span>
                  <span className="font-medium">${artwork.pricePerPercent.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-primary">${totalCost.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setShowConfirmation(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleProceedToPayment}
                className="btn-hero flex-1"
              >
                Pay Now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Buy Fractions</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Artwork Display */}
          <div className="space-y-4">
            <div className="relative rounded-xl overflow-hidden">
              <img 
                src={artwork.image} 
                alt={artwork.title}
                className="w-full h-48 object-cover"
              />
              <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                Fractional
              </Badge>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-foreground">{artwork.title}</h3>
              <p className="text-muted-foreground">by {artwork.artist}</p>
            </div>

            <div className="bg-background-secondary rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-1">Total Artwork Value</div>
              <div className="text-2xl font-bold text-foreground">
                ${artwork.totalValue.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                ${artwork.pricePerPercent.toLocaleString()} per 1%
              </div>
            </div>
          </div>

          {/* Purchase Interface */}
          <div className="space-y-6">
            {/* Ownership Selector */}
            <div className="bg-background-secondary rounded-lg p-4">
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                <Percent className="w-5 h-5 mr-2" />
                Select Ownership Percentage
              </h4>
              
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {ownershipPercent[0]}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    of total artwork ownership
                  </div>
                </div>

                <Slider
                  value={ownershipPercent}
                  onValueChange={setOwnershipPercent}
                  max={10}
                  min={1}
                  step={0.5}
                  className="w-full"
                />

                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>1%</span>
                  <span>10%</span>
                </div>
              </div>
            </div>

            {/* Cost Calculation */}
            <div className="bg-background-secondary rounded-lg p-4">
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Cost Breakdown
              </h4>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Ownership Percentage:</span>
                  <span className="font-medium">{ownershipPercent[0]}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Price per %:</span>
                  <span className="font-medium">${artwork.pricePerPercent.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Cost:</span>
                  <span className="text-primary">${totalCost.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Purchase Button */}
            <Button 
              onClick={handleConfirmPurchase}
              className="btn-hero w-full text-lg"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Purchase {ownershipPercent[0]}% for ${totalCost.toLocaleString()}
            </Button>

            {/* Benefits */}
            <div className="bg-background-secondary rounded-lg p-4">
              <h5 className="font-semibold mb-3">What you get:</h5>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>{ownershipPercent[0]}% ownership of the artwork</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Proportional share of future sales</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Voting rights on major decisions</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Tradeable ownership tokens</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BuyFractionsModal;