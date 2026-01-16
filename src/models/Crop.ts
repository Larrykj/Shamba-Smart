import mongoose from 'mongoose';

const CropSchema = new mongoose.Schema({
    name: { type: String, required: true },
    variety: String,
    optimalRainfallMm: {
        min: Number,
        max: Number
    },
    optimalTempC: {
        min: Number,
        max: Number
    },
    growthDurationDays: Number,
    soilTypes: [String], // e.g., ['Loamy', 'Clay']
    plantingInstructions: String,
});

export default mongoose.models.Crop || mongoose.model('Crop', CropSchema);
