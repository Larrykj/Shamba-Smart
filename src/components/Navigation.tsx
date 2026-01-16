"use client";

import { Leaf, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navigation() {
    const [mobileOpen, setMobileOpen] = useState(false);

    const navLinks = [
        { label: 'Features', href: '#features' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Market Prices', href: '#market' },
        { label: 'About', href: '#about' },
    ];

    const scrollTo = (id: string) => {
        const el = document.getElementById(id.replace('#', ''));
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        setMobileOpen(false);
    };

    return (
        <>
            <nav style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(46, 125, 50, 0.1)',
                padding: '1rem 0'
            }}>
                <div className="container" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Leaf size={32} color="#2E7D32" />
                        <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2E7D32' }}>
                            Shamba<span style={{ color: '#FFB300' }}>Smart</span>
                        </span>
                    </div>

                    {/* Desktop Navigation */}
                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }} className="desktop-nav">
                        {navLinks.map((link, i) => (
                            <a
                                key={i}
                                onClick={() => scrollTo(link.href)}
                                style={{
                                    textDecoration: 'none',
                                    color: '#1B5E20',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    transition: 'color 0.3s'
                                }}
                            >
                                {link.label}
                            </a>
                        ))}
                        <button
                            onClick={() => scrollTo('#search-section')}
                            className="btn-primary"
                            style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}
                        >
                            Get Started
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="mobile-menu-btn"
                        style={{
                            display: 'none',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0.5rem'
                        }}
                    >
                        {mobileOpen ? <X size={28} color="#2E7D32" /> : <Menu size={28} color="#2E7D32" />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mobile-nav"
                        style={{
                            position: 'fixed',
                            top: '72px',
                            left: 0,
                            right: 0,
                            background: 'white',
                            zIndex: 99,
                            padding: '2rem',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                            display: 'none'
                        }}
                    >
                        {navLinks.map((link, i) => (
                            <a
                                key={i}
                                onClick={() => scrollTo(link.href)}
                                style={{
                                    display: 'block',
                                    padding: '1rem 0',
                                    textDecoration: 'none',
                                    color: '#1B5E20',
                                    fontWeight: 600,
                                    fontSize: '1.1rem',
                                    borderBottom: '1px solid #eee'
                                }}
                            >
                                {link.label}
                            </a>
                        ))}
                        <button
                            onClick={() => scrollTo('#search-section')}
                            className="btn-primary"
                            style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }}
                        >
                            Get Started
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Spacer for fixed nav */}
            <div style={{ height: '72px' }} />

            <style jsx global>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
          .mobile-nav { display: block !important; }
        }
      `}</style>
        </>
    );
}
