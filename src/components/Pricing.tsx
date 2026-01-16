"use client";

import { motion } from 'framer-motion';
import { ArrowRight, Check, Loader2 } from 'lucide-react';
import { useState } from 'react';

const plans = [
    {
        name: 'Mkulima',
        subtitle: 'For Individual Farmers',
        price: 'Free',
        period: 'forever',
        features: [
            'Basic planting calendar',
            'Weekly SMS weather alerts',
            'USSD access',
            'Community observations',
            'Market price updates'
        ],
        cta: 'Get Started',
        popular: false,
        color: '#E8F5E9'
    },
    {
        name: 'Shamba Pro',
        subtitle: 'For Commercial Farmers',
        price: 'KES 299',
        period: '/month',
        features: [
            'Everything in Mkulima',
            'AI yield predictions',
            'Daily personalized alerts',
            'Satellite imagery access',
            'Export detailed reports',
            'Priority support'
        ],
        cta: 'Start Free Trial',
        popular: true,
        color: '#2E7D32'
    },
    {
        name: 'Enterprise',
        subtitle: 'For Organizations',
        price: 'Custom',
        period: 'pricing',
        features: [
            'Everything in Shamba Pro',
            'API access',
            'White-label solutions',
            'Bulk farmer onboarding',
            'Insurance integration',
            'Dedicated account manager',
            'Custom analytics dashboard'
        ],
        cta: 'Contact Sales',
        popular: false,
        color: '#1B5E20'
    }
];

export default function Pricing() {
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ phone: '', email: '' });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handlePlanClick = (planName: string) => {
        setSelectedPlan(planName);
        setShowModal(true);
        setSubmitted(false);
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.phone) {
            setError('Phone number is required');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'pricing',
                    phone: formData.phone,
                    email: formData.email || undefined,
                    plan: selectedPlan
                })
            });

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Server error. Please try again later.');
            }

            const result = await response.json();

            if (response.ok && result.success) {
                setSubmitted(true);
                setFormData({ phone: '', email: '' });
            } else {
                setError(result.error || 'Failed to sign up. Please try again.');
            }
        } catch (err: any) {
            console.error('Signup error:', err);
            setError(err.message || 'Network error. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="pricing" style={{ padding: '6rem 0' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <span className="badge" style={{ background: '#E3F2FD', color: '#1976D2', marginBottom: '1rem', display: 'inline-block' }}>
                        SIMPLE PRICING
                    </span>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Plans for Every Farmer</h2>
                    <p style={{ color: '#666', maxWidth: '600px', margin: '0 auto' }}>
                        Start free and upgrade as your farm grows. No hidden fees.
                    </p>
                </div>

                <div className="grid grid-3" style={{ gap: '2rem', alignItems: 'stretch' }}>
                    {plans.map((plan, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            style={{
                                background: plan.popular ? 'linear-gradient(135deg, #1B5E20, #2E7D32)' : 'white',
                                color: plan.popular ? 'white' : 'inherit',
                                borderRadius: '24px',
                                padding: '2.5rem',
                                border: plan.popular ? 'none' : '1px solid rgba(0,0,0,0.08)',
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                boxShadow: plan.popular ? '0 20px 60px -15px rgba(46, 125, 50, 0.4)' : 'none'
                            }}
                        >
                            {plan.popular && (
                                <div style={{
                                    position: 'absolute',
                                    top: '-12px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    background: '#FFB300',
                                    color: '#1B5E20',
                                    padding: '0.4rem 1.25rem',
                                    borderRadius: '99px',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    textTransform: 'uppercase'
                                }}>
                                    Most Popular
                                </div>
                            )}

                            <div style={{ marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{plan.name}</h3>
                                <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>{plan.subtitle}</p>
                            </div>

                            <div style={{ marginBottom: '2rem' }}>
                                <span style={{ fontSize: '3rem', fontWeight: 800 }}>{plan.price}</span>
                                <span style={{ opacity: 0.7 }}>{plan.period}</span>
                            </div>

                            <ul style={{ listStyle: 'none', marginBottom: '2rem', flex: 1 }}>
                                {plan.features.map((feature, j) => (
                                    <li key={j} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        marginBottom: '0.75rem',
                                        fontSize: '0.95rem'
                                    }}>
                                        <Check size={18} color={plan.popular ? '#81C784' : '#2E7D32'} />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handlePlanClick(plan.name)}
                                className={plan.popular ? 'btn-primary' : 'btn-secondary'}
                                style={{
                                    width: '100%',
                                    justifyContent: 'center',
                                    background: plan.popular ? '#FFB300' : undefined,
                                    color: plan.popular ? '#1B5E20' : undefined
                                }}
                            >
                                {plan.cta} <ArrowRight size={18} />
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Sign Up Modal */}
            {showModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
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
                    onClick={() => setShowModal(false)}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        style={{
                            background: 'white',
                            borderRadius: '24px',
                            padding: '2.5rem',
                            maxWidth: '450px',
                            width: '100%',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        {!submitted ? (
                            <>
                                <h3 style={{ marginBottom: '0.5rem', color: '#1B5E20' }}>
                                    {selectedPlan === 'Enterprise' ? 'Contact Our Sales Team' : `Sign Up for ${selectedPlan}`}
                                </h3>
                                <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                                    {selectedPlan === 'Enterprise'
                                        ? 'Tell us about your organization and we\'ll get back to you within 24 hours.'
                                        : 'Enter your details to get started with Shamba Smart.'}
                                </p>

                                <form onSubmit={handleSubmit}>
                                    {error && (
                                        <div style={{
                                            background: '#FFEBEE',
                                            color: '#C62828',
                                            padding: '0.75rem',
                                            borderRadius: '8px',
                                            marginBottom: '1rem',
                                            fontSize: '0.85rem'
                                        }}>
                                            ⚠️ {error}
                                        </div>
                                    )}

                                    <div style={{ marginBottom: '1rem' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.85rem' }}>
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            placeholder="+254 7XX XXX XXX"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            disabled={loading}
                                            required
                                            style={{ width: '100%', opacity: loading ? 0.6 : 1 }}
                                        />
                                    </div>
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.85rem' }}>
                                            Email (optional)
                                        </label>
                                        <input
                                            type="email"
                                            placeholder="you@example.com"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            disabled={loading}
                                            style={{ width: '100%', opacity: loading ? 0.6 : 1 }}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn-primary"
                                        style={{
                                            width: '100%',
                                            justifyContent: 'center',
                                            opacity: loading ? 0.7 : 1,
                                            cursor: loading ? 'wait' : 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 size={18} className="spinning" />
                                                Processing...
                                            </>
                                        ) : (
                                            selectedPlan === 'Enterprise' ? 'Request Demo' : 'Create Account'
                                        )}
                                    </button>
                                </form>

                                <button
                                    onClick={() => setShowModal(false)}
                                    style={{
                                        width: '100%',
                                        marginTop: '1rem',
                                        padding: '0.75rem',
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#666',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                                <h3 style={{ color: '#2E7D32', marginBottom: '0.5rem' }}>Welcome to Shamba Smart!</h3>
                                <p style={{ color: '#666', marginBottom: '1.5rem' }}>
                                    {selectedPlan === 'Enterprise'
                                        ? 'Our team will contact you within 24 hours.'
                                        : 'Check your phone for a verification SMS.'}
                                </p>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="btn-primary"
                                    style={{ width: '100%', justifyContent: 'center' }}
                                >
                                    Got it!
                                </button>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </section>
    );
}
