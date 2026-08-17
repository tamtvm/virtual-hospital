// --- Main router ---

import { getPatientAdminView, getPatientModal, initPatientAdminLogic } from './views/patients/patientadmin.js';
import { getMedicalRecordsView, initMedicalRecordsLogic } from './views/records/medicalrecords.js';
import { getAboutView, initAboutLogic } from './views/about/about.js';

const appRoot = document.getElementById('app-root');
const modalRoot = document.getElementById('modal-root');

const ROUTE_ABOUT = 'about';
const ROUTE_PATIENTS = 'patients';
const ROUTE_MEDICAL_RECORDS = 'medical-records';

// Maps each nav to its route
const NAV_ROUTES = {
    'nav-home': ROUTE_PATIENTS,
    'nav-patients': ROUTE_PATIENTS,
    'nav-medical-records': ROUTE_MEDICAL_RECORDS,
};

const NAV_LINK_IDS = ['nav-patients', 'nav-medical-records'];

const ROUTE_PATHS = {
    [ROUTE_ABOUT]: '/about',
    [ROUTE_PATIENTS]: '/patients',
    [ROUTE_MEDICAL_RECORDS]: '/medical-records',
};

const buildPath = (routeName, options = {}) => {
    const base = ROUTE_PATHS[routeName] ?? ROUTE_PATHS[ROUTE_ABOUT];
    if (routeName === ROUTE_MEDICAL_RECORDS && options.patientId) {
        return `${base}?patientId=${encodeURIComponent(options.patientId)}`;
    }
    return base;
};

const resolveRouteFromLocation = () => {
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);

    if (path.startsWith('/patients')) {
        return { routeName: ROUTE_PATIENTS, options: {} };
    }
    if (path.startsWith('/medical-records')) {
        const patientId = params.get('patientId');
        return { routeName: ROUTE_MEDICAL_RECORDS, options: patientId ? { patientId } : {} };
    }
    return { routeName: ROUTE_ABOUT, options: {} };
};

const routes = {
    [ROUTE_ABOUT]: () => {
        appRoot.innerHTML = getAboutView();
        modalRoot.innerHTML = '';
        initAboutLogic();
    },
    [ROUTE_PATIENTS]: () => {
        appRoot.innerHTML = getPatientAdminView();
        modalRoot.innerHTML = getPatientModal();
        initPatientAdminLogic();
    },
    [ROUTE_MEDICAL_RECORDS]: (options = {}) => {
        appRoot.innerHTML = getMedicalRecordsView();
        modalRoot.innerHTML = '';
        initMedicalRecordsLogic(options.patientId);
    },
};

const highlightActiveNav = (routeName) => {
    NAV_LINK_IDS.forEach((id) => {
        document.getElementById(id)?.classList.toggle('active', NAV_ROUTES[id] === routeName);
    });
};

const navigateTo = (routeName, options = {}, { push = true } = {}) => {
    const render = routes[routeName];
    if (!render) return;

    render(options);
    highlightActiveNav(routeName);
    document.body.classList.toggle('mlvh-entry-screen', routeName === ROUTE_ABOUT);

    if (push) {
        const path = buildPath(routeName, options);
        if (window.location.pathname + window.location.search !== path) {
            window.history.pushState({ routeName, options }, '', path);
        }
    }
};

const initRouter = () => {
    Object.entries(NAV_ROUTES).forEach(([navId, routeName]) => {
        document.getElementById(navId)?.addEventListener('click', (event) => {
            event.preventDefault();
            navigateTo(routeName);
        });
    });

    document.addEventListener('mlvh:navigate', (event) => {
        navigateTo(event.detail.route, event.detail.options);
    });
};

const initSidebarToggle = () => {
    const sidebar = document.querySelector('.mlvh-sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle');
    const closeBtn = document.getElementById('sidebar-close');
    const backdrop = document.getElementById('sidebar-backdrop');

    const closeSidebar = () => {
        sidebar.classList.remove('open');
        backdrop.classList.remove('show');
    };

    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        backdrop.classList.toggle('show');
    });

    closeBtn.addEventListener('click', () => {
        closeSidebar();
        navigateTo(ROUTE_ABOUT);
    });

    backdrop.addEventListener('click', closeSidebar);

    document.querySelectorAll('.mlvh-sidebar-link').forEach((link) => {
        link.addEventListener('click', closeSidebar);
    });
};

// Application bootstrap
window.addEventListener('popstate', () => {
    const { routeName, options } = resolveRouteFromLocation();
    navigateTo(routeName, options, { push: false });
});

function bootstrap() {
    initRouter();
    initSidebarToggle();
    const { routeName, options } = resolveRouteFromLocation();
    navigateTo(routeName, options, { push: false });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
} else {
    bootstrap();
}