import mongoose from 'mongoose';

const ObservationSchema = new mongoose.Schema({
    location: {
        type: { type: String, default: 'Point' },
        coordinates: [Number], // [longitude, latitude]
    },
    indicatorType: {
        type: String,
        enum: ['Bird Behavior', 'Plant Flowering', 'Wind Pattern', 'Insects', 'Other'],
        required: true
    },
    description: String,
    prediction: String, // e.g., 'Heavy rains coming in 2 weeks'
    userId: String,
    dateObserved: { type: Date, default: Date.now },
    validations: [{
        userId: String,
        isValid: Boolean,
        comment: String
    }],
    accuracyScore: { type: Number, default: 0 }
});

ObservationSchema.index({ location: '2dsphere' });

export default mongoose.models.Observation || mongoose.model('Observation', ObservationSchema);
