import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Security Fix: Add authentication check

// HTML sanitization function to prevent XSS attacks
function sanitizeHtml(input: string): string {
  if (!input) return '';
  
  // Basic HTML entity encoding to prevent XSS
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    // Limit length to prevent abuse
    .slice(0, 10000);
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
  recaptchaToken: string;
}

// Verify reCAPTCHA token
async function verifyRecaptcha(token: string): Promise<boolean> {
  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${Deno.env.get("RECAPTCHA_SECRET_KEY")}&response=${token}`,
    });
    
    const result = await response.json();
    return result.success && result.score > 0.5; // Require score > 0.5 for v3
  } catch (error) {
    console.error('reCAPTCHA verification failed:', error);
    return false;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Security Fix: Require authentication for contact email
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Initialize Supabase client to verify auth
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    // Verify the user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    const formData: ContactFormData = await req.json();
    const { firstName, lastName, email, subject, message, recaptchaToken } = formData;

    console.log('Processing contact form submission for:', email);

    // Validate required fields
    if (!firstName?.trim() || !email?.trim() || !message?.trim()) {
      console.log('Validation failed: Missing required fields');
      return new Response(
        JSON.stringify({ 
          error: "Missing required fields",
          details: "First name, email, and message are required" 
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Validation failed: Invalid email format');
      return new Response(
        JSON.stringify({ 
          error: "Invalid email format",
          details: "Please enter a valid email address" 
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Verify reCAPTCHA
    if (!recaptchaToken || !(await verifyRecaptcha(recaptchaToken))) {
      console.log('reCAPTCHA verification failed');
      return new Response(
        JSON.stringify({ 
          error: "reCAPTCHA verification failed",
          details: "Please complete the security verification" 
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Sanitize all user inputs to prevent XSS attacks
    const sanitizedFirstName = sanitizeHtml(firstName.trim());
    const sanitizedLastName = sanitizeHtml(lastName?.trim() || '');
    const sanitizedEmail = sanitizeHtml(email.trim());
    const sanitizedSubject = sanitizeHtml(subject?.trim() || 'General Inquiry');
    const sanitizedMessage = sanitizeHtml(message.trim());

    console.log('All validations passed, sending emails...');
    // Initialize Resend safely after validations to avoid top-level crashes
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      console.error("Missing RESEND_API_KEY");
      return new Response(
        JSON.stringify({
          error: "Email service not configured",
          details: "Missing RESEND_API_KEY. Please configure the email provider.",
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const resend = new Resend(RESEND_API_KEY);

    // Send confirmation email to user
    const userEmailResponse = await resend.emails.send({
      from: "ArtBridge Support <onboarding@resend.dev>",
      to: [email],
      subject: "We've received your message!",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="color: #ff6600; font-size: 32px; margin: 0;">ArtBridge</h1>
            <p style="color: #666; font-size: 16px; margin: 10px 0 0 0;">Art Investment Platform</p>
          </div>
          
          <h2 style="color: #333; font-size: 24px; margin-bottom: 20px;">Hi ${sanitizedFirstName},</h2>
          
          <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
            Thank you for contacting ArtBridge! We have successfully received your message and our team will respond within 24 hours.
          </p>
          
          <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 25px; border-radius: 12px; margin: 30px 0; border-left: 4px solid #ff6600;">
            <h3 style="color: #333; font-size: 18px; margin: 0 0 15px 0;">Your Message Summary:</h3>
            <p style="margin: 10px 0; color: #555;"><strong>Name:</strong> ${sanitizedFirstName} ${sanitizedLastName}</p>
            <p style="margin: 10px 0; color: #555;"><strong>Email:</strong> ${sanitizedEmail}</p>
            <p style="margin: 10px 0; color: #555;"><strong>Subject:</strong> ${sanitizedSubject}</p>
            <div style="margin: 15px 0;">
              <strong style="color: #555;">Message:</strong>
              <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 8px; border: 1px solid #dee2e6;">
                <p style="margin: 0; color: #333; font-style: italic; line-height: 1.5;">"${sanitizedMessage}"</p>
              </div>
            </div>
          </div>
          
          <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <h4 style="color: #856404; margin: 0 0 10px 0; font-size: 16px;">What happens next?</h4>
            <ul style="color: #856404; margin: 0; padding-left: 20px;">
              <li>Our team will review your message</li>
              <li>You'll receive a response within 24 hours</li>
              <li>For urgent matters, call us at +1 (555) 123-4567</li>
            </ul>
          </div>
          
          <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 30px 0;">
            If you have any urgent concerns, please don't hesitate to contact us directly at 
            <a href="mailto:support@artbridge.com" style="color: #ff6600; text-decoration: none;">support@artbridge.com</a>
          </p>
          
          <div style="text-align: center; margin: 40px 0;">
            <p style="color: #333; font-size: 16px; margin-bottom: 10px;">Best regards,</p>
            <p style="color: #ff6600; font-weight: bold; font-size: 18px; margin: 0;">The ArtBridge Team</p>
          </div>
          
          <hr style="margin: 40px 0; border: none; border-top: 1px solid #ddd;">
          <div style="text-align: center;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              This is an automated confirmation message. Please do not reply to this email.
            </p>
            <p style="color: #999; font-size: 12px; margin: 5px 0 0 0;">
              © 2024 ArtBridge. All rights reserved.
            </p>
          </div>
        </div>
      `,
    });

    // Send notification to support team
    const supportEmailResponse = await resend.emails.send({
      from: "ArtBridge Contact Form <onboarding@resend.dev>",
      to: ["abcxyz46346@gmail.com"],
      subject: "New contact form submission",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #ff6600 0%, #ff8533 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; font-size: 28px; margin: 0;">🚨 New Contact Form Submission</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">ArtBridge Support Alert</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 0 0 12px 12px; border: 1px solid #dee2e6; border-top: none;">
            <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h3 style="color: #333; font-size: 20px; margin: 0 0 20px 0; padding-bottom: 10px; border-bottom: 2px solid #ff6600;">📋 Contact Details</h3>
              <div style="display: grid; gap: 12px;">
                <p style="margin: 0; padding: 8px 0; border-bottom: 1px solid #eee;"><strong style="color: #555; width: 100px; display: inline-block;">Name:</strong> <span style="color: #333;">${sanitizedFirstName} ${sanitizedLastName}</span></p>
                <p style="margin: 0; padding: 8px 0; border-bottom: 1px solid #eee;"><strong style="color: #555; width: 100px; display: inline-block;">Email:</strong> <a href="mailto:${sanitizedEmail}" style="color: #ff6600; text-decoration: none;">${sanitizedEmail}</a></p>
                <p style="margin: 0; padding: 8px 0;"><strong style="color: #555; width: 100px; display: inline-block;">Subject:</strong> <span style="color: #333;">${sanitizedSubject}</span></p>
              </div>
            </div>
            
            <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h3 style="color: #333; font-size: 20px; margin: 0 0 15px 0; padding-bottom: 10px; border-bottom: 2px solid #ff6600;">💬 Message Content</h3>
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #ff6600;">
                <p style="margin: 0; color: #333; line-height: 1.6; font-size: 15px; white-space: pre-wrap;">${sanitizedMessage}</p>
              </div>
            </div>
            
            <div style="background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%); padding: 20px; border-radius: 8px; border: 1px solid #c3e6cb; text-align: center;">
              <h4 style="color: #155724; margin: 0 0 10px 0; font-size: 18px;">⏰ Action Required</h4>
              <p style="color: #155724; margin: 0; font-size: 16px; font-weight: bold;">Response required within 24 hours</p>
              <p style="color: #6c757d; margin: 10px 0 0 0; font-size: 14px;">Submitted: ${new Date().toLocaleString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit', 
                timeZoneName: 'short' 
              })}</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="mailto:${sanitizedEmail}?subject=Re: ${sanitizedSubject}" 
                 style="background: #ff6600; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
                📧 Reply to Customer
              </a>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; padding: 20px;">
            <p style="color: #6c757d; font-size: 12px; margin: 0;">
              This is an automated notification from the ArtBridge contact form system.
            </p>
          </div>
        </div>
      `,
    });

    console.log("User email sent:", userEmailResponse);
    console.log("Support email sent:", supportEmailResponse);

    // Check if both emails were sent successfully
    if (userEmailResponse.error || supportEmailResponse.error) {
      console.error("Email sending errors:", {
        userError: userEmailResponse.error,
        supportError: supportEmailResponse.error
      });
      throw new Error("Failed to send one or more emails");
    }

    console.log("Both emails sent successfully");

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Message sent successfully! Check your email for confirmation.",
        userEmailId: userEmailResponse.data?.id,
        supportEmailId: supportEmailResponse.data?.id
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to send message",
        details: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});