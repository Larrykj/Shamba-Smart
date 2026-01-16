import { NextResponse } from 'next/server';
import { sendSMS, sendWeatherAlert, sendPriceAlert, isValidKenyanNumber } from '@/lib/sms';

export async function POST(req: Request) {
    try {
        const { type, phone, data } = await req.json();

        // Debug logging
        console.log('--- SMS Request Debug ---');
        console.log('Username:', process.env.AT_USERNAME);
        console.log('API Key Length:', process.env.AT_API_KEY ? process.env.AT_API_KEY.length : 'Missing');
        console.log('Target Phone:', phone);
        console.log('Message Type:', type);

        if (!process.env.AT_API_KEY) {
            console.error('❌ Missing AT_API_KEY in environment variables');
            return NextResponse.json({ error: 'Server misconfiguration: Missing API Key' }, { status: 500 });
        }

        if (!phone) {
            return NextResponse.json({ error: 'Phone number required' }, { status: 400 });
        }

        if (!isValidKenyanNumber(phone)) {
            console.error('❌ Invalid phone number format:', phone);
            return NextResponse.json({ error: 'Invalid Kenyan phone number. Use format +254...' }, { status: 400 });
        }

        let result;

        switch (type) {
            case 'weather-alert':
                console.log('Sending weather alert...');
                result = await sendWeatherAlert(
                    phone,
                    data.location || 'Your Location',
                    data.alert || 'Weather conditions are changing. Check the app for details.'
                );
                break;

            case 'price-alert':
                console.log('Sending price alert...');
                result = await sendPriceAlert(
                    phone,
                    data.market || 'Nakuru',
                    data.prices || [
                        { crop: 'Maize', price: 3850, change: 5.2 },
                        { crop: 'Beans', price: 8750, change: 3.8 },
                    ]
                );
                break;

            case 'planting-advice':
                result = await sendPlantingAdvice(
                    phone,
                    data.crop || 'Maize',
                    data.recommendation || 'Optimal planting conditions detected.',
                    data.confidence || 85
                );
                break;

            case 'custom':
                result = await sendSMS({
                    to: phone,
                    message: data.message || 'Hello from Shamba Smart!',
                });
                break;

            default:
                // Default welcome message
                result = await sendSMS({
                    to: phone,
                    message: `🌾 Welcome to Shamba Smart!\n\nYou're now registered for alerts.\n\nDial *384*1300# anytime for:\n- Planting advice\n- Market prices\n- Weather forecasts\n\nHappy farming!`,
                });
        }

        console.log('AT Response:', JSON.stringify(result, null, 2));

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: 'SMS sent successfully',
                messageId: result.messageId,
            });
        } else {
            return NextResponse.json(
                { error: result.error || 'Failed to send SMS' },
                { status: 500 }
            );
        }
    } catch (error: any) {
        console.error('SMS API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

// Helper function imported from sms.ts
async function sendPlantingAdvice(
    phone: string,
    crop: string,
    recommendation: string,
    confidence: number
) {
    const { sendSMS } = await import('@/lib/sms');
    const message = `🌱 SHAMBA SMART\n\n${crop} Planting Advice:\n\n${recommendation}\n\nConfidence: ${confidence}%\n\nDial *384*1300# for full report.`;
    return sendSMS({ to: phone, message });
}
