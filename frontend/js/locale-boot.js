// --- Locale boot ---

(() => {
    const root = document.documentElement;
    const supportedLocales = ['en', 'es'];
    const candidates = [
        localStorage.getItem('mlvh:locale'),
        ...navigator.languages.map((tag) => tag.split('-')[0]),
    ];
    const locale = candidates.find((code) => supportedLocales.includes(code));

    if (locale && locale !== root.lang) {
        root.lang = locale;
        root.dataset.mlvhI18nPending = '';
    }
})();