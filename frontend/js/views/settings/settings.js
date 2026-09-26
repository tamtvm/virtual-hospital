// --- MODULE: settings view ---

import { t, getLocale, setLocale, AVAILABLE_LOCALES } from '../../i18n.js';

const renderLocaleOptions = () => {
    const activeLocale = getLocale();

    return AVAILABLE_LOCALES.map(({ code, label }) => `
        <input type="radio" class="mlvh-visually-hidden" name="settings-locale" id="settings-locale-${code}" value="${code}"${code === activeLocale ? ' checked' : ''}>
        <label class="mlvh-segmented-option" for="settings-locale-${code}" lang="${code}">${label}</label>
    `).join('');
};

export const getSettingsView = () => {
    return `
    <div class="mlvh-card">
        <div class="mlvh-card-header">
            <span class="mlvh-card-tag">${t('settings.title')}</span>
        </div>
        <div class="mlvh-card-body">
            <fieldset id="settings-language" aria-describedby="settings-language-hint">
                <legend class="mlvh-setting-title">${t('settings.language.title')}</legend>
                <p class="mlvh-card-subtitle mb-3" id="settings-language-hint">${t('settings.language.hint')}</p>
                <div class="mlvh-segmented">
                    ${renderLocaleOptions()}
                </div>
            </fieldset>
        </div>
    </div>
    `;
};

export const initSettingsLogic = () => {
    document.getElementById('settings-language')?.addEventListener('change', (event) => {
        setLocale(event.target.value);
    });
};