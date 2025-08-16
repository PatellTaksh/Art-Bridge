import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, MapPin, MessageSquare, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

const RECAPTCHA_SITE_KEY = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"; // Test key for development

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isRecaptchaLoaded, setIsRecaptchaLoaded] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Load reCAPTCHA script
  useEffect(() => {
    const loadRecaptcha = () => {
      if (window.grecaptcha) {
        setIsRecaptchaLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        window.grecaptcha.ready(() => {
          setIsRecaptchaLoaded(true);
        });
      };
      document.head.appendChild(script);
    };

    loadRecaptcha();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
    // Reset submit status when user modifies form
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle');
    }
  };

  const getRecaptchaToken = async (): Promise<string> => {
    if (!window.grecaptcha || !isRecaptchaLoaded) {
      throw new Error("reCAPTCHA not loaded");
    }

    return new Promise((resolve, reject) => {
      window.grecaptcha.ready(async () => {
        try {
          const token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, {
            action: 'contact_form'
          });
          resolve(token);
        } catch (error) {
          reject(error);
        }
      });
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Please fix the errors",
        description: "All required fields must be filled correctly",
        variant: "destructive",
      });
      return;
    }

    if (!isRecaptchaLoaded) {
      toast({
        title: "Security check unavailable",
        description: "Please wait for the page to fully load and try again",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Get reCAPTCHA token
      const recaptchaToken = await getRecaptchaToken();

      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          ...formData,
          recaptchaToken
        }
      });

      if (error) {
        console.error("Supabase function error:", error);
        throw new Error(error.message || "Failed to send message");
      }

      if (data?.error) {
        console.error("Function returned error:", data.error);
        throw new Error(data.details || data.error);
      }

      console.log("Email sent successfully:", data);
      
      setSubmitStatus('success');
      toast({
        title: "Message sent successfully!",
        description: "Check your email for confirmation. We'll respond within 24 hours.",
      });

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: ""
      });

    } catch (error: any) {
      console.error("Error sending email:", error);
      setSubmitStatus('error');
      
      let errorMessage = "Please try again or contact us directly.";
      
      if (error.message?.includes("reCAPTCHA")) {
        errorMessage = "Security verification failed. Please refresh and try again.";
      } else if (error.message?.includes("validation")) {
        errorMessage = error.message;
      } else if (error.message?.includes("API key")) {
        errorMessage = "Email service temporarily unavailable. Please try again later.";
      }
      
      toast({
        title: "Error sending message",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-background-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-foreground">Need Support?</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get in touch with our team for any questions about art investment or platform support
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-6">Send us a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {submitStatus === 'success' && (
                  <div className="flex items-center space-x-2 p-4 bg-success/10 border border-success/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <p className="text-success font-medium">Message sent successfully! Check your email for confirmation.</p>
                  </div>
                )}
                
                {submitStatus === 'error' && (
                  <div className="flex items-center space-x-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-destructive" />
                    <p className="text-destructive font-medium">Failed to send message. Please check the form and try again.</p>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input 
                      id="firstName" 
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      placeholder="Enter your first name"
                      disabled={isSubmitting}
                      className={`bg-background border-border focus:border-primary ${
                        errors.firstName ? "border-destructive focus:border-destructive" : ""
                      }`}
                    />
                    {errors.firstName && (
                      <p className="text-sm text-destructive flex items-center space-x-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.firstName}</span>
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      placeholder="Enter your last name"
                      disabled={isSubmitting}
                      className="bg-background border-border focus:border-primary"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter your email address"
                    disabled={isSubmitting}
                    className={`bg-background border-border focus:border-primary ${
                      errors.email ? "border-destructive focus:border-destructive" : ""
                    }`}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select 
                    value={formData.subject} 
                    onValueChange={(value) => handleInputChange("subject", value)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="bg-background border-border focus:border-primary">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="investment">Investment Inquiry</SelectItem>
                      <SelectItem value="artist">Artist Application</SelectItem>
                      <SelectItem value="technical">Technical Support</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea 
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    placeholder="Tell us how we can help you..."
                    rows={6}
                    disabled={isSubmitting}
                    className={`bg-background border-border focus:border-primary resize-none ${
                      errors.message ? "border-destructive focus:border-destructive" : ""
                    }`}
                  />
                  {errors.message && (
                    <p className="text-sm text-destructive flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.message}</span>
                    </p>
                  )}
                </div>

                {!isRecaptchaLoaded && (
                  <div className="flex items-center space-x-2 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                    <Loader2 className="w-4 h-4 text-warning animate-spin" />
                    <p className="text-warning text-sm">Loading security verification...</p>
                  </div>
                )}

                <Button 
                  type="submit" 
                  disabled={isSubmitting || !isRecaptchaLoaded}
                  className="btn-hero w-full text-lg py-3"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Sending Message...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  This site is protected by reCAPTCHA and the Google{' '}
                  <a href="https://policies.google.com/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </a>{' '}
                  and{' '}
                  <a href="https://policies.google.com/terms" className="text-primary hover:underline">
                    Terms of Service
                  </a>{' '}
                  apply.
                </p>
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-6">Get in Touch</h3>
              <p className="text-muted-foreground mb-8">
                Our team is here to help you navigate the world of art investment. 
                Reach out through any of these channels.
              </p>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Email Support</div>
                    <div className="text-muted-foreground">support@artbridge.com</div>
                    <div className="text-sm text-muted-foreground">We'll respond within 24 hours</div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Phone Support</div>
                    <div className="text-muted-foreground">+1 (555) 123-4567</div>
                    <div className="text-sm text-muted-foreground">Mon-Fri, 9AM-6PM EST</div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Live Chat</div>
                    <div className="text-muted-foreground">Available on our platform</div>
                    <div className="text-sm text-muted-foreground">Instant support during business hours</div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Office Location</div>
                    <div className="text-muted-foreground">
                      123 Art District Ave<br />
                      New York, NY 10001<br />
                      United States
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-background rounded-2xl p-8 border border-border">
              <h4 className="text-xl font-semibold text-foreground mb-4">Quick Questions?</h4>
              <p className="text-muted-foreground mb-4">
                Check out our comprehensive FAQ section for instant answers to common questions about art investment, platform usage, and more.
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Browse FAQ
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;