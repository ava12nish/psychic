// ============================================================================
// Vedic Astrology Engine — Nakshatra Calculations
// ============================================================================
// Determines the nakshatra (lunar mansion) for any given sidereal longitude.
// Each nakshatra spans 13°20' (13.3333°) and has 4 padas of 3°20' each.
// ============================================================================

import { NakshatraInfo } from './types';
import { NAKSHATRAS, NAKSHATRA_SPAN, PADA_SPAN } from './constants';

/**
 * Calculate the nakshatra for a given sidereal longitude.
 * 
 * @param siderealLongitude - Sidereal longitude in degrees (0-360)
 * @returns NakshatraInfo with name, lord, pada, and degree within nakshatra
 */
export function getNakshatra(siderealLongitude: number): NakshatraInfo {
    // Normalize longitude to 0-360
    const lon = ((siderealLongitude % 360) + 360) % 360;

    // Which nakshatra? (0-26)
    const nakshatraIndex = Math.floor(lon / NAKSHATRA_SPAN);
    const safeIndex = Math.min(nakshatraIndex, 26);

    const nakshatra = NAKSHATRAS[safeIndex];

    // Degree within this nakshatra (0 to 13.3333)
    const degreeInNakshatra = lon - nakshatra.startDegree;

    // Which pada? (1-4)
    const pada = Math.min(Math.floor(degreeInNakshatra / PADA_SPAN) + 1, 4);

    return {
        index: safeIndex,
        name: nakshatra.name,
        lord: nakshatra.lord,
        pada,
        degree: degreeInNakshatra,
        startDegree: nakshatra.startDegree,
    };
}

/**
 * Get the nakshatra lord's index in the Vimshottari sequence.
 * Used for dasha calculations.
 * 
 * @param nakshatraIndex - Index of the nakshatra (0-26)
 * @returns The nakshatra lord name (planet ruling this nakshatra)
 */
export function getNakshatraLord(nakshatraIndex: number): string {
    return NAKSHATRAS[nakshatraIndex].lord;
}
