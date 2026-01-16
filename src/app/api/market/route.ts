import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import MarketPrice from '@/models/MarketPrice';

export async function GET(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const market = searchParams.get('market') || 'Nakuru';

        const prices = await MarketPrice.find({ market }).sort({ date: -1 }).limit(10);

        return NextResponse.json(prices);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch prices' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const data = await req.json();
        const price = await MarketPrice.create(data);
        return NextResponse.json(price, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create price' }, { status: 500 });
    }
}
