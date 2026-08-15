// --- MODULE: medical records view ---

import { fetchPatients, fetchPatientRecords, addPatientRecord, ApiError } from '../../api/patients.js';
import { AVATAR_BASE_PATH, DEFAULT_AVATAR } from '../../config.js';
import { escapeHtml, setAvatarWithFallback, formatDisplayDate } from '../../utils/dom.js';
import { LOCATIONS, SPECIES, SEXES, CONSULTATION_TYPES, PROFESSIONALS, CALENDAR_ICON, renderOptions } from '../../constants/patientOptions.js';
import { formatRecordSummary, PROFESSIONAL_LABELS } from '../../constants/recordOptions.js';
import { showToast } from '../../utils/toast.js';

const LOCATION_LABELS = Object.fromEntries(LOCATIONS.map(({ value, label }) => [value, label]));
const SPECIES_LABELS = Object.fromEntries(SPECIES.map(({ value, label }) => [value, label]));
const SEX_LABELS = Object.fromEntries(SEXES.map(({ value, label }) => [value, label]));

// --- Keeps the styled date text in sync with the (visually hidden) native date input ---
const wireDateBadge = (inputId, textId) => {
    const input = document.getElementById(inputId);
    const text = document.getElementById(textId);
    if (!input || !text) return;

    text.textContent = formatDisplayDate(input.value);
    input.addEventListener('change', () => {
        text.textContent = formatDisplayDate(input.value);
    });
};

export const getMedicalRecordsView = () => {
    return `
    <div class="mlvh-card mlvh-record-search-card">
        <div class="mlvh-card-body">
            <div class="mlvh-search-field">
                <img src="/assets/icons/misc/search.svg" alt="">
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

    return records.map((record) => {
        const dateLabel = record.record_date ?? (record.created_at ? record.created_at.slice(0, 10) : '');
        const professionalLabel = PROFESSIONAL_LABELS[record.assigned_professional];

        return `
        <div class="mlvh-history-entry" data-record-id="${record.id}" role="button" tabindex="0">
            <div class="mlvh-history-entry-header">
                <span class="mlvh-history-entry-date">${escapeHtml(dateLabel)}</span>
                ${professionalLabel ? `<span class="mlvh-history-entry-professional">${escapeHtml(professionalLabel)}</span>` : ''}
            </div>
            <div class="mlvh-history-entry-text">${escapeHtml(formatRecordSummary(record))}</div>
            ${record.diagnosis ? `<div class="mlvh-history-entry-diagnosis">Diagnosis: ${escapeHtml(record.diagnosis)}</div>` : ''}
        </div>
        `;
    }).join('');
};

// --- Add-record form ---
const getRecordFormHTML = () => `
    <form id="record-form">
        <fieldset id="record-fieldset">
            <div class="row">
                <div class="col-6 mb-2">
                    <label class="form-label small text-muted mb-0 d-block">Consultation Type</label>
                    <select class="form-select form-select-sm mlvh-rounded-input" id="record-consultation-type" required>
                        ${renderOptions(CONSULTATION_TYPES)}
                    </select>
                </div>
                <div class="col-6 mb-2">
                    <label class="form-label small text-muted mb-0 d-block">Professional</label>
                    <select class="form-select form-select-sm mlvh-rounded-input" id="record-professional" required>
                        ${renderOptions(PROFESSIONALS)}
                    </select>
                </div>
            </div>
            <div class="row">
                <div class="col-7 mb-2">
                    <label class="form-label small text-muted mb-0 d-block">Diagnosis</label>
                    <input type="text" class="form-control form-control-sm mlvh-rounded-input" id="record-diagnosis" placeholder="Optional">
                </div>
                <div class="col-5 mb-2">
                    <label class="form-label small text-muted mb-0 d-block">Date</label>
                    <div class="mlvh-date-badge">
                        <img src="${CALENDAR_ICON}" alt="">
                        <span class="mlvh-date-badge-text" id="record-date-text"></span>
                        <input type="date" class="mlvh-date-badge-input" id="record-date" required>
                    </div>
                </div>
            </div>
            <div class="mb-2">
                <label class="form-label small text-muted mb-0 d-block">Description</label>
                <textarea class="form-control form-control-sm mlvh-rounded-textarea" id="record-description" rows="2" placeholder="What happened during this visit..." required></textarea>
            </div>
            <div class="mb-2">
                <label class="form-label small text-muted mb-0 d-block">Procedures Performed</label>
                <textarea class="form-control form-control-sm mlvh-rounded-textarea" id="record-procedures" rows="2" placeholder="Optional"></textarea>
            </div>
            <div class="mb-2">
                <label class="form-label small text-muted mb-0 d-block">Indications</label>
                <textarea class="form-control form-control-sm mlvh-rounded-textarea" id="record-indications" rows="2" placeholder="Optional"></textarea>
            </div>
        </fieldset>
    </form>
`;

// --- LOGIC: event listeners and dom manipulation ---

export const initMedicalRecordsLogic = (initialPatientId = null) => {

    const searchInput = document.getElementById('record-patient-search');
    const resultsList = document.getElementById('record-search-results');
    const historyPlaceholder = document.getElementById('record-history-placeholder');

    let localPatients = [];
    let currentRecords = [];

    if (!searchInput || !resultsList) {
        console.error('Medical Records DOM elements not found.');
        return;
    }

    const loadPatients = async () => {
        try {
            localPatients = await fetchPatients();

            if (initialPatientId != null) {
                selectPatient(initialPatientId);
            }
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
        currentRecords = records;
        const displayId = `${patient.location}-${patient.id_number}`;

        historyPlaceholder.innerHTML = `
        <div class="mlvh-card mlvh-history-card">
            <div class="mlvh-history-card-actions js-history-actions">
                <button type="button" class="btn mlvh-admit-btn shadow-sm js-add-record" aria-label="Add Record">
                    <img src="/assets/icons/misc/plus.svg" alt="" class="mlvh-btn-icon">
                </button>
            </div>
            <div class="mlvh-folder-header d-flex justify-content-between align-items-center">
                <h5 class="fw-bold mb-0 mlvh-folder-tab-title">medical history</h5>
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
                    <div class="mlvh-history-add-mobile-row js-history-actions">
                        <button type="button" class="btn mlvh-admit-btn shadow-sm js-add-record" aria-label="Add Record">
                            <img src="/assets/icons/misc/plus.svg" alt="" class="mlvh-btn-icon">
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
                renderRecordForm(patient);
            });
        });

        const recordList = document.getElementById('history-record-list');
        recordList?.addEventListener('click', (event) => {
            const entry = event.target.closest('.mlvh-history-entry');
            if (!entry) return;
            const record = currentRecords.find((r) => r.id == entry.dataset.recordId);
            if (record) renderRecordDetail(patient, record);
        });
    };

    const setCardActions = (extraButtons) => {
        historyPlaceholder.querySelectorAll('.js-history-actions').forEach((container) => {
            container.querySelectorAll('.js-dynamic-action').forEach((btn) => btn.remove());
            const plusBtn = container.querySelector('.js-add-record');

            extraButtons.forEach((config) => {
                const btn = document.createElement('button');
                btn.type = config.type ?? 'button';
                if (config.form) btn.setAttribute('form', config.form);
                btn.className = 'btn mlvh-admit-btn shadow-sm js-dynamic-action';
                btn.setAttribute('aria-label', config.label);
                btn.innerHTML = `<img src="${config.icon}" alt="" class="mlvh-btn-icon">`;
                if (config.onClick) btn.addEventListener('click', config.onClick);
                container.insertBefore(btn, plusBtn);
            });
        });
    };

    const renderRecordForm = (patient) => {
        const timelineCol = historyPlaceholder.querySelector('.mlvh-history-timeline-col');
        if (!timelineCol) return;

        timelineCol.innerHTML = getRecordFormHTML();
        document.getElementById('record-date').value = new Date().toISOString().slice(0, 10);
        wireDateBadge('record-date', 'record-date-text');

        const backToHistory = async () => {
            try {
                const records = await fetchPatientRecords(patient.id);
                renderHistoryCard(patient, records);
            } catch (error) {
                console.error('API Error:', error);
            }
        };

        setCardActions([
            { icon: '/assets/icons/misc/back.svg', label: 'Cancel', onClick: backToHistory },
            { icon: '/assets/icons/misc/save.svg', label: 'Save Record', type: 'submit', form: 'record-form' },
        ]);

        document.getElementById('record-form').addEventListener('submit', async (event) => {
            event.preventDefault();

            const payload = {
                consultation_type: document.getElementById('record-consultation-type').value,
                assigned_professional: document.getElementById('record-professional').value,
                diagnosis: document.getElementById('record-diagnosis').value,
                record_date: document.getElementById('record-date').value,
                description: document.getElementById('record-description').value,
                procedures: document.getElementById('record-procedures').value,
                indications: document.getElementById('record-indications').value,
            };

            try {
                await addPatientRecord(patient.id, payload);
                showToast('Record saved successfully.');
                await backToHistory();
            } catch (error) {
                console.error('API Error:', error);
                showToast(error instanceof ApiError ? error.message : 'Error saving record.', 'error');
            }
        });
    };

    const renderRecordDetail = (patient, record) => {
        const timelineCol = historyPlaceholder.querySelector('.mlvh-history-timeline-col');
        if (!timelineCol) return;

        timelineCol.innerHTML = getRecordFormHTML();

        document.getElementById('record-consultation-type').value = record.consultation_type;
        document.getElementById('record-professional').value = record.assigned_professional;
        document.getElementById('record-diagnosis').value = record.diagnosis;
        document.getElementById('record-date').value = record.record_date ?? '';
        wireDateBadge('record-date', 'record-date-text');
        document.getElementById('record-description').value = record.description;
        document.getElementById('record-procedures').value = record.procedures;
        document.getElementById('record-indications').value = record.indications;

        document.getElementById('record-fieldset').disabled = true;

        setCardActions([
            { icon: '/assets/icons/misc/back.svg', label: 'Back to history', onClick: () => renderHistoryCard(patient, currentRecords) },
        ]);
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