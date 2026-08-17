// --- Application configuration (environment dependent values) ---
async function loadConfig() {
    try {
        const localResponse = await fetch('/config.local.json');
        if (localResponse.ok) return localResponse.json();
    } catch {
        
    }
    const response = await fetch('/config.json');
    return response.json();
}

const config = await loadConfig();

export const API_BASE_URL = `${config.apiBaseUrl}/api`;
export const AVATAR_BASE_PATH = '/assets/avatars';
export const DEFAULT_AVATAR = '/assets/default-avatar.png';