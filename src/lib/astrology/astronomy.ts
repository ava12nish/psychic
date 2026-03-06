// ============================================================================
// Vedic Astrology Engine — Astronomical Calculations
// ============================================================================
// Core astronomical position calculations for planets, Sun, Moon, and nodes.
// Uses simplified VSOP87/Meeus algorithms for planetary longitudes.
// Applies Lahiri ayanamsa for sidereal conversion (Vedic astrology).
//
// ACCURACY NOTE: These are simplified calculations suitable for an MVP.
// For professional-grade accuracy, consider integrating Swiss Ephemeris
// or a full VSOP87 implementation. The current approach gives positions
// accurate to approximately ±1° for inner planets and ±2° for outer planets,
// which is sufficient for sign-level and nakshatra-level analysis.
// ============================================================================

import { LAHIRI_AYANAMSA_J2000, AYANAMSA_RATE, OBLIQUITY_J2000 } from './constants';
import { julianCenturiesFromJ2000, calculateLST } from './julian';

/** Degrees to radians */
function toRad(deg: number): number {
    return deg * Math.PI / 180;
}

/** Radians to degrees */
function toDeg(rad: number): number {
    return rad * 180 / Math.PI;
}

/** Normalize angle to 0-360 range */
export function normalizeAngle(angle: number): number {
    return ((angle % 360) + 360) % 360;
}

// ---------------------------------------------------------------------------
// Ayanamsa (Precession correction for Sidereal zodiac)
// ---------------------------------------------------------------------------

/**
 * Calculate Lahiri ayanamsa for a given Julian Day.
 * Ayanamsa is the angular difference between the tropical and sidereal zodiacs.
 * 
 * @param jd - Julian Day Number
 * @returns Ayanamsa in degrees
 */
export function calculateAyanamsa(jd: number): number {
    const T = julianCenturiesFromJ2000(jd);
    const yearsFromJ2000 = T * 100;
    // Linear approximation of Lahiri ayanamsa
    // More precise models use polynomial series, but this is good for MVP
    return LAHIRI_AYANAMSA_J2000 + AYANAMSA_RATE * yearsFromJ2000;
}

/**
 * Convert tropical (Western) longitude to sidereal (Vedic) longitude.
 * 
 * @param tropicalLongitude - Tropical ecliptic longitude in degrees
 * @param jd - Julian Day Number (for ayanamsa calculation)
 * @returns Sidereal longitude in degrees (0-360)
 */
export function tropicalToSidereal(tropicalLongitude: number, jd: number): number {
    const ayanamsa = calculateAyanamsa(jd);
    return normalizeAngle(tropicalLongitude - ayanamsa);
}

// ---------------------------------------------------------------------------
// Solar Position (Simplified VSOP87)
// ---------------------------------------------------------------------------

/**
 * Calculate the Sun's ecliptic longitude (tropical).
 * Based on Meeus' simplified solar position algorithm.
 * Accuracy: ~0.01° (more than sufficient for sign determination).
 * 
 * @param jd - Julian Day Number
 * @returns Tropical ecliptic longitude of the Sun in degrees
 */
export function calculateSunLongitude(jd: number): number {
    const T = julianCenturiesFromJ2000(jd);

    // Geometric mean longitude of the Sun (degrees)
    const L0 = normalizeAngle(280.46646 + 36000.76983 * T + 0.0003032 * T * T);

    // Mean anomaly of the Sun (degrees)
    const M = normalizeAngle(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
    const Mrad = toRad(M);

    // Equation of center
    const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad) +
        (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad) +
        0.000289 * Math.sin(3 * Mrad);

    // Sun's true longitude
    const sunLon = normalizeAngle(L0 + C);

    // Apparent longitude (correcting for nutation and aberration)
    const omega = 125.04 - 1934.136 * T;
    const apparent = sunLon - 0.00569 - 0.00478 * Math.sin(toRad(omega));

    return normalizeAngle(apparent);
}

// ---------------------------------------------------------------------------
// Lunar Position (Simplified)
// ---------------------------------------------------------------------------

/**
 * Calculate the Moon's ecliptic longitude (tropical).
 * Simplified version based on Meeus. Includes major perturbation terms.
 * Accuracy: ~0.5° (good enough for nakshatra and sign determination).
 * 
 * @param jd - Julian Day Number
 * @returns Tropical ecliptic longitude of the Moon in degrees
 */
export function calculateMoonLongitude(jd: number): number {
    const T = julianCenturiesFromJ2000(jd);

    // Moon's mean longitude (degrees)
    const Lp = normalizeAngle(218.3165 + 481267.8813 * T);

    // Mean elongation of the Moon
    const D = normalizeAngle(297.8502 + 445267.1115 * T);

    // Sun's mean anomaly
    const M = normalizeAngle(357.5291 + 35999.0503 * T);

    // Moon's mean anomaly
    const Mp = normalizeAngle(134.9634 + 477198.8676 * T);

    // Moon's argument of latitude
    const F = normalizeAngle(93.2720 + 483202.0175 * T);

    const Drad = toRad(D), Mrad = toRad(M), Mprad = toRad(Mp), Frad = toRad(F);

    // Periodic terms for longitude (simplified — major terms only)
    let longitude = Lp;
    longitude += 6.289 * Math.sin(Mprad);                    // Evection
    longitude += 1.274 * Math.sin(2 * Drad - Mprad);         // Variation
    longitude += 0.658 * Math.sin(2 * Drad);                 // Annual eq
    longitude -= 0.186 * Math.sin(Mrad);                     // Solar eq
    longitude -= 0.114 * Math.sin(2 * Frad);
    longitude += 0.059 * Math.sin(2 * Drad - 2 * Mprad);
    longitude += 0.057 * Math.sin(2 * Drad - Mrad - Mprad);
    longitude += 0.053 * Math.sin(2 * Drad + Mprad);
    longitude += 0.046 * Math.sin(2 * Drad - Mrad);
    longitude += 0.041 * Math.sin(Mprad - Mrad);
    longitude -= 0.035 * Math.sin(Drad);
    longitude -= 0.031 * Math.sin(Mprad + Mrad);
    longitude -= 0.015 * Math.sin(2 * Frad - 2 * Drad);
    longitude += 0.011 * Math.sin(2 * Mprad - 2 * Drad);

    return normalizeAngle(longitude);
}

// ---------------------------------------------------------------------------
// Planetary Positions (Simplified VSOP87-like)
// ---------------------------------------------------------------------------

interface PlanetaryElements {
    L: number[];  // Mean longitude coefficients [L0, L1, L2]
    a: number[];  // Semi-major axis (AU) [a0]
    e: number[];  // Eccentricity [e0, e1]
    i: number[];  // Inclination [i0, i1]
    w: number[];  // Longitude of perihelion [w0, w1]
    O: number[];  // Longitude of ascending node [O0, O1]
}

/**
 * Simplified orbital elements for planets at J2000.0
 * and their rates of change per Julian century.
 * Source: Meeus "Astronomical Algorithms" and JPL data
 */
const ORBITAL_ELEMENTS: Record<string, PlanetaryElements> = {
    mercury: {
        L: [252.2509, 149472.6746, 0],
        a: [0.38710],
        e: [0.20563, 0.000020],
        i: [7.0050, -0.0060],
        w: [77.4561, 1.5564],
        O: [48.3309, -0.1254],
    },
    venus: {
        L: [181.9798, 58517.8157, 0],
        a: [0.72333],
        e: [0.00677, -0.000047],
        i: [3.3947, -0.0009],
        w: [131.5637, 1.4022],
        O: [76.6799, -0.2780],
    },
    mars: {
        L: [355.4330, 19140.2993, 0],
        a: [1.52368],
        e: [0.09340, 0.000090],
        i: [1.8497, -0.0013],
        w: [336.0602, 1.8410],
        O: [49.5574, -0.2940],
    },
    jupiter: {
        L: [34.3515, 3034.9057, 0],
        a: [5.20260],
        e: [0.04849, 0.000163],
        i: [1.3033, -0.0019],
        w: [14.3312, 1.6126],
        O: [100.4644, 0.1766],
    },
    saturn: {
        L: [50.0774, 1222.1138, 0],
        a: [9.55491],
        e: [0.05551, -0.000346],
        i: [2.4889, 0.0025],
        w: [93.0572, 1.9584],
        O: [113.6634, -0.2507],
    },
};

/**
 * Solve Kepler's equation iteratively.
 * M = E - e * sin(E)
 * 
 * @param M - Mean anomaly in radians
 * @param e - Eccentricity
 * @returns Eccentric anomaly in radians
 */
function solveKepler(M: number, e: number): number {
    let E = M;
    for (let i = 0; i < 20; i++) {
        const dE = (M - (E - e * Math.sin(E))) / (1 - e * Math.cos(E));
        E += dE;
        if (Math.abs(dE) < 1e-9) break;
    }
    return E;
}

/**
 * Calculate heliocentric ecliptic longitude of a planet.
 * Uses a simplified Keplerian orbit model.
 * 
 * @param planetId - Planet identifier (mercury, venus, mars, jupiter, saturn)
 * @param T - Julian centuries from J2000
 * @returns Heliocentric ecliptic longitude in degrees
 */
function heliocentricLongitude(planetId: string, T: number): number {
    const elem = ORBITAL_ELEMENTS[planetId];
    if (!elem) return 0;

    // Mean longitude
    const L = normalizeAngle(elem.L[0] + elem.L[1] * T);
    // Eccentricity
    const e = elem.e[0] + (elem.e[1] || 0) * T;
    // Longitude of perihelion
    const w = elem.w[0] + elem.w[1] * T;

    // Mean anomaly
    const M = toRad(normalizeAngle(L - w));

    // Eccentric anomaly
    const E = solveKepler(M, e);

    // True anomaly
    const v = 2 * Math.atan2(
        Math.sqrt(1 + e) * Math.sin(E / 2),
        Math.sqrt(1 - e) * Math.cos(E / 2)
    );

    // Heliocentric longitude
    return normalizeAngle(toDeg(v) + w);
}

/**
 * Calculate geocentric ecliptic longitude of a planet.
 * Converts from heliocentric to geocentric coordinates.
 * 
 * @param planetId - Planet identifier
 * @param jd - Julian Day Number
 * @returns Geocentric tropical ecliptic longitude in degrees
 */
export function calculatePlanetLongitude(planetId: string, jd: number): number {
    const T = julianCenturiesFromJ2000(jd);

    if (planetId === 'sun') return calculateSunLongitude(jd);
    if (planetId === 'moon') return calculateMoonLongitude(jd);
    if (planetId === 'rahu') return calculateRahuLongitude(jd);
    if (planetId === 'ketu') return normalizeAngle(calculateRahuLongitude(jd) + 180);

    const elem = ORBITAL_ELEMENTS[planetId];
    if (!elem) {
        // Fallback for unknown planets
        return 0;
    }

    // Planet's heliocentric longitude
    const planetHelio = heliocentricLongitude(planetId, T);
    const planetR = elem.a[0]; // Simplified: using mean distance

    // Earth's heliocentric longitude (opposite of Sun's geocentric longitude)
    const sunLon = calculateSunLongitude(jd);
    const earthHelio = normalizeAngle(sunLon + 180);
    const earthR = 1.0; // Earth's mean distance = 1 AU

    // Convert to geocentric using simple trigonometry
    const planetHelioRad = toRad(planetHelio);
    const earthHelioRad = toRad(earthHelio);

    const x = planetR * Math.cos(planetHelioRad) - earthR * Math.cos(earthHelioRad);
    const y = planetR * Math.sin(planetHelioRad) - earthR * Math.sin(earthHelioRad);

    const geocentricLon = normalizeAngle(toDeg(Math.atan2(y, x)));

    return geocentricLon;
}

/**
 * Determine if a planet appears retrograde.
 * Compares longitude at jd vs jd+1 day.
 * 
 * @param planetId - Planet identifier
 * @param jd - Julian Day Number
 * @returns true if the planet is retrograde
 */
export function isPlanetRetrograde(planetId: string, jd: number): boolean {
    // Sun and Moon are never retrograde
    if (planetId === 'sun' || planetId === 'moon') return false;
    // Rahu and Ketu are always (mean motion) retrograde
    if (planetId === 'rahu' || planetId === 'ketu') return true;

    const lon1 = calculatePlanetLongitude(planetId, jd);
    const lon2 = calculatePlanetLongitude(planetId, jd + 1);

    // Handle wrap-around at 360°
    let diff = lon2 - lon1;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    return diff < 0;
}

// ---------------------------------------------------------------------------
// Lunar Nodes (Rahu/Ketu)
// ---------------------------------------------------------------------------

/**
 * Calculate mean longitude of Rahu (North Node of the Moon).
 * Ketu is always exactly 180° opposite.
 * Rahu moves retrograde through the zodiac, completing a cycle in ~18.6 years.
 * 
 * @param jd - Julian Day Number
 * @returns Tropical ecliptic longitude of Rahu in degrees
 */
export function calculateRahuLongitude(jd: number): number {
    const T = julianCenturiesFromJ2000(jd);
    // Mean longitude of ascending node (Rahu)
    const omega = 125.0446 - 1934.1363 * T + 0.0020754 * T * T;
    return normalizeAngle(omega);
}

// ---------------------------------------------------------------------------
// Ascendant (Lagna)
// ---------------------------------------------------------------------------

/**
 * Calculate the Ascendant (Lagna) from Local Sidereal Time.
 * The ascendant is the point of the ecliptic rising on the eastern horizon.
 * 
 * @param lst - Local Sidereal Time in degrees
 * @param latitude - Observer's latitude in degrees
 * @param obliquity - Obliquity of the ecliptic in degrees
 * @returns Tropical ecliptic longitude of the ascendant in degrees
 */
export function calculateAscendant(lst: number, latitude: number, obliquity?: number): number {
    const e = toRad(obliquity || OBLIQUITY_J2000);
    const lstRad = toRad(lst);
    const latRad = toRad(latitude);

    // Ascendant formula using the rising point of the ecliptic
    const y = -Math.cos(lstRad);
    const x = Math.sin(lstRad) * Math.cos(e) + Math.tan(latRad) * Math.sin(e);

    let asc = toDeg(Math.atan2(y, x));
    asc = normalizeAngle(asc);

    return asc;
}

// ---------------------------------------------------------------------------
// All planetary positions at once
// ---------------------------------------------------------------------------

export interface RawPlanetaryPositions {
    sun: number;
    moon: number;
    mars: number;
    mercury: number;
    jupiter: number;
    venus: number;
    saturn: number;
    rahu: number;
    ketu: number;
    ascendant: number;
}

/**
 * Calculate all planetary positions (tropical) at a given moment.
 * 
 * @param jd - Julian Day Number (in UT)
 * @param latitude - Observer's latitude
 * @param longitude - Observer's longitude
 * @returns Object with tropical longitudes for all planets
 */
export function calculateAllPositions(
    jd: number,
    latitude: number,
    longitude: number
): RawPlanetaryPositions {
    const lst = calculateLST(jd, longitude);

    return {
        sun: calculateSunLongitude(jd),
        moon: calculateMoonLongitude(jd),
        mars: calculatePlanetLongitude('mars', jd),
        mercury: calculatePlanetLongitude('mercury', jd),
        jupiter: calculatePlanetLongitude('jupiter', jd),
        venus: calculatePlanetLongitude('venus', jd),
        saturn: calculatePlanetLongitude('saturn', jd),
        rahu: calculateRahuLongitude(jd),
        ketu: normalizeAngle(calculateRahuLongitude(jd) + 180),
        ascendant: calculateAscendant(lst, latitude),
    };
}
