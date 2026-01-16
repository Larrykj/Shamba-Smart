"use client";

import { useState } from 'react';
import { MapPin, Search, Crosshair, Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import PredictionResult from './PredictionResult';
import { motion } from 'framer-motion';

const MapPicker = dynamic(() => import('./MapPicker'), {
    ssr: false,
    loading: () => (
        <div style={{ height: '300px', background: '#f0f0f0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Loader2 className="spinning" size={24} color="#2E7D32" />
        </div>
    )
});

const locations = [
    { name: 'Nakuru', lat: -0.3031, lon: 36.0613 },
    { name: 'Nairobi', lat: -1.2921, lon: 36.8219 },
    { name: 'Eldoret', lat: 0.5143, lon: 35.2698 },
    { name: 'Kisumu', lat: -0.0917, lon: 34.7680 },
    { name: 'Meru', lat: 0.0500, lon: 37.6500 },
    { name: 'Machakos', lat: -1.5177, lon: 37.2634 },
];

const crops = [
    { name: 'Maize', icon: '🌽' },
    { name: 'Beans', icon: '🫘' },
    { name: 'Potatoes', icon: '🥔' },
    { name: 'Wheat', icon: '🌾' },
    { name: 'Cassava', icon: '🥔' },
    { name: 'Sorghum', icon: '🌰' },
];

export default function PlantingForm() {
    const [selectedLocation, setSelectedLocation] = useState(locations[0]);
    const [coords, setCoords] = useState({ lat: -0.3031, lon: 36.0613 });
    const [crop, setCrop] = useState('Maize');
    const [loading, setLoading] = useState(false);
    const [prediction, setPrediction] = useState<any>(null);
    const [showMap, setShowMap] = useState(false);

    const handleLocationSelect = (lat: number, lng: number) => {
        setCoords({ lat, lon: lng });
        setSelectedLocation({ name: `${lat.toFixed(2)}°, ${lng.toFixed(2)}°`, lat, lon: lng });
    };

    const handleQuickLocation = (loc: typeof locations[0]) => {
        setSelectedLocation(loc);
        setCoords({ lat: loc.lat, lon: loc.lon });
    };

    const getPrediction = async () => {
        setLoading(true);
        setPrediction(null);
        try {
            const response = await fetch('/api/planting', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lat: coords.lat, lon: coords.lon, cropName: crop })
            });

            // Check if response is OK before parsing
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                console.error('API returned non-JSON response');
                setPrediction({ error: 'Server error. Please try again.' });
                return;
            }

            const data = await response.json();

            if (!response.ok) {
                setPrediction({ error: data.error || 'Failed to get prediction' });
                return;
            }

            setPrediction(data);
        } catch (error) {
            console.error('Prediction error:', error);
            setPrediction({ error: 'Network error. Please check your connection.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="search-section" style={{ marginTop: '-5rem', position: 'relative', zIndex: 10, paddingBottom: '2rem' }}>
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{
                        background: 'white',
                        borderRadius: '24px',
                        padding: '2.5rem',
                        boxShadow: '0 20px 60px -15px rgba(0,0,0,0.15)',
                        border: '1px solid rgba(0,0,0,0.05)'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', color: '#1B5E20', marginBottom: '0.25rem' }}>Planting Calendar</h2>
                            <p style={{ color: '#666', fontSize: '0.95rem' }}>Get AI-powered planting recommendations for your location</p>
                        </div>
                        <button
                            onClick={() => setShowMap(!showMap)}
                            style={{
                                background: showMap ? '#E8F5E9' : 'white',
                                border: '1px solid #2E7D32',
                                color: '#2E7D32',
                                padding: '0.6rem 1rem',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontWeight: 600,
                                fontSize: '0.9rem'
                            }}
                        >
                            <Crosshair size={16} />
                            {showMap ? 'Hide Map' : 'Pick on Map'}
                        </button>
                    </div>

                    {showMap && (
                        <div style={{ marginBottom: '2rem' }}>
                            <MapPicker onSelect={handleLocationSelect} />
                            <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#888', textAlign: 'center' }}>
                                Click anywhere on the map to select your exact farm location
                            </p>
                        </div>
                    )}

                    {/* Quick Location Selection */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600, fontSize: '0.85rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            <MapPin size={14} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                            SELECT YOUR COUNTY
                        </label>
                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                            {locations.map((loc) => (
                                <button
                                    key={loc.name}
                                    onClick={() => handleQuickLocation(loc)}
                                    style={{
                                        padding: '0.7rem 1.25rem',
                                        borderRadius: '10px',
                                        border: selectedLocation.name === loc.name ? '2px solid #2E7D32' : '1px solid #E0E0E0',
                                        background: selectedLocation.name === loc.name ? '#E8F5E9' : 'white',
                                        color: selectedLocation.name === loc.name ? '#1B5E20' : '#555',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {loc.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Crop Selection */}
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600, fontSize: '0.85rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            🌱 SELECT YOUR CROP
                        </label>
                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                            {crops.map((c) => (
                                <button
                                    key={c.name}
                                    onClick={() => setCrop(c.name)}
                                    style={{
                                        padding: '0.7rem 1.25rem',
                                        borderRadius: '10px',
                                        border: crop === c.name ? '2px solid #2E7D32' : '1px solid #E0E0E0',
                                        background: crop === c.name ? '#E8F5E9' : 'white',
                                        color: crop === c.name ? '#1B5E20' : '#555',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}
                                >
                                    <span style={{ fontSize: '1.1rem' }}>{c.icon}</span>
                                    {c.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={getPrediction}
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '1.25rem',
                            borderRadius: '14px',
                            border: 'none',
                            background: loading ? '#81C784' : 'linear-gradient(135deg, #2E7D32, #388E3C)',
                            color: 'white',
                            fontWeight: 700,
                            fontSize: '1.1rem',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.75rem',
                            boxShadow: '0 4px 15px rgba(46, 125, 50, 0.3)',
                            transition: 'all 0.3s'
                        }}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="spinning" size={22} />
                                Analyzing Weather Data...
                            </>
                        ) : (
                            <>
                                <Search size={22} />
                                Get Planting Recommendations
                            </>
                        )}
                    </button>

                    {/* Results */}
                    <PredictionResult prediction={prediction} />
                </motion.div>
            </div>

            <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spinning {
          animation: spin 1s linear infinite;
        }
      `}</style>
        </section>
    );
}
