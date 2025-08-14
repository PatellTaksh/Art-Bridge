import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData: ContactFormData = await req.json();
    const { firstName, lastName, email, subject, message } = formData;

    // Validate required fields
    if (!firstName || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Send confirmation email to user
    const userEmailResponse = await resend.emails.send({
      from: "ArtBridge Support <onboarding@resend.dev>",
      to: [email],
      subject: "ArtBridge Query Received",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #ff6600; text-align: center;">ArtBridge</h1>
          <h2>Hi ${firstName},</h2>
          <p>Thank you for contacting ArtBridge! We have received your message and will respond within 24 hours.</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Your Message:</h3>
            <p><strong>Subject:</strong> ${subject || 'No subject specified'}</p>
            <p><strong>Message:</strong></p>
            <p style="font-style: italic;">"${message}"</p>
          </div>
          
          <p>If you have any urgent concerns, please don't hesitate to contact us directly at support@artbridge.com.</p>
          
          <p>Best regards,<br>
          The ArtBridge Team</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          <p style="text-align: center; color: #666; font-size: 12px;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      `,
    });

    // Send notification to support team
    const supportEmailResponse = await resend.emails.send({
      from: "ArtBridge Contact Form <onboarding@resend.dev>",
      to: ["support@artbridge.com"],
      subject: `New query from ${email}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #ff6600;">New Contact Form Submission</h1>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Contact Details:</h3>
            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject || 'No subject specified'}</p>
          </div>
          
          <div style="background-color: #fff; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
            <h3>Message:</h3>
            <p>${message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <p style="margin-top: 20px;">
            <strong>Response required within 24 hours.</strong>
          </p>
        </div>
      `,
    });

    console.log("User email sent:", userEmailResponse);
    console.log("Support email sent:", supportEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Emails sent successfully" 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});