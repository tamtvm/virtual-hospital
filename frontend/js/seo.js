// --- MODULE: document metadata ---

import { SITE_ORIGIN, ROUTE_PATHS, NOINDEX_ROUTES } from './constants/routes.js';
import { brandTitle } from './constants/brand.js';
import { t } from './i18n.js';

const titleEl = document.querySelector('title');
const descriptionEl = document.querySelector('meta[name="description"]');
const robotsEl = document.querySelector('meta[name="robots"]');
const canonicalEl = document.querySelector('link[rel="canonical"]');
const ogTitleEl = document.querySelector('meta[property="og:title"]');
const ogDescriptionEl = document.querySelector('meta[property="og:description"]');
const ogUrlEl = document.querySelector('meta[property="og:url"]');
const headingEl = document.getElementById('page-heading');

export const applyRouteMeta = (routeName) => {
    const title = brandTitle(t(`routes.${routeName}.title`));
    const description = t(`routes.${routeName}.description`);
    const canonicalUrl = `${SITE_ORIGIN}${ROUTE_PATHS[routeName] ?? '/'}`;

    titleEl.textContent = title;
    headingEl.textContent = t(`routes.${routeName}.heading`);
    descriptionEl.content = description;
    robotsEl.content = NOINDEX_ROUTES.has(routeName) ? 'noindex, follow' : 'index, follow';
    canonicalEl.href = canonicalUrl;
    ogTitleEl.content = title;
    ogDescriptionEl.content = description;
    ogUrlEl.content = canonicalUrl;
};