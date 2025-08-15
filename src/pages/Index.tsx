import Navigation from "@/components/ui/navigation";
import Hero from "@/components/sections/hero";
import Marketplace from "@/components/sections/marketplace";
import Auction from "@/components/sections/auction";
import HowItWorks from "@/components/sections/how-it-works";
import FAQ from "@/components/sections/faq";
import Contact from "@/components/sections/contact";
import Footer from "@/components/sections/footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <Marketplace />
      <Auction />
      <HowItWorks />
      <FAQ />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
