// ============================================================================
// Vedic Astrology Engine — Chart Assembly
// ============================================================================
// Orchestrates the chart generation process:
// 1. Calculate all planetary positions (tropical)
// 2. Convert to sidereal using Lahiri ayanamsa
// 3. Determine sign, house, nakshatra for each planet
// 4. Determine exaltation/debilitation status
// 5. Assemble the final ChartResult
// ============================================================================

import { ChartResult, PlanetPlacement, AscendantInfo, ZodiacSign } from './types';
import { ZODIAC_SIGNS, PLANETS } from './constants';
import { calculateAllPositions, tropicalToSidereal, isPlanetRetrograde } from './astronomy';
import { getNakshatra } from './nakshatra';
import { calculateHouses, getHouseNumber } from './houses';

/**
 * Get zodiac sign info from a sidereal longitude.
 */
function getSignFromLongitude(siderealLongitude: number): ZodiacSign {
    const signIndex = Math.floor(siderealLongitude / 30) % 12;
    return ZODIAC_SIGNS[signIndex];
}

/**
 * Get degree within the sign (0-30) from sidereal longitude.
 */
function getDegreeInSign(siderealLongitude: number): number {
    return siderealLongitude % 30;
}

/**
 * Check if a planet is exalted at a given sidereal longitude.
 * Uses a ±5° orb around the exact exaltation degree.
 */
function isExalted(planetId: string, siderealLongitude: number): boolean {
    const planetData = PLANETS.find(p => p.id === planetId);
    if (!planetData) return false;

    const signIndex = Math.floor(siderealLongitude / 30) % 12;
    if (signIndex !== planetData.exaltationSign) return false;

    // Check if within orb of exaltation degree
    let diff = Math.abs(siderealLongitude - planetData.exaltationDegree);
    if (diff > 180) diff = 360 - diff;
    return diff <= 10; // Generous orb for sign-based evaluation
}

/**
 * Check if a planet is debilitated at a given sidereal longitude.
 * Uses a ±5° orb around the exact debilitation degree.
 */
function isDebilitated(planetId: string, siderealLongitude: number): boolean {
    const planetData = PLANETS.find(p => p.id === planetId);
    if (!planetData) return false;

    const signIndex = Math.floor(siderealLongitude / 30) % 12;
    if (signIndex !== planetData.debilitationSign) return false;

    let diff = Math.abs(siderealLongitude - planetData.debilitationDegree);
    if (diff > 180) diff = 360 - diff;
    return diff <= 10;
}

/**
 * Generate the complete birth chart.
 * This is the main chart assembly function that brings together all
 * astronomical calculations into a structured chart result.
 * 
 * @param jd - Julian Day Number (in UT)
 * @param latitude - Observer's latitude
 * @param longitude - Observer's longitude
 * @returns Complete ChartResult with planets, houses, and ascendant
 */
export function generateChart(
    jd: number,
    latitude: number,
    longitude: number
): ChartResult {
    // Step 1: Get all tropical planetary positions
    const tropicalPositions = calculateAllPositions(jd, latitude, longitude);

    // Step 2: Convert ascendant to sidereal
    const ascSidereal = tropicalToSidereal(tropicalPositions.ascendant, jd);
    const ascSign = getSignFromLongitude(ascSidereal);
    const ascNakshatra = getNakshatra(ascSidereal);
    const ascendantSignIndex = ascSign.index;

    const ascendant: AscendantInfo = {
        sign: ascSign,
        degree: getDegreeInSign(ascSidereal),
        nakshatra: ascNakshatra,
        longitude: ascSidereal,
    };

    // Step 3: Calculate sidereal positions for all planets
    const planetPlacements: PlanetPlacement[] = PLANETS.map(planetData => {
        const tropicalLon = tropicalPositions[planetData.id as keyof typeof tropicalPositions] as number;
        const siderealLon = tropicalToSidereal(tropicalLon, jd);
        const sign = getSignFromLongitude(siderealLon);
        const house = getHouseNumber(sign.index, ascendantSignIndex);
        const nakshatra = getNakshatra(siderealLon);
        const retrograde = isPlanetRetrograde(planetData.id, jd);

        return {
            id: planetData.id,
            name: planetData.name,
            sanskrit: planetData.sanskrit,
            longitude: siderealLon,
            sign,
            house,
            degreeInSign: getDegreeInSign(siderealLon),
            nakshatra,
            isRetrograde: retrograde,
            isExalted: isExalted(planetData.id, siderealLon),
            isDebilitated: isDebilitated(planetData.id, siderealLon),
        };
    });

    // Step 4: Calculate houses (with planets mapped)
    const houses = calculateHouses(ascendantSignIndex, planetPlacements);

    // Step 5: Identify Moon sign and Sun sign
    const moonPlacement = planetPlacements.find(p => p.id === 'moon')!;
    const sunPlacement = planetPlacements.find(p => p.id === 'sun')!;

    return {
        ascendant,
        moonSign: moonPlacement.sign,
        sunSign: sunPlacement.sign,
        planets: planetPlacements,
        houses,
    };
}
