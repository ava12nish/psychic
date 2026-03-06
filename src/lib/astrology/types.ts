// ============================================================================
// Vedic Astrology Engine — Type Definitions
// ============================================================================
// All TypeScript interfaces for the astrology calculation pipeline.
// These types represent the structured output of the engine and are consumed
// by the API layer, frontend dashboard, and AI Q&A system.
// ============================================================================

/** Raw user input from the intake form */
export interface BirthInput {
  fullName: string;
  birthDate: string;      // YYYY-MM-DD
  birthTime: string;      // HH:MM (24-hour)
  birthPlace: string;     // Free-text location string
}

/** Geocoded and timezone-resolved birth data */
export interface ResolvedBirthData {
  fullName: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  latitude: number;
  longitude: number;
  timezone: string;       // IANA timezone (e.g., "Asia/Kolkata")
  utcOffset: number;      // Offset in hours
  julianDay: number;      // Julian Day Number for the birth moment
  localDateTime: string;  // ISO string in local time
  utcDateTime: string;    // ISO string in UTC
}

/** Zodiac sign information */
export interface ZodiacSign {
  index: number;          // 0-11 (Aries=0, ..., Pisces=11)
  name: string;           // e.g., "Aries", "Taurus"
  sanskrit: string;       // e.g., "Mesha", "Vrishabha"
  ruler: string;          // Ruling planet
  element: string;        // Fire, Earth, Air, Water
  quality: string;        // Cardinal, Fixed, Mutable
}

/** Nakshatra (lunar mansion) information */
export interface NakshatraInfo {
  index: number;          // 0-26
  name: string;           // e.g., "Ashwini", "Bharani"
  lord: string;           // Ruling planet (for dasha)
  pada: number;           // 1-4
  degree: number;         // Degree within this nakshatra (0-13.333)
  startDegree: number;    // Starting degree of this nakshatra
}

/** A planet's placement in the chart */
export interface PlanetPlacement {
  id: string;             // e.g., "sun", "moon", "mars"
  name: string;           // e.g., "Sun", "Moon", "Mars"
  sanskrit: string;       // e.g., "Surya", "Chandra", "Mangala"
  longitude: number;      // Sidereal longitude (0-360)
  sign: ZodiacSign;
  house: number;          // 1-12
  degreeInSign: number;   // 0-30
  nakshatra: NakshatraInfo;
  isRetrograde: boolean;
  isExalted: boolean;
  isDebilitated: boolean;
}

/** A house in the chart */
export interface HousePlacement {
  house: number;          // 1-12
  sign: ZodiacSign;
  ruler: string;          // Ruling planet of the sign
  planets: string[];      // Names of planets in this house
}

/** Ascendant / Lagna details */
export interface AscendantInfo {
  sign: ZodiacSign;
  degree: number;         // Exact degree within the sign
  nakshatra: NakshatraInfo;
  longitude: number;      // Full sidereal longitude
}

/** A single dasha period */
export interface DashaPeriod {
  lord: string;           // Planet name
  lordSanskrit: string;   // Sanskrit name
  startDate: string;      // ISO date string
  endDate: string;        // ISO date string
  durationYears: number;
  isActive: boolean;      // Whether this period is currently active
  subPeriods?: DashaPeriod[];  // Antardasha sub-periods
}

/** Full dasha timeline */
export interface DashaResult {
  system: string;         // "Vimshottari"
  birthNakshatra: NakshatraInfo;
  dashaBalance: number;   // Remaining years of first dasha at birth
  mahadashas: DashaPeriod[];
  currentMahadasha: DashaPeriod;
  currentAntardasha: DashaPeriod;
}

/** Chart summary with all computed data */
export interface ChartResult {
  ascendant: AscendantInfo;
  moonSign: ZodiacSign;
  sunSign: ZodiacSign;
  planets: PlanetPlacement[];
  houses: HousePlacement[];
}

/** Interpretation themes derived from chart analysis */
export interface InterpretationSummary {
  personalityOverview: string;
  strengths: string[];
  challenges: string[];
  careerThemes: string;
  relationshipThemes: string;
  currentPeriodFocus: string;
  mindfulnessNotes: string[];
  lifePathSummary: string;
}

/** Compact AI context for Q&A grounding */
export interface AiContext {
  essentialFacts: string[];
  currentDasha: {
    mahadasha: string;
    antardasha: string;
    periodDescription: string;
  };
  keyPlacements: string[];
  summaryThemes: string[];
  cautionNotes: string[];
  guidanceTopics: string[];
}

/** Complete engine response */
export interface AstrologyEngineResponse {
  id?: string;
  inputSummary: {
    fullName: string;
    birthDate: string;
    birthTime: string;
    birthPlace: string;
    coordinates: { latitude: number; longitude: number };
    timezone: string;
  };
  resolvedBirthData: ResolvedBirthData;
  chart: ChartResult;
  dasha: DashaResult;
  interpretation: InterpretationSummary;
  aiContext: AiContext;
  generatedAt: string;
}

/** Geocoding result from location provider */
export interface GeocodingResult {
  latitude: number;
  longitude: number;
  displayName: string;
  timezone: string;
  utcOffset: number;
}

/** Error types for the engine */
export type AstrologyError =  
  | { code: 'INVALID_DATE'; message: string }
  | { code: 'INVALID_TIME'; message: string }
  | { code: 'MISSING_FIELD'; message: string; field: string }
  | { code: 'GEOCODING_FAILED'; message: string }
  | { code: 'TIMEZONE_FAILED'; message: string }
  | { code: 'CALCULATION_ERROR'; message: string }
  | { code: 'UNKNOWN_ERROR'; message: string };

export class AstrologyEngineError extends Error {
  public code: string;
  public field?: string;
  
  constructor(error: AstrologyError) {
    super(error.message);
    this.code = error.code;
    this.name = 'AstrologyEngineError';
    if ('field' in error) {
      this.field = error.field;
    }
  }
}
