// --- MODULE: route registry ---

export const SITE_ORIGIN = 'https://virtual-hospital.pages.dev';

export const ROUTE_ABOUT = 'about';
export const ROUTE_HOME = 'home';
export const ROUTE_PATIENTS = 'patients';
export const ROUTE_MEDICAL_RECORDS = 'medical-records';
export const ROUTE_SETTINGS = 'settings';
export const ROUTE_NOT_FOUND = 'not-found';

export const ROUTE_PATHS = {
    [ROUTE_ABOUT]: '/',
    [ROUTE_HOME]: '/home',
    [ROUTE_PATIENTS]: '/patients',
    [ROUTE_MEDICAL_RECORDS]: '/medical-records',
    [ROUTE_SETTINGS]: '/settings',
};

// --- Per route document metadata ---

export const NOINDEX_ROUTES = new Set([ROUTE_SETTINGS, ROUTE_NOT_FOUND]);