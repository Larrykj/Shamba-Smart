import axios from 'axios';

export async function getWeatherData(lat: number, lon: number) {
    try {
        const response = await axios.get(`https://api.open-meteo.com/v1/forecast`, {
            params: {
                latitude: lat,
                longitude: lon,
                daily: 'precipitation_sum,temperature_2m_max,temperature_2m_min,rain_sum',
                timezone: 'Africa/Nairobi',
                forecast_days: 14
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}

/**
 * Placeholder for CHIRPS historical analysis
 * In a real app, this would query a processed CHIRPS dataset in MongoDB or GEE
 */
export async function getHistoricalInsights(lat: number, lon: number) {
    // Simulating historical data processing
    // Dynamic logic based on current date
    const currentMonth = new Date().getMonth(); // 0-11
    const longRainsStart = new Date().getFullYear() + (currentMonth > 5 ? 1 : 0) + '-03-15';

    return {
        typicalRainySeasonStart: 'March 15 (Long Rains)',
        typicalRainySeasonEnd: 'June 10',
        probabilityOfDrought: currentMonth > 9 ? 0.3 : 0.1, // Higher risk in dry months
        averageMonthlyRainfall: [80, 120, 200, 150]
    };
}
