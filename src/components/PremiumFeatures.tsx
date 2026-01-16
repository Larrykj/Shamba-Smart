"use client";

import { motion } from 'framer-motion';
import { Shield, Zap, Wifi, Bell, BarChart3, Users2, Smartphone, Cloud, Lock, CreditCard } from 'lucide-react';

export default function PremiumFeatures() {
    const features = [
        {
            icon: <Shield size={28} />,
            title: 'Crop Insurance Integration',
            desc: 'Partner with insurance providers. Farmers get automatic payouts when satellite data confirms drought.',
            tag: 'Revenue Stream'
        },
        {
            icon: <Bell size={28} />,
            title: 'SMS Alert System',
            desc: 'Automated weather warnings, pest outbreak alerts, and planting reminders sent directly to farmers.',
            tag: 'High Engagement'
        },
        {
            icon: <BarChart3 size={28} />,
            title: 'Yield Prediction AI',
            desc: 'Machine learning models predict harvest yields based on weather, soil, and historical data.',
            tag: 'AI-Powered'
        },
        {
            icon: <Users2 size={28} />,
            title: 'Farmer Cooperatives',
            desc: 'Group buying features, shared equipment scheduling, and collective market negotiations.',
            tag: 'Community'
        },
        {
            icon: <Smartphone size={28} />,
            title: 'Offline-First Mobile',
            desc: 'Android app works without internet. Syncs data when connectivity is available.',
            tag: 'Accessibility'
        },
        {
            icon: <Cloud size={28} />,
            title: 'Satellite Integration',
            desc: 'Real-time NDVI vegetation health, soil moisture, and rainfall detection from space.',
            tag: 'Enterprise'
        },
        {
            icon: <CreditCard size={28} />,
            title: 'Input Financing',
            desc: 'Connect farmers with microfinance for seeds, fertilizer with harvest-time repayment.',
            tag: 'Fintech'
        },
        {
            icon: <Lock size={28} />,
            title: 'Data Marketplace',
            desc: 'Anonymized agricultural insights for researchers, NGOs, and agribusinesses.',
            tag: 'B2B Revenue'
        }
    ];

    return (
        <section style={{ padding: '6rem 0', background: '#FAFAFA' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <span className="badge" style={{ background: '#E8F5E9', color: '#2E7D32', marginBottom: '1rem', display: 'inline-block' }}>
                        PLATFORM CAPABILITIES
                    </span>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Enterprise-Grade Features</h2>
                    <p style={{ color: '#666', maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem' }}>
                        Built for scale. From smallholder farmers to government agricultural departments.
                    </p>
                </div>

                <div className="grid grid-4" style={{ gap: '1.5rem' }}>
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -8, boxShadow: '0 20px 40px -15px rgba(0,0,0,0.15)' }}
                            style={{
                                background: 'white',
                                borderRadius: '20px',
                                padding: '2rem',
                                border: '1px solid rgba(0,0,0,0.05)',
                                cursor: 'default',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                <div style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '12px',
                                    background: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#2E7D32'
                                }}>
                                    {feature.icon}
                                </div>
                                <span style={{
                                    fontSize: '0.7rem',
                                    fontWeight: 700,
                                    color: '#1976D2',
                                    background: '#E3F2FD',
                                    padding: '4px 8px',
                                    borderRadius: '6px',
                                    textTransform: 'uppercase'
                                }}>
                                    {feature.tag}
                                </span>
                            </div>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', color: '#1B5E20' }}>{feature.title}</h3>
                            <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: 1.5 }}>{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
