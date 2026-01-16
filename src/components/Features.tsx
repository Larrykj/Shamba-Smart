"use client";

import { motion } from 'framer-motion';
import { Calendar, Sprout, MessageSquare, TrendingUp, Satellite, Shield, Bell, Smartphone } from 'lucide-react';

export default function Features() {
    const features = [
        {
            icon: <Calendar size={36} />,
            title: "AI Planting Calendar",
            desc: "14-day forecasts combined with 30 years of historical data to find your perfect planting window.",
            stat: "87%",
            statLabel: "accuracy"
        },
        {
            icon: <Sprout size={36} />,
            title: "Smart Crop Matching",
            desc: "Machine learning analyzes your soil, rainfall, and market to recommend the most profitable crops.",
            stat: "12",
            statLabel: "crop varieties"
        },
        {
            icon: <MessageSquare size={36} />,
            title: "Indigenous Wisdom",
            desc: "Community-validated traditional indicators combined with satellite data for hyperlocal predictions.",
            stat: "2,400+",
            statLabel: "observations"
        },
        {
            icon: <TrendingUp size={36} />,
            title: "Market Intelligence",
            desc: "Real-time prices from 47 county markets. Know the best time and place to sell.",
            stat: "Live",
            statLabel: "updates"
        },
        {
            icon: <Satellite size={36} />,
            title: "Satellite Monitoring",
            desc: "NDVI vegetation health, soil moisture, and rainfall detection from space at 10m resolution.",
            stat: "10m",
            statLabel: "resolution"
        },
        {
            icon: <Shield size={36} />,
            title: "Crop Insurance",
            desc: "Automatic claim triggers based on weather data. No paperwork, no delays.",
            stat: "72hr",
            statLabel: "payout time"
        },
        {
            icon: <Bell size={36} />,
            title: "Smart Alerts",
            desc: "Pest outbreak warnings, frost alerts, and optimal harvest timing notifications.",
            stat: "4hrs",
            statLabel: "early warning"
        },
        {
            icon: <Smartphone size={36} />,
            title: "Works Everywhere",
            desc: "Web, Android app, USSD, and SMS. No smartphone required.",
            stat: "100%",
            statLabel: "coverage"
        }
    ];

    return (
        <section style={{ padding: '6rem 0' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <span className="badge" style={{ background: '#E8F5E9', color: '#2E7D32', marginBottom: '1rem', display: 'inline-block' }}>
                        CORE CAPABILITIES
                    </span>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Everything You Need to Farm Smarter</h2>
                    <p style={{ color: '#558B2F', maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem' }}>
                        From weather prediction to market analysis, we've got you covered.
                    </p>
                </div>

                <div className="grid grid-4">
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -8 }}
                            className="glass-card"
                            style={{ textAlign: 'center', background: 'white', padding: '2rem' }}
                        >
                            <div style={{
                                margin: '0 auto 1.5rem',
                                width: '70px',
                                height: '70px',
                                borderRadius: '20px',
                                background: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#2E7D32'
                            }}>
                                {f.icon}
                            </div>
                            <h3 style={{ marginBottom: '0.75rem', fontSize: '1.15rem', color: '#1B5E20' }}>{f.title}</h3>
                            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1.5rem', lineHeight: 1.5 }}>{f.desc}</p>

                            <div style={{
                                borderTop: '1px solid #eee',
                                paddingTop: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem'
                            }}>
                                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2E7D32' }}>{f.stat}</span>
                                <span style={{ fontSize: '0.8rem', color: '#888' }}>{f.statLabel}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
