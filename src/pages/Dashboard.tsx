import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { usePortfolio } from '@/hooks/usePortfolio';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, DollarSign, Palette, Activity, Plus } from 'lucide-react';

interface Profile {
  id: string;
  display_name: string;
  role: string;
  bio?: string;
  wallet_address?: string;
}

interface Artwork {
  id: string;
  title: string;
  description?: string;
  price_amount?: number;
  status: string;
  created_at: string;
}

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  transaction_type: string;
  status: string;
  created_at: string;
  artwork_id: string;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { stats, holdings, loading: portfolioLoading, refetch } = usePortfolio();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchUserData();
  }, [user, navigate]);

  const fetchUserData = async () => {
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();
      
      setProfile(profileData);

      // Fetch user's artworks
      const { data: artworksData } = await supabase
        .from('artworks')
        .select('*')
        .eq('owner_user_id', user?.id)
        .order('created_at', { ascending: false });
      
      setArtworks(artworksData || []);

      // Fetch user's transactions
      const { data: transactionsData } = await supabase
        .from('transactions')
        .select('*')
        .or(`buyer_user_id.eq.${user?.id},seller_user_id.eq.${user?.id}`)
        .order('created_at', { ascending: false });
      
      setTransactions(transactionsData || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: "Error",
        description: "Failed to load user data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {profile?.display_name}</h1>
            <p className="text-muted-foreground">Role: {profile?.role}</p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="artworks">My Artworks</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Artworks</CardTitle>
                  <CardDescription>Artworks you own</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{artworks.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Total Transactions</CardTitle>
                  <CardDescription>Your trading activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{transactions.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Value</CardTitle>
                  <CardDescription>Estimated value</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {artworks.reduce((sum, artwork) => sum + (artwork.price_amount || 0), 0).toFixed(2)} ETH
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="artworks" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Artworks</h2>
              <Button onClick={() => navigate('/create-artwork')}>
                Create New Artwork
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {artworks.map((artwork) => (
                <Card key={artwork.id}>
                  <CardHeader>
                    <CardTitle>{artwork.title}</CardTitle>
                    <CardDescription>{artwork.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p><strong>Price:</strong> {artwork.price_amount || 'N/A'} ETH</p>
                      <p><strong>Status:</strong> {artwork.status}</p>
                      <p><strong>Created:</strong> {new Date(artwork.created_at).toLocaleDateString()}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {artworks.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No artworks yet. Create your first artwork!</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <h2 className="text-2xl font-bold">Transaction History</h2>
            
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <Card key={transaction.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold capitalize">{transaction.transaction_type}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{transaction.amount} {transaction.currency}</p>
                        <p className="text-sm text-muted-foreground capitalize">{transaction.status}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {transactions.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No transactions yet.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Display Name</label>
                  <p className="text-lg">{profile?.display_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p className="text-lg">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Role</label>
                  <p className="text-lg capitalize">{profile?.role}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Wallet Address</label>
                  <p className="text-lg">{profile?.wallet_address || 'Not connected'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Bio</label>
                  <p className="text-lg">{profile?.bio || 'No bio provided'}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;