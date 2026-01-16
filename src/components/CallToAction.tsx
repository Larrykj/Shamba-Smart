"use client";

import { motion } from 'framer-motion';
import { ArrowRight, Mail, Phone, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function CallToAction() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'newsletter',
                    email: email
                })
            });

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Server error. Please try again later.');
            }

            const result = await response.json();

            if (response.ok && result.success) {
                setSubmitted(true);
                setEmail('');
            } else {
                setError(result.error || 'Failed to subscribe. Please try again.');
            }
        } catch (err: any) {
            console.error('Subscription error:', err);
            setError(err.message || 'Network error. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section style={{
            padding: '6rem 0',
            background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #1B5E20 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{
                position: 'absolute',
                top: '-50%',
                right: '-10%',
                width: '600px',
                height: '600px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.05)',
            }} />

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                <div className="grid grid-2" style={{ gap: '4rem', alignItems: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem', lineHeight: 1.2 }}>
                            Ready to Transform <br />
                            <span style={{ color: '#FFB300' }}>Your Farming?</span>
                        </h2>
                        <p style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '2rem', lineHeight: 1.6 }}>
                            Join 12,000+ farmers already using Shamba Smart. Get started in under 2 minutes.
                        </p>

                        <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
                            <a
                                href="tel:+254700123456"
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white', textDecoration: 'none' }}
                            >
                                <Phone size={20} />
                                <span>+254 700 123 456</span>
                            </a>
                            <a
                                href="mailto:hello@shambasmart.co.ke"
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white', textDecoration: 'none' }}
                            >
                                <Mail size={20} />
                                <span>hello@shambasmart.co.ke</span>
                            </a>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        style={{
                            background: 'rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '24px',
                            padding: '2.5rem',
                            border: '1px solid rgba(255,255,255,0.2)'
                        }}
                    >
                        {!submitted ? (
                            <>
                                <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Get Early Access</h3>
                                <p style={{ opacity: 0.8, marginBottom: '1.5rem' }}>
                                    Be the first to know when we launch new features.
                                </p>

                                {error && (
                                    <div style={{
                                        background: 'rgba(239, 83, 80, 0.2)',
                                        color: '#FFCDD2',
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        marginBottom: '1rem',
                                        fontSize: '0.85rem'
                                    }}>
                                        ⚠️ {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email"
                                            disabled={loading}
                                            style={{
                                                flex: 1,
                                                background: 'rgba(255,255,255,0.1)',
                                                border: '1px solid rgba(255,255,255,0.3)',
                                                color: 'white',
                                                padding: '1rem',
                                                borderRadius: '12px',
                                                opacity: loading ? 0.6 : 1
                                            }}
                                            required
                                        />
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="btn-primary"
                                            style={{
                                                background: '#FFB300',
                                                color: '#1B5E20',
                                                opacity: loading ? 0.7 : 1,
                                                cursor: loading ? 'wait' : 'pointer'
                                            }}
                                        >
                                            {loading ? <Loader2 size={20} className="spinning" /> : <ArrowRight size={20} />}
                                        </button>
                                    </div>
                                </form>
                                <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>
                                    🔒 We respect your privacy. Unsubscribe anytime.
                                </p>
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '2rem' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                                <h3 style={{ marginBottom: '0.5rem' }}>You're on the list!</h3>
                                <p style={{ opacity: 0.8 }}>We'll notify you when new features launch.</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

