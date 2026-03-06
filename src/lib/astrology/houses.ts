// ============================================================================
// Vedic Astrology Engine — House System
// ============================================================================
// Implements the Whole Sign House system, the traditional house system
// used in Vedic/Jyotish astrology. In this system, the entire sign
// containing the ascendant becomes the 1st house, the next sign becomes
// the 2nd house, and so on.
// ============================================================================

import { HousePlacement, PlanetPlacement, ZodiacSign } from './types';
import { ZODIAC_SIGNS } from './constants';

/**
 * Calculate houses using the Whole Sign system.
 * The sign of the ascendant becomes house 1, the next sign becomes house 2, etc.
 * 
 * @param ascendantSignIndex - The zodiac sign index of the ascendant (0-11)
 * @param planets - Array of planet placements (to map planets to houses)
 * @returns Array of 12 HousePlacement objects
 */
export function calculateHouses(
    ascendantSignIndex: number,
    planets: PlanetPlacement[]
): HousePlacement[] {
    const houses: HousePlacement[] = [];

    for (let i = 0; i < 12; i++) {
        const signIndex = (ascendantSignIndex + i) % 12;
        const sign = ZODIAC_SIGNS[signIndex];

        // Find planets in this house
        const planetsInHouse = planets
            .filter(p => p.house === i + 1)
            .map(p => p.name);

        houses.push({
            house: i + 1,
            sign,
            ruler: sign.ruler,
            planets: planetsInHouse,
        });
    }

    return houses;
}

/**
 * Determine which house a planet occupies based on its sign and the ascendant.
 * In Whole Sign houses, the house = (planet's sign index - ascendant sign index) + 1
 * 
 * @param planetSignIndex - The zodiac sign index of the planet (0-11)
 * @param ascendantSignIndex - The zodiac sign index of the ascendant (0-11)
 * @returns House number (1-12)
 */
export function getHouseNumber(planetSignIndex: number, ascendantSignIndex: number): number {
    let house = ((planetSignIndex - ascendantSignIndex + 12) % 12) + 1;
    return house;
}

/**
 * Get the sign for a given house number.
 * 
 * @param houseNumber - House number (1-12)
 * @param ascendantSignIndex - Ascendant sign index (0-11)
 * @returns ZodiacSign for that house
 */
export function getHouseSign(houseNumber: number, ascendantSignIndex: number): ZodiacSign {
    const signIndex = (ascendantSignIndex + houseNumber - 1) % 12;
    return ZODIAC_SIGNS[signIndex];
}
