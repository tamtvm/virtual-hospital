// --- Main router ---

import { getPatientAdminView, getPatientModal, initPatientAdminLogic } from './views/patients/patientadmin.js';
import { getMedicalRecordsView, initMedicalRecordsLogic } from './views/records/medicalrecords.js';
import { getHomeView, initHomeLogic } from './views/home/home.js';
import { getAboutView, initAboutLogic } from './views/about/about.js';
import { getNotFoundView, initNotFoundLogic } from './views/notfound/notfound.js';

const appRoot = document.getElementById('app-root');
const modalRoot = document.getElementById('modal-root');

// --- Header navigation history ---
const updateHeaderNavState = () => {
    const backBtn = document.getElementById('nav-back');
    const forwardBtn = document.getElementById('nav-forward');
    const nav = window.navigation;
    if (backBtn) {
        const disabled = nav ? !nav.canGoBack : false;
        if (backBtn.disabled !== disabled) backBtn.disabled = disabled;
    }
    if (forwardBtn) {
        const disabled = nav ? !nav.canGoForward : false;
        if (forwardBtn.disabled !== disabled) forwardBtn.disabled = disabled;
    }
};

const ROUTE_ABOUT = 'about';
const ROUTE_HOME = 'home';
const ROUTE_PATIENTS = 'patients';
const ROUTE_MEDICAL_RECORDS = 'medical-records';
const ROUTE_NOT_FOUND = 'not-found';

// Maps each nav to its route
const NAV_ROUTES = {
    'nav-home': ROUTE_HOME,
    'nav-home-link': ROUTE_HOME,
    'nav-patients': ROUTE_PATIENTS,
    'nav-medical-records': ROUTE_MEDICAL_RECORDS,
};

const NAV_LINK_IDS = ['nav-home-link', 'nav-patients', 'nav-medical-records'];

const ROUTE_PATHS = {
    [ROUTE_ABOUT]: '/about',
    [ROUTE_HOME]: '/home',
    [ROUTE_PATIENTS]: '/patients',
    [ROUTE_MEDICAL_RECORDS]: '/medical-records',
};

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

    if (path === '/') {
        return { routeName: ROUTE_ABOUT, options: {} };
    }

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
        window.history.pushState({ routeName, options }, '', path);
    }
};

const navigateTo = (routeName, options = {}, { push = true } = {}) => {
    const render = routes[routeName];
    if (!render) return;

    render(options);
    highlightActiveNav(routeName);
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

    const closeSidebar = () => {
        sidebar.classList.remove('open');
        backdrop.classList.remove('show');
    };

    const closeSidebarForNavigation = () => {
        document.documentElement.dataset.mlvhNavigating = '';
        closeSidebar();
    };

    window.addEventListener('pagehide', closeSidebarForNavigation);

    window.addEventListener('pageshow', () => {
        delete document.documentElement.dataset.mlvhNavigating;
    });

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
        link.addEventListener('click', closeSidebarForNavigation);
    });
};

const initHeaderNav = () => {
    document.getElementById('nav-back')?.addEventListener('click', () => window.history.back());
    document.getElementById('nav-forward')?.addEventListener('click', () => window.history.forward());

    window.navigation?.addEventListener('currententrychange', updateHeaderNavState);
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
    initHeaderNav();
    const { routeName, options } = resolveRouteFromLocation();
    navigateTo(routeName, options, { push: false });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
} else {
    bootstrap();
}