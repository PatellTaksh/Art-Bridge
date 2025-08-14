import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { 
  Wallet, 
  Plus, 
  Minus, 
  History, 
  ChevronDown,
  ArrowUpRight,
  ArrowDownLeft
} from "lucide-react";

const WalletDropdown = () => {
  const [balance] = useState(250);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2">
          <Wallet className="w-4 h-4" />
          <span className="font-medium">{balance} $ART</span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="text-center">
          <div className="space-y-1">
            <div className="text-lg font-bold text-primary">{balance} $ART</div>
            <div className="text-sm text-muted-foreground">
              ≈ ${(balance * 3.75).toLocaleString()} USD
            </div>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="flex items-center space-x-3 p-3 cursor-pointer">
          <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
            <Plus className="w-4 h-4 text-green-500" />
          </div>
          <div className="flex-1">
            <div className="font-medium">Deposit Funds</div>
            <div className="text-xs text-muted-foreground">Add $ART to your wallet</div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
        </DropdownMenuItem>
        
        <DropdownMenuItem className="flex items-center space-x-3 p-3 cursor-pointer">
          <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
            <Minus className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex-1">
            <div className="font-medium">Withdraw Earnings</div>
            <div className="text-xs text-muted-foreground">Cash out your profits</div>
          </div>
          <ArrowDownLeft className="w-4 h-4 text-muted-foreground" />
        </DropdownMenuItem>
        
        <DropdownMenuItem className="flex items-center space-x-3 p-3 cursor-pointer">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <History className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1">
            <div className="font-medium">Transaction History</div>
            <div className="text-xs text-muted-foreground">View all transactions</div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <div className="p-3">
          <div className="text-xs text-center text-muted-foreground">
            Recent Activity
          </div>
          <div className="mt-2 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span>Bought 2% of "Ancient Wisdom"</span>
              <Badge variant="outline" className="text-xs">-45 $ART</Badge>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span>Sold 1% of "Cosmic Journey"</span>
              <Badge variant="outline" className="text-xs text-green-500">+22 $ART</Badge>
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WalletDropdown;