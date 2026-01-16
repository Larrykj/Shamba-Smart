import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Crop from '@/models/Crop';
import MarketPrice from '@/models/MarketPrice';

export async function GET() {
    try {
        await dbConnect();

        // Seed Crops
        const existingCrops = await Crop.countDocuments();
        if (existingCrops === 0) {
            const crops = [
                {
                    name: 'Maize',
                    variety: 'H614',
                    optimalRainfallMm: { min: 500, max: 800 },
                    optimalTempC: { min: 18, max: 30 },
                    growthDurationDays: 120,
                    soilTypes: ['Loamy', 'Alluvial'],
                    plantingInstructions: 'Plant at a depth of 5cm when the soil is moist. Space 75cm between rows and 25cm between plants.'
                },
                {
                    name: 'Beans',
                    variety: 'Rosecoco',
                    optimalRainfallMm: { min: 300, max: 450 },
                    optimalTempC: { min: 15, max: 27 },
                    growthDurationDays: 90,
                    soilTypes: ['Sandy Loam'],
                    plantingInstructions: 'Sow directly into the field. Requires well-drained soil.'
                },
                {
                    name: 'Cassava',
                    variety: 'Migyera',
                    optimalRainfallMm: { min: 400, max: 1000 },
                    optimalTempC: { min: 25, max: 32 },
                    growthDurationDays: 240,
                    soilTypes: ['Sandy', 'Loamy'],
                    plantingInstructions: 'Use stem cuttings of about 20-30cm. Plant horizontally or vertically.'
                },
                {
                    name: 'Potatoes',
                    variety: 'Shangi',
                    optimalRainfallMm: { min: 500, max: 750 },
                    optimalTempC: { min: 15, max: 20 },
                    growthDurationDays: 105,
                    soilTypes: ['Loamy', 'Sandy'],
                    plantingInstructions: 'Plant seed potatoes 10cm deep. Ensure good drainage and regular earthing up.'
                }
            ];
            await Crop.insertMany(crops);
        }

        // Seed Market Prices with realistic variations
        const existingPrices = await MarketPrice.countDocuments();
        if (existingPrices === 0) {
            const markets = ['Nakuru', 'Nairobi', 'Mombasa'];
            const cropPrices = [
                { crop: 'Maize', base: 3500 },
                { crop: 'Beans', base: 8400 },
                { crop: 'Potatoes', base: 1500 },
                { crop: 'Cassava', base: 2200 }
            ];

            const prices = [];
            for (const market of markets) {
                for (const cropData of cropPrices) {
                    const variation = (Math.random() - 0.5) * 800; // +/- 400
                    const price = Math.round(cropData.base + variation);
                    const trends: ('up' | 'down' | 'stable')[] = ['up', 'down', 'stable'];

                    prices.push({
                        crop: cropData.crop,
                        market,
                        pricePerBag: price,
                        pricePerKg: Math.round(price / 90),
                        trend: trends[Math.floor(Math.random() * trends.length)],
                        date: new Date()
                    });
                }
            }
            await MarketPrice.insertMany(prices);
        }

        return NextResponse.json({
            message: 'Database seeded successfully',
            crops: await Crop.countDocuments(),
            marketPrices: await MarketPrice.countDocuments()
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Seeding failed' }, { status: 500 });
    }
}
