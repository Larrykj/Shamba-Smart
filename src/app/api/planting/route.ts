import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Crop from '@/models/Crop';
import { getWeatherData, getHistoricalInsights } from '@/lib/weather';

interface RiskFactor {
    factor: string;
    level: 'low' | 'medium' | 'high';
    description: string;
    mitigation?: string;
}

interface PlantingRecommendation {
    action: string;
    confidence: number;
    timing: string;
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { lat, lon, cropName } = await req.json();

        if (!lat || !lon || !cropName) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        // 1. Get Crop Data
        const crop = await Crop.findOne({ name: { $regex: new RegExp(cropName, 'i') } });

        // 2. Get Weather & Climate Data
        const weather = await getWeatherData(lat, lon);
        const history = await getHistoricalInsights(lat, lon);

        if (!weather) {
            return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 });
        }

        const forecast = weather.daily;

        // ========== COMPREHENSIVE ANALYSIS ==========

        // Rainfall Analysis
        const next7DaysRain = forecast.precipitation_sum.slice(0, 7).reduce((a: number, b: number) => a + b, 0);
        const next14DaysRain = forecast.precipitation_sum.reduce((a: number, b: number) => a + b, 0);
        const maxDailyRain = Math.max(...forecast.precipitation_sum);
        const rainyDays = forecast.precipitation_sum.filter((r: number) => r > 2).length;
        const drySpellRisk = forecast.precipitation_sum.slice(0, 7).filter((r: number) => r < 1).length >= 5;

        // Temperature Analysis
        const avgMaxTemp = forecast.temperature_2m_max.reduce((a: number, b: number) => a + b, 0) / forecast.temperature_2m_max.length;
        const avgMinTemp = forecast.temperature_2m_min.reduce((a: number, b: number) => a + b, 0) / forecast.temperature_2m_min.length;
        const avgTemp = (avgMaxTemp + avgMinTemp) / 2;
        const tempVariation = avgMaxTemp - avgMinTemp;
        const frostRisk = Math.min(...forecast.temperature_2m_min) < 5;
        const heatStressRisk = Math.max(...forecast.temperature_2m_max) > 35;

        // Crop-specific thresholds (defaults if crop not in DB)
        const optimalRain = crop?.optimalRainfallMm || { min: 400, max: 800 };
        const optimalTemp = crop?.optimalTempC || { min: 15, max: 30 };
        const growthDays = crop?.growthDurationDays || 120;

        // Scoring System (0-100)
        let rainfallScore = 0;
        if (next14DaysRain >= 30 && next14DaysRain <= 100) {
            rainfallScore = 90;
        } else if (next14DaysRain >= 20 && next14DaysRain < 30) {
            rainfallScore = 70;
        } else if (next14DaysRain >= 10 && next14DaysRain < 20) {
            rainfallScore = 50;
        } else if (next14DaysRain > 100) {
            rainfallScore = 60; // Too much rain can be problematic
        } else {
            rainfallScore = 30;
        }

        let temperatureScore = 0;
        if (avgTemp >= optimalTemp.min && avgTemp <= optimalTemp.max) {
            temperatureScore = 90;
        } else if (avgTemp >= optimalTemp.min - 5 && avgTemp <= optimalTemp.max + 5) {
            temperatureScore = 70;
        } else {
            temperatureScore = 40;
        }

        // Timing score based on consistency
        const timingScore = rainyDays >= 5 ? 85 : rainyDays >= 3 ? 70 : 50;

        // Overall confidence
        const overallScore = Math.round((rainfallScore * 0.45) + (temperatureScore * 0.35) + (timingScore * 0.20));

        // Risk Factors
        const riskFactors: RiskFactor[] = [];

        if (drySpellRisk) {
            riskFactors.push({
                factor: 'Dry Spell Risk',
                level: 'high',
                description: 'Less than 2mm rainfall expected in 5+ of the next 7 days',
                mitigation: 'Consider mulching to retain soil moisture or delay planting by 1 week'
            });
        }

        if (frostRisk) {
            riskFactors.push({
                factor: 'Frost Risk',
                level: 'high',
                description: `Minimum temperature of ${Math.min(...forecast.temperature_2m_min).toFixed(1)}°C expected`,
                mitigation: 'Delay planting until frost risk passes or use protective covers'
            });
        }

        if (heatStressRisk) {
            riskFactors.push({
                factor: 'Heat Stress',
                level: 'medium',
                description: `Maximum temperature of ${Math.max(...forecast.temperature_2m_max).toFixed(1)}°C expected`,
                mitigation: 'Ensure adequate irrigation and plant during cooler morning hours'
            });
        }

        if (maxDailyRain > 30) {
            riskFactors.push({
                factor: 'Heavy Rainfall',
                level: 'medium',
                description: `Up to ${maxDailyRain.toFixed(1)}mm expected in a single day`,
                mitigation: 'Ensure good drainage. Avoid planting on slopes prone to erosion'
            });
        }

        if (next14DaysRain < 15) {
            riskFactors.push({
                factor: 'Insufficient Moisture',
                level: 'high',
                description: `Only ${next14DaysRain.toFixed(1)}mm expected in 14 days`,
                mitigation: 'Wait for better conditions or ensure irrigation is available'
            });
        }

        if (tempVariation > 15) {
            riskFactors.push({
                factor: 'Temperature Fluctuation',
                level: 'low',
                description: `${tempVariation.toFixed(1)}°C difference between day and night`,
                mitigation: 'Normal for this region. Young seedlings may need protection at night'
            });
        }

        // Generate Recommendation
        let status: 'good' | 'wait' | 'risk' = 'wait';
        let recommendation = '';
        let details = '';
        let timing = '';

        if (overallScore >= 75) {
            status = 'good';
            recommendation = `Excellent conditions for planting ${cropName}!`;
            details = `Weather forecast shows ${next14DaysRain.toFixed(1)}mm of rainfall over the next 14 days with ${rainyDays} rainy days. Average temperatures of ${avgTemp.toFixed(1)}°C are within the optimal range for ${cropName} germination.`;
            timing = 'Plant within the next 3-5 days to maximize soil moisture';
        } else if (overallScore >= 55) {
            status = 'wait';
            recommendation = `Moderate conditions for ${cropName}. Consider waiting.`;
            details = `Forecast shows ${next14DaysRain.toFixed(1)}mm rainfall which is below optimal for confident germination. Temperature conditions are ${avgTemp >= optimalTemp.min && avgTemp <= optimalTemp.max ? 'favorable' : 'marginal'}.`;
            timing = 'Monitor weather for the next 5-7 days before deciding';
        } else {
            status = 'risk';
            recommendation = `Not recommended to plant ${cropName} now.`;
            details = `Current conditions pose significant risks. ${next14DaysRain < 15 ? 'Insufficient rainfall expected.' : ''} ${avgTemp < optimalTemp.min ? 'Temperatures too low.' : ''} ${avgTemp > optimalTemp.max ? 'Temperatures too high.' : ''}`;
            timing = 'Wait for improved conditions or consider alternative crops';
        }

        // Soil preparation tips based on conditions
        const soilTips = [];
        if (next7DaysRain > 20) {
            soilTips.push('Prepare seedbed 2-3 days before planting when soil is moist but not waterlogged');
        } else {
            soilTips.push('Pre-irrigate if possible, or wait for natural rainfall before planting');
        }

        if (crop?.soilTypes) {
            soilTips.push(`${cropName} grows best in ${crop.soilTypes.join(' or ')} soils`);
        }

        soilTips.push('Apply well-decomposed manure to improve water retention');
        soilTips.push('Consider making water harvesting furrows to capture rainfall');

        // Best planting window analysis
        let bestPlantingDay = 0;
        let bestScore = 0;
        for (let i = 0; i < 7; i++) {
            const dayRain = forecast.precipitation_sum[i] + (forecast.precipitation_sum[i + 1] || 0);
            const dayTemp = (forecast.temperature_2m_max[i] + forecast.temperature_2m_min[i]) / 2;
            const dayScore = (dayRain > 5 ? 50 : dayRain * 10) + (dayTemp >= optimalTemp.min && dayTemp <= optimalTemp.max ? 50 : 25);
            if (dayScore > bestScore) {
                bestScore = dayScore;
                bestPlantingDay = i;
            }
        }

        const bestDate = new Date();
        bestDate.setDate(bestDate.getDate() + bestPlantingDay);

        return NextResponse.json({
            recommendation,
            status,
            details,
            timing,
            confidence: overallScore,
            analysis: {
                rainfall: {
                    next7Days: Math.round(next7DaysRain * 10) / 10,
                    next14Days: Math.round(next14DaysRain * 10) / 10,
                    rainyDays,
                    distribution: forecast.precipitation_sum.map((v: number, i: number) => ({
                        date: forecast.time[i],
                        value: Math.round(v * 10) / 10
                    })),
                    verdict: rainfallScore >= 70 ? 'Favorable' : rainfallScore >= 50 ? 'Marginal' : 'Insufficient'
                },
                temperature: {
                    avgMax: Math.round(avgMaxTemp * 10) / 10,
                    avgMin: Math.round(avgMinTemp * 10) / 10,
                    average: Math.round(avgTemp * 10) / 10,
                    optimalRange: optimalTemp,
                    distribution: forecast.temperature_2m_max.map((v: number, i: number) => ({
                        date: forecast.time[i],
                        max: Math.round(v * 10) / 10,
                        min: Math.round(forecast.temperature_2m_min[i] * 10) / 10
                    })),
                    verdict: temperatureScore >= 70 ? 'Optimal' : temperatureScore >= 50 ? 'Acceptable' : 'Challenging'
                },
                scores: {
                    rainfall: rainfallScore,
                    temperature: temperatureScore,
                    timing: timingScore,
                    overall: overallScore
                }
            },
            riskFactors,
            bestPlantingWindow: {
                date: forecast.time[bestPlantingDay],
                formattedDate: bestDate.toLocaleDateString('en-KE', { weekday: 'long', month: 'short', day: 'numeric' }),
                reason: `Best combination of moisture (${forecast.precipitation_sum[bestPlantingDay].toFixed(1)}mm) and temperature (${((forecast.temperature_2m_max[bestPlantingDay] + forecast.temperature_2m_min[bestPlantingDay]) / 2).toFixed(1)}°C)`
            },
            cropInfo: crop ? {
                name: crop.name,
                variety: crop.variety,
                growthDuration: crop.growthDurationDays,
                optimalConditions: {
                    rainfall: crop.optimalRainfallMm,
                    temperature: crop.optimalTempC
                },
                soilTypes: crop.soilTypes,
                plantingInstructions: crop.plantingInstructions
            } : null,
            soilPreparation: soilTips,
            historicalContext: {
                typicalRainySeasonStart: history.typicalRainySeasonStart,
                typicalRainySeasonEnd: history.typicalRainySeasonEnd,
                droughtProbability: `${(history.probabilityOfDrought * 100).toFixed(0)}%`
            },
            data: {
                forecast: weather.daily,
                history
            }
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
