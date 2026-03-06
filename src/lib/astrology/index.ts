// ============================================================================
// Vedic Astrology Engine — Main Entry Point
// ============================================================================
// This is the public API of the astrology calculation engine.
// Call `generateChartReading(input)` to get a complete structured reading.
//
// Architecture layers:
//   Layer 1: Raw astronomical calculations (astronomy.ts, julian.ts)
//   Layer 2: Vedic astrological derivations (chart.ts, houses.ts, nakshatra.ts, dasha.ts)
//   Layer 3: Human-readable interpretation (interpretation.ts)
//   Layer 4: AI-ready context for Q&A (ai-context.ts)
// ============================================================================

import { BirthInput, AstrologyEngineResponse, AstrologyEngineError, ResolvedBirthData } from './types';
import { geocodePlace } from './geocoding';
import { calculateJulianDay } from './julian';
import { generateChart } from './chart';
import { getNakshatra } from './nakshatra';
import { calculateVimshottariDasha } from './dasha';
import { generateInterpretation } from './interpretation';
import { generateAiContext } from './ai-context';

/**
 * Validate the raw birth input from the user.
 * Throws AstrologyEngineError for invalid inputs.
 */
function validateInput(input: BirthInput): void {
    if (!input.fullName || input.fullName.trim().length === 0) {
        throw new AstrologyEngineError({
            code: 'MISSING_FIELD',
            message: 'Full name is required',
            field: 'fullName',
        });
    }

    if (!input.birthDate) {
        throw new AstrologyEngineError({
            code: 'MISSING_FIELD',
            message: 'Birth date is required',
            field: 'birthDate',
        });
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(input.birthDate)) {
        throw new AstrologyEngineError({
            code: 'INVALID_DATE',
            message: 'Birth date must be in YYYY-MM-DD format',
        });
    }

    const dateParts = input.birthDate.split('-').map(Number);
    const year = dateParts[0], month = dateParts[1], day = dateParts[2];
    if (month < 1 || month > 12 || day < 1 || day > 31 || year < 1900 || year > 2100) {
        throw new AstrologyEngineError({
            code: 'INVALID_DATE',
            message: 'Please provide a valid birth date',
        });
    }

    if (!input.birthTime) {
        throw new AstrologyEngineError({
            code: 'MISSING_FIELD',
            message: 'Birth time is required for accurate chart calculation',
            field: 'birthTime',
        });
    }

    // Validate time format (HH:MM)
    const timeRegex = /^\d{2}:\d{2}$/;
    if (!timeRegex.test(input.birthTime)) {
        throw new AstrologyEngineError({
            code: 'INVALID_TIME',
            message: 'Birth time must be in HH:MM (24-hour) format',
        });
    }

    const timeParts = input.birthTime.split(':').map(Number);
    if (timeParts[0] < 0 || timeParts[0] > 23 || timeParts[1] < 0 || timeParts[1] > 59) {
        throw new AstrologyEngineError({
            code: 'INVALID_TIME',
            message: 'Please provide a valid birth time (0-23 hours, 0-59 minutes)',
        });
    }

    if (!input.birthPlace || input.birthPlace.trim().length === 0) {
        throw new AstrologyEngineError({
            code: 'MISSING_FIELD',
            message: 'Birth place is required for chart calculation',
            field: 'birthPlace',
        });
    }
}

/**
 * Resolve birth data: geocode place, determine timezone, compute Julian Day.
 */
async function resolveBirthData(input: BirthInput): Promise<ResolvedBirthData> {
    // Geocode the birth place
    const geo = await geocodePlace(input.birthPlace);

    // Parse date and time
    const [year, month, day] = input.birthDate.split('-').map(Number);
    const [hour, minute] = input.birthTime.split(':').map(Number);

    // Convert local time to UTC using the timezone offset
    const utcHour = hour - geo.utcOffset;
    let utcDay = day;
    let utcMonth = month;
    let utcYear = year;

    // Handle day boundary crossings
    if (utcHour < 0) {
        // Previous day in UTC
        utcDay -= 1;
        if (utcDay < 1) {
            utcMonth -= 1;
            if (utcMonth < 1) {
                utcMonth = 12;
                utcYear -= 1;
            }
            utcDay = new Date(utcYear, utcMonth, 0).getDate();
        }
    } else if (utcHour >= 24) {
        // Next day in UTC
        utcDay += 1;
        const daysInMonth = new Date(utcYear, utcMonth, 0).getDate();
        if (utcDay > daysInMonth) {
            utcDay = 1;
            utcMonth += 1;
            if (utcMonth > 12) {
                utcMonth = 1;
                utcYear += 1;
            }
        }
    }

    // Calculate Julian Day Number in UT
    const adjustedUtcHour = ((utcHour % 24) + 24) % 24;
    const jd = calculateJulianDay(utcYear, utcMonth, utcDay, adjustedUtcHour, minute, 0);

    // Build date strings
    const localDate = new Date(year, month - 1, day, hour, minute);
    const utcDate = new Date(Date.UTC(utcYear, utcMonth - 1, utcDay, adjustedUtcHour, minute));

    return {
        fullName: input.fullName,
        birthDate: input.birthDate,
        birthTime: input.birthTime,
        birthPlace: input.birthPlace,
        latitude: geo.latitude,
        longitude: geo.longitude,
        timezone: geo.timezone,
        utcOffset: geo.utcOffset,
        julianDay: jd,
        localDateTime: localDate.toISOString(),
        utcDateTime: utcDate.toISOString(),
    };
}

/**
 * Generate a complete Vedic astrology reading.
 * This is the main public API of the engine.
 * 
 * @param input - Raw birth input from the user
 * @returns Complete AstrologyEngineResponse with chart, dasha, interpretation, and AI context
 * 
 * @example
 * ```typescript
 * const reading = await generateChartReading({
 *   fullName: 'Arjun Sharma',
 *   birthDate: '1990-05-15',
 *   birthTime: '14:30',
 *   birthPlace: 'Mumbai, India',
 * });
 * ```
 */
export async function generateChartReading(input: BirthInput): Promise<AstrologyEngineResponse> {
    // Step 1: Validate input
    validateInput(input);

    // Step 2: Resolve birth data (geocode, timezone, Julian Day)
    const resolved = await resolveBirthData(input);

    // Step 3: Generate birth chart
    const chart = generateChart(resolved.julianDay, resolved.latitude, resolved.longitude);

    // Step 4: Calculate Vimshottari Dasha from Moon's nakshatra
    const moonPlacement = chart.planets.find(p => p.id === 'moon')!;
    const moonNakshatra = moonPlacement.nakshatra;

    const [year, month, day] = input.birthDate.split('-').map(Number);
    const [hour, minute] = input.birthTime.split(':').map(Number);
    const birthDateObj = new Date(year, month - 1, day, hour, minute);

    const dasha = calculateVimshottariDasha(moonNakshatra, birthDateObj);

    // Step 5: Generate interpretation (Layer 3)
    const interpretation = generateInterpretation(chart, dasha);

    // Step 6: Generate AI context (Layer 4)
    const aiContext = generateAiContext(chart, dasha, interpretation);

    // Step 7: Assemble final response
    return {
        inputSummary: {
            fullName: input.fullName,
            birthDate: input.birthDate,
            birthTime: input.birthTime,
            birthPlace: input.birthPlace,
            coordinates: {
                latitude: resolved.latitude,
                longitude: resolved.longitude,
            },
            timezone: resolved.timezone,
        },
        resolvedBirthData: resolved,
        chart,
        dasha,
        interpretation,
        aiContext,
        generatedAt: new Date().toISOString(),
    };
}

// Re-export key types and utilities for external use
export { AstrologyEngineError } from './types';
export type {
    BirthInput,
    AstrologyEngineResponse,
    ChartResult,
    DashaResult,
    InterpretationSummary,
    AiContext,
    PlanetPlacement,
    HousePlacement,
    DashaPeriod,
    NakshatraInfo,
    AscendantInfo,
} from './types';
export { buildLLMSystemPrompt } from './ai-context';
export { formatDashaDuration } from './dasha';
