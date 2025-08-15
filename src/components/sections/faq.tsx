import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<number[]>([]);

  const faqData = [
    {
      question: "How does fractional art ownership work?",
      answer: "Fractional art ownership allows multiple investors to own shares of a single piece of artwork. Through blockchain technology, we tokenize artworks and divide them into affordable fractions. You can purchase these fractions and benefit from the artwork's appreciation while having the flexibility to trade your shares on our marketplace."
    },
    {
      question: "What are the minimum investment amounts?",
      answer: "Our platform makes art investment accessible to everyone. The minimum investment starts at just $50 for most artworks. Some premium pieces may have higher minimums, but we strive to keep barriers low so that anyone can start building their art portfolio."
    },
    {
      question: "How are artworks authenticated and valued?",
      answer: "All artworks on our platform undergo rigorous authentication by certified art experts and appraisers. We work with leading auction houses and galleries to ensure authenticity. Valuations are conducted by independent, accredited appraisers and updated regularly based on market conditions and comparable sales."
    },
    {
      question: "Can I sell my art fractions anytime?",
      answer: "Yes, our secondary marketplace allows you to trade your art fractions with other investors 24/7. However, liquidity may vary depending on the artwork's popularity and market demand. Some pieces may have holding periods specified in their offering documents."
    },
    {
      question: "What fees are involved in art investing?",
      answer: "We charge a transparent fee structure: 2.5% transaction fee on purchases, 2.5% on sales, and a 1% annual management fee. There are no hidden costs, and all fees are clearly disclosed before you make any investment decisions."
    },
    {
      question: "How do I track my investment performance?",
      answer: "Your personalized dashboard provides real-time updates on your portfolio performance, including current valuations, historical returns, and market trends. You'll receive regular reports and can access detailed analytics for each artwork in your portfolio."
    },
    {
      question: "Are there any tax implications?",
      answer: "Art investments may have tax implications including capital gains when you sell. We provide tax reporting documents, but we recommend consulting with a tax professional for advice specific to your situation. Tax treatment may vary based on your location and investment strategy."
    }
  ];

  const filteredFAQs = faqData.filter(
    item =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <section id="faq" className="py-24 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-foreground">Frequently Asked</span>{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">Questions</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about art investment, our platform, and how to get started.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-12">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 py-3 text-lg bg-background-secondary border-border focus:border-primary"
          />
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((item, index) => (
              <Collapsible
                key={index}
                open={openItems.includes(index)}
                onOpenChange={() => toggleItem(index)}
              >
                <div className="bg-background-secondary border border-border rounded-lg overflow-hidden">
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between p-6 text-left hover:bg-background/50 focus:bg-background/50"
                    >
                      <span className="text-lg font-semibold text-foreground pr-4">
                        {item.question}
                      </span>
                      {openItems.includes(index) ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="px-6 pb-6">
                      <p className="text-muted-foreground leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No questions found matching your search.
              </p>
            </div>
          )}
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-6">
            Still have questions? Our team is here to help.
          </p>
          <Button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-hero"
          >
            Contact Support
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FAQ;