// --- MODULE: medical records view ---

import { fetchPatients, fetchPatientRecords } from '../../api/patients.js';
import { AVATAR_BASE_PATH, DEFAULT_AVATAR } from '../../config.js';
import { escapeHtml, setAvatarWithFallback } from '../../utils/dom.js';
import { LOCATIONS, SPECIES, SEXES } from '../../constants/patientOptions.js';
import { formatRecordSummary } from '../../constants/recordOptions.js';
import { showToast } from '../../utils/toast.js';

const LOCATION_LABELS = Object.fromEntries(LOCATIONS.map(({ value, label }) => [value, label]));
const SPECIES_LABELS = Object.fromEntries(SPECIES.map(({ value, label }) => [value, label]));
const SEX_LABELS = Object.fromEntries(SEXES.map(({ value, label }) => [value, label]));

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

// --- Profile summary rows for the history card ---

const buildSummaryRows = (patient) => {
    const rows = [
        ['species', SPECIES_LABELS[patient.species] ?? patient.species],
        ['sex', SEX_LABELS[patient.sex] ?? patient.sex],
        ['pronouns', patient.pronouns],
        ['age', patient.age],
        ['location', LOCATION_LABELS[patient.location] ?? patient.location],
    ];

    return rows.map(([label, value]) => `
        <div class="mlvh-history-summary-row">
            <dt>${escapeHtml(label)}</dt>
            <dd>${escapeHtml(String(value))}</dd>
        </div>
    `).join('');
};

// --- Timeline entries for the history card ---

const buildHistoryEntries = (records) => {
    if (!records || records.length === 0) {
        return '<p class="mlvh-card-subtitle text-center mb-0">No records yet.</p>';
    }

    return records.map((record) => `
        <div class="mlvh-history-entry">
            <div class="mlvh-history-entry-date">${record.created_at ? record.created_at.slice(0, 10) : ''}</div>
            <div class="mlvh-history-entry-text">${escapeHtml(formatRecordSummary(record))}</div>
        </div>
    `).join('');
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

    const renderHistoryCard = (patient, records) => {
        const displayId = `${patient.location}-${patient.id_number}`;

        historyPlaceholder.innerHTML = `
        <div class="mlvh-card mlvh-history-card">
            <button type="button" class="btn mlvh-admit-btn shadow-sm mlvh-history-add-btn js-add-record" aria-label="Add Record">
                <img src="assets/icons/misc/plus.svg" alt="" class="mlvh-btn-icon">
            </button>
            <div class="mlvh-folder-header d-flex justify-content-between align-items-center">
                <h5 class="fw-bold mb-0 mlvh-folder-tab-title">Medical History</h5>
            </div>
            <div class="mlvh-card-body">
                <div class="mlvh-history-columns">
                    <div class="text-center d-flex flex-column mlvh-profile-left-col mlvh-history-profile-col">
                        <div class="mlvh-avatar-stage">
                            <img id="history-avatar" alt="${escapeHtml(patient.name)}" class="img-fluid mb-2 mlvh-detail-avatar-img">
                        </div>
                        <h5 class="fw-bold mt-3 mb-0">${escapeHtml(patient.name)}</h5>
                        <p class="text-muted small mb-3">[${displayId}]</p>
                        <dl class="text-start mb-0">
                            ${buildSummaryRows(patient)}
                        </dl>
                    </div>
                    <div class="mlvh-history-add-mobile-row">
                        <button type="button" class="btn mlvh-admit-btn shadow-sm js-add-record" aria-label="Add Record">
                            <img src="assets/icons/misc/plus.svg" alt="" class="mlvh-btn-icon">
                        </button>
                    </div>
                    <div class="mlvh-profile-right-col mlvh-history-timeline-col">
                        <div id="history-record-list" class="mlvh-history-list">
                            ${buildHistoryEntries(records)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;

        setAvatarWithFallback(
            document.getElementById('history-avatar'),
            `${AVATAR_BASE_PATH}/${patient.avatar_style}.png`,
            DEFAULT_AVATAR
        );

        historyPlaceholder.querySelectorAll('.js-add-record').forEach((btn) => {
            btn.addEventListener('click', () => {
                showToast('Adding new records is not built yet, next step!', 'error');
            });
        });
    };

    const selectPatient = async (id) => {
        const patient = localPatients.find((p) => p.id == id);
        if (!patient) return;

        searchInput.value = patient.name;
        resultsList.innerHTML = '';

        historyPlaceholder.innerHTML = `
            <div class="mlvh-card text-center py-5">
                <p class="mlvh-card-subtitle mb-0">Loading history...</p>
            </div>
        `;

        try {
            const records = await fetchPatientRecords(patient.id);
            renderHistoryCard(patient, records);
        } catch (error) {
            console.error('API Error:', error);
            historyPlaceholder.innerHTML = `
                <div class="mlvh-card text-center py-5">
                    <p class="mlvh-card-subtitle mb-0">Could not load this patient's history.</p>
                </div>
            `;
        }
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