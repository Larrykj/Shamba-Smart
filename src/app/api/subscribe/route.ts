import { NextResponse } from 'next/server';
import { sendSMS, isValidKenyanNumber } from '@/lib/sms';
import { sendWelcomeEmail, isEmailConfigured } from '@/lib/email';
import dbConnect from '@/lib/mongodb';

// Subscriber model for email/phone collection
import mongoose from 'mongoose';

const SubscriberSchema = new mongoose.Schema({
    email: { type: String, sparse: true },
    phone: { type: String, sparse: true },
    plan: { type: String, default: 'newsletter' },
    source: { type: String, default: 'website' },
    emailSent: { type: Boolean, default: false },
    smsSent: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const Subscriber = mongoose.models.Subscriber || mongoose.model('Subscriber', SubscriberSchema);

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        const { type, email, phone, plan } = body;

        // Validate input
        if (!email && !phone) {
            return NextResponse.json(
                { error: 'Email or phone number is required' },
                { status: 400 }
            );
        }

        // Validate phone number if provided
        if (phone && !isValidKenyanNumber(phone)) {
            return NextResponse.json(
                { error: 'Invalid Kenyan phone number. Use format +254...' },
                { status: 400 }
            );
        }

        // Validate email if provided
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email address' },
                { status: 400 }
            );
        }

        let smsSent = false;
        let emailSent = false;

        // Check if subscriber already exists
        const existingSubscriber = await Subscriber.findOne({
            $or: [
                ...(email ? [{ email }] : []),
                ...(phone ? [{ phone }] : [])
            ]
        });

        if (existingSubscriber) {
            // Update existing subscriber
            if (email) existingSubscriber.email = email;
            if (phone) existingSubscriber.phone = phone;
            if (plan) existingSubscriber.plan = plan;
            await existingSubscriber.save();
        } else {
            // Create new subscriber
            const newSubscriber = await Subscriber.create({
                email: email || undefined,
                phone: phone || undefined,
                plan: plan || 'newsletter',
                source: type || 'website'
            });

            // Send welcome SMS if phone is provided and AT is configured
            if (phone && process.env.AT_API_KEY) {
                try {
                    const welcomeMessage = plan && plan !== 'newsletter'
                        ? `🌾 Welcome to Shamba Smart!\n\nYou've signed up for the ${plan} plan.\n\nDial *384*1300# anytime for:\n- Planting advice\n- Market prices\n- Weather forecasts\n\nHappy farming!`
                        : `🌾 Welcome to Shamba Smart!\n\nThank you for subscribing to our updates.\n\nDial *384*1300# anytime for farming insights.\n\nHappy farming!`;

                    const smsResult = await sendSMS({
                        to: phone,
                        message: welcomeMessage
                    });

                    if (smsResult.success) {
                        smsSent = true;
                        newSubscriber.smsSent = true;
                        await newSubscriber.save();
                        console.log('Welcome SMS sent to:', phone);
                    }
                } catch (smsError) {
                    console.error('Failed to send welcome SMS:', smsError);
                }
            }

            // Send welcome email if email is provided and Resend is configured
            if (email && process.env.RESEND_API_KEY) {
                try {
                    const emailResult = await sendWelcomeEmail(email, plan);

                    if (emailResult.success) {
                        emailSent = true;
                        newSubscriber.emailSent = true;
                        await newSubscriber.save();
                        console.log('Welcome email sent to:', email);
                    }
                } catch (emailError) {
                    console.error('Failed to send welcome email:', emailError);
                }
            }
        }

        return NextResponse.json({
            success: true,
            message: existingSubscriber
                ? 'Your subscription has been updated!'
                : 'Thank you for subscribing!',
            smsSent,
            emailSent,
            smsConfigured: !!process.env.AT_API_KEY,
            emailConfigured: !!process.env.RESEND_API_KEY
        });

    } catch (error: any) {
        console.error('Subscribe API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to process subscription' },
            { status: 500 }
        );
    }
}

export async function GET() {
    // Health check endpoint
    return NextResponse.json({
        status: 'ok',
        smsConfigured: !!process.env.AT_API_KEY,
        emailConfigured: isEmailConfigured(),
        message: 'Subscribe API is running'
    });
}
