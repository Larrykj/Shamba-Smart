"use client";

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const testimonials = [
    {
        name: 'Mary Wanjiku',
        location: 'Muranga County',
        crop: 'Coffee',
        image: 'MW',
        quote: 'Shamba Smart told me to delay planting by 2 weeks. The rains came exactly as predicted. My neighbors who planted early lost 40% of their seedlings.',
        yield: '+35%',
        highlight: 'yield increase'
    },
    {
        name: 'James Otieno',
        location: 'Kisumu County',
        crop: 'Maize',
        image: 'JO',
        quote: 'The market price alerts helped me sell at the right time. I got KES 800 more per bag than farmers who sold a week earlier.',
        yield: 'KES 28K',
        highlight: 'extra income'
    },
    {
        name: 'Grace Muthoni',
        location: 'Nakuru County',
        crop: 'Potatoes',
        image: 'GM',
        quote: 'I switched from maize to potatoes based on the app\'s recommendation for my soil type. Best decision I ever made for my farm.',
        yield: '3x',
        highlight: 'profit increase'
    },
    {
        name: 'Peter Kimani',
        location: 'Kiambu County',
        crop: 'Vegetables',
        image: 'PK',
        quote: 'The traditional indicators from other farmers in my area are surprisingly accurate. The community wisdom feature is invaluable.',
        yield: '89%',
        highlight: 'prediction accuracy'
    }
];

export default function Testimonials() {
    return (
        <section style={{ padding: '6rem 0', background: 'linear-gradient(180deg, #F1F8E9 0%, #FFFFFF 100%)' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <span className="badge" style={{ background: '#FFF8E1', color: '#E65100', marginBottom: '1rem', display: 'inline-block' }}>
                        SUCCESS STORIES
                    </span>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Farmers Love Shamba Smart</h2>
                    <p style={{ color: '#666', maxWidth: '600px', margin: '0 auto' }}>
                        Real stories from real farmers seeing real results across Kenya.
                    </p>
                </div>

                <div className="grid grid-2" style={{ gap: '2rem' }}>
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="glass-card"
                            style={{ padding: '2.5rem', position: 'relative', overflow: 'hidden' }}
                        >
                            <Quote
                                size={120}
                                style={{
                                    position: 'absolute',
                                    right: '-20px',
                                    top: '-20px',
                                    color: '#E8F5E9',
                                    transform: 'rotate(10deg)'
                                }}
                            />

                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', position: 'relative', zIndex: 1 }}>
                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '16px',
                                    background: 'linear-gradient(135deg, #2E7D32, #4CAF50)',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 700,
                                    fontSize: '1.2rem'
                                }}>
                                    {t.image}
                                </div>
                                <div>
                                    <h4 style={{ marginBottom: '0.25rem', color: '#1B5E20' }}>{t.name}</h4>
                                    <p style={{ fontSize: '0.85rem', color: '#666' }}>{t.location} • {t.crop} Farmer</p>
                                </div>
                            </div>

                            <p style={{
                                fontSize: '1.05rem',
                                lineHeight: 1.7,
                                color: '#333',
                                marginBottom: '1.5rem',
                                fontStyle: 'italic',
                                position: 'relative',
                                zIndex: 1
                            }}>
                                "{t.quote}"
                            </p>

                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                background: '#E8F5E9',
                                padding: '0.75rem 1.25rem',
                                borderRadius: '12px'
                            }}>
                                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2E7D32' }}>{t.yield}</span>
                                <span style={{ fontSize: '0.85rem', color: '#558B2F' }}>{t.highlight}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
