// ============================================================================
// Vedic Astrology Engine — Julian Day Calculations
// ============================================================================
// Converts calendar dates to Julian Day Numbers (JDN), which are the
// foundation of all astronomical calculations. Based on Meeus' algorithms.
// ============================================================================

import { J2000, DAYS_PER_JULIAN_CENTURY } from './constants';

/**
 * Calculate Julian Day Number from a calendar date and time.
 * Algorithm from Jean Meeus, "Astronomical Algorithms", 2nd Edition.
 * 
 * @param year - Calendar year
 * @param month - Month (1-12)
 * @param day - Day of month
 * @param hour - Hour (0-23)
 * @param minute - Minute (0-59)
 * @param second - Second (0-59)
 * @returns Julian Day Number
 */
export function calculateJulianDay(
    year: number,
    month: number,
    day: number,
    hour: number = 0,
    minute: number = 0,
    second: number = 0
): number {
    // Convert time to fractional day
    const dayFraction = day + (hour + minute / 60 + second / 3600) / 24;

    // Adjust year and month for January/February
    let Y = year;
    let M = month;
    if (M <= 2) {
        Y -= 1;
        M += 12;
    }

    // Gregorian calendar correction
    const A = Math.floor(Y / 100);
    const B = 2 - A + Math.floor(A / 4);

    const JD = Math.floor(365.25 * (Y + 4716)) +
        Math.floor(30.6001 * (M + 1)) +
        dayFraction + B - 1524.5;

    return JD;
}

/**
 * Calculate Julian centuries from J2000.0 epoch.
 * This is the standard time measure used in astronomical formulas.
 * 
 * @param jd - Julian Day Number
 * @returns Julian centuries since J2000.0
 */
export function julianCenturiesFromJ2000(jd: number): number {
    return (jd - J2000) / DAYS_PER_JULIAN_CENTURY;
}

/**
 * Convert a Date object to Julian Day Number.
 * Uses UTC values from the Date object.
 */
export function dateToJulianDay(date: Date): number {
    return calculateJulianDay(
        date.getUTCFullYear(),
        date.getUTCMonth() + 1,
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds()
    );
}

/**
 * Convert Julian Day Number back to a Date object.
 */
export function julianDayToDate(jd: number): Date {
    // Algorithm from Meeus
    const z = Math.floor(jd + 0.5);
    const f = jd + 0.5 - z;

    let A: number;
    if (z < 2299161) {
        A = z;
    } else {
        const alpha = Math.floor((z - 1867216.25) / 36524.25);
        A = z + 1 + alpha - Math.floor(alpha / 4);
    }

    const B = A + 1524;
    const C = Math.floor((B - 122.1) / 365.25);
    const D = Math.floor(365.25 * C);
    const E = Math.floor((B - D) / 30.6001);

    const day = B - D - Math.floor(30.6001 * E);
    const month = E < 14 ? E - 1 : E - 13;
    const year = month > 2 ? C - 4716 : C - 4715;

    // Extract time from fractional part
    const totalHours = f * 24;
    const hours = Math.floor(totalHours);
    const totalMinutes = (totalHours - hours) * 60;
    const minutes = Math.floor(totalMinutes);
    const seconds = Math.floor((totalMinutes - minutes) * 60);

    return new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds));
}

/**
 * Calculate Local Sidereal Time (LST) at a given longitude.
 * LST is needed to determine the ascendant (lagna).
 * 
 * @param jd - Julian Day Number in UT
 * @param longitude - Observer's longitude in degrees (East positive)
 * @returns Local Sidereal Time in degrees (0-360)
 */
export function calculateLST(jd: number, longitude: number): number {
    const T = julianCenturiesFromJ2000(jd);

    // Greenwich Mean Sidereal Time (GMST) in degrees
    // Formula from Meeus, using polynomial in T
    let gmst = 280.46061837 +
        360.98564736629 * (jd - J2000) +
        0.000387933 * T * T -
        T * T * T / 38710000;

    // Normalize to 0-360
    gmst = ((gmst % 360) + 360) % 360;

    // Local Sidereal Time = GMST + longitude
    let lst = gmst + longitude;
    lst = ((lst % 360) + 360) % 360;

    return lst;
}
