/**
 * Utility functions for date calculations
 */

/**
 * Calculate age from birthdate
 * @param birthdate - The birthdate as Date object or ISO string
 * @returns The calculated age in years
 */
export function calculateAge(birthdate: Date | string | undefined): number {
    if (!birthdate) return 0;

    const birth = new Date(birthdate);
    const today = new Date();

    // Check if the birthdate is valid
    if (isNaN(birth.getTime())) return 0;

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    // If birthday hasn't occurred this year yet, subtract 1
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    return Math.max(0, age); // Ensure age is never negative
}

/**
 * Format a date to a readable string
 * @param date - The date to format
 * @param locale - The locale to use for formatting (default: 'es-GT' for Guatemala)
 * @returns Formatted date string
 */
export function formatDate(date: Date | string | undefined, locale: string = 'es-GT'): string {
    if (!date) return '';

    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return '';

    return dateObj.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Convert a date to ISO string for API requests
 * @param date - The date to convert
 * @returns ISO string or empty string if invalid
 */
export function toISOString(date: Date | string | undefined): string {
    if (!date) return '';

    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return '';

    return dateObj.toISOString();
}

/**
 * Check if a birthdate is valid (not in the future, not too old)
 * @param birthdate - The birthdate to validate
 * @returns True if valid, false otherwise
 */
export function isValidBirthdate(birthdate: Date | string | undefined): boolean {
    if (!birthdate) return true; // Optional field

    const birth = new Date(birthdate);
    const today = new Date();
    const maxAge = 150;
    const minDate = new Date(today.getFullYear() - maxAge, 0, 1);

    return !isNaN(birth.getTime()) &&
        birth <= today &&
        birth >= minDate;
}