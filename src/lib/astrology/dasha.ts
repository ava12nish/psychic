// ============================================================================
// Vedic Astrology Engine — Vimshottari Dasha Calculations
// ============================================================================
// Implements the Vimshottari Dasha system, the most widely used dasha
// system in Vedic astrology. It's a 120-year planetary period system
// based on the Moon's nakshatra at birth.
//
// How it works:
// 1. Find Moon's nakshatra at birth
// 2. The nakshatra lord determines the starting Mahadasha
// 3. The position within the nakshatra determines how much of the
//    first dasha has already elapsed at birth
// 4. Sub-periods (Antardasha) follow the same sequence within each Mahadasha
// ============================================================================

import { DashaPeriod, DashaResult, NakshatraInfo } from './types';
import { VIMSHOTTARI_SEQUENCE, DASHA_YEARS, VIMSHOTTARI_TOTAL_YEARS, PLANET_SANSKRIT, NAKSHATRA_SPAN } from './constants';

/**
 * Calculate the dasha balance at birth.
 * This is the remaining duration of the first Mahadasha period,
 * based on how far the Moon has traversed through its nakshatra.
 * 
 * @param moonNakshatra - The Moon's nakshatra info at birth
 * @returns Remaining years of the first dasha period
 */
export function calculateDashaBalance(moonNakshatra: NakshatraInfo): number {
    const lord = moonNakshatra.lord;
    const totalYears = DASHA_YEARS[lord];

    if (!totalYears) {
        throw new Error(`Unknown dasha lord: ${lord}`);
    }

    // How far through the nakshatra is the Moon? (0 to 1)
    const proportionTraversed = moonNakshatra.degree / NAKSHATRA_SPAN;

    // Remaining proportion of the dasha = what's left of the nakshatra
    const remainingProportion = 1 - proportionTraversed;

    return totalYears * remainingProportion;
}

/**
 * Get the index of a planet lord in the Vimshottari sequence.
 */
function getSequenceIndex(lord: string): number {
    return VIMSHOTTARI_SEQUENCE.findIndex(d => d.lord === lord);
}

/**
 * Add years (as decimal) to a Date.
 */
function addYears(date: Date, years: number): Date {
    const msPerYear = 365.25 * 24 * 60 * 60 * 1000;
    return new Date(date.getTime() + years * msPerYear);
}

/**
 * Calculate the complete Vimshottari Mahadasha timeline.
 * 
 * @param moonNakshatra - Moon's nakshatra at birth
 * @param birthDate - Birth date
 * @param referenceDate - Date for determining "current" period (defaults to now)
 * @returns Full DashaResult with timeline, current periods, etc.
 */
export function calculateVimshottariDasha(
    moonNakshatra: NakshatraInfo,
    birthDate: Date,
    referenceDate?: Date
): DashaResult {
    const now = referenceDate || new Date();
    const dashaBalance = calculateDashaBalance(moonNakshatra);
    const startLordIndex = getSequenceIndex(moonNakshatra.lord);

    if (startLordIndex === -1) {
        throw new Error(`Nakshatra lord "${moonNakshatra.lord}" not found in Vimshottari sequence`);
    }

    const mahadashas: DashaPeriod[] = [];
    let currentDate = new Date(birthDate);
    let currentMahadasha: DashaPeriod | null = null;
    let currentAntardasha: DashaPeriod | null = null;

    // Generate enough Mahadashas to cover from birth to well into the future
    // We go through the entire 120-year cycle at least twice to ensure coverage
    for (let cycle = 0; cycle < 2; cycle++) {
        for (let i = 0; i < VIMSHOTTARI_SEQUENCE.length; i++) {
            const seqIndex = (startLordIndex + i) % VIMSHOTTARI_SEQUENCE.length;
            const dashaInfo = VIMSHOTTARI_SEQUENCE[seqIndex];

            // First period of first cycle uses the balance
            let durationYears: number;
            if (cycle === 0 && i === 0) {
                durationYears = dashaBalance;
            } else {
                durationYears = dashaInfo.years;
            }

            const startDate = new Date(currentDate);
            const endDate = addYears(currentDate, durationYears);

            const isActive = now >= startDate && now < endDate;

            // Calculate Antardasha sub-periods for this Mahadasha
            const subPeriods = calculateAntardashas(
                dashaInfo.lord,
                durationYears,
                startDate,
                now
            );

            const period: DashaPeriod = {
                lord: dashaInfo.lord,
                lordSanskrit: PLANET_SANSKRIT[dashaInfo.lord] || dashaInfo.lord,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                durationYears,
                isActive,
                subPeriods,
            };

            mahadashas.push(period);

            if (isActive) {
                currentMahadasha = period;
                // Find active antardasha
                currentAntardasha = subPeriods.find(sp => sp.isActive) || subPeriods[0];
            }

            currentDate = endDate;
        }
    }

    // Fallback if somehow we didn't find current periods
    if (!currentMahadasha) {
        currentMahadasha = mahadashas[0];
    }
    if (!currentAntardasha) {
        currentAntardasha = currentMahadasha.subPeriods?.[0] || {
            lord: currentMahadasha.lord,
            lordSanskrit: currentMahadasha.lordSanskrit,
            startDate: currentMahadasha.startDate,
            endDate: currentMahadasha.endDate,
            durationYears: currentMahadasha.durationYears,
            isActive: true,
        };
    }

    return {
        system: 'Vimshottari',
        birthNakshatra: moonNakshatra,
        dashaBalance,
        mahadashas,
        currentMahadasha,
        currentAntardasha,
    };
}

/**
 * Calculate Antardasha (sub-periods) within a Mahadasha.
 * The Antardasha sequence starts from the Mahadasha lord itself
 * and follows the Vimshottari sequence.
 * Duration proportional to: (mahaLordYears × subLordYears) / 120
 * 
 * @param mahaLord - The Mahadasha lord
 * @param mahaDuration - Total duration of the Mahadasha in years
 * @param mahaStart - Start date of the Mahadasha
 * @param referenceDate - Date for determining active period
 * @returns Array of Antardasha sub-periods
 */
function calculateAntardashas(
    mahaLord: string,
    mahaDuration: number,
    mahaStart: Date,
    referenceDate: Date
): DashaPeriod[] {
    const subPeriods: DashaPeriod[] = [];
    const mahaLordIndex = getSequenceIndex(mahaLord);
    let currentDate = new Date(mahaStart);

    for (let i = 0; i < VIMSHOTTARI_SEQUENCE.length; i++) {
        const seqIndex = (mahaLordIndex + i) % VIMSHOTTARI_SEQUENCE.length;
        const subLord = VIMSHOTTARI_SEQUENCE[seqIndex];

        // Antardasha duration = (Mahadasha lord years × Sub lord years) / 120
        // But scaled to actual mahadasha duration
        const proportionalDuration = (mahaDuration * subLord.years) / VIMSHOTTARI_TOTAL_YEARS;

        const startDate = new Date(currentDate);
        const endDate = addYears(currentDate, proportionalDuration);
        const isActive = referenceDate >= startDate && referenceDate < endDate;

        subPeriods.push({
            lord: subLord.lord,
            lordSanskrit: PLANET_SANSKRIT[subLord.lord] || subLord.lord,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            durationYears: proportionalDuration,
            isActive,
        });

        currentDate = endDate;
    }

    return subPeriods;
}

/**
 * Format a dasha duration into a human-readable string.
 * 
 * @param years - Duration in years (decimal)
 * @returns Formatted string like "3 years, 4 months"
 */
export function formatDashaDuration(years: number): string {
    const wholeYears = Math.floor(years);
    const months = Math.round((years - wholeYears) * 12);

    if (wholeYears === 0) {
        return `${months} month${months !== 1 ? 's' : ''}`;
    }
    if (months === 0) {
        return `${wholeYears} year${wholeYears !== 1 ? 's' : ''}`;
    }
    return `${wholeYears} year${wholeYears !== 1 ? 's' : ''}, ${months} month${months !== 1 ? 's' : ''}`;
}
