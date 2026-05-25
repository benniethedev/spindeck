import { sendEmail } from "@/libs/resend";
import config from "@/config";

/**
 * Get the base URL for the app
 */
const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_APP_URL || `https://${config.domainName}`;
};

/**
 * Send a welcome email when a user first subscribes
 * 
 * @param {Object} params
 * @param {string} params.email - Recipient email
 * @param {string} params.name - User's name (optional)
 * @param {string} params.planName - Name of the subscribed plan
 * @param {Object[]} params.features - Array of plan features
 */
export const sendWelcomeEmail = async ({ email, name, planName, features = [] }) => {
  const baseUrl = getBaseUrl();
  const displayName = name || "there";
  
  const featuresHtml = features.length > 0 
    ? `
      <div style="background: #1a1a1a; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #333;">
        <h3 style="margin: 0 0 16px; color: #ffffff; font-size: 16px;">Your ${planName} plan includes:</h3>
        <ul style="margin: 0; padding-left: 20px; color: #cccccc;">
          ${features.map(f => `<li style="margin-bottom: 8px;">${f.name}</li>`).join('')}
        </ul>
      </div>
    `
    : '';

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to SpinRec!</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #000000; color: #ffffff;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    
    <!-- Header -->
    <div style="text-align: center; padding: 30px 0; border-bottom: 1px solid #333;">
      <a href="${baseUrl}" style="font-size: 32px; font-weight: bold; color: #FF3C3C; text-decoration: none;">SpinRec</a>
    </div>
    
    <!-- Main Content -->
    <div style="padding: 40px 0;">
      
      <!-- Welcome Badge -->
      <div style="text-align: center; margin-bottom: 30px;">
        <span style="display: inline-block; background: linear-gradient(135deg, #FF3C3C 0%, #cc3030 100%); color: white; padding: 8px 24px; border-radius: 20px; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
          🎉 Welcome Aboard!
        </span>
      </div>
      
      <h1 style="margin: 0 0 20px; font-size: 28px; text-align: center; color: #ffffff;">
        Hey ${displayName}!
      </h1>
      
      <p style="font-size: 18px; line-height: 1.6; color: #cccccc; text-align: center; margin: 0 0 30px;">
        Your <strong style="color: #FF3C3C;">${planName}</strong> subscription is now active!
      </p>
      
      <p style="font-size: 16px; line-height: 1.6; color: #888888; text-align: center; margin: 0 0 30px;">
        Welcome to the SpinRec family. You're now part of a growing community of artists, DJs, and labels pushing music forward.
      </p>
      
      ${featuresHtml}
      
      <!-- Getting Started -->
      <div style="background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%); border-radius: 12px; padding: 24px; margin: 30px 0; border: 1px solid #333;">
        <h3 style="margin: 0 0 16px; color: #ffffff; font-size: 18px;">🚀 Get Started</h3>
        <ol style="margin: 0; padding-left: 20px; color: #cccccc; line-height: 1.8;">
          <li><strong>Upload your first track</strong> – Head to your dashboard and share your music</li>
          <li><strong>Explore the DJ Pool</strong> – Connect with DJs and get your music spinning</li>
          <li><strong>Send email blasts</strong> – Promote directly to your target audience</li>
          <li><strong>Track your analytics</strong> – See who's downloading and playing your tracks</li>
        </ol>
      </div>
      
      <!-- CTA Button -->
      <div style="text-align: center; padding: 20px 0;">
        <a href="${baseUrl}/dashboard" style="display: inline-block; background: linear-gradient(135deg, #FF3C3C 0%, #cc3030 100%); color: #ffffff; padding: 16px 40px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
          Go to Dashboard →
        </a>
      </div>
      
      <p style="font-size: 14px; line-height: 1.6; color: #666666; text-align: center; margin: 30px 0 0;">
        Questions? Reply to this email or reach out at <a href="mailto:${config.resend.supportEmail}" style="color: #FF3C3C;">${config.resend.supportEmail}</a>
      </p>
      
    </div>
    
    <!-- Footer -->
    <div style="text-align: center; padding: 30px 0; border-top: 1px solid #333; font-size: 12px; color: #666;">
      <p style="margin: 0 0 10px;">© ${new Date().getFullYear()} SpinRec. All rights reserved.</p>
      <p style="margin: 0;">
        <a href="${baseUrl}/privacy-policy" style="color: #888; text-decoration: none;">Privacy Policy</a>
        &nbsp;|&nbsp;
        <a href="${baseUrl}/tos" style="color: #888; text-decoration: none;">Terms of Service</a>
      </p>
    </div>
    
  </div>
</body>
</html>
  `;

  const text = `
Welcome to SpinRec, ${displayName}!

Your ${planName} subscription is now active!

Welcome to the SpinRec family. You're now part of a growing community of artists, DJs, and labels pushing music forward.

GET STARTED:
1. Upload your first track – Head to your dashboard and share your music
2. Explore the DJ Pool – Connect with DJs and get your music spinning
3. Send email blasts – Promote directly to your target audience
4. Track your analytics – See who's downloading and playing your tracks

Go to your dashboard: ${baseUrl}/dashboard

Questions? Reply to this email or reach out at ${config.resend.supportEmail}

© ${new Date().getFullYear()} SpinRec. All rights reserved.
  `.trim();

  return sendEmail({
    to: email,
    subject: `🎉 Welcome to SpinRec – Your ${planName} subscription is active!`,
    html,
    text,
    replyTo: config.resend.supportEmail,
  });
};

/**
 * Send a subscription confirmation/receipt email
 * 
 * @param {Object} params
 * @param {string} params.email - Recipient email
 * @param {string} params.name - User's name (optional)
 * @param {string} params.planName - Name of the subscribed plan
 * @param {number} params.amount - Amount charged
 * @param {string} params.interval - Billing interval (month/year)
 */
export const sendSubscriptionConfirmation = async ({ email, name, planName, amount, interval }) => {
  const baseUrl = getBaseUrl();
  const displayName = name || "there";
  const formattedAmount = new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD' 
  }).format(amount / 100);
  const billingPeriod = interval === 'year' ? 'yearly' : 'monthly';

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Subscription Confirmed</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #000000; color: #ffffff;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    
    <!-- Header -->
    <div style="text-align: center; padding: 30px 0; border-bottom: 1px solid #333;">
      <a href="${baseUrl}" style="font-size: 32px; font-weight: bold; color: #FF3C3C; text-decoration: none;">SpinRec</a>
    </div>
    
    <!-- Main Content -->
    <div style="padding: 40px 0;">
      
      <div style="text-align: center; margin-bottom: 30px;">
        <span style="display: inline-block; font-size: 48px;">✅</span>
      </div>
      
      <h1 style="margin: 0 0 20px; font-size: 24px; text-align: center; color: #ffffff;">
        Subscription Confirmed
      </h1>
      
      <p style="font-size: 16px; line-height: 1.6; color: #cccccc; text-align: center; margin: 0 0 30px;">
        Hey ${displayName}, your payment was successful!
      </p>
      
      <!-- Receipt Box -->
      <div style="background: #1a1a1a; border-radius: 12px; padding: 24px; margin: 20px 0; border: 1px solid #333;">
        <h3 style="margin: 0 0 20px; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Payment Details</h3>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
          <span style="color: #888;">Plan</span>
          <span style="color: #ffffff; font-weight: bold;">${planName}</span>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
          <span style="color: #888;">Billing</span>
          <span style="color: #ffffff;">${billingPeriod.charAt(0).toUpperCase() + billingPeriod.slice(1)}</span>
        </div>
        
        <div style="border-top: 1px solid #333; margin: 16px 0; padding-top: 16px; display: flex; justify-content: space-between;">
          <span style="color: #888; font-weight: bold;">Amount Paid</span>
          <span style="color: #FF3C3C; font-weight: bold; font-size: 18px;">${formattedAmount}</span>
        </div>
      </div>
      
      <p style="font-size: 14px; line-height: 1.6; color: #666666; text-align: center; margin: 30px 0;">
        Manage your subscription anytime from your <a href="${baseUrl}/dashboard" style="color: #FF3C3C;">dashboard</a>.
      </p>
      
    </div>
    
    <!-- Footer -->
    <div style="text-align: center; padding: 30px 0; border-top: 1px solid #333; font-size: 12px; color: #666;">
      <p style="margin: 0 0 10px;">© ${new Date().getFullYear()} SpinRec. All rights reserved.</p>
      <p style="margin: 0;">
        <a href="${baseUrl}/privacy-policy" style="color: #888; text-decoration: none;">Privacy Policy</a>
        &nbsp;|&nbsp;
        <a href="${baseUrl}/tos" style="color: #888; text-decoration: none;">Terms of Service</a>
      </p>
    </div>
    
  </div>
</body>
</html>
  `;

  const text = `
Subscription Confirmed

Hey ${displayName}, your payment was successful!

PAYMENT DETAILS
Plan: ${planName}
Billing: ${billingPeriod.charAt(0).toUpperCase() + billingPeriod.slice(1)}
Amount Paid: ${formattedAmount}

Manage your subscription anytime from your dashboard: ${baseUrl}/dashboard

© ${new Date().getFullYear()} SpinRec. All rights reserved.
  `.trim();

  return sendEmail({
    to: email,
    subject: `Receipt: SpinRec ${planName} Subscription`,
    html,
    text,
    replyTo: config.resend.supportEmail,
  });
};
