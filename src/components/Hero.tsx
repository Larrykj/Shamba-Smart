"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play, X } from 'lucide-react';
import { useState } from 'react';

export default function Hero() {
    const [showVideo, setShowVideo] = useState(false);

    return (
        <section style={{
            padding: '10rem 0 8rem',
            background: 'linear-gradient(135deg, #0D3A0D 0%, #1B5E20 40%, #2E7D32 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Animated background elements */}
            <div style={{
                position: 'absolute',
                top: '10%',
                right: '5%',
                width: '400px',
                height: '400px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(129,199,132,0.2) 0%, transparent 70%)',
                animation: 'pulse 4s ease-in-out infinite'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-20%',
                left: '-10%',
                width: '500px',
                height: '500px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(76,175,80,0.15) 0%, transparent 70%)',
            }} />

            {/* Wave SVG */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '120px',
                background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1440 320\'%3E%3Cpath fill=\'%23F1F8E9\' fill-opacity=\'1\' d=\'M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,181.3C672,192,768,160,864,138.7C960,117,1056,107,1152,122.7C1248,139,1344,181,1392,202.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z\'%3E%3C/path%3E%3C/svg%3E")',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                zIndex: 2
            }} />

            <div className="container" style={{ position: 'relative', zIndex: 3 }}>
                <div className="grid grid-2" style={{ alignItems: 'center', gap: '4rem' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            background: 'rgba(255,255,255,0.15)',
                            backdropFilter: 'blur(4px)',
                            padding: '0.5rem 1rem 0.5rem 0.5rem',
                            borderRadius: '99px',
                            marginBottom: '2rem'
                        }}>
                            <span style={{
                                background: '#FFB300',
                                color: '#1B5E20',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '99px',
                                fontSize: '0.75rem',
                                fontWeight: 700
                            }}>NEW</span>
                            <span style={{ fontSize: '0.9rem' }}>AI-powered yield predictions now live</span>
                        </div>

                        <h1 style={{
                            fontSize: '4.5rem',
                            color: 'white',
                            marginBottom: '1.5rem',
                            lineHeight: 1.1,
                            fontWeight: 800,
                            letterSpacing: '-0.02em'
                        }}>
                            Farming Smarter,<br />
                            <span style={{
                                background: 'linear-gradient(90deg, #FFB300, #FF8F00)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}>Harvesting Better.</span>
                        </h1>

                        <p style={{ fontSize: '1.3rem', opacity: 0.9, marginBottom: '2.5rem', lineHeight: 1.6, maxWidth: '550px' }}>
                            Data-driven planting windows. Real-time market prices. Indigenous wisdom validated by science. All in one platform.
                        </p>

                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <button
                                onClick={() => document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' })}
                                className="btn-primary"
                                style={{
                                    background: '#FFB300',
                                    color: '#1B5E20',
                                    fontSize: '1.1rem',
                                    padding: '1rem 2rem'
                                }}
                            >
                                Try Free Now <ArrowRight size={20} />
                            </button>
                            <button
                                onClick={() => setShowVideo(true)}
                                className="btn-secondary"
                                style={{
                                    background: 'transparent',
                                    border: '2px solid rgba(255,255,255,0.5)',
                                    color: 'white',
                                    padding: '1rem 2rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <Play size={18} fill="white" /> Watch Demo
                            </button>
                        </div>

                        <div style={{ marginTop: '3rem', display: 'flex', gap: '3rem' }}>
                            <div>
                                <div style={{ fontSize: '2rem', fontWeight: 800 }}>12,847+</div>
                                <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>Active Farmers</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '2rem', fontWeight: 800 }}>87%</div>
                                <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>Accuracy Rate</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '2rem', fontWeight: 800 }}>47</div>
                                <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>Counties</div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        style={{
                            background: 'rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: '24px',
                            padding: '2rem',
                            border: '1px solid rgba(255,255,255,0.2)'
                        }}
                    >
                        <div style={{
                            background: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            marginBottom: '1.5rem'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <span style={{ color: '#1B5E20', fontWeight: 700 }}>Today&apos;s Conditions</span>
                                <span style={{ background: '#2E7D32', color: 'white', padding: '4px 12px', borderRadius: '8px', fontSize: '0.8rem' }}>Nakuru</span>
                            </div>
                            <div style={{ display: 'flex', gap: '2rem', color: '#1B5E20' }}>
                                <div>
                                    <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>24°C</div>
                                    <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>Temperature</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>68%</div>
                                    <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>Humidity</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>12mm</div>
                                    <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>Rain Expected</div>
                                </div>
                            </div>
                        </div>

                        <div style={{ background: 'rgba(255,179,0,0.2)', borderRadius: '12px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ background: '#FFB300', borderRadius: '10px', padding: '0.75rem', color: '#1B5E20' }}>
                                <ArrowRight size={20} />
                            </div>
                            <div>
                                <div style={{ fontWeight: 600 }}>Optimal Planting Window</div>
                                <div style={{ opacity: 0.8, fontSize: '0.9rem' }}>Plant maize within the next 5 days</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Video Modal */}
            <AnimatePresence>
                {showVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0,0,0,0.9)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1000,
                            padding: '2rem'
                        }}
                        onClick={() => setShowVideo(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            style={{
                                background: '#111',
                                borderRadius: '16px',
                                padding: '2rem',
                                maxWidth: '800px',
                                width: '100%',
                                position: 'relative'
                            }}
                            onClick={e => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setShowVideo(false)}
                                style={{
                                    position: 'absolute',
                                    top: '-40px',
                                    right: '0',
                                    background: 'none',
                                    border: 'none',
                                    color: 'white',
                                    cursor: 'pointer',
                                    padding: '0.5rem'
                                }}
                            >
                                <X size={28} />
                            </button>

                            <div style={{
                                background: 'linear-gradient(135deg, #1B5E20, #2E7D32)',
                                borderRadius: '12px',
                                padding: '4rem 2rem',
                                textAlign: 'center'
                            }}>
                                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌾</div>
                                <h3 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.5rem' }}>
                                    Shamba Smart Demo
                                </h3>
                                <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '2rem' }}>
                                    See how Shamba Smart helps farmers make better decisions with AI-powered insights.
                                </p>

                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                                    <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px', minWidth: '150px' }}>
                                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📍</div>
                                        <div style={{ color: 'white', fontWeight: 600 }}>Select Location</div>
                                    </div>
                                    <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px', minWidth: '150px' }}>
                                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌱</div>
                                        <div style={{ color: 'white', fontWeight: 600 }}>Choose Crop</div>
                                    </div>
                                    <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px', minWidth: '150px' }}>
                                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
                                        <div style={{ color: 'white', fontWeight: 600 }}>Get Analysis</div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        setShowVideo(false);
                                        document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="btn-primary"
                                    style={{
                                        marginTop: '2rem',
                                        background: '#FFB300',
                                        color: '#1B5E20'
                                    }}
                                >
                                    Try It Now <ArrowRight size={18} />
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
      `}</style>
        </section>
    );
}
