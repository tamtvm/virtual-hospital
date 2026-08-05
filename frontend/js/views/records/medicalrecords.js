// --- MODULE: medical records view ---

import { fetchPatients } from '../../api/patients.js';
import { AVATAR_BASE_PATH, DEFAULT_AVATAR } from '../../config.js';
import { escapeHtml, setAvatarWithFallback } from '../../utils/dom.js';

export const getMedicalRecordsView = () => {
    return `
    <div class="mlvh-card mlvh-record-search-card">
        <div class="mlvh-card-body">
            <div class="mlvh-search-field">
                <img src="assets/icons/misc/search.svg" alt="">
                <input type="text" id="record-patient-search" class="form-control form-control-sm border-0 bg-transparent p-0" placeholder="Search patient by name or ID...">
            </div>
            <div id="record-search-results" class="mlvh-record-results"></div>
        </div>
    </div>

    <div id="record-history-placeholder"></div>
    `;
};

// --- LOGIC: event listeners and dom manipulation ---

export const initMedicalRecordsLogic = () => {

    const searchInput = document.getElementById('record-patient-search');
    const resultsList = document.getElementById('record-search-results');
    const historyPlaceholder = document.getElementById('record-history-placeholder');

    let localPatients = [];

    if (!searchInput || !resultsList) {
        console.error('Medical Records DOM elements not found.');
        return;
    }

    const loadPatients = async () => {
        try {
            localPatients = await fetchPatients();
        } catch (error) {
            console.error('API Error:', error);
        }
    };

    const filterPatients = (patients, query) => {
        const normalizedQuery = query.trim().toLowerCase();
        if (!normalizedQuery) return [];

        return patients.filter((patient) => {
            const displayId = `${patient.location}-${patient.id_number}`.toLowerCase();
            return patient.name.toLowerCase().includes(normalizedQuery) || displayId.includes(normalizedQuery);
        });
    };

    const renderResults = (patients) => {
        if (patients.length === 0) {
            resultsList.innerHTML = '';
            return;
        }

        resultsList.innerHTML = patients.map((patient) => {
            const displayId = `${patient.location}-${patient.id_number}`;
            return `
            <div class="mlvh-record-result-item" data-id="${patient.id}">
                <img data-avatar-src="${AVATAR_BASE_PATH}/${patient.avatar_style}.png" alt="${escapeHtml(patient.name)}">
                <div>
                    <div class="mlvh-record-result-name">${escapeHtml(patient.name)}</div>
                    <div class="mlvh-record-result-id">${escapeHtml(displayId)}</div>
                </div>
            </div>
            `;
        }).join('');

        resultsList.querySelectorAll('.mlvh-record-result-item img').forEach((img) => {
            setAvatarWithFallback(img, img.dataset.avatarSrc, DEFAULT_AVATAR);
        });
    };

    const selectPatient = (id) => {
        const patient = localPatients.find((p) => p.id == id);
        if (!patient) return;

        searchInput.value = patient.name;
        resultsList.innerHTML = '';

        historyPlaceholder.innerHTML = `
            <div class="mlvh-card text-center py-5">
                <p class="mlvh-card-subtitle mb-0">Selected ${escapeHtml(patient.name)} [${patient.location}-${patient.id_number}]</p>
            </div>
        `;
    };

    searchInput.addEventListener('input', () => {
        renderResults(filterPatients(localPatients, searchInput.value));
    });

    resultsList.addEventListener('click', (event) => {
        const item = event.target.closest('.mlvh-record-result-item');
        if (!item) return;
        selectPatient(item.dataset.id);
    });

    loadPatients();
};