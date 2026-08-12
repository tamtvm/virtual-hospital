// --- DOM helpers ---

/**
 * Escapes a value before its interpolated into an innerHTML template string.
 */
export const escapeHtml = (value) => {
    const div = document.createElement('div');
    div.textContent = String(value ?? '');
    return div.innerHTML;
};

/**
 * Automatic fallback if the asset doesnt exist
 * (e.g. no matching avatar file)
 */
export const setAvatarWithFallback = (imgElement, src, fallbackSrc) => {
    imgElement.onerror = () => {
        imgElement.onerror = null;
        imgElement.src = fallbackSrc;
    };
    imgElement.src = src;
};

/**
 * Formats an ISO date string (YYYY-MM-DD) into a readable display date,
 * AHTE YOU IOS
 */
export const formatDisplayDate = (isoDate) => {
    if (!isoDate) return '';
    const [year, month, day] = isoDate.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};