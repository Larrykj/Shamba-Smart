import axios from 'axios';

/**
 * Get geocoded coordinates from location name using Nominatim (free OSM service)
 */
export async function geocodeLocation(locationName: string): Promise<{ lat: number; lon: number } | null> {
    try {
        const response = await axios.get('https://nominatim.openstreetmap.org/search', {
            params: {
                q: locationName + ', Kenya',
                format: 'json',
                limit: 1
            },
            headers: {
                'User-Agent': 'Shamba-Smart/1.0'
            }
        });

        if (response.data && response.data.length > 0) {
            return {
                lat: parseFloat(response.data[0].lat),
                lon: parseFloat(response.data[0].lon)
            };
        }
        return null;
    } catch (error) {
        console.error('Geocoding error:', error);
        return null;
    }
}
