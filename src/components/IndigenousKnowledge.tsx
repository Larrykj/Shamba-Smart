"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { BadgeCheck, Leaf, Wind, Bug, Flower2, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';

interface Observation {
    _id: string;
    indicatorType: string;
    description: string;
    location: { coordinates: number[] };
    dateObserved: string;
    validations: any[];
}

const sampleObservations = [
    {
        _id: 'sample1',
        indicatorType: 'Bird Behavior',
        description: 'Large flocks of swallows flying very low over the fields near Kericho. Elders say this signals heavy rains within 3-4 days.',
        dateObserved: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        location: { coordinates: [35.2863, -0.3689] },
        validations: Array(18).fill({ userId: 'x' }),
        author: 'John Kiprop',
        county: 'Kericho'
    },
    {
        _id: 'sample2',
        indicatorType: 'Plant Flowering',
        description: 'Acacia trees showing early flowering in Machakos region, about 2 weeks earlier than usual. Traditional knowledge suggests short rains may come early this year.',
        dateObserved: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        location: { coordinates: [37.2634, -1.5177] },
        validations: Array(24).fill({ userId: 'x' }),
        author: 'Mary Mutua',
        county: 'Machakos'
    },
    {
        _id: 'sample3',
        indicatorType: 'Insect Migration',
        description: 'Safari ants moving to higher ground in large numbers observed in Muranga. This typically indicates flooding rains coming within a week.',
        dateObserved: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        location: { coordinates: [37.1502, -0.7839] },
        validations: Array(31).fill({ userId: 'x' }),
        author: 'Peter Mwangi',
        county: 'Muranga'
    }
];

const getIcon = (type: string) => {
    switch (type) {
        case 'Bird Behavior': return <Eye size={18} />;
        case 'Plant Flowering': return <Flower2 size={18} />;
        case 'Wind Pattern': return <Wind size={18} />;
        case 'Insect Migration': return <Bug size={18} />;
        default: return <Leaf size={18} />;
    }
};

export default function IndigenousKnowledge() {
    const [observations, setObservations] = useState<any[]>(sampleObservations);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        indicatorType: 'Bird Behavior',
        description: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [validatedIds, setValidatedIds] = useState<Set<string>>(new Set());

    const handleValidate = (obsId: string) => {
        if (validatedIds.has(obsId)) return;
        setValidatedIds(prev => new Set(prev).add(obsId));
        setObservations(prev => prev.map(obs => {
            if (obs._id === obsId) {
                return { ...obs, validations: [...(obs.validations || []), { userId: 'current' }] };
            }
            return obs;
        }));
    };

    useEffect(() => {
        const fetchObservations = async () => {
            try {
                const res = await axios.get('/api/observations');
                if (res.data && res.data.length > 0) {
                    setObservations([...res.data, ...sampleObservations.slice(0, 2)]);
                }
            } catch (err) {
                // Keep sample data on error
            }
        };
        fetchObservations();
    }, []);

    const handleSubmit = async () => {
        if (!form.description) return;
        setSubmitting(true);
        try {
            await axios.post('/api/observations', form);
            setForm({ ...form, description: '' });
            // Add to local state immediately
            setObservations(prev => [{
                _id: 'new-' + Date.now(),
                ...form,
                dateObserved: new Date().toISOString(),
                validations: [],
                author: 'You',
                county: 'Your Location'
            }, ...prev]);
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section id="community" style={{ padding: '6rem 0', background: 'linear-gradient(180deg, #FFFDE7 0%, #FFFFFF 100%)' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <span className="badge" style={{ background: '#FFF8E1', color: '#E65100', marginBottom: '1rem', display: 'inline-block' }}>
                        COMMUNITY WISDOM
                    </span>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Traditional Knowledge,<br /><span className="gradient-text">Validated by Science</span></h2>
                    <p style={{ color: '#666', maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem' }}>
                        Farmers across Kenya share observations that have predicted weather for generations. We validate these with satellite data.
                    </p>
                </div>

                <div className="grid grid-2" style={{ gap: '3rem', alignItems: 'start' }}>
                    {/* Observations Feed */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.25rem', color: '#1B5E20' }}>Recent Observations</h3>
                            <span style={{ background: '#E8F5E9', color: '#2E7D32', padding: '0.4rem 1rem', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 600 }}>
                                {observations.length} reports
                            </span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {observations.slice(0, 4).map((obs, idx) => (
                                <motion.div
                                    key={obs._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    viewport={{ once: true }}
                                    style={{
                                        background: 'white',
                                        borderRadius: '16px',
                                        padding: '1.5rem',
                                        border: '1px solid rgba(0,0,0,0.06)',
                                        boxShadow: '0 4px 15px rgba(0,0,0,0.04)'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '10px',
                                                background: '#FFF8E1',
                                                color: '#F57C00',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                {getIcon(obs.indicatorType)}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, color: '#1B5E20' }}>{obs.indicatorType}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#888' }}>
                                                    {(obs as any).author || 'Anonymous'} • {(obs as any).county || 'Kenya'}
                                                </div>
                                            </div>
                                        </div>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            color: '#888',
                                            background: '#F5F5F5',
                                            padding: '4px 10px',
                                            borderRadius: '6px'
                                        }}>
                                            {formatDistanceToNow(new Date(obs.dateObserved))} ago
                                        </span>
                                    </div>

                                    <p style={{ color: '#444', lineHeight: 1.6, marginBottom: '1rem', fontSize: '0.95rem' }}>
                                        "{obs.description}"
                                    </p>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #f0f0f0' }}>
                                        <button
                                            onClick={() => handleValidate(obs._id)}
                                            disabled={validatedIds.has(obs._id)}
                                            style={{
                                                background: validatedIds.has(obs._id) ? '#C8E6C9' : '#E8F5E9',
                                                border: 'none',
                                                padding: '0.5rem 1rem',
                                                borderRadius: '8px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                cursor: validatedIds.has(obs._id) ? 'default' : 'pointer',
                                                color: '#2E7D32',
                                                fontWeight: 600,
                                                fontSize: '0.85rem'
                                            }}>
                                            <BadgeCheck size={16} /> {validatedIds.has(obs._id) ? 'Validated ✓' : 'Validate'}
                                        </button>
                                        <span style={{ fontSize: '0.85rem', color: '#666', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <span style={{ fontWeight: 700, color: '#2E7D32' }}>{obs.validations?.length || 0}</span> farmers confirmed
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Report Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{
                            background: 'linear-gradient(135deg, #1B5E20, #2E7D32)',
                            borderRadius: '24px',
                            padding: '2.5rem',
                            color: 'white',
                            position: 'sticky',
                            top: '100px'
                        }}
                    >
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Share Your Observation</h3>
                        <p style={{ opacity: 0.8, marginBottom: '2rem' }}>
                            Help the community by reporting traditional weather indicators you observe.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, opacity: 0.9 }}>
                                    INDICATOR TYPE
                                </label>
                                <select
                                    value={form.indicatorType}
                                    onChange={(e) => setForm({ ...form, indicatorType: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        borderRadius: '12px',
                                        border: 'none',
                                        background: 'rgba(255,255,255,0.15)',
                                        color: 'white',
                                        fontSize: '1rem'
                                    }}
                                >
                                    <option value="Bird Behavior" style={{ color: '#333' }}>🐦 Bird Behavior</option>
                                    <option value="Plant Flowering" style={{ color: '#333' }}>🌸 Plant Flowering</option>
                                    <option value="Wind Pattern" style={{ color: '#333' }}>💨 Wind Pattern</option>
                                    <option value="Insect Migration" style={{ color: '#333' }}>🐜 Insect Migration</option>
                                    <option value="Other" style={{ color: '#333' }}>📝 Other</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, opacity: 0.9 }}>
                                    WHAT DID YOU OBSERVE?
                                </label>
                                <textarea
                                    rows={4}
                                    placeholder="Describe what you saw and what it traditionally means..."
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        borderRadius: '12px',
                                        border: 'none',
                                        background: 'rgba(255,255,255,0.15)',
                                        color: 'white',
                                        fontSize: '1rem',
                                        resize: 'none'
                                    }}
                                />
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={submitting || !form.description}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: '#FFB300',
                                    color: '#1B5E20',
                                    fontWeight: 700,
                                    fontSize: '1rem',
                                    cursor: submitting || !form.description ? 'not-allowed' : 'pointer',
                                    opacity: submitting || !form.description ? 0.7 : 1
                                }}
                            >
                                {submitting ? 'Submitting...' : 'Submit Observation'}
                            </button>

                            <p style={{ fontSize: '0.8rem', textAlign: 'center', opacity: 0.7 }}>
                                🔒 Your observation helps farmers in your region make better decisions.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
