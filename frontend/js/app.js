// --- Main router ---

import { getPatientAdminView, getPatientModal, initPatientAdminLogic } from './views/patients/patientadmin.js';

const appRoot = document.getElementById('app-root');
const modalRoot = document.getElementById('modal-root');

const loadPatientAdmin = () => {
    appRoot.innerHTML = getPatientAdminView();
    modalRoot.innerHTML = getPatientModal();
    initPatientAdminLogic();
};

// Application bootstrap
document.addEventListener('DOMContentLoaded', () => {
    loadPatientAdmin();
});