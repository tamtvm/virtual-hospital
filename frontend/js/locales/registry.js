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

const selectPlural = (locale, forms, count) => forms[new Intl.PluralRules(locale).select(count)] ?? forms.other;

export const translate = (locale, key, values) => {
    const found = lookup(locale, key) ?? key;
    const message = typeof found === 'object' ? selectPlural(locale, found, values?.count) : found;
    return values ? interpolate(message, values) : message;
};

export const translateOption = (locale, group, value) => lookup(locale, `${group}.${value}`) ?? value;