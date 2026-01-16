import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Observation from '@/models/Observation';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();

        // For MVP, we'll hardcode coordinates for Nakuru if not provided
        const newObservation = await Observation.create({
            ...body,
            location: {
                type: 'Point',
                coordinates: [36.0613, -0.3031]
            }
        });

        return NextResponse.json(newObservation, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to submit observation' }, { status: 500 });
    }
}

export async function GET() {
    try {
        await dbConnect();
        const observations = await Observation.find().sort({ dateObserved: -1 }).limit(10);
        return NextResponse.json(observations);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch observations' }, { status: 500 });
    }
}
