"use client";

import { motion } from 'framer-motion';
import { Handshake } from 'lucide-react';

const partners = [
    { name: 'Kenya Met Department', type: 'Data Partner' },
    { name: 'KALRO', type: 'Research Partner' },
    { name: 'Safaricom', type: 'Technology Partner' },
    { name: 'World Bank', type: 'Funding Partner' },
    { name: 'USAID', type: 'Development Partner' },
    { name: 'FAO Kenya', type: 'Knowledge Partner' },
];

export default function Partners() {
    return (
        <section style={{ padding: '4rem 0', background: '#FAFAFA' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <Handshake size={24} color="#2E7D32" />
                        <span style={{ color: '#666', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '2px' }}>
                            Trusted By
                        </span>
                    </div>
                </div>

                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '3rem'
                }}>
                    {partners.map((partner, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: i * 0.05 }}
                            viewport={{ once: true }}
                            style={{
                                textAlign: 'center',
                                opacity: 0.6,
                                transition: 'opacity 0.3s',
                                cursor: 'default'
                            }}
                            whileHover={{ opacity: 1 }}
                        >
                            <div style={{
                                background: 'white',
                                padding: '1.5rem 2rem',
                                borderRadius: '12px',
                                border: '1px solid rgba(0,0,0,0.05)'
                            }}>
                                <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#333', marginBottom: '0.25rem' }}>
                                    {partner.name}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    {partner.type}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
