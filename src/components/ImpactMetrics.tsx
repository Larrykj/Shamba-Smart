"use client";

import { motion } from 'framer-motion';
import { Users, TrendingUp, Smartphone, Globe, ArrowUp } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ImpactMetrics() {
    const [counts, setCounts] = useState({
        farmers: 0,
        predictions: 0,
        accuracy: 0,
        regions: 0
    });

    useEffect(() => {
        // Animate counters on mount
        const targets = { farmers: 12847, predictions: 58392, accuracy: 87, regions: 47 };
        const duration = 2000;
        const steps = 60;
        const interval = duration / steps;

        let step = 0;
        const timer = setInterval(() => {
            step++;
            const progress = step / steps;
            setCounts({
                farmers: Math.round(targets.farmers * progress),
                predictions: Math.round(targets.predictions * progress),
                accuracy: Math.round(targets.accuracy * progress),
                regions: Math.round(targets.regions * progress)
            });
            if (step >= steps) clearInterval(timer);
        }, interval);

        return () => clearInterval(timer);
    }, []);

    const metrics = [
        { icon: <Users size={32} />, value: counts.farmers.toLocaleString(), label: 'Active Farmers', suffix: '+', color: '#2E7D32' },
        { icon: <TrendingUp size={32} />, value: counts.predictions.toLocaleString(), label: 'Predictions Made', suffix: '', color: '#1976D2' },
        { icon: <Globe size={32} />, value: counts.regions, label: 'Counties Covered', suffix: '/47', color: '#E65100' },
        { icon: <Smartphone size={32} />, value: counts.accuracy, label: 'Prediction Accuracy', suffix: '%', color: '#7B1FA2' },
    ];

    return (
        <section style={{ padding: '5rem 0', background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #388E3C 100%)', color: 'white' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <span style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem 1.5rem', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 600 }}>
                        REAL-TIME IMPACT
                    </span>
                    <h2 style={{ fontSize: '2.5rem', marginTop: '1.5rem', color: 'white' }}>Transforming Agriculture Across Kenya</h2>
                </div>

                <div className="grid grid-4" style={{ gap: '2rem' }}>
                    {metrics.map((metric, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            style={{
                                background: 'rgba(255,255,255,0.1)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: '24px',
                                padding: '2rem',
                                textAlign: 'center',
                                border: '1px solid rgba(255,255,255,0.2)'
                            }}
                        >
                            <div style={{
                                width: '70px',
                                height: '70px',
                                borderRadius: '20px',
                                background: 'rgba(255,255,255,0.15)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1.5rem'
                            }}>
                                {metric.icon}
                            </div>
                            <div style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                                {metric.value}{metric.suffix}
                                <ArrowUp size={24} style={{ color: '#81C784' }} />
                            </div>
                            <div style={{ opacity: 0.8, fontWeight: 500 }}>{metric.label}</div>
                        </motion.div>
                    ))}
                </div>

                <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                    <p style={{ opacity: 0.8, maxWidth: '600px', margin: '0 auto' }}>
                        Join thousands of farmers already using Shamba Smart to increase yields and reduce crop losses.
                    </p>
                </div>
            </div>
        </section>
    );
}
