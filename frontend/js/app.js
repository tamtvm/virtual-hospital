// --- Main router ---

import { getPatientAdminView, getPatientModal, initPatientAdminLogic } from './views/patients/patientadmin.js';

const appRoot = document.getElementById('app-root');
const modalRoot = document.getElementById('modal-root');

const ROUTE_PATIENTS = 'patients';
const ROUTE_CONSULTATIONS = 'consultations';

// Maps each nav to its route
const NAV_ROUTES = {
    'nav-home': ROUTE_PATIENTS,
    'nav-patients': ROUTE_PATIENTS,
    'nav-consultations': ROUTE_CONSULTATIONS,
};

const NAV_LINK_IDS = ['nav-patients', 'nav-consultations'];

const routes = {
    [ROUTE_PATIENTS]: () => {
        appRoot.innerHTML = getPatientAdminView();
        modalRoot.innerHTML = getPatientModal();
        initPatientAdminLogic();
    },
    [ROUTE_CONSULTATIONS]: () => {
        appRoot.innerHTML = `
            <div class="container text-center py-5">
                <h2 class="fw-bold text-muted">Consultations</h2>
                <p class="text-muted">I havent built this section yet!! pls wait ok</p>
            </div>
        `;

        modalRoot.innerHTML = '';
    },
};

const highlightActiveNav = (routeName) => {
    NAV_LINK_IDS.forEach((id) => {
        document.getElementById(id)?.classList.toggle('active', NAV_ROUTES[id] === routeName);
    });
};

const navigateTo = (routeName) => {
    const render = routes[routeName];
    if (!render) return;
    render();
    highlightActiveNav(routeName);
};

const initRouter = () => {
    Object.entries(NAV_ROUTES).forEach(([navId, routeName]) => {
        document.getElementById(navId)?.addEventListener('click', (event) => {
            event.preventDefault();
            navigateTo(routeName);
        });
    });
};

const initSidebarToggle = () => {
    const sidebar = document.querySelector('.mlvh-sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle');
    const backdrop = document.getElementById('sidebar-backdrop');

    const closeSidebar = () => {
        sidebar.classList.remove('open');
        backdrop.classList.remove('show');
    };

    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        backdrop.classList.toggle('show');
    });

    backdrop.addEventListener('click', closeSidebar);

    document.querySelectorAll('.mlvh-sidebar-link').forEach((link) => {
        link.addEventListener('click', closeSidebar);
    });
};

// Application bootstrap
document.addEventListener('DOMContentLoaded', () => {
    initRouter();
    initSidebarToggle();
    navigateTo(ROUTE_PATIENTS);
});