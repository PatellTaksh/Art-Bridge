import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign, Palette, Activity, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface PortfolioStatsProps {
  stats: {
    totalValue: number;
    totalInvested: number;
    totalGains: number;
    gainsPercentage: number;
    artworksOwned: number;
    activeTransactions: number;
  };
  holdings: Array<{
    artwork_id: string;
    artwork_title: string;
    artist_name: string;
    ownership_percentage: number;
    current_value: number;
    purchase_price: number;
    gains: number;
    gains_percentage: number;
  }>;
}

const PortfolioAnalytics = ({ stats, holdings }: PortfolioStatsProps) => {
  // Mock performance data for chart
  const performanceData = [
    { month: 'Jan', value: stats.totalInvested * 0.95 },
    { month: 'Feb', value: stats.totalInvested * 0.98 },
    { month: 'Mar', value: stats.totalInvested * 1.02 },
    { month: 'Apr', value: stats.totalInvested * 1.05 },
    { month: 'May', value: stats.totalInvested * 1.08 },
    { month: 'Jun', value: stats.totalValue },
  ];

  // Prepare pie chart data
  const pieData = holdings.slice(0, 5).map((holding, index) => ({
    name: holding.artwork_title,
    value: holding.current_value,
    color: `hsl(${index * 72}, 70%, 60%)`,
  }));

  const StatCard = ({ title, value, change, icon: Icon, trend }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">${value.toLocaleString()}</div>
        {change !== undefined && (
          <div className={`flex items-center text-xs ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
            {Math.abs(change).toFixed(1)}%
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Portfolio Value"
          value={stats.totalValue}
          change={stats.gainsPercentage}
          icon={DollarSign}
          trend={stats.gainsPercentage >= 0 ? 'up' : 'down'}
        />
        <StatCard
          title="Total Invested"
          value={stats.totalInvested}
          icon={Activity}
        />
        <StatCard
          title="Total Gains/Losses"
          value={stats.totalGains}
          change={stats.gainsPercentage}
          icon={stats.totalGains >= 0 ? TrendingUp : TrendingDown}
          trend={stats.totalGains >= 0 ? 'up' : 'down'}
        />
        <StatCard
          title="Artworks Owned"
          value={stats.artworksOwned}
          icon={Palette}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Portfolio Performance
            </CardTitle>
            <CardDescription>Portfolio value over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-muted-foreground" />
                  <YAxis className="text-muted-foreground" />
                  <Tooltip 
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Portfolio Value']}
                    labelClassName="text-foreground"
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Allocation */}
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Allocation</CardTitle>
            <CardDescription>Distribution by artwork value</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Holdings */}
      <Card>
        <CardHeader>
          <CardTitle>Top Holdings</CardTitle>
          <CardDescription>Your best performing investments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {holdings.slice(0, 5).map((holding) => (
              <div key={holding.artwork_id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-semibold">{holding.artwork_title}</h4>
                  <p className="text-sm text-muted-foreground">by {holding.artist_name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary">{holding.ownership_percentage.toFixed(1)}% owned</Badge>
                    <Badge variant={holding.gains >= 0 ? 'default' : 'destructive'}>
                      {holding.gains >= 0 ? '+' : ''}{holding.gains_percentage.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">${holding.current_value.toLocaleString()}</div>
                  <div className={`text-sm ${holding.gains >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {holding.gains >= 0 ? '+' : ''}${holding.gains.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Return on Investment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.gainsPercentage >= 0 ? '+' : ''}{stats.gainsPercentage.toFixed(1)}%
            </div>
            <Progress 
              value={Math.min(Math.abs(stats.gainsPercentage), 100)} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Diversification Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.min(stats.artworksOwned * 10, 100)}%
            </div>
            <Progress 
              value={Math.min(stats.artworksOwned * 10, 100)} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Active Investments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeTransactions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Recent transactions
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PortfolioAnalytics;