// ============================================================================
// Vedic Astrology Engine — Constants
// ============================================================================
// All Vedic astrology reference data: zodiac signs, nakshatras, planets,
// Vimshottari dasha sequence, exaltation/debilitation degrees, etc.
// ============================================================================

import { ZodiacSign } from './types';

// ---------------------------------------------------------------------------
// Zodiac Signs (Sidereal / Vedic)
// ---------------------------------------------------------------------------
export const ZODIAC_SIGNS: ZodiacSign[] = [
    { index: 0, name: 'Aries', sanskrit: 'Mesha', ruler: 'Mars', element: 'Fire', quality: 'Cardinal' },
    { index: 1, name: 'Taurus', sanskrit: 'Vrishabha', ruler: 'Venus', element: 'Earth', quality: 'Fixed' },
    { index: 2, name: 'Gemini', sanskrit: 'Mithuna', ruler: 'Mercury', element: 'Air', quality: 'Mutable' },
    { index: 3, name: 'Cancer', sanskrit: 'Karka', ruler: 'Moon', element: 'Water', quality: 'Cardinal' },
    { index: 4, name: 'Leo', sanskrit: 'Simha', ruler: 'Sun', element: 'Fire', quality: 'Fixed' },
    { index: 5, name: 'Virgo', sanskrit: 'Kanya', ruler: 'Mercury', element: 'Earth', quality: 'Mutable' },
    { index: 6, name: 'Libra', sanskrit: 'Tula', ruler: 'Venus', element: 'Air', quality: 'Cardinal' },
    { index: 7, name: 'Scorpio', sanskrit: 'Vrishchika', ruler: 'Mars', element: 'Water', quality: 'Fixed' },
    { index: 8, name: 'Sagittarius', sanskrit: 'Dhanu', ruler: 'Jupiter', element: 'Fire', quality: 'Mutable' },
    { index: 9, name: 'Capricorn', sanskrit: 'Makara', ruler: 'Saturn', element: 'Earth', quality: 'Cardinal' },
    { index: 10, name: 'Aquarius', sanskrit: 'Kumbha', ruler: 'Saturn', element: 'Air', quality: 'Fixed' },
    { index: 11, name: 'Pisces', sanskrit: 'Meena', ruler: 'Jupiter', element: 'Water', quality: 'Mutable' },
];

// ---------------------------------------------------------------------------
// Nakshatras (27 Lunar Mansions)
// ---------------------------------------------------------------------------
export interface NakshatraData {
    index: number;
    name: string;
    lord: string;       // Vimshottari dasha lord
    startDegree: number;  // Starting sidereal longitude
    deityName: string;
}

export const NAKSHATRAS: NakshatraData[] = [
    { index: 0, name: 'Ashwini', lord: 'Ketu', startDegree: 0, deityName: 'Ashwini Kumaras' },
    { index: 1, name: 'Bharani', lord: 'Venus', startDegree: 13.3333, deityName: 'Yama' },
    { index: 2, name: 'Krittika', lord: 'Sun', startDegree: 26.6667, deityName: 'Agni' },
    { index: 3, name: 'Rohini', lord: 'Moon', startDegree: 40, deityName: 'Brahma' },
    { index: 4, name: 'Mrigashira', lord: 'Mars', startDegree: 53.3333, deityName: 'Soma' },
    { index: 5, name: 'Ardra', lord: 'Rahu', startDegree: 66.6667, deityName: 'Rudra' },
    { index: 6, name: 'Punarvasu', lord: 'Jupiter', startDegree: 80, deityName: 'Aditi' },
    { index: 7, name: 'Pushya', lord: 'Saturn', startDegree: 93.3333, deityName: 'Brihaspati' },
    { index: 8, name: 'Ashlesha', lord: 'Mercury', startDegree: 106.6667, deityName: 'Nagas' },
    { index: 9, name: 'Magha', lord: 'Ketu', startDegree: 120, deityName: 'Pitris' },
    { index: 10, name: 'Purva Phalguni', lord: 'Venus', startDegree: 133.3333, deityName: 'Bhaga' },
    { index: 11, name: 'Uttara Phalguni', lord: 'Sun', startDegree: 146.6667, deityName: 'Aryaman' },
    { index: 12, name: 'Hasta', lord: 'Moon', startDegree: 160, deityName: 'Savitar' },
    { index: 13, name: 'Chitra', lord: 'Mars', startDegree: 173.3333, deityName: 'Vishwakarma' },
    { index: 14, name: 'Swati', lord: 'Rahu', startDegree: 186.6667, deityName: 'Vayu' },
    { index: 15, name: 'Vishakha', lord: 'Jupiter', startDegree: 200, deityName: 'Indra-Agni' },
    { index: 16, name: 'Anuradha', lord: 'Saturn', startDegree: 213.3333, deityName: 'Mitra' },
    { index: 17, name: 'Jyeshtha', lord: 'Mercury', startDegree: 226.6667, deityName: 'Indra' },
    { index: 18, name: 'Mula', lord: 'Ketu', startDegree: 240, deityName: 'Nirrti' },
    { index: 19, name: 'Purva Ashadha', lord: 'Venus', startDegree: 253.3333, deityName: 'Apas' },
    { index: 20, name: 'Uttara Ashadha', lord: 'Sun', startDegree: 266.6667, deityName: 'Vishve Devas' },
    { index: 21, name: 'Shravana', lord: 'Moon', startDegree: 280, deityName: 'Vishnu' },
    { index: 22, name: 'Dhanishta', lord: 'Mars', startDegree: 293.3333, deityName: 'Vasus' },
    { index: 23, name: 'Shatabhisha', lord: 'Rahu', startDegree: 306.6667, deityName: 'Varuna' },
    { index: 24, name: 'Purva Bhadrapada', lord: 'Jupiter', startDegree: 320, deityName: 'Aja Ekapada' },
    { index: 25, name: 'Uttara Bhadrapada', lord: 'Saturn', startDegree: 333.3333, deityName: 'Ahir Budhnya' },
    { index: 26, name: 'Revati', lord: 'Mercury', startDegree: 346.6667, deityName: 'Pushan' },
];

// Each nakshatra spans 13°20' = 13.3333°
export const NAKSHATRA_SPAN = 360 / 27; // 13.3333...

// Each pada spans 3°20' = 3.3333°
export const PADA_SPAN = NAKSHATRA_SPAN / 4;

// ---------------------------------------------------------------------------
// Planet Data
// ---------------------------------------------------------------------------
export interface PlanetData {
    id: string;
    name: string;
    sanskrit: string;
    exaltationDegree: number;   // Sidereal degree of exaltation
    debilitationDegree: number; // Sidereal degree of debilitation
    exaltationSign: number;     // Sign index where exalted
    debilitationSign: number;   // Sign index where debilitated
    isOuter: boolean;           // Rahu/Ketu are shadow planets
}

export const PLANETS: PlanetData[] = [
    { id: 'sun', name: 'Sun', sanskrit: 'Surya', exaltationDegree: 10, debilitationDegree: 190, exaltationSign: 0, debilitationSign: 6, isOuter: false },
    { id: 'moon', name: 'Moon', sanskrit: 'Chandra', exaltationDegree: 33, debilitationDegree: 213, exaltationSign: 1, debilitationSign: 7, isOuter: false },
    { id: 'mars', name: 'Mars', sanskrit: 'Mangala', exaltationDegree: 298, debilitationDegree: 118, exaltationSign: 9, debilitationSign: 3, isOuter: false },
    { id: 'mercury', name: 'Mercury', sanskrit: 'Budha', exaltationDegree: 165, debilitationDegree: 345, exaltationSign: 5, debilitationSign: 11, isOuter: false },
    { id: 'jupiter', name: 'Jupiter', sanskrit: 'Guru', exaltationDegree: 95, debilitationDegree: 275, exaltationSign: 3, debilitationSign: 9, isOuter: false },
    { id: 'venus', name: 'Venus', sanskrit: 'Shukra', exaltationDegree: 357, debilitationDegree: 177, exaltationSign: 11, debilitationSign: 5, isOuter: false },
    { id: 'saturn', name: 'Saturn', sanskrit: 'Shani', exaltationDegree: 200, debilitationDegree: 20, exaltationSign: 6, debilitationSign: 0, isOuter: false },
    { id: 'rahu', name: 'Rahu', sanskrit: 'Rahu', exaltationDegree: 60, debilitationDegree: 240, exaltationSign: 1, debilitationSign: 7, isOuter: true },
    { id: 'ketu', name: 'Ketu', sanskrit: 'Ketu', exaltationDegree: 240, debilitationDegree: 60, exaltationSign: 7, debilitationSign: 1, isOuter: true },
];

// ---------------------------------------------------------------------------
// Vimshottari Dasha System
// ---------------------------------------------------------------------------
// Total cycle: 120 years
// Sequence follows the nakshatra lords in a fixed order.
// ---------------------------------------------------------------------------

export interface VimshottariDashaData {
    lord: string;
    years: number;
}

/** Vimshottari Dasha sequence and period lengths (total = 120 years) */
export const VIMSHOTTARI_SEQUENCE: VimshottariDashaData[] = [
    { lord: 'Ketu', years: 7 },
    { lord: 'Venus', years: 20 },
    { lord: 'Sun', years: 6 },
    { lord: 'Moon', years: 10 },
    { lord: 'Mars', years: 7 },
    { lord: 'Rahu', years: 18 },
    { lord: 'Jupiter', years: 16 },
    { lord: 'Saturn', years: 19 },
    { lord: 'Mercury', years: 17 },
];

export const VIMSHOTTARI_TOTAL_YEARS = 120;

// Map planet name to its Vimshottari dasha duration
export const DASHA_YEARS: Record<string, number> = {};
for (const d of VIMSHOTTARI_SEQUENCE) {
    DASHA_YEARS[d.lord] = d.years;
}

// Map planet name to Sanskrit
export const PLANET_SANSKRIT: Record<string, string> = {};
for (const p of PLANETS) {
    PLANET_SANSKRIT[p.name] = p.sanskrit;
}
// Also add for dasha lords that may differ in casing
PLANET_SANSKRIT['Ketu'] = 'Ketu';
PLANET_SANSKRIT['Rahu'] = 'Rahu';

// ---------------------------------------------------------------------------
// Ayanamsa
// ---------------------------------------------------------------------------
// Lahiri Ayanamsa at J2000.0 (Jan 1, 2000 12:00 TT)
// The standard Vedic sidereal reference point.
// Ayanamsa = tropical_longitude - sidereal_longitude
// It increases by ~50.29" per year (precession rate).
// ---------------------------------------------------------------------------
export const LAHIRI_AYANAMSA_J2000 = 23.856; // degrees at J2000.0
export const AYANAMSA_RATE = 50.29 / 3600;   // degrees per year (~0.01397°/yr)

// ---------------------------------------------------------------------------
// Astronomical Constants
// ---------------------------------------------------------------------------
export const J2000 = 2451545.0; // Julian Day for J2000.0 epoch
export const DAYS_PER_JULIAN_CENTURY = 36525.0;

// Obliquity of the ecliptic at J2000 (degrees)
export const OBLIQUITY_J2000 = 23.4393;
