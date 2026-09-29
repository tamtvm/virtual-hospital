// --- MODULE: internationalization ---

import { STORAGE_KEY, DEFAULT_LOCALE, isSupportedLocale, translate, translateOption } from './locales/registry.js';

export { AVAILABLE_LOCALES } from './locales/registry.js';

const initialLocale = document.documentElement.lang;
let currentLocale = isSupportedLocale(initialLocale) ? initialLocale : DEFAULT_LOCALE;

export const t = (key, values) => translate(currentLocale, key, values);
export const tOption = (group, value) => translateOption(currentLocale, group, value);
export const getLocale = () => currentLocale;

// --- Document translation ---

const translateDocument = () => {
    document.documentElement.lang = currentLocale;

    document.querySelectorAll('[data-i18n]').forEach((element) => {
        element.textContent = t(element.dataset.i18n);
    });

    document.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
        element.setAttribute('aria-label', t(element.dataset.i18nAriaLabel));
    });
};

export const initI18n = () => {
    translateDocument();
    delete document.documentElement.dataset.mlvhI18nPending;
};

export const setLocale = (locale) => {
    if (!isSupportedLocale(locale) || locale === currentLocale) return;

    currentLocale = locale;
    window.localStorage.setItem(STORAGE_KEY, locale);
    translateDocument();
    document.dispatchEvent(new CustomEvent('mlvh:locale-change'));
};