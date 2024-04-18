/**
 * Formats a given date to return the time in HH:mm format.
 * @param date The date object to be formatted.
 * @returns The formatted time string.
 */
export function formatDateTime(date: Date): string {
	const hours = ('0' + date.getHours()).slice(-2);
	const minutes = ('0' + date.getMinutes()).slice(-2);
	return `${hours}:${minutes}`;
}
