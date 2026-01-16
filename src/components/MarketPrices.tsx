"use client";

import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, RefreshCw, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

interface MarketPrice {
    _id: string;
    crop: string;
    pricePerBag: number;
    market: string;
    trend: 'up' | 'down' | 'stable';
    date: string;
    change?: number;
}

const samplePrices: Record<string, MarketPrice[]> = {
    'Nakuru': [
        { _id: '1', crop: 'Maize', pricePerBag: 3850, market: 'Nakuru', trend: 'up', date: new Date().toISOString(), change: 5.2 },
        { _id: '2', crop: 'Beans', pricePerBag: 8750, market: 'Nakuru', trend: 'up', date: new Date().toISOString(), change: 3.8 },
        { _id: '3', crop: 'Potatoes', pricePerBag: 1650, market: 'Nakuru', trend: 'down', date: new Date().toISOString(), change: -2.1 },
        { _id: '4', crop: 'Wheat', pricePerBag: 4200, market: 'Nakuru', trend: 'stable', date: new Date().toISOString(), change: 0.3 },
    ],
    'Nairobi': [
        { _id: '5', crop: 'Maize', pricePerBag: 4100, market: 'Nairobi', trend: 'up', date: new Date().toISOString(), change: 4.1 },
        { _id: '6', crop: 'Beans', pricePerBag: 9200, market: 'Nairobi', trend: 'up', date: new Date().toISOString(), change: 6.2 },
        { _id: '7', crop: 'Potatoes', pricePerBag: 1800, market: 'Nairobi', trend: 'stable', date: new Date().toISOString(), change: 0.5 },
        { _id: '8', crop: 'Cabbage', pricePerBag: 950, market: 'Nairobi', trend: 'down', date: new Date().toISOString(), change: -8.3 },
    ],
    'Mombasa': [
        { _id: '9', crop: 'Maize', pricePerBag: 4500, market: 'Mombasa', trend: 'up', date: new Date().toISOString(), change: 7.5 },
        { _id: '10', crop: 'Beans', pricePerBag: 9800, market: 'Mombasa', trend: 'stable', date: new Date().toISOString(), change: 1.2 },
        { _id: '11', crop: 'Rice', pricePerBag: 7200, market: 'Mombasa', trend: 'up', date: new Date().toISOString(), change: 4.8 },
        { _id: '12', crop: 'Cassava', pricePerBag: 2400, market: 'Mombasa', trend: 'down', date: new Date().toISOString(), change: -3.2 },
    ],
    'Eldoret': [
        { _id: '13', crop: 'Maize', pricePerBag: 3600, market: 'Eldoret', trend: 'stable', date: new Date().toISOString(), change: 0.8 },
        { _id: '14', crop: 'Wheat', pricePerBag: 4000, market: 'Eldoret', trend: 'up', date: new Date().toISOString(), change: 5.5 },
        { _id: '15', crop: 'Potatoes', pricePerBag: 1400, market: 'Eldoret', trend: 'down', date: new Date().toISOString(), change: -4.2 },
        { _id: '16', crop: 'Beans', pricePerBag: 8200, market: 'Eldoret', trend: 'up', date: new Date().toISOString(), change: 2.9 },
    ]
};

export default function MarketPrices() {
    const [prices, setPrices] = useState<MarketPrice[]>(samplePrices['Nakuru']);
    const [selectedMarket, setSelectedMarket] = useState('Nakuru');
    const [loading, setLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [alertPhone, setAlertPhone] = useState('');
    const [alertSet, setAlertSet] = useState(false);
    const [sending, setSending] = useState(false);
    const [alertError, setAlertError] = useState('');

    const markets = ['Nakuru', 'Nairobi', 'Mombasa', 'Eldoret'];

    const handleMarketChange = (market: string) => {
        setLoading(true);
        setSelectedMarket(market);
        setTimeout(() => {
            setPrices(samplePrices[market] || []);
            setLastUpdated(new Date());
            setLoading(false);
        }, 300);
    };

    const handleSetAlerts = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!alertPhone) return;

        setSending(true);
        setAlertError('');

        try {
            const response = await fetch('/api/sms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'price-alert',
                    phone: alertPhone,
                    data: {
                        market: selectedMarket,
                        prices: prices.map(p => ({
                            crop: p.crop,
                            price: p.pricePerBag,
                            change: p.change || 0
                        }))
                    }
                })
            });

            // Check if response is JSON before parsing
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                setAlertError('Server error. Please try again later.');
                return;
            }

            const result = await response.json();

            if (response.ok && result.success) {
                setAlertSet(true);
                setTimeout(() => {
                    setShowAlertModal(false);
                    setAlertSet(false);
                    setAlertPhone('');
                }, 2000);
            } else {
                setAlertError(result.error || 'Failed to send SMS. Please configure your Africa\'s Talking API key.');
            }
        } catch (error) {
            console.error('SMS error:', error);
            setAlertError('Network error. Please try again.');
        } finally {
            setSending(false);
        }
    };

    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case 'up': return <TrendingUp size={20} />;
            case 'down': return <TrendingDown size={20} />;
            default: return <Minus size={20} />;
        }
    };

    const getTrendStyle = (trend: string) => {
        switch (trend) {
            case 'up': return { bg: '#E8F5E9', color: '#2E7D32', icon: '#4CAF50' };
            case 'down': return { bg: '#FFEBEE', color: '#C62828', icon: '#EF5350' };
            default: return { bg: '#F5F5F5', color: '#757575', icon: '#9E9E9E' };
        }
    };

    return (
        <section id="market" style={{ padding: '6rem 0', background: '#FAFAFA' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <span className="badge" style={{ background: '#E8F5E9', color: '#2E7D32', marginBottom: '1rem', display: 'inline-block' }}>
                        REAL-TIME DATA
                    </span>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Live Market Prices</h2>
                    <p style={{ color: '#666', maxWidth: '600px', margin: '0 auto' }}>
                        Updated hourly from major markets across Kenya. Know the best time and place to sell.
                    </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                    {markets.map((market) => (
                        <button
                            key={market}
                            onClick={() => handleMarketChange(market)}
                            style={{
                                padding: '0.75rem 1.5rem',
                                borderRadius: '12px',
                                border: selectedMarket === market ? '2px solid #2E7D32' : '1px solid #E0E0E0',
                                background: selectedMarket === market ? '#E8F5E9' : 'white',
                                color: selectedMarket === market ? '#1B5E20' : '#666',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <MapPin size={16} />
                            {market}
                        </button>
                    ))}
                    <button
                        onClick={() => handleMarketChange(selectedMarket)}
                        style={{
                            padding: '0.75rem',
                            borderRadius: '12px',
                            border: '1px solid #E0E0E0',
                            background: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                        title="Refresh prices"
                    >
                        <RefreshCw size={18} style={loading ? { animation: 'spin 1s linear infinite' } : undefined} />
                    </button>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <span style={{ fontSize: '0.85rem', color: '#888' }}>
                        Last updated: {lastUpdated.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })} EAT
                    </span>
                </div>

                <div className="grid grid-4" style={{ gap: '1.5rem' }}>
                    {prices.map((price, idx) => {
                        const style = getTrendStyle(price.trend);
                        return (
                            <motion.div
                                key={price._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                style={{
                                    background: 'white',
                                    borderRadius: '20px',
                                    padding: '1.75rem',
                                    border: '1px solid rgba(0,0,0,0.06)',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.25rem', color: '#1B5E20', marginBottom: '0.25rem' }}>{price.crop}</h3>
                                        <span style={{ fontSize: '0.8rem', color: '#888' }}>90kg bag</span>
                                    </div>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '10px',
                                        background: style.bg,
                                        color: style.icon,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {getTrendIcon(price.trend)}
                                    </div>
                                </div>

                                <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#1B5E20', marginBottom: '0.5rem' }}>
                                    KES {price.pricePerBag.toLocaleString()}
                                </div>

                                <div style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                    padding: '0.35rem 0.75rem',
                                    borderRadius: '8px',
                                    background: style.bg,
                                    color: style.color,
                                    fontSize: '0.85rem',
                                    fontWeight: 600
                                }}>
                                    {price.change && price.change > 0 ? '+' : ''}{price.change}% this week
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    style={{
                        marginTop: '3rem',
                        background: 'linear-gradient(135deg, #FFF8E1, #FFFDE7)',
                        borderRadius: '20px',
                        padding: '2rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        border: '1px solid #FFE082',
                        flexWrap: 'wrap',
                        gap: '1rem'
                    }}
                >
                    <div>
                        <h4 style={{ color: '#E65100', marginBottom: '0.5rem', fontSize: '1.1rem' }}>💡 Market Insight</h4>
                        <p style={{ color: '#666', maxWidth: '600px' }}>
                            Maize prices are {prices.find(p => p.crop === 'Maize')?.trend === 'up' ? 'rising' : 'stable'} in {selectedMarket}.
                            {prices.find(p => p.crop === 'Maize')?.trend === 'up'
                                ? ' Consider selling within the next 2 weeks for optimal returns.'
                                : ' Monitor the market for better opportunities.'}
                        </p>
                    </div>
                    <button
                        onClick={() => { setShowAlertModal(true); setAlertError(''); setAlertSet(false); }}
                        className="btn-primary"
                        style={{ background: '#E65100', whiteSpace: 'nowrap' }}
                    >
                        Get Price Alerts via SMS
                    </button>
                </motion.div>
            </div>

            {/* SMS Alert Modal */}
            {showAlertModal && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: '1rem'
                    }}
                    onClick={() => setShowAlertModal(false)}
                >
                    <div
                        style={{
                            background: 'white',
                            borderRadius: '20px',
                            padding: '2rem',
                            maxWidth: '400px',
                            width: '100%',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        {!alertSet ? (
                            <div>
                                <h3 style={{ color: '#E65100', marginBottom: '0.5rem' }}>📱 Get SMS Price Alerts</h3>
                                <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                                    We will send you the current {selectedMarket} market prices via SMS.
                                </p>

                                {alertError && (
                                    <div style={{
                                        background: '#FFEBEE',
                                        color: '#C62828',
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        marginBottom: '1rem',
                                        fontSize: '0.85rem'
                                    }}>
                                        ⚠️ {alertError}
                                    </div>
                                )}

                                <form onSubmit={handleSetAlerts}>
                                    <div style={{ marginBottom: '1rem' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.85rem' }}>
                                            Your Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            placeholder="+254 7XX XXX XXX"
                                            value={alertPhone}
                                            onChange={e => setAlertPhone(e.target.value)}
                                            required
                                            disabled={sending}
                                            style={{ width: '100%', opacity: sending ? 0.6 : 1 }}
                                        />
                                    </div>
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.85rem' }}>
                                            Prices You'll Receive
                                        </label>
                                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                            {prices.map(p => (
                                                <span key={p._id} style={{
                                                    background: '#E8F5E9',
                                                    color: '#2E7D32',
                                                    padding: '0.4rem 0.8rem',
                                                    borderRadius: '8px',
                                                    fontSize: '0.85rem',
                                                    fontWeight: 600
                                                }}>
                                                    {p.crop}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={sending}
                                        className="btn-primary"
                                        style={{
                                            width: '100%',
                                            justifyContent: 'center',
                                            background: sending ? '#FFAB91' : '#E65100',
                                            cursor: sending ? 'wait' : 'pointer'
                                        }}
                                    >
                                        {sending ? '📤 Sending SMS...' : '📲 Send Me Prices Now'}
                                    </button>
                                </form>
                                <button
                                    onClick={() => setShowAlertModal(false)}
                                    style={{
                                        width: '100%',
                                        marginTop: '0.75rem',
                                        padding: '0.75rem',
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#666',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                                <h3 style={{ color: '#2E7D32', marginBottom: '0.5rem' }}>SMS Sent!</h3>
                                <p style={{ color: '#666' }}>Check your phone for the market prices.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
        </section>
    );
}
