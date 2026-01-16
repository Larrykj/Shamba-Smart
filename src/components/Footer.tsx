"use client";

import { Leaf, Twitter, Linkedin, Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
        e.preventDefault();
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const productLinks = [
        { name: 'Planting Calendar', href: '#search-section' },
        { name: 'Market Prices', href: '#market' },
        { name: 'Weather Forecasts', href: '#features' },
        { name: 'Crop Recommendations', href: '#search-section' },
        { name: 'USSD Service', href: '#ussd' },
        { name: 'Mobile App', href: '#features' }
    ];

    const companyLinks = [
        { name: 'About Us', href: '#about' },
        { name: 'Careers', href: '#about' },
        { name: 'Press Kit', href: '#about' },
        { name: 'Blog', href: '#features' },
        { name: 'Partners', href: '#partners' },
        { name: 'Contact', href: '#contact' }
    ];

    const socialLinks = [
        { Icon: Twitter, href: 'https://twitter.com/shambasmart', label: 'Twitter' },
        { Icon: Facebook, href: 'https://facebook.com/shambasmart', label: 'Facebook' },
        { Icon: Linkedin, href: 'https://linkedin.com/company/shambasmart', label: 'LinkedIn' },
        { Icon: Instagram, href: 'https://instagram.com/shambasmart', label: 'Instagram' }
    ];

    const legalLinks = [
        { name: 'Privacy Policy', href: '#privacy' },
        { name: 'Terms of Service', href: '#terms' },
        { name: 'Cookie Policy', href: '#cookies' }
    ];

    return (
        <footer id="contact" style={{ background: '#0D3A0D', color: 'white', paddingTop: '5rem' }}>
            <div className="container">
                <div className="grid grid-4" style={{ gap: '3rem', marginBottom: '4rem' }}>
                    {/* Brand */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                            <Leaf size={28} color="#81C784" />
                            <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                                Shamba<span style={{ color: '#FFB300' }}>Smart</span>
                            </span>
                        </div>
                        <p style={{ opacity: 0.7, lineHeight: 1.7, marginBottom: '1.5rem' }}>
                            Empowering African farmers with data-driven insights, traditional wisdom, and modern technology.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            {socialLinks.map(({ Icon, href, label }, i) => (
                                <a
                                    key={i}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '10px',
                                        background: 'rgba(255,255,255,0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.3s',
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                >
                                    <Icon size={18} color="white" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Product */}
                    <div>
                        <h4 style={{ color: '#81C784', marginBottom: '1.5rem', fontWeight: 700 }}>Product</h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {productLinks.map((item, i) => (
                                <li key={i}>
                                    <a
                                        href={item.href}
                                        onClick={(e) => scrollToSection(e, item.href.replace('#', ''))}
                                        style={{
                                            color: 'rgba(255,255,255,0.7)',
                                            textDecoration: 'none',
                                            transition: 'color 0.3s',
                                            cursor: 'pointer'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
                                        onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                                    >
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 style={{ color: '#81C784', marginBottom: '1.5rem', fontWeight: 700 }}>Company</h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {companyLinks.map((item, i) => (
                                <li key={i}>
                                    <a
                                        href={item.href}
                                        onClick={(e) => scrollToSection(e, item.href.replace('#', ''))}
                                        style={{
                                            color: 'rgba(255,255,255,0.7)',
                                            textDecoration: 'none',
                                            transition: 'color 0.3s',
                                            cursor: 'pointer'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
                                        onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                                    >
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 style={{ color: '#81C784', marginBottom: '1.5rem', fontWeight: 700 }}>Contact</h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                                <MapPin size={18} style={{ marginTop: '2px', flexShrink: 0 }} color="#81C784" />
                                <a
                                    href="https://maps.google.com/?q=Westlands,Nairobi,Kenya"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        opacity: 0.7,
                                        color: 'white',
                                        textDecoration: 'none',
                                        transition: 'opacity 0.3s',
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
                                >
                                    Westlands, Nairobi<br />Kenya
                                </a>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Phone size={18} color="#81C784" />
                                <a
                                    href="tel:+254700123456"
                                    style={{
                                        opacity: 0.7,
                                        color: 'white',
                                        textDecoration: 'none',
                                        transition: 'opacity 0.3s',
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
                                >
                                    +254 700 123 456
                                </a>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Mail size={18} color="#81C784" />
                                <a
                                    href="mailto:hello@shambasmart.co.ke"
                                    style={{
                                        opacity: 0.7,
                                        color: 'white',
                                        textDecoration: 'none',
                                        transition: 'opacity 0.3s',
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
                                >
                                    hello@shambasmart.co.ke
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    padding: '2rem 0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}>
                    <p style={{ opacity: 0.5, fontSize: '0.9rem' }}>
                        © {currentYear} Shamba Smart. All rights reserved.
                    </p>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                        {legalLinks.map((item, i) => (
                            <a
                                key={i}
                                href={item.href}
                                onClick={(e) => {
                                    e.preventDefault();
                                    alert(`${item.name} page coming soon!`);
                                }}
                                style={{
                                    color: 'rgba(255,255,255,0.5)',
                                    textDecoration: 'none',
                                    fontSize: '0.9rem',
                                    transition: 'color 0.3s',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}
                                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
                            >
                                {item.name}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
