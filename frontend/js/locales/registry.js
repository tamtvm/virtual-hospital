// --- MODULE: locale registry ---

import { en } from './en.js';
import { es } from './es.js';

export const STORAGE_KEY = 'mlvh:locale';
export const DEFAULT_LOCALE = 'en';

const LOCALES = {
    en: { label: 'English', messages: en },
    es: { label: 'Español', messages: es },
};

export const AVAILABLE_LOCALES = Object.entries(LOCALES).map(([code, { label }]) => ({ code, label }));

export const isSupportedLocale = (locale) => Object.hasOwn(LOCALES, locale);

const resolveMessage = (messages, key) => key.split('.').reduce((node, segment) => node?.[segment], messages);

const lookup = (locale, key) =>
    resolveMessage(LOCALES[locale].messages, key) ?? resolveMessage(LOCALES[DEFAULT_LOCALE].messages, key);

const interpolate = (message, values) =>
    message.replace(/\{(\w+)\}/g, (placeholder, name) => values[name] ?? placeholder);

export const translate = (locale, key, values) => {
    const message = lookup(locale, key) ?? key;
    return values ? interpolate(message, values) : message;
};

export const translateOption = (locale, group, value) => lookup(locale, `${group}.${value}`) ?? value;