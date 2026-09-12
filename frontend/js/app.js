// --- Main router ---

import { getPatientAdminView, getPatientModal, initPatientAdminLogic } from './views/patients/patientadmin.js';
import { getMedicalRecordsView, initMedicalRecordsLogic } from './views/records/medicalrecords.js';
import { getHomeView, initHomeLogic } from './views/home/home.js';
import { getAboutView, initAboutLogic } from './views/about/about.js';
import { getNotFoundView, initNotFoundLogic } from './views/notfound/notfound.js';
import {
    ROUTE_ABOUT,
    ROUTE_HOME,
    ROUTE_PATIENTS,
    ROUTE_MEDICAL_RECORDS,
    ROUTE_NOT_FOUND,
    ROUTE_PATHS,
} from './constants/routes.js';
import { applyRouteMeta } from './seo.js';

const appRoot = document.getElementById('app-root');
const modalRoot = document.getElementById('modal-root');

// --- Header navigation history ---
const HISTORY_INDEX_KEY = 'mlvh:historyIndex';
const HISTORY_MAX_INDEX_KEY = 'mlvh:historyMaxIndex';
const readHistoryPosition = (key) => Number(window.sessionStorage.getItem(key)) || 0;
const writeHistoryPosition = (key, value) => window.sessionStorage.setItem(key, String(value));
const getHistoryIndex = () => window.history.state?.index ?? 0;

const resolveNewEntryIndex = () => {
    const stored = window.sessionStorage.getItem(HISTORY_INDEX_KEY);
    return stored === null ? 0 : Number(stored) + 1;
};

const commitHistoryIndex = (index, { truncate = false } = {}) => {
    writeHistoryPosition(HISTORY_INDEX_KEY, index);
    const maxIndex = truncate ? index : Math.max(index, readHistoryPosition(HISTORY_MAX_INDEX_KEY));
    writeHistoryPosition(HISTORY_MAX_INDEX_KEY, maxIndex);
};

const stampHistoryEntry = (routeName, options) => {
    const restoredIndex = window.history.state?.index;
    const index = restoredIndex ?? resolveNewEntryIndex();
    window.history.replaceState({ routeName, options, index }, '', window.location.href);
    commitHistoryIndex(index, { truncate: restoredIndex === undefined });
};

const updateHeaderNavState = () => {
    const backBtn = document.getElementById('nav-back');
    const forwardBtn = document.getElementById('nav-forward');
    const index = getHistoryIndex();
    commitHistoryIndex(index);

    if (backBtn) backBtn.disabled = index === 0;
    if (forwardBtn) forwardBtn.disabled = index >= readHistoryPosition(HISTORY_MAX_INDEX_KEY);
};

// Maps each nav to its route
const NAV_ROUTES = {
    'nav-home': ROUTE_HOME,
    'nav-home-link': ROUTE_HOME,
    'nav-patients': ROUTE_PATIENTS,
    'nav-medical-records': ROUTE_MEDICAL_RECORDS,
};

const NAV_LINK_IDS = ['nav-home-link', 'nav-patients', 'nav-medical-records'];

const PATH_TO_ROUTE = Object.fromEntries(
    Object.entries(ROUTE_PATHS).map(([routeName, path]) => [path, routeName])
);

const buildPath = (routeName, options = {}) => {
    const base = ROUTE_PATHS[routeName] ?? ROUTE_PATHS[ROUTE_ABOUT];
    if (routeName === ROUTE_MEDICAL_RECORDS && options.patientId) {
        return `${base}?patientId=${encodeURIComponent(options.patientId)}`;
    }
    return base;
};

const normalizePath = (pathname) => {
    return pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
};

const resolveRouteFromLocation = () => {
    const path = normalizePath(window.location.pathname);
    const params = new URLSearchParams(window.location.search);

    const routeName = PATH_TO_ROUTE[path];
    if (!routeName) {
        return { routeName: ROUTE_NOT_FOUND, options: {} };
    }

    if (routeName === ROUTE_MEDICAL_RECORDS) {
        const patientId = params.get('patientId');
        return { routeName, options: patientId ? { patientId } : {} };
    }

    return { routeName, options: {} };
};

const routes = {
    [ROUTE_ABOUT]: () => {
        appRoot.innerHTML = getAboutView();
        modalRoot.innerHTML = '';
        initAboutLogic();
    },
    [ROUTE_HOME]: () => {
        appRoot.innerHTML = getHomeView();
        modalRoot.innerHTML = '';
        initHomeLogic();
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
    [ROUTE_NOT_FOUND]: () => {
        appRoot.innerHTML = getNotFoundView();
        modalRoot.innerHTML = '';
        initNotFoundLogic();
    },
};

const highlightActiveNav = (routeName) => {
    NAV_LINK_IDS.forEach((id) => {
        document.getElementById(id)?.classList.toggle('active', NAV_ROUTES[id] === routeName);
    });
    document.documentElement.dataset.mlvhRoute = ROUTE_PATHS[routeName] ?? '';
};

const pushRouteUrl = (routeName, options = {}) => {
    const path = buildPath(routeName, options);
    if (window.location.pathname + window.location.search !== path) {
        const index = getHistoryIndex() + 1;
        window.history.pushState({ routeName, options, index }, '', path);
        commitHistoryIndex(index, { truncate: true });
    }
};

const navigateTo = (routeName, options = {}, { push = true } = {}) => {
    const render = routes[routeName];
    if (!render) return;

    render(options);
    highlightActiveNav(routeName);
    applyRouteMeta(routeName);
    document.body.classList.toggle('mlvh-entry-screen', routeName === ROUTE_ABOUT);

    if (push) pushRouteUrl(routeName, options);

    updateHeaderNavState();
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

    document.addEventListener('mlvh:sync-url', (event) => {
        pushRouteUrl(event.detail.route, event.detail.options);
        updateHeaderNavState();
    });
};

const initSidebarToggle = () => {
    const sidebar = document.querySelector('.mlvh-sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle');
    const closeBtn = document.getElementById('sidebar-close');
    const backdrop = document.getElementById('sidebar-backdrop');

    const setSidebarOpen = (open) => {
        sidebar.classList.toggle('open', open);
        backdrop.classList.toggle('show', open);
        toggleBtn.setAttribute('aria-expanded', String(open));
    };

    const closeSidebar = () => setSidebarOpen(false);

    const closeSidebarForNavigation = () => {
        document.documentElement.dataset.mlvhNavigating = '';
        closeSidebar();
    };

    window.addEventListener('pagehide', closeSidebarForNavigation);

    window.addEventListener('pageshow', () => {
        delete document.documentElement.dataset.mlvhNavigating;
    });

    toggleBtn.addEventListener('click', () => {
        setSidebarOpen(!sidebar.classList.contains('open'));
    });

    closeBtn.addEventListener('click', () => {
        closeSidebar();
        navigateTo(ROUTE_ABOUT);
    });

    backdrop.addEventListener('click', closeSidebar);

    document.querySelectorAll('.mlvh-sidebar-link').forEach((link) => {
        link.addEventListener('click', closeSidebarForNavigation);
    });
};

const initSkipLink = () => {
    const skipLink = document.querySelector('.mlvh-skip-link');
    const main = document.getElementById('main-content');

    skipLink?.addEventListener('click', (event) => {
        event.preventDefault();
        main.focus();
    });
};

const initHeaderNav = () => {
    document.getElementById('nav-back')?.addEventListener('click', () => window.history.back());
    document.getElementById('nav-forward')?.addEventListener('click', () => window.history.forward());

    window.addEventListener('pageshow', updateHeaderNavState);
};

// Application bootstrap
window.addEventListener('popstate', () => {
    const { routeName, options } = resolveRouteFromLocation();
    navigateTo(routeName, options, { push: false });
});

function bootstrap() {
    initRouter();
    initSidebarToggle();
    initSkipLink();
    initHeaderNav();
    const { routeName, options } = resolveRouteFromLocation();
    stampHistoryEntry(routeName, options);
    navigateTo(routeName, options, { push: false });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
} else {
    bootstrap();
}