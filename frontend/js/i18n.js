// --- MODULE: internationalization ---

import { en } from './locales/en.js';
import { es } from './locales/es.js';

const STORAGE_KEY = 'mlvh:locale';
const DEFAULT_LOCALE = 'en';

const LOCALES = {
    en: { label: 'English', messages: en },
    es: { label: 'Español', messages: es },
};

export const AVAILABLE_LOCALES = Object.entries(LOCALES).map(([code, { label }]) => ({ code, label }));

const isSupportedLocale = (locale) => Object.hasOwn(LOCALES, locale);

const initialLocale = document.documentElement.lang;
let currentLocale = isSupportedLocale(initialLocale) ? initialLocale : DEFAULT_LOCALE;

const resolveMessage = (messages, key) => key.split('.').reduce((node, segment) => node?.[segment], messages);

export const t = (key) =>
    resolveMessage(LOCALES[currentLocale].messages, key)
    ?? resolveMessage(LOCALES[DEFAULT_LOCALE].messages, key)
    ?? key;

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