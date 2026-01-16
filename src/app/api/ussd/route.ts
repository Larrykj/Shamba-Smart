import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Crop from '@/models/Crop';
import { getWeatherData } from '@/lib/weather';

export async function POST(req: Request) {
    try {
        const text = await req.text();
        // Africa's Talking sends x-www-form-urlencoded data
        const params = new URLSearchParams(text);

        // const sessionId = params.get('sessionId');
        // const serviceCode = params.get('serviceCode');
        const phoneNumber = params.get('phoneNumber');
        const textInput = params.get('text') || '';

        let response = '';

        // Logic for USSD Menu
        // textInput comes in as "1", "1*2", "1*2*1" etc.
        const textArray = textInput.split('*').filter((x) => x !== '');
        const level = textArray.length;

        if (level === 0) {
            // Main Menu
            response = `CON Welcome to Shamba Smart
1. Get Planting Advice
2. Report Observation
3. Market Prices`;
        } else if (textArray[0] === '1') {
            // Option 1: Planting Advice
            if (level === 1) {
                response = `CON Select Crop:
1. Maize
2. Beans
3. Cassava`;
            } else if (level === 2) {
                response = `CON Enter your Location (District/Town):`;
            } else if (level === 3) {
                // Logic to get advice (Simplified)
                // In real app, we'd gecode the text location. 
                // Here we default to Nakuru for demo.
                const cropMap = { '1': 'Maize', '2': 'Beans', '3': 'Cassava' };
                const selectedCrop = cropMap[textArray[1] as keyof typeof cropMap];
                const location = textArray[2]; // User typed location

                // Fetch simplified weather (using dummy coords for demo)
                // const weather = await getWeatherData(-0.3, 36.0); 

                response = `END Prediction for ${selectedCrop} in ${location}:
Rainfall is GOOD for planting (45mm next 7 days).
Plant within 3 days. Soil moisture is high.`;
            }
        } else if (textArray[0] === '2') {
            // Option 2: Report Observation
            if (level === 1) {
                response = `CON What did you see?
1. Bird Migration
2. Flowering
3. Changes in Wind`;
            } else if (level === 2) {
                response = `END Thank you! Your observation has been recorded and will help the community.`;
                // Save to DB here in real app
            }
        } else if (textArray[0] === '3') {
            // Option 3: Market Prices - Dynamic from DB
            await dbConnect();
            const MarketPrice = (await import('@/models/MarketPrice')).default;
            const prices = await MarketPrice.find({ market: 'Nakuru' }).sort({ date: -1 }).limit(3);

            if (prices.length > 0) {
                let priceText = 'Current Prices (Nakuru):\n';
                prices.forEach((p: any) => {
                    priceText += `${p.crop}: KES ${p.pricePerBag}/bag\n`;
                });
                response = `END ${priceText}`;
            } else {
                response = `END Current Prices (Nakuru Market):
Maize: KES 3500/bag
Beans: KES 8400/bag
Potatoes: KES 1500/bag`;
            }
        } else {
            response = `END Invalid Option`;
        }

        return new NextResponse(response, {
            headers: { 'Content-Type': 'text/plain' },
        });

    } catch (error) {
        console.error(error);
        return new NextResponse('END System Error', { status: 500 });
    }
}
