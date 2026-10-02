// --- API layer: board ---
import { getApiBaseUrl } from '../config.js';
import { t } from '../i18n.js';
import { ApiError, buildErrorFromResponse } from './errors.js';

const boardUrl = async (path = '') => `${await getApiBaseUrl()}/board/${path}`;

export const fetchBoardStrokes = async (afterId = null) => {
    const query = afterId === null ? '' : `?after=${afterId}`;
    const response = await fetch(await boardUrl(`strokes/${query}`));
    if (!response.ok) {
        throw new ApiError(t('home.board.loadError'));
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
        throw await buildErrorFromResponse(response, t('home.board.saveError'));
    }
    return response.json();
};