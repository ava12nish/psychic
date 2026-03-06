// ============================================================================
// Vedic Astrology Engine — Geocoding Service
// ============================================================================
// Resolves a place name string into latitude, longitude, and timezone.
// Uses OpenStreetMap Nominatim API (free, no API key required).
// Wrapped in a provider interface for easy swapping to Google Maps, etc.
// ============================================================================

import { AstrologyEngineError, GeocodingResult } from './types';

/** Geocoding provider interface — implement this to swap providers */
export interface GeocodingProvider {
    geocode(place: string): Promise<GeocodingResult>;
}

// ---------------------------------------------------------------------------
// Timezone lookup from coordinates
// ---------------------------------------------------------------------------
// Uses a simplified approach: we calculate UTC offset from longitude
// and map to a reasonable IANA timezone. For production, use a timezone
// API like Google Time Zone API or TimeZoneDB.
// ---------------------------------------------------------------------------

/** Common timezone mappings for major regions */
const TIMEZONE_OFFSETS: Record<string, { tz: string; offset: number }[]> = {
    'India': [{ tz: 'Asia/Kolkata', offset: 5.5 }],
    'United States': [
        { tz: 'America/New_York', offset: -5 },
        { tz: 'America/Chicago', offset: -6 },
        { tz: 'America/Denver', offset: -7 },
        { tz: 'America/Los_Angeles', offset: -8 },
    ],
    'United Kingdom': [{ tz: 'Europe/London', offset: 0 }],
    'Canada': [
        { tz: 'America/Toronto', offset: -5 },
        { tz: 'America/Vancouver', offset: -8 },
    ],
    'Australia': [
        { tz: 'Australia/Sydney', offset: 10 },
        { tz: 'Australia/Perth', offset: 8 },
    ],
};

/**
 * Estimates timezone from coordinates using longitude-based heuristic.
 * For production, replace with a proper timezone API.
 */
function estimateTimezone(lat: number, lng: number, country?: string): { timezone: string; offset: number } {
    // Check known country mappings first
    if (country) {
        for (const [key, tzList] of Object.entries(TIMEZONE_OFFSETS)) {
            if (country.toLowerCase().includes(key.toLowerCase())) {
                if (tzList.length === 1) return { timezone: tzList[0].tz, offset: tzList[0].offset };
                // For multi-timezone countries, use longitude to pick the best match
                const estimatedOffset = Math.round(lng / 15);
                const closest = tzList.reduce((best, tz) =>
                    Math.abs(tz.offset - estimatedOffset) < Math.abs(best.offset - estimatedOffset) ? tz : best
                );
                return { timezone: closest.tz, offset: closest.offset };
            }
        }
    }

    // Fallback: estimate from longitude
    // Each 15° of longitude ≈ 1 hour offset from UTC
    const rawOffset = lng / 15;
    const roundedOffset = Math.round(rawOffset * 2) / 2; // Round to nearest 0.5h

    // India special case (most Vedic astrology users)
    if (lat >= 8 && lat <= 37 && lng >= 68 && lng <= 97) {
        return { timezone: 'Asia/Kolkata', offset: 5.5 };
    }

    // Map to common timezone
    const tzMappings: { offset: number; tz: string }[] = [
        { offset: -8, tz: 'America/Los_Angeles' },
        { offset: -7, tz: 'America/Denver' },
        { offset: -6, tz: 'America/Chicago' },
        { offset: -5, tz: 'America/New_York' },
        { offset: -4, tz: 'America/Halifax' },
        { offset: -3, tz: 'America/Sao_Paulo' },
        { offset: 0, tz: 'Europe/London' },
        { offset: 1, tz: 'Europe/Paris' },
        { offset: 2, tz: 'Europe/Athens' },
        { offset: 3, tz: 'Asia/Baghdad' },
        { offset: 4, tz: 'Asia/Dubai' },
        { offset: 5, tz: 'Asia/Karachi' },
        { offset: 5.5, tz: 'Asia/Kolkata' },
        { offset: 6, tz: 'Asia/Dhaka' },
        { offset: 7, tz: 'Asia/Bangkok' },
        { offset: 8, tz: 'Asia/Shanghai' },
        { offset: 9, tz: 'Asia/Tokyo' },
        { offset: 10, tz: 'Australia/Sydney' },
        { offset: 12, tz: 'Pacific/Auckland' },
    ];

    const best = tzMappings.reduce((closest, tz) =>
        Math.abs(tz.offset - roundedOffset) < Math.abs(closest.offset - roundedOffset) ? tz : closest
    );

    return { timezone: best.tz, offset: best.offset };
}

// ---------------------------------------------------------------------------
// OpenStreetMap Nominatim Geocoding Provider
// ---------------------------------------------------------------------------

export class NominatimGeocodingProvider implements GeocodingProvider {
    private baseUrl = 'https://nominatim.openstreetmap.org/search';

    async geocode(place: string): Promise<GeocodingResult> {
        try {
            const params = new URLSearchParams({
                q: place,
                format: 'json',
                limit: '1',
                addressdetails: '1',
            });

            const response = await fetch(`${this.baseUrl}?${params}`, {
                headers: {
                    'User-Agent': 'Psychic-Astrology-App/1.0',
                },
            });

            if (!response.ok) {
                throw new AstrologyEngineError({
                    code: 'GEOCODING_FAILED',
                    message: `Geocoding service returned status ${response.status}`,
                });
            }

            const results = await response.json();

            if (!results || results.length === 0) {
                throw new AstrologyEngineError({
                    code: 'GEOCODING_FAILED',
                    message: `Could not find location: "${place}". Please try a more specific location name.`,
                });
            }

            const result = results[0];
            const lat = parseFloat(result.lat);
            const lng = parseFloat(result.lon);
            const country = result.address?.country || '';
            const displayName = result.display_name || place;

            const { timezone, offset } = estimateTimezone(lat, lng, country);

            return {
                latitude: lat,
                longitude: lng,
                displayName,
                timezone,
                utcOffset: offset,
            };
        } catch (error) {
            if (error instanceof AstrologyEngineError) throw error;
            throw new AstrologyEngineError({
                code: 'GEOCODING_FAILED',
                message: `Failed to geocode "${place}": ${error instanceof Error ? error.message : 'Unknown error'}`,
            });
        }
    }
}

// ---------------------------------------------------------------------------
// Default geocoding instance
// ---------------------------------------------------------------------------
let geocodingProvider: GeocodingProvider = new NominatimGeocodingProvider();

export function setGeocodingProvider(provider: GeocodingProvider): void {
    geocodingProvider = provider;
}

export function getGeocodingProvider(): GeocodingProvider {
    return geocodingProvider;
}

export async function geocodePlace(place: string): Promise<GeocodingResult> {
    return geocodingProvider.geocode(place);
}
