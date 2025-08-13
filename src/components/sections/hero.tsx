import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Users, DollarSign, TrendingUp } from "lucide-react";
import heroArtwork from "@/assets/hero-artwork.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url(${heroArtwork})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Own a <span className="bg-gradient-primary bg-clip-text text-transparent text-glow">Piece</span> of{" "}
            <span className="text-foreground">History!</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Invest in fractions of iconic artworks. Democratizing art investment through blockchain technology.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button size="lg" className="btn-hero text-lg px-8 py-4">
              Start Investing
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center animate-slide-up">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-8 w-8 text-primary mr-3" />
                <div className="text-3xl font-bold text-foreground">15K+</div>
              </div>
              <div className="text-muted-foreground">Investors</div>
            </div>
            
            <div className="text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-center mb-2">
                <DollarSign className="h-8 w-8 text-primary mr-3" />
                <div className="text-3xl font-bold text-foreground">$2.4M</div>
              </div>
              <div className="text-muted-foreground">Artworks Traded</div>
            </div>

            <div className="text-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-8 w-8 text-primary mr-3" />
                <div className="text-3xl font-bold text-foreground">8.2%</div>
              </div>
              <div className="text-muted-foreground">Avg. Returns</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-glow-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: '1.5s' }} />
    </section>
  );
};

export default Hero;