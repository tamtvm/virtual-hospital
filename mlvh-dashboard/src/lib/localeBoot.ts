import { AVAILABLE_LOCALES, STORAGE_KEY } from "@frontend/locales/registry.js";

const supportedLocales = JSON.stringify(AVAILABLE_LOCALES.map(({ code }) => code));

export const LOCALE_BOOT_SCRIPT = `(() => {
  const root = document.documentElement;
  const supportedLocales = ${supportedLocales};
  const candidates = [
    localStorage.getItem(${JSON.stringify(STORAGE_KEY)}),
    ...navigator.languages.map((tag) => tag.split("-")[0]),
  ];
  const locale = candidates.find((code) => supportedLocales.includes(code));

  if (locale && locale !== root.lang) {
    root.lang = locale;
    root.dataset.mlvhI18nPending = "";
  }
})();`;