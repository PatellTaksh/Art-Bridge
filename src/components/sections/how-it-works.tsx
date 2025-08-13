import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet, Search, Gavel, TrendingUp, Palette, Users, DollarSign, Shield } from "lucide-react";

const HowItWorks = () => {
  const investorSteps = [
    {
      icon: Wallet,
      title: "Connect Wallet",
      description: "Connect your crypto wallet to start investing in fractional art ownership"
    },
    {
      icon: Search,
      title: "Browse Art",
      description: "Explore our curated collection of premium artworks from verified artists"
    },
    {
      icon: Gavel,
      title: "Place Bids",
      description: "Participate in auctions or buy fractions directly from the marketplace"
    },
    {
      icon: TrendingUp,
      title: "Track Growth",
      description: "Monitor your portfolio and watch your art investments appreciate over time"
    }
  ];

  const artistSteps = [
    {
      icon: Palette,
      title: "Submit Artwork",
      description: "Upload high-quality images and details of your original artwork"
    },
    {
      icon: Shield,
      title: "Verification",
      description: "Our experts authenticate and verify the artwork's provenance"
    },
    {
      icon: Users,
      title: "Tokenization",
      description: "Your artwork gets fractionally tokenized for investment opportunities"
    },
    {
      icon: DollarSign,
      title: "Earn Revenue",
      description: "Receive royalties from sales and trading of your tokenized artwork"
    }
  ];

  return (
    <section id="about" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-foreground">How it works</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join the revolution of democratized art investment
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="investors" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-16">
            <TabsTrigger value="investors" className="text-lg">For Investors</TabsTrigger>
            <TabsTrigger value="artists" className="text-lg">For Artists</TabsTrigger>
          </TabsList>

          {/* Investors Flow */}
          <TabsContent value="investors" className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {investorSteps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div 
                    key={index}
                    className="text-center group animate-fade-in hover-lift"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    {/* Step Number */}
                    <div className="relative mb-6">
                      <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                        <IconComponent className="w-10 h-10 text-primary" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {/* Artists Flow */}
          <TabsContent value="artists" className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {artistSteps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div 
                    key={index}
                    className="text-center group animate-fade-in hover-lift"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    {/* Step Number */}
                    <div className="relative mb-6">
                      <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                        <IconComponent className="w-10 h-10 text-primary" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA */}
        <div className="text-center mt-16">
          <Button size="lg" className="btn-hero text-lg px-8 py-4">
            Get Started Today
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;