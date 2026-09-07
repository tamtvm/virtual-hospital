// --- MODULE: route registry ---

export const SITE_ORIGIN = 'https://virtual-hospital.pages.dev';

const brandTitle = (label) => (label ? `˚₊‧꒰ა ${label}, mlvh ໒꒱ ‧₊˚` : '˚₊‧꒰ა mlvh ໒꒱ ‧₊˚');

export const ROUTE_ABOUT = 'about';
export const ROUTE_HOME = 'home';
export const ROUTE_PATIENTS = 'patients';
export const ROUTE_MEDICAL_RECORDS = 'medical-records';
export const ROUTE_NOT_FOUND = 'not-found';

export const ROUTE_PATHS = {
    [ROUTE_ABOUT]: '/',
    [ROUTE_HOME]: '/home',
    [ROUTE_PATIENTS]: '/patients',
    [ROUTE_MEDICAL_RECORDS]: '/medical-records',
};

// --- Per route document metadata ---

export const ROUTE_META = {
    [ROUTE_ABOUT]: {
        title: brandTitle(),
        heading: 'My Little Virtual Hospital',
        description: 'A gamified hospital management sandbox. Admit patients, browse the roster and explore live clinical analytics. No login needed.',
    },
    [ROUTE_HOME]: {
        title: brandTitle('home'),
        heading: 'Home',
        description: 'The MLVH interactive 3D front desk: check the calendar, see who is on duty today, etc.',
    },
    [ROUTE_PATIENTS]: {
        title: brandTitle('patient admin'),
        heading: 'Patient Administration',
        description: 'Admit new patients, search the hospital roster and manage discharges. Create your own character.',
    },
    [ROUTE_MEDICAL_RECORDS]: {
        title: brandTitle('medical records'),
        heading: 'Medical Records',
        description: 'Search any registered patient, read their full medical history and log new consultation records.',
    },
    [ROUTE_NOT_FOUND]: {
        title: brandTitle('not found'),
        heading: 'Page Not Found',
        description: 'This page does not exist in our hospital.',
        noindex: true,
    },
};