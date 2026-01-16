import { Resend } from 'resend';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Default sender email - you can customize this after verifying your domain
const FROM_EMAIL = process.env.FROM_EMAIL || 'Shamba Smart <onboarding@resend.dev>';

interface EmailOptions {
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
}

interface EmailResponse {
    success: boolean;
    messageId?: string;
    error?: string;
}

/**
 * Send an email using Resend
 */
export async function sendEmail({ to, subject, html, text }: EmailOptions): Promise<EmailResponse> {
    try {
        if (!process.env.RESEND_API_KEY) {
            console.warn('RESEND_API_KEY not configured, skipping email');
            return { success: false, error: 'Email service not configured' };
        }

        const recipients = Array.isArray(to) ? to : [to];

        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: recipients,
            subject,
            html,
            text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
        });

        if (error) {
            console.error('Resend error:', error);
            return { success: false, error: error.message };
        }

        console.log('Email sent:', data?.id);
        return { success: true, messageId: data?.id };
    } catch (error: any) {
        console.error('Email error:', error);
        return { success: false, error: error.message || 'Failed to send email' };
    }
}

/**
 * Send welcome email to new subscribers
 */
export async function sendWelcomeEmail(email: string, plan?: string): Promise<EmailResponse> {
    const planName = plan || 'newsletter';

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; margin-top: 20px; margin-bottom: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1B5E20, #2E7D32); padding: 40px 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">
                🌾 Welcome to Shamba Smart!
            </h1>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
            <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                Thank you for joining <strong>Shamba Smart</strong>! You're now part of a community of <strong>12,000+ farmers</strong> using data-driven insights to grow better crops.
            </p>
            
            ${plan && plan !== 'newsletter' ? `
            <div style="background: #E8F5E9; border-radius: 12px; padding: 20px; margin-bottom: 25px;">
                <p style="margin: 0; color: #1B5E20; font-weight: 600;">
                    📋 Your Plan: <span style="color: #2E7D32;">${planName}</span>
                </p>
            </div>
            ` : ''}
            
            <h3 style="color: #1B5E20; margin-bottom: 15px;">What you can do now:</h3>
            
            <ul style="color: #555; line-height: 2; padding-left: 20px;">
                <li>🌱 Get AI-powered planting recommendations</li>
                <li>📊 Access real-time market prices</li>
                <li>🌤️ Receive weather forecasts and alerts</li>
                <li>📱 Dial <strong>*384*1300#</strong> for USSD access</li>
            </ul>
            
            <div style="text-align: center; margin: 35px 0;">
                <a href="https://shambasmart.co.ke" style="display: inline-block; background: linear-gradient(135deg, #2E7D32, #388E3C); color: white; padding: 15px 35px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 16px;">
                    Start Using Shamba Smart →
                </a>
            </div>
            
            <p style="color: #888; font-size: 14px; margin-top: 30px;">
                Questions? Reply to this email or call us at <strong>+254 700 123 456</strong>
            </p>
        </div>
        
        <!-- Footer -->
        <div style="background: #0D3A0D; padding: 25px 30px; text-align: center;">
            <p style="color: rgba(255,255,255,0.7); margin: 0; font-size: 12px;">
                © ${new Date().getFullYear()} Shamba Smart. Empowering African Farmers.
            </p>
            <p style="color: rgba(255,255,255,0.5); margin: 10px 0 0; font-size: 11px;">
                Westlands, Nairobi, Kenya
            </p>
        </div>
    </div>
</body>
</html>
`;

    return sendEmail({
        to: email,
        subject: `🌾 Welcome to Shamba Smart${plan && plan !== 'newsletter' ? ` - ${planName} Plan` : ''}!`,
        html
    });
}

/**
 * Send market price alert via email
 */
export async function sendPriceAlertEmail(
    email: string,
    market: string,
    prices: { crop: string; price: number; change: number }[]
): Promise<EmailResponse> {
    const priceRows = prices.map(p => `
        <tr>
            <td style="padding: 12px; border-bottom: 1px solid #eee;">${p.crop}</td>
            <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: 600;">KES ${p.price.toLocaleString()}</td>
            <td style="padding: 12px; border-bottom: 1px solid #eee; color: ${p.change > 0 ? '#2E7D32' : p.change < 0 ? '#C62828' : '#666'};">
                ${p.change > 0 ? '↑' : p.change < 0 ? '↓' : '−'} ${Math.abs(p.change)}%
            </td>
        </tr>
    `).join('');

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; margin-top: 20px; margin-bottom: 20px;">
        <div style="background: linear-gradient(135deg, #1B5E20, #2E7D32); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">📊 Market Price Alert</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 10px 0 0;">📍 ${market} Market</p>
        </div>
        
        <div style="padding: 30px;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #f5f5f5;">
                        <th style="padding: 12px; text-align: left; color: #666;">Crop</th>
                        <th style="padding: 12px; text-align: left; color: #666;">Price/Bag</th>
                        <th style="padding: 12px; text-align: left; color: #666;">Change</th>
                    </tr>
                </thead>
                <tbody>
                    ${priceRows}
                </tbody>
            </table>
            
            <p style="color: #888; font-size: 13px; margin-top: 25px; text-align: center;">
                Updated: ${new Date().toLocaleString('en-KE', { dateStyle: 'medium', timeStyle: 'short' })}
            </p>
        </div>
    </div>
</body>
</html>
`;

    return sendEmail({
        to: email,
        subject: `📊 ${market} Market Prices - Shamba Smart`,
        html
    });
}

/**
 * Check if email service is configured
 */
export function isEmailConfigured(): boolean {
    return !!process.env.RESEND_API_KEY;
}
