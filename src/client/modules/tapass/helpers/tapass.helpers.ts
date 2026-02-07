/** Converts a base64-encoded string to a hex string */
export function base64ToHex(value: string): string {
    return Array.from(atob(value))
        .map((byte) => byte.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('');
}
