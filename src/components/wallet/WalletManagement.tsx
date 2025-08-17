import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Wallet, Copy, ExternalLink, AlertCircle, CheckCircle, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface WalletManagementProps {
  profile: any;
  onProfileUpdate: () => void;
}

const WalletManagement = ({ profile, onProfileUpdate }: WalletManagementProps) => {
  const [walletAddress, setWalletAddress] = useState(profile?.wallet_address || '');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Mock wallet connection - in real app this would integrate with actual wallet providers
  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      // Simulate wallet connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a mock wallet address
      const mockAddress = '0x' + Math.random().toString(16).substr(2, 40);
      setWalletAddress(mockAddress);
      
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to MetaMask",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const saveWalletAddress = async () => {
    if (!user || !walletAddress) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          wallet_address: walletAddress,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Wallet Updated",
        description: "Your wallet address has been saved successfully",
      });
      
      onProfileUpdate();
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update wallet address",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      toast({
        title: "Copied!",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const isValidAddress = walletAddress.length === 42 && walletAddress.startsWith('0x');

  return (
    <div className="space-y-6">
      {/* Wallet Connection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wallet className="h-5 w-5 mr-2" />
            Wallet Connection
          </CardTitle>
          <CardDescription>
            Connect your crypto wallet to enable blockchain transactions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!walletAddress ? (
            <div className="text-center py-8">
              <Wallet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No wallet connected</p>
              <Button 
                onClick={connectWallet} 
                disabled={isConnecting}
                className="btn-hero"
              >
                {isConnecting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet className="h-4 w-4 mr-2" />
                    Connect MetaMask
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-background-secondary rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Wallet className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">MetaMask Wallet</p>
                    <p className="text-sm text-muted-foreground">
                      {walletAddress.substring(0, 6)}...{walletAddress.substring(38)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Connected
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={copyAddress}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Manual Address Entry */}
      <Card>
        <CardHeader>
          <CardTitle>Manual Address Entry</CardTitle>
          <CardDescription>
            Or enter your wallet address manually
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="wallet">Wallet Address</Label>
            <div className="flex space-x-2 mt-1">
              <Input
                id="wallet"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="0x..."
                className="flex-1"
              />
              <Button 
                onClick={saveWalletAddress} 
                disabled={!isValidAddress || isSaving}
                variant="outline"
              >
                {isSaving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                ) : (
                  'Save'
                )}
              </Button>
            </div>
            {walletAddress && !isValidAddress && (
              <p className="text-sm text-red-500 mt-1 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                Please enter a valid Ethereum address
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Wallet Info */}
      {walletAddress && (
        <Card>
          <CardHeader>
            <CardTitle>Wallet Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-background-secondary rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">ETH Balance</span>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="text-2xl font-bold">
                  {(Math.random() * 5).toFixed(3)} ETH
                </div>
                <div className="text-sm text-muted-foreground">
                  ≈ ${(Math.random() * 15000).toLocaleString()}
                </div>
              </div>
              
              <div className="p-4 bg-background-secondary rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Network</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-2xl font-bold">Ethereum</div>
                <div className="text-sm text-muted-foreground">Mainnet</div>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">View on Etherscan</span>
              <Button variant="ghost" size="sm">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WalletManagement;