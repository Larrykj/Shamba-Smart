"use client";

import { useState } from 'react';
import { Phone, RefreshCcw, Smartphone } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function UssdSimulator() {
    const [screenText, setScreenText] = useState('');
    const [input, setInput] = useState('');
    const [sessionText, setSessionText] = useState('');
    const [active, setActive] = useState(false);
    const [loading, setLoading] = useState(false);

    const startSession = async () => {
        setActive(true);
        setLoading(true);
        setSessionText('');
        await sendRequest('');
    };

    const sendRequest = async (currentInput: string) => {
        try {
            let nextText = currentInput;
            if (sessionText) {
                nextText = sessionText + '*' + currentInput;
            }
            if (currentInput === '' && !sessionText) nextText = '';

            const body = new URLSearchParams();
            body.append('phoneNumber', '+254712345678');
            body.append('sessionId', 'simulated-session-id');
            body.append('serviceCode', '*384*1300#');
            body.append('text', nextText);

            const res = await axios.post('/api/ussd', body);
            const responseData = res.data;

            if (responseData.startsWith('CON ')) {
                setScreenText(responseData.replace('CON ', ''));
                if (nextText) setSessionText(nextText);
            } else if (responseData.startsWith('END ')) {
                setScreenText(responseData.replace('END ', ''));
                setSessionText('');
                setActive(false);
            }
        } catch (error) {
            setScreenText("Network Error");
        } finally {
            setLoading(false);
            setInput('');
        }
    };

    const handleSend = () => {
        if (!input) return;
        setLoading(true);
        sendRequest(input);
    };

    const resetSimulator = () => {
        setActive(false);
        setScreenText('');
        setSessionText('');
        setInput('');
    };

    const sessionEnded = !active && screenText;

    return (
        <section style={{ padding: '6rem 0', background: 'linear-gradient(135deg, #263238 0%, #37474F 100%)' }}>
            <div className="container">
                <div className="grid grid-2" style={{ alignItems: 'center', gap: '4rem' }}>

                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <span style={{
                            background: 'rgba(129, 199, 132, 0.2)',
                            color: '#81C784',
                            padding: '0.5rem 1rem',
                            borderRadius: '99px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            display: 'inline-block',
                            marginBottom: '1.5rem'
                        }}>
                            INCLUSIVE BY DESIGN
                        </span>

                        <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'white', lineHeight: 1.2 }}>
                            Works on <span style={{ color: '#FFB300' }}>Every Phone</span>
                        </h2>

                        <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '2rem', fontSize: '1.1rem', lineHeight: 1.7 }}>
                            Not everyone has a smartphone. That's why Shamba Smart works via USSD and SMS on any basic phone.
                            No internet required.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
                            {[
                                { label: 'USSD Code', value: '*384*1300#', desc: 'Dial from any phone' },
                                { label: 'SMS Number', value: '22334', desc: 'Text "MAIZE NAKURU"' },
                                { label: 'WhatsApp', value: '+254 700 123 456', desc: 'Coming soon' },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    style={{
                                        background: 'rgba(255,255,255,0.05)',
                                        borderRadius: '12px',
                                        padding: '1rem 1.25rem',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        border: '1px solid rgba(255,255,255,0.1)'
                                    }}
                                >
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                            {item.label}
                                        </div>
                                        <div style={{ color: '#81C784', fontWeight: 700, fontSize: '1.25rem' }}>{item.value}</div>
                                    </div>
                                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>{item.desc}</div>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div
                                        key={i}
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            background: `hsl(${150 + i * 30}, 70%, 40%)`,
                                            border: '3px solid #263238',
                                            marginLeft: i > 1 ? '-12px' : 0,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontSize: '0.75rem',
                                            fontWeight: 700
                                        }}
                                    >
                                        {i === 5 ? '+' : ''}
                                    </div>
                                ))}
                            </div>
                            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                                <strong style={{ color: 'white' }}>4,200+</strong> farmers use USSD daily
                            </div>
                        </div>
                    </motion.div>

                    {/* Phone Simulator */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        style={{ display: 'flex', justifyContent: 'center' }}
                    >
                        <div style={{
                            width: '320px',
                            background: '#111',
                            borderRadius: '45px',
                            padding: '12px',
                            boxShadow: '0 30px 60px -15px rgba(0,0,0,0.5)',
                            position: 'relative'
                        }}>
                            {/* Phone notch */}
                            <div style={{
                                position: 'absolute',
                                top: '12px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '100px',
                                height: '30px',
                                background: '#111',
                                borderRadius: '0 0 20px 20px',
                                zIndex: 10
                            }} />

                            {/* Screen */}
                            <div style={{
                                background: 'linear-gradient(180deg, #b0bec5 0%, #cfd8dc 100%)',
                                height: '550px',
                                borderRadius: '35px',
                                position: 'relative',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                {/* Status bar */}
                                <div style={{
                                    padding: '2rem 1.5rem 1rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    fontSize: '0.8rem',
                                    color: '#333'
                                }}>
                                    <span>Safaricom KE</span>
                                    <span>{new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>

                                {/* USSD Content */}
                                <div style={{ flex: 1, padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column' }}>
                                    {!active && !screenText ? (
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                                            <Smartphone size={48} color="#546E7A" style={{ marginBottom: '1rem' }} />
                                            <p style={{ color: '#455A64', marginBottom: '1rem', fontWeight: 500 }}>Try Shamba Smart USSD</p>
                                            <p style={{ color: '#78909C', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Dial *384*1300# to start</p>
                                            <button
                                                onClick={startSession}
                                                style={{
                                                    background: '#2E7D32',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '1rem 2rem',
                                                    borderRadius: '12px',
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem'
                                                }}
                                            >
                                                <Phone size={18} /> Dial Now
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div style={{
                                                background: 'white',
                                                borderRadius: '12px',
                                                padding: '1rem',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                                fontFamily: 'monospace',
                                                fontSize: '0.95rem',
                                                whiteSpace: 'pre-wrap',
                                                lineHeight: 1.5,
                                                color: '#333'
                                            }}>
                                                {loading ? 'Processing...' : screenText}
                                            </div>

                                            {active && (
                                                <div style={{ marginTop: '1rem' }}>
                                                    <input
                                                        type="text"
                                                        value={input}
                                                        onChange={(e) => setInput(e.target.value)}
                                                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                                        placeholder="Enter reply..."
                                                        style={{
                                                            width: '100%',
                                                            padding: '0.75rem 1rem',
                                                            borderRadius: '10px',
                                                            border: '1px solid #B0BEC5',
                                                            fontFamily: 'monospace',
                                                            fontSize: '1rem',
                                                            marginBottom: '0.5rem'
                                                        }}
                                                    />
                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                        <button
                                                            onClick={handleSend}
                                                            style={{
                                                                flex: 1,
                                                                background: '#2E7D32',
                                                                color: 'white',
                                                                border: 'none',
                                                                padding: '0.75rem',
                                                                borderRadius: '10px',
                                                                fontWeight: 600,
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            Send
                                                        </button>
                                                        <button
                                                            onClick={resetSimulator}
                                                            style={{
                                                                background: '#C62828',
                                                                color: 'white',
                                                                border: 'none',
                                                                padding: '0.75rem',
                                                                borderRadius: '10px',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {sessionEnded && (
                                                <button
                                                    onClick={resetSimulator}
                                                    style={{
                                                        marginTop: '1rem',
                                                        background: 'transparent',
                                                        border: '1px solid #78909C',
                                                        padding: '0.75rem',
                                                        borderRadius: '10px',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '0.5rem',
                                                        color: '#455A64'
                                                    }}
                                                >
                                                    <RefreshCcw size={16} /> Dial Again
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
