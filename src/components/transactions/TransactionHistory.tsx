import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Download, Filter, ArrowUpDown, ExternalLink } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  transaction_type: string;
  status: string;
  created_at: string;
  artwork_id: string;
  buyer_user_id: string;
  seller_user_id: string;
  tx_hash?: string;
  metadata?: any;
  artwork?: {
    title: string;
    image_url?: string;
  };
}

const TransactionHistory = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  const fetchTransactions = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          artwork:artworks(title, image_url)
        `)
        .or(`buyer_user_id.eq.${user.id},seller_user_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading transactions",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions
    .filter(tx => {
      if (filter === 'all') return true;
      if (filter === 'buy') return tx.buyer_user_id === user?.id;
      if (filter === 'sell') return tx.seller_user_id === user?.id;
      if (filter === 'pending') return tx.status === 'pending';
      if (filter === 'completed') return tx.status === 'completed';
      return true;
    })
    .filter(tx => 
      searchTerm === '' || 
      tx.artwork?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.transaction_type.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = sortBy === 'created_at' ? new Date(a.created_at).getTime() : a.amount;
      const bValue = sortBy === 'created_at' ? new Date(b.created_at).getTime() : b.amount;
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'purchase': return '🎨';
      case 'fraction_purchase': return '🧩';
      case 'sale': return '💰';
      case 'bid': return '🔨';
      default: return '📄';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'pending': return 'secondary';
      case 'failed': return 'destructive';
      default: return 'outline';
    }
  };

  const exportTransactions = () => {
    const csvContent = [
      ['Date', 'Type', 'Artwork', 'Amount', 'Currency', 'Status', 'Hash'].join(','),
      ...filteredTransactions.map(tx => [
        new Date(tx.created_at).toLocaleDateString(),
        tx.transaction_type,
        tx.artwork?.title || 'Unknown',
        tx.amount.toString(),
        tx.currency,
        tx.status,
        tx.tx_hash || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-20 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Transaction History</h2>
          <p className="text-muted-foreground">
            {filteredTransactions.length} transactions found
          </p>
        </div>
        <Button onClick={exportTransactions} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="buy">Purchases</SelectItem>
                <SelectItem value="sell">Sales</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
              const [field, order] = value.split('-');
              setSortBy(field);
              setSortOrder(order as 'asc' | 'desc');
            }}>
              <SelectTrigger className="w-full sm:w-40">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at-desc">Newest First</SelectItem>
                <SelectItem value="created_at-asc">Oldest First</SelectItem>
                <SelectItem value="amount-desc">Highest Amount</SelectItem>
                <SelectItem value="amount-asc">Lowest Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Tabs */}
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-4">
          {filteredTransactions.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-8">
                <p className="text-muted-foreground">No transactions found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.map((transaction) => (
                <Card key={transaction.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">
                          {getTransactionIcon(transaction.transaction_type)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold">
                              {transaction.artwork?.title || 'Unknown Artwork'}
                            </h4>
                            <Badge variant={getStatusColor(transaction.status)}>
                              {transaction.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {transaction.transaction_type.replace('_', ' ')} • {new Date(transaction.created_at).toLocaleDateString()}
                          </p>
                          {transaction.metadata?.ownership_percentage && (
                            <p className="text-sm text-muted-foreground">
                              {transaction.metadata.ownership_percentage}% ownership
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-bold text-lg">
                          {transaction.buyer_user_id === user?.id ? '-' : '+'}
                          {transaction.amount.toLocaleString()} {transaction.currency}
                        </div>
                        {transaction.tx_hash && (
                          <Button variant="ghost" size="sm" className="mt-1">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View on Chain
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="summary">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Spent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${filteredTransactions
                    .filter(tx => tx.buyer_user_id === user?.id)
                    .reduce((sum, tx) => sum + tx.amount, 0)
                    .toLocaleString()}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Total Earned</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${filteredTransactions
                    .filter(tx => tx.seller_user_id === user?.id)
                    .reduce((sum, tx) => sum + tx.amount, 0)
                    .toLocaleString()}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Pending Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {filteredTransactions.filter(tx => tx.status === 'pending').length}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TransactionHistory;