/**
 * Convert date string (YYYY-MM-DD or any parsable format)
 * into a valid ISO-8601 string for Prisma DateTime fields.
 *
 * Example:
 * toISODateTime("2005-07-17") → "2005-07-17T00:00:00.000Z"
 */
export function toISODateTime(dateString: string): string {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date string: ${dateString}`);
  }

  return date.toISOString();
}

/**
 * Convert ISO date string (from Prisma or DB)
 * into 'YYYY-MM-DD' format for <input type="date">
 *
 * Example:
 * fromISODateTime("2005-07-17T00:00:00.000Z") → "2005-07-17"
 */
export function fromISODateTime(isoString: string | null | undefined): string {
  if (!isoString) return '';

  const date = new Date(isoString);

  if (isNaN(date.getTime())) {
    console.warn(`Invalid ISO date: ${isoString}`);
    return '';
  }

  // Convert to YYYY-MM-DD (local)
  return date.toISOString().split('T')[0];
}
