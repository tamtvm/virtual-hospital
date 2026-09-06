// --- MODULE: document metadata ---

import { SITE_ORIGIN, ROUTE_META, ROUTE_PATHS, ROUTE_ABOUT } from './constants/routes.js';

const titleEl = document.querySelector('title');
const descriptionEl = document.querySelector('meta[name="description"]');
const robotsEl = document.querySelector('meta[name="robots"]');
const canonicalEl = document.querySelector('link[rel="canonical"]');
const ogTitleEl = document.querySelector('meta[property="og:title"]');
const ogDescriptionEl = document.querySelector('meta[property="og:description"]');
const ogUrlEl = document.querySelector('meta[property="og:url"]');

export const applyRouteMeta = (routeName) => {
    const meta = ROUTE_META[routeName] ?? ROUTE_META[ROUTE_ABOUT];
    const canonicalUrl = `${SITE_ORIGIN}${ROUTE_PATHS[routeName] ?? '/'}`;

    titleEl.textContent = meta.title;
    descriptionEl.content = meta.description;
    robotsEl.content = meta.noindex ? 'noindex, follow' : 'index, follow';
    canonicalEl.href = canonicalUrl;
    ogTitleEl.content = meta.title;
    ogDescriptionEl.content = meta.description;
    ogUrlEl.content = canonicalUrl;
};