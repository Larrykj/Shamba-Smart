"use client";

import { motion } from 'framer-motion';
import {
    Sprout, CloudSun, Droplets, ThermometerSun, AlertTriangle,
    CheckCircle2, Clock, Calendar, Lightbulb, Shield,
    ChevronDown, ChevronUp, Share2, Download, Bell
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ComposedChart, Line, Area } from 'recharts';
import { useState } from 'react';

interface RiskFactor {
    factor: string;
    level: 'low' | 'medium' | 'high';
    description: string;
    mitigation?: string;
}

interface Prediction {
    recommendation: string;
    status: 'good' | 'wait' | 'risk';
    details: string;
    timing?: string;
    confidence?: number;
    analysis?: {
        rainfall: {
            next7Days: number;
            next14Days: number;
            rainyDays: number;
            distribution: { date: string; value: number }[];
            verdict: string;
        };
        temperature: {
            avgMax: number;
            avgMin: number;
            average: number;
            optimalRange: { min: number; max: number };
            distribution: { date: string; max: number; min: number }[];
            verdict: string;
        };
        scores: {
            rainfall: number;
            temperature: number;
            timing: number;
            overall: number;
        };
    };
    riskFactors?: RiskFactor[];
    bestPlantingWindow?: {
        date: string;
        formattedDate: string;
        reason: string;
    };
    cropInfo?: {
        name: string;
        variety: string;
        growthDuration: number;
        plantingInstructions: string;
    } | null;
    soilPreparation?: string[];
    data?: any;
}

const CustomRainTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ background: 'white', padding: '12px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', border: '1px solid #eee' }}>
                <p style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '6px', color: '#333' }}>
                    {new Date(label).toLocaleDateString('en-KE', { weekday: 'short', month: 'short', day: 'numeric' })}
                </p>
                <p style={{ fontSize: '0.9rem', color: '#2E7D32', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Droplets size={14} /> {payload[0].value.toFixed(1)}mm rainfall
                </p>
            </div>
        );
    }
    return null;
};

const CustomTempTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ background: 'white', padding: '12px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', border: '1px solid #eee' }}>
                <p style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '6px', color: '#333' }}>
                    {new Date(label).toLocaleDateString('en-KE', { weekday: 'short', month: 'short', day: 'numeric' })}
                </p>
                <p style={{ fontSize: '0.85rem', color: '#E65100' }}>High: {payload[0]?.value}°C</p>
                <p style={{ fontSize: '0.85rem', color: '#1976D2' }}>Low: {payload[1]?.value}°C</p>
            </div>
        );
    }
    return null;
};

const ScoreGauge = ({ score, label }: { score: number; label: string }) => {
    const getColor = (s: number) => s >= 70 ? '#2E7D32' : s >= 50 ? '#F9A825' : '#C62828';
    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                background: `conic-gradient(${getColor(score)} ${score * 3.6}deg, #E0E0E0 0deg)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto'
            }}>
                <div style={{
                    width: '55px',
                    height: '55px',
                    borderRadius: '50%',
                    background: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    color: getColor(score)
                }}>
                    {score}
                </div>
            </div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#666' }}>{label}</div>
        </div>
    );
};

export default function PredictionResult({ prediction }: { prediction: Prediction | null }) {
    const [expandedSection, setExpandedSection] = useState<string | null>('recommendation');
    const [alertSet, setAlertSet] = useState(false);

    if (!prediction) return null;

    // Handle both old and new API response formats
    const hasAnalysis = prediction.analysis && prediction.analysis.scores;
    const confidence = prediction.confidence || (hasAnalysis ? prediction.analysis!.scores.overall : 75);

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    const handleShare = async () => {
        const shareText = `${prediction.recommendation}\n\n${prediction.details}\n\nGet your own prediction at Shamba Smart!`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Planting Recommendation - Shamba Smart',
                    text: shareText,
                });
            } catch (err) {
                // User cancelled or error
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(shareText);
            alert('Recommendation copied to clipboard!');
        }
    };

    const handleDownload = () => {
        const reportContent = `
SHAMBA SMART - PLANTING REPORT
Generated: ${new Date().toLocaleDateString('en-KE', { dateStyle: 'full' })}
=====================================

RECOMMENDATION: ${prediction.recommendation}
CONFIDENCE: ${confidence}%
STATUS: ${prediction.status.toUpperCase()}

DETAILS:
${prediction.details}

${prediction.timing ? `TIMING: ${prediction.timing}` : ''}

${hasAnalysis ? `
RAINFALL ANALYSIS:
- Next 7 Days: ${prediction.analysis!.rainfall.next7Days}mm
- Next 14 Days: ${prediction.analysis!.rainfall.next14Days}mm
- Rainy Days: ${prediction.analysis!.rainfall.rainyDays}

TEMPERATURE ANALYSIS:
- Average: ${prediction.analysis!.temperature.average}°C
- High: ${prediction.analysis!.temperature.avgMax}°C
- Low: ${prediction.analysis!.temperature.avgMin}°C
` : ''}

${prediction.riskFactors && prediction.riskFactors.length > 0 ? `
RISK FACTORS:
${prediction.riskFactors.map(r => `- ${r.factor} (${r.level}): ${r.description}`).join('\n')}
` : ''}

${prediction.soilPreparation ? `
SOIL PREPARATION TIPS:
${prediction.soilPreparation.map(t => `- ${t}`).join('\n')}
` : ''}

---
Report generated by Shamba Smart
www.shambasmart.co.ke
    `.trim();

        const blob = new Blob([reportContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `shamba-smart-report-${new Date().toISOString().split('T')[0]}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleSetAlert = () => {
        setAlertSet(true);
        // In production, this would call an API to register SMS alerts
        setTimeout(() => {
            alert('📱 Weather alert set! You will receive SMS updates for this location.');
        }, 300);
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'good': return { bg: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)', color: '#1B5E20', icon: <CheckCircle2 size={28} /> };
            case 'wait': return { bg: 'linear-gradient(135deg, #FFF8E1, #FFECB3)', color: '#E65100', icon: <Clock size={28} /> };
            case 'risk': return { bg: 'linear-gradient(135deg, #FFEBEE, #FFCDD2)', color: '#C62828', icon: <AlertTriangle size={28} /> };
            default: return { bg: '#F5F5F5', color: '#666', icon: <CloudSun size={28} /> };
        }
    };

    const style = getStatusStyle(prediction.status);

    const getRiskColor = (level: string) => {
        switch (level) {
            case 'high': return { bg: '#FFEBEE', border: '#FFCDD2', text: '#C62828' };
            case 'medium': return { bg: '#FFF8E1', border: '#FFECB3', text: '#E65100' };
            default: return { bg: '#E3F2FD', border: '#BBDEFB', text: '#1565C0' };
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ marginTop: '2.5rem' }}
        >
            {/* Main Recommendation Card */}
            <div style={{
                background: style.bg,
                borderRadius: '20px',
                padding: '2rem',
                marginBottom: '1.5rem'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
                    <div style={{ flex: 1, minWidth: '280px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '16px',
                                background: style.color,
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {style.icon}
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.4rem', color: style.color, marginBottom: '0.25rem' }}>
                                    {prediction.recommendation}
                                </h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{
                                        background: 'rgba(255,255,255,0.5)',
                                        padding: '4px 12px',
                                        borderRadius: '99px',
                                        fontSize: '0.8rem',
                                        fontWeight: 600,
                                        color: style.color
                                    }}>
                                        {confidence}% Confidence
                                    </span>
                                </div>
                            </div>
                        </div>
                        <p style={{ color: '#444', lineHeight: 1.7, marginBottom: '1rem' }}>{prediction.details}</p>

                        {prediction.timing && (
                            <div style={{
                                background: 'rgba(255,255,255,0.6)',
                                padding: '1rem',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                marginBottom: '1rem'
                            }}>
                                <Calendar size={20} color={style.color} />
                                <div>
                                    <div style={{ fontWeight: 600, color: style.color }}>{prediction.timing}</div>
                                    {prediction.bestPlantingWindow && (
                                        <div style={{ fontSize: '0.85rem', color: '#666' }}>
                                            Best day: <strong>{prediction.bestPlantingWindow.formattedDate}</strong>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                            <button
                                onClick={handleShare}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.6rem 1rem',
                                    borderRadius: '10px',
                                    border: '1px solid rgba(0,0,0,0.1)',
                                    background: 'white',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    fontSize: '0.85rem',
                                    color: '#555'
                                }}
                            >
                                <Share2 size={16} /> Share
                            </button>
                            <button
                                onClick={handleDownload}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.6rem 1rem',
                                    borderRadius: '10px',
                                    border: '1px solid rgba(0,0,0,0.1)',
                                    background: 'white',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    fontSize: '0.85rem',
                                    color: '#555'
                                }}
                            >
                                <Download size={16} /> Download Report
                            </button>
                            <button
                                onClick={handleSetAlert}
                                disabled={alertSet}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.6rem 1rem',
                                    borderRadius: '10px',
                                    border: 'none',
                                    background: alertSet ? '#81C784' : '#2E7D32',
                                    color: 'white',
                                    cursor: alertSet ? 'default' : 'pointer',
                                    fontWeight: 600,
                                    fontSize: '0.85rem'
                                }}
                            >
                                <Bell size={16} /> {alertSet ? 'Alert Set ✓' : 'Set Weather Alert'}
                            </button>
                        </div>
                    </div>

                    {/* Score Gauges */}
                    {hasAnalysis && (
                        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                            <ScoreGauge score={prediction.analysis!.scores.rainfall} label="Rainfall" />
                            <ScoreGauge score={prediction.analysis!.scores.temperature} label="Temp" />
                            <ScoreGauge score={prediction.analysis!.scores.overall} label="Overall" />
                        </div>
                    )}
                </div>
            </div>

            {/* Expandable Sections - Only show if we have analysis data */}
            {hasAnalysis && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {/* Rainfall Analysis */}
                    <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E0E0E0', overflow: 'hidden' }}>
                        <button
                            onClick={() => toggleSection('rainfall')}
                            style={{
                                width: '100%',
                                padding: '1.25rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <Droplets size={24} color="#2E7D32" />
                                <div style={{ textAlign: 'left' }}>
                                    <div style={{ fontWeight: 600, color: '#333' }}>Rainfall Analysis</div>
                                    <div style={{ fontSize: '0.85rem', color: '#888' }}>
                                        {prediction.analysis!.rainfall.next14Days}mm over 14 days • {prediction.analysis!.rainfall.verdict}
                                    </div>
                                </div>
                            </div>
                            {expandedSection === 'rainfall' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>

                        {expandedSection === 'rainfall' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                style={{ padding: '0 1.25rem 1.5rem' }}
                            >
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <div style={{ background: '#E8F5E9', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#2E7D32' }}>{prediction.analysis!.rainfall.next7Days}mm</div>
                                        <div style={{ fontSize: '0.8rem', color: '#558B2F' }}>Next 7 Days</div>
                                    </div>
                                    <div style={{ background: '#E8F5E9', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#2E7D32' }}>{prediction.analysis!.rainfall.next14Days}mm</div>
                                        <div style={{ fontSize: '0.8rem', color: '#558B2F' }}>Next 14 Days</div>
                                    </div>
                                    <div style={{ background: '#E8F5E9', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#2E7D32' }}>{prediction.analysis!.rainfall.rainyDays}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#558B2F' }}>Rainy Days</div>
                                    </div>
                                </div>

                                <div style={{ height: '180px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={prediction.analysis!.rainfall.distribution}>
                                            <XAxis
                                                dataKey="date"
                                                tickFormatter={(val) => new Date(val).getDate().toString()}
                                                tick={{ fontSize: 11, fill: '#888' }}
                                                axisLine={false}
                                                tickLine={false}
                                            />
                                            <YAxis hide />
                                            <Tooltip content={<CustomRainTooltip />} />
                                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                                {prediction.analysis!.rainfall.distribution.map((entry, index) => (
                                                    <Cell key={index} fill={entry.value > 5 ? '#2E7D32' : entry.value > 2 ? '#81C784' : '#C8E6C9'} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Temperature Analysis */}
                    <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E0E0E0', overflow: 'hidden' }}>
                        <button
                            onClick={() => toggleSection('temperature')}
                            style={{
                                width: '100%',
                                padding: '1.25rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <ThermometerSun size={24} color="#E65100" />
                                <div style={{ textAlign: 'left' }}>
                                    <div style={{ fontWeight: 600, color: '#333' }}>Temperature Analysis</div>
                                    <div style={{ fontSize: '0.85rem', color: '#888' }}>
                                        Avg {prediction.analysis!.temperature.average}°C • {prediction.analysis!.temperature.verdict}
                                    </div>
                                </div>
                            </div>
                            {expandedSection === 'temperature' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>

                        {expandedSection === 'temperature' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                style={{ padding: '0 1.25rem 1.5rem' }}
                            >
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <div style={{ background: '#FFF3E0', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#E65100' }}>{prediction.analysis!.temperature.avgMax}°C</div>
                                        <div style={{ fontSize: '0.8rem', color: '#FB8C00' }}>Avg High</div>
                                    </div>
                                    <div style={{ background: '#E3F2FD', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1565C0' }}>{prediction.analysis!.temperature.avgMin}°C</div>
                                        <div style={{ fontSize: '0.8rem', color: '#1976D2' }}>Avg Low</div>
                                    </div>
                                    <div style={{ background: '#E8F5E9', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#2E7D32' }}>{prediction.analysis!.temperature.average}°C</div>
                                        <div style={{ fontSize: '0.8rem', color: '#558B2F' }}>Average</div>
                                    </div>
                                </div>

                                <div style={{ height: '180px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <ComposedChart data={prediction.analysis!.temperature.distribution}>
                                            <XAxis
                                                dataKey="date"
                                                tickFormatter={(val) => new Date(val).getDate().toString()}
                                                tick={{ fontSize: 11, fill: '#888' }}
                                                axisLine={false}
                                                tickLine={false}
                                            />
                                            <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                                            <Tooltip content={<CustomTempTooltip />} />
                                            <Area type="monotone" dataKey="max" fill="#FFCCBC" stroke="transparent" />
                                            <Line type="monotone" dataKey="max" stroke="#E65100" strokeWidth={2} dot={false} />
                                            <Line type="monotone" dataKey="min" stroke="#1976D2" strokeWidth={2} dot={false} />
                                        </ComposedChart>
                                    </ResponsiveContainer>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Risk Factors */}
                    {prediction.riskFactors && prediction.riskFactors.length > 0 && (
                        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E0E0E0', overflow: 'hidden' }}>
                            <button
                                onClick={() => toggleSection('risks')}
                                style={{
                                    width: '100%',
                                    padding: '1.25rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <Shield size={24} color="#C62828" />
                                    <div style={{ textAlign: 'left' }}>
                                        <div style={{ fontWeight: 600, color: '#333' }}>Risk Factors</div>
                                        <div style={{ fontSize: '0.85rem', color: '#888' }}>
                                            {prediction.riskFactors.length} potential {prediction.riskFactors.length === 1 ? 'risk' : 'risks'} identified
                                        </div>
                                    </div>
                                </div>
                                {expandedSection === 'risks' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>

                            {expandedSection === 'risks' && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    style={{ padding: '0 1.25rem 1.5rem' }}
                                >
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {prediction.riskFactors.map((risk, i) => {
                                            const riskStyle = getRiskColor(risk.level);
                                            return (
                                                <div
                                                    key={i}
                                                    style={{
                                                        background: riskStyle.bg,
                                                        border: `1px solid ${riskStyle.border}`,
                                                        borderRadius: '12px',
                                                        padding: '1rem'
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                                        <div style={{ fontWeight: 600, color: riskStyle.text }}>{risk.factor}</div>
                                                        <span style={{
                                                            background: riskStyle.text,
                                                            color: 'white',
                                                            padding: '2px 8px',
                                                            borderRadius: '4px',
                                                            fontSize: '0.7rem',
                                                            fontWeight: 700,
                                                            textTransform: 'uppercase'
                                                        }}>
                                                            {risk.level}
                                                        </span>
                                                    </div>
                                                    <p style={{ fontSize: '0.9rem', color: '#555', marginBottom: '0.75rem' }}>{risk.description}</p>
                                                    {risk.mitigation && (
                                                        <div style={{
                                                            background: 'rgba(255,255,255,0.5)',
                                                            padding: '0.75rem',
                                                            borderRadius: '8px',
                                                            fontSize: '0.85rem',
                                                            display: 'flex',
                                                            alignItems: 'flex-start',
                                                            gap: '0.5rem'
                                                        }}>
                                                            <Lightbulb size={16} color="#FB8C00" style={{ marginTop: '2px', flexShrink: 0 }} />
                                                            <span style={{ color: '#555' }}><strong>Mitigation:</strong> {risk.mitigation}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    )}

                    {/* Soil Preparation Tips */}
                    {prediction.soilPreparation && prediction.soilPreparation.length > 0 && (
                        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E0E0E0', overflow: 'hidden' }}>
                            <button
                                onClick={() => toggleSection('tips')}
                                style={{
                                    width: '100%',
                                    padding: '1.25rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <Sprout size={24} color="#558B2F" />
                                    <div style={{ textAlign: 'left' }}>
                                        <div style={{ fontWeight: 600, color: '#333' }}>Agronomist Tips</div>
                                        <div style={{ fontSize: '0.85rem', color: '#888' }}>
                                            Soil preparation & best practices
                                        </div>
                                    </div>
                                </div>
                                {expandedSection === 'tips' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>

                            {expandedSection === 'tips' && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    style={{ padding: '0 1.25rem 1.5rem' }}
                                >
                                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        {prediction.soilPreparation.map((tip, i) => (
                                            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                                                <CheckCircle2 size={18} color="#2E7D32" style={{ marginTop: '2px', flexShrink: 0 }} />
                                                <span style={{ color: '#444', lineHeight: 1.5 }}>{tip}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {prediction.cropInfo && (
                                        <div style={{
                                            marginTop: '1.5rem',
                                            padding: '1rem',
                                            background: '#F1F8E9',
                                            borderRadius: '12px',
                                            border: '1px solid #C8E6C9'
                                        }}>
                                            <div style={{ fontWeight: 600, color: '#2E7D32', marginBottom: '0.5rem' }}>
                                                {prediction.cropInfo.name} Planting Guide
                                            </div>
                                            <p style={{ fontSize: '0.9rem', color: '#555', lineHeight: 1.6 }}>
                                                {prediction.cropInfo.plantingInstructions}
                                            </p>
                                            <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#666' }}>
                                                Growth duration: <strong>{prediction.cropInfo.growthDuration} days</strong>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    );
}
