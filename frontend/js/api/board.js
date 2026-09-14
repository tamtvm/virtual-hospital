// --- API layer: board ---
import { getApiBaseUrl } from '../config.js';
import { ApiError } from './patients.js';

const boardUrl = async (path = '') => `${await getApiBaseUrl()}/board/${path}`;

export const fetchBoardStrokes = async (afterId = null) => {
    const query = afterId === null ? '' : `?after=${afterId}`;
    const response = await fetch(await boardUrl(`strokes/${query}`));
    if (!response.ok) {
        throw new ApiError('Could not load the whiteboard.');
    }
    return response.json();
};

export const createBoardStroke = async (stroke) => {
    const response = await fetch(await boardUrl('strokes/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stroke),
    });
    if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new ApiError(payload.detail ?? 'Could not save your stroke.');
    }
    return response.json();
};