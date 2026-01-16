import mongoose from 'mongoose';

const MarketPriceSchema = new mongoose.Schema({
    crop: { type: String, required: true },
    market: { type: String, required: true }, // e.g., 'Nakuru', 'Nairobi'
    pricePerBag: { type: Number, required: true }, // KES
    pricePerKg: { type: Number },
    unit: { type: String, default: '90kg bag' },
    date: { type: Date, default: Date.now },
    trend: { type: String, enum: ['up', 'down', 'stable'], default: 'stable' }
});

export default mongoose.models.MarketPrice || mongoose.model('MarketPrice', MarketPriceSchema);
