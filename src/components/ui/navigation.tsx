import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X, Wallet } from "lucide-react";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Art Bridge
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a href="#" className="text-foreground hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium">
                Home
              </a>
              <a href="#marketplace" className="text-muted-foreground hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium">
                Marketplace
              </a>
              <a href="#auction" className="text-muted-foreground hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium">
                Auction
              </a>
              <a href="#about" className="text-muted-foreground hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium">
                About
              </a>
              <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium">
                Contact
              </a>
            </div>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" size="sm">
              Connect Wallet
            </Button>
            <Button size="sm" className="btn-hero">
              <Wallet className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background-secondary rounded-lg mt-2">
              <a href="#" className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium">
                Home
              </a>
              <a href="#marketplace" className="text-muted-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium">
                Marketplace
              </a>
              <a href="#auction" className="text-muted-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium">
                Auction
              </a>
              <a href="#about" className="text-muted-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium">
                About
              </a>
              <a href="#contact" className="text-muted-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium">
                Contact
              </a>
              <div className="pt-4 pb-3 border-t border-border">
                <div className="flex flex-col space-y-2">
                  <Button variant="outline" size="sm">
                    Connect Wallet
                  </Button>
                  <Button size="sm" className="btn-hero">
                    <Wallet className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;