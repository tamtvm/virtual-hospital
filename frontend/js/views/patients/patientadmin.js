// --- MODULE: patient administration view ---

import { AVATAR_BASE_PATH, DEFAULT_AVATAR } from '../../config.js';
import { fetchPatients, createPatient, updatePatient, dischargePatient, ApiError } from '../../api/patients.js';
import {
    LOCATIONS,
    SPECIES,
    SEXES,
    PRONOUNS,
    CONSULTATION_TYPES,
    PROFESSIONALS,
    SPECIES_ICONS,
    SEX_ICONS,
    CALENDAR_ICON,
    PENCIL_ICON,
    ID_NUMBER_PATTERN,
    ID_NUMBER_MAXLENGTH,
    renderOptions,
    renderIconButtons,
} from '../../constants/patientOptions.js';
import { formatRecordSummary } from '../../constants/recordOptions.js';
import { escapeHtml, setAvatarWithFallback, formatDisplayDate } from '../../utils/dom.js';
import { showToast, confirmAction } from '../../utils/toast.js';

export const getPatientAdminView = () => {
    return `
    <div class="mlvh-card">
        <div class="mlvh-card-header">
            <span class="mlvh-card-tag">Patient Administration</span>
        </div>
        <div class="mlvh-card-body">
        <div class="d-flex align-items-center gap-2 mb-4">
            <div class="mlvh-search-field flex-grow-1">
                <img src="assets/icons/misc/search.svg" alt="">
                <input type="text" id="patient-search" class="form-control form-control-sm border-0 bg-transparent p-0" placeholder="Search by name or ID...">
            </div>
            <button class="btn mlvh-admit-btn shadow-sm flex-shrink-0" data-bs-toggle="modal" data-bs-target="#createPatientModal" aria-label="Admit Patient">
                <img src="assets/icons/misc/plus.svg" alt="" class="mlvh-btn-icon">
            </button>
        </div>

        <span class="d-block mb-3 mlvh-card-subtitle" id="patient-count">Loading roster...</span>
        <div id="patient-gallery" class="mlvh-patient-grid"></div>
        </div>
    </div>
    `;
};

export const getPatientModal = () => {
    return `
    <!-- Create Patient Modal -->
    <div class="modal fade" id="createPatientModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
            <div class="modal-content">
                <!-- Folder header -->
                <div class="modal-header border-0 pb-0 d-flex justify-content-between align-items-center mlvh-folder-header">
                    <h5 class="fw-bold mb-0 mlvh-folder-tab-title">Admit New Patient</h5>
                    <button type="button" class="btn-close me-3" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body p-0">
                    <div class="row g-0">
                        <div class="col-md-5 text-center d-flex flex-column mlvh-profile-left-col">
                            <div class="mlvh-avatar-stage">
                                <img id="avatar-preview" src="${DEFAULT_AVATAR}" alt="Avatar Preview" class="img-fluid mb-2" style="max-height: 220px;">
                                <div class="mlvh-name-field">
                                    <input type="text" class="form-control form-control-sm text-center mlvh-name-input" id="name" placeholder="name" required>
                                    <img src="${PENCIL_ICON}" alt="">
                                </div>
                            </div>
                        </div>
                        <div class="col-md-7 mlvh-profile-right-col">
                            <form id="patient-form">
                                <div class="row">
                                    <div class="col-7 mb-2">
                                        <label class="form-label small text-muted mb-0 d-block">Sex</label>
                                        <div class="mlvh-icon-group" id="sex-icons" data-target="sex">
                                            ${renderIconButtons(SEXES, SEX_ICONS, 'sex')}
                                        </div>
                                        <select class="d-none" id="sex">
                                            ${renderOptions(SEXES)}
                                        </select>
                                    </div>
                                    <div class="col-5 mb-2">
                                        <label class="form-label small text-muted mb-0">Pronouns</label>
                                        <select class="form-select form-select-sm mlvh-rounded-input" id="pronouns">
                                            ${renderOptions(PRONOUNS)}
                                        </select>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-7 mb-2">
                                        <label class="form-label small text-muted mb-0 d-block">Species</label>
                                        <div class="mlvh-icon-group" id="species-icons" data-target="species">
                                            ${renderIconButtons(SPECIES, SPECIES_ICONS, 'species')}
                                        </div>
                                        <select class="d-none" id="species">
                                            ${renderOptions(SPECIES)}
                                        </select>
                                    </div>
                                    <div class="col-5 mb-2">
                                        <label class="form-label small text-muted mb-0">Age</label>
                                        <input type="number" class="form-control form-control-sm mlvh-rounded-input" id="age" min="0" placeholder="e.g. 25" required>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-7 mb-2">
                                        <label class="form-label small text-muted mb-0">Location</label>
                                        <select class="form-select form-select-sm mlvh-rounded-input" id="location" required>
                                            ${renderOptions(LOCATIONS)}
                                        </select>
                                    </div>
                                    <div class="col-5 mb-2">
                                        <label class="form-label small text-muted mb-0">ID Number</label>
                                        <input type="text" class="form-control form-control-sm mlvh-rounded-input" id="id_number" maxlength="${ID_NUMBER_MAXLENGTH}" pattern="${ID_NUMBER_PATTERN}" title="Up to 5 alphanumeric characters" placeholder="e.g. 1234" required>
                                    </div>
                                </div>
                                <div class="mb-2">
                                    <label class="form-label small text-muted mb-0 d-block">Admission Date</label>
                                    <div class="mlvh-date-badge mlvh-date-badge-readonly">
                                        <img src="${CALENDAR_ICON}" alt="">
                                        <span class="mlvh-date-badge-text" id="admission_date"></span>
                                    </div>
                                </div>
                                <div class="mb-2">
                                    <label class="form-label small text-muted mb-0 d-block">Consultation Type</label>
                                    <select class="form-select form-select-sm mlvh-rounded-input" id="consultation_type" required>
                                        ${renderOptions(CONSULTATION_TYPES)}
                                    </select>
                                </div>
                                <div class="mb-2">
                                    <label class="form-label small text-muted mb-0 d-block">Professional</label>
                                    <select class="form-select form-select-sm mlvh-rounded-input" id="assigned_professional" required>
                                        ${renderOptions(PROFESSIONALS)}
                                    </select>
                                </div>
                                <div class="mb-2">
                                    <label class="form-label small text-muted mb-0 d-block">Description</label>
                                    <textarea class="form-control form-control-sm mlvh-rounded-textarea" id="record_description" rows="2" placeholder="Describe why the patient is checking into the hospital today..." required></textarea>
                                </div>
                                <div class="text-end mt-3">
                                    <button type="submit" class="btn btn-primary w-100">Admit to Hospital</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Patient Details / Edit Modal -->
    <div class="modal fade" id="patientDetailsModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
            <div class="modal-content">
                <!-- Folder header -->
                <div class="modal-header border-0 pb-0 d-flex justify-content-between align-items-center mlvh-folder-header">
                    <h5 class="fw-bold mb-0 mlvh-folder-tab-title" id="details-modal-title">Patient Profile</h5>
                    <button type="button" class="btn-close me-3" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body p-0">
                    <form id="patient-details-form">
                        <div class="row g-0">
                            <div class="col-md-5 text-center d-flex flex-column mlvh-profile-left-col">
                                <fieldset id="patient-name-fieldset" disabled>
                                    <div class="mlvh-avatar-stage">
                                        <img id="details-avatar" src="${DEFAULT_AVATAR}" alt="Patient Avatar" class="img-fluid mb-2 mlvh-detail-avatar-img">
                                        <div class="mlvh-name-field">
                                            <input type="text" class="form-control form-control-sm text-center mlvh-name-input" id="details-name">
                                            <img src="${PENCIL_ICON}" alt="">
                                        </div>
                                        <p class="text-muted small mb-0 mt-2" id="details-patient-id"></p>
                                    </div>
                                </fieldset>
                                <div class="d-flex justify-content-center gap-2 mt-3">
                                    <button type="button" class="btn mlvh-admit-btn shadow-sm" id="edit-toggle-btn" aria-label="Edit Profile">
                                        <img src="assets/icons/misc/pencil.svg" alt="" id="edit-toggle-icon" class="mlvh-btn-icon">
                                    </button>
                                    <button type="button" class="btn mlvh-admit-btn shadow-sm" id="history-btn" aria-label="Medical History">
                                        <img src="assets/icons/misc/history.svg" alt="" class="mlvh-btn-icon">
                                    </button>
                                    <button type="button" class="btn mlvh-admit-btn shadow-sm" id="discharge-btn" aria-label="Discharge">
                                        <img src="assets/icons/misc/exit.svg" alt="" class="mlvh-btn-icon">
                                    </button>
                                </div>
                            </div>
                            <div class="col-md-7 mlvh-profile-right-col">
                                <fieldset id="patient-fieldset" disabled>
                                    <div class="row">
                                        <div class="col-7 mb-2">
                                            <label class="form-label small text-muted mb-0 d-block">Sex</label>
                                            <div class="mlvh-icon-group" id="details-sex-icons" data-target="details-sex">
                                                ${renderIconButtons(SEXES, SEX_ICONS, 'details-sex')}
                                            </div>
                                            <select class="d-none" id="details-sex">
                                                ${renderOptions(SEXES)}
                                            </select>
                                        </div>
                                        <div class="col-5 mb-2">
                                            <label class="form-label small text-muted mb-0">Pronouns</label>
                                            <select class="form-select form-select-sm mlvh-rounded-input" id="details-pronouns">
                                                ${renderOptions(PRONOUNS)}
                                            </select>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-7 mb-2">
                                            <label class="form-label small text-muted mb-0 d-block">Species</label>
                                            <div class="mlvh-icon-group" id="details-species-icons" data-target="details-species">
                                                ${renderIconButtons(SPECIES, SPECIES_ICONS, 'details-species')}
                                            </div>
                                            <select class="d-none" id="details-species">
                                                ${renderOptions(SPECIES)}
                                            </select>
                                        </div>
                                        <div class="col-5 mb-2">
                                            <label class="form-label small text-muted mb-0">Age</label>
                                            <input type="number" class="form-control form-control-sm mlvh-rounded-input" id="details-age" min="0" placeholder="e.g. 25">
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-7 mb-2">
                                            <label class="form-label small text-muted mb-0">Location</label>
                                            <select class="form-select form-select-sm mlvh-rounded-input" id="details-location">
                                                ${renderOptions(LOCATIONS)}
                                            </select>
                                        </div>
                                        <div class="col-5 mb-2">
                                            <label class="form-label small text-muted mb-0">ID Number</label>
                                            <input type="text" class="form-control form-control-sm mlvh-rounded-input" id="details-id_number" maxlength="${ID_NUMBER_MAXLENGTH}" pattern="${ID_NUMBER_PATTERN}" title="Up to 5 alphanumeric characters" placeholder="e.g. 1234">
                                        </div>
                                    </div>
                                    <div class="mb-2">
                                        <label class="form-label small text-muted mb-0 d-block">Admission Date</label>
                                        <div class="mlvh-date-badge mlvh-date-badge-readonly">
                                            <img src="${CALENDAR_ICON}" alt="">
                                            <span class="mlvh-date-badge-text" id="details-admission_date"></span>
                                        </div>
                                    </div>
                                    <div class="mb-2">
                                        <label class="form-label small text-muted mb-0 d-block">Latest Record</label>
                                        <textarea class="form-control form-control-sm mlvh-rounded-textarea" id="details-latest-record" rows="3" readonly></textarea>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    `;
};

// --- LOGIC: event listeners and dom manipulation ---

export const initPatientAdminLogic = () => {

    // DOM elements
    const patientForm = document.getElementById('patient-form');
    const avatarPreview = document.getElementById('avatar-preview');
    const nameInput = document.getElementById('name');
    const pronounsSelect = document.getElementById('pronouns');
    const speciesSelect = document.getElementById('species');
    const sexSelect = document.getElementById('sex');
    const locationSelect = document.getElementById('location');
    const idNumberInput = document.getElementById('id_number');
    const admissionDateInput = document.getElementById('admission_date');
    const consultationTypeSelect = document.getElementById('consultation_type');
    const assignedProfessionalSelect = document.getElementById('assigned_professional');
    const descriptionInput = document.getElementById('record_description');
    const speciesIconGroup = document.getElementById('species-icons');
    const sexIconGroup = document.getElementById('sex-icons');
    const patientGallery = document.getElementById('patient-gallery');
    const patientCount = document.getElementById('patient-count');
    const patientSearchInput = document.getElementById('patient-search');

    // Details modal elements
    const detailsModalElement = document.getElementById('patientDetailsModal');
    const detailsAvatar = document.getElementById('details-avatar');
    const detailsPatientId = document.getElementById('details-patient-id');
    const detailsName = document.getElementById('details-name');
    const detailsPronouns = document.getElementById('details-pronouns');
    const detailsAge = document.getElementById('details-age');
    const detailsSpecies = document.getElementById('details-species');
    const detailsSex = document.getElementById('details-sex');
    const detailsLocation = document.getElementById('details-location');
    const detailsIdNumber = document.getElementById('details-id_number');
    const detailsAdmissionDate = document.getElementById('details-admission_date');
    const detailsLatestRecord = document.getElementById('details-latest-record');
    const detailsSpeciesIconGroup = document.getElementById('details-species-icons');
    const detailsSexIconGroup = document.getElementById('details-sex-icons');
    const patientFieldset = document.getElementById('patient-fieldset');
    const patientNameFieldset = document.getElementById('patient-name-fieldset');
    const editToggleBtn = document.getElementById('edit-toggle-btn');
    const editToggleIcon = document.getElementById('edit-toggle-icon');
    const dischargeBtn = document.getElementById('discharge-btn');
    const historyBtn = document.getElementById('history-btn');

    let localPatients = [];
    let currentEditingPatientId = null;

    if (!patientForm || !patientGallery) {
        console.error('Patient Admin DOM elements not found.');
        return;
    }

    const setProfileEditable = (isEditable) => {
        patientFieldset.disabled = !isEditable;
        patientNameFieldset.disabled = !isEditable;
    };

    // --- Icon button groups (visual layer on top of the hidden <select>) ---

    const syncIconGroup = (groupEl, selectEl) => {
        if (!groupEl) return;
        groupEl.querySelectorAll('.mlvh-icon-btn').forEach((btn) => {
            btn.classList.toggle('active', btn.dataset.value === selectEl.value);
        });
    };

    const wireIconGroup = (groupEl, selectEl) => {
        if (!groupEl) return;
        groupEl.addEventListener('click', (event) => {
            const btn = event.target.closest('.mlvh-icon-btn');
            if (!btn) return;
            selectEl.value = btn.dataset.value;
            selectEl.dispatchEvent(new Event('change'));
        });
    };

    const refreshAvatarPreview = (imgEl, speciesEl, sexEl) => {
        const src = `${AVATAR_BASE_PATH}/${speciesEl.value}_${sexEl.value}.png`;
        setAvatarWithFallback(imgEl, src, DEFAULT_AVATAR);
    };

    // -- "unknown" as starting character with neutral pronouns  --
  
    const setUnknownDefaults = (speciesEl, sexEl, locationEl, pronounsEl, speciesGroupEl, sexGroupEl, avatarEl) => {
        speciesEl.value = 'unknown';
        sexEl.value = 'unknown';
        locationEl.value = 'XX';
        pronounsEl.value = 'they/them';
        syncIconGroup(speciesGroupEl, speciesEl);
        syncIconGroup(sexGroupEl, sexEl);
        refreshAvatarPreview(avatarEl, speciesEl, sexEl);
    };
    // If any field is set to unknown, it will populate the rest of the fields as unknown too (the default character profile)
    const handleIdentityChange = (changedField, speciesEl, sexEl, locationEl, pronounsEl, speciesGroupEl, sexGroupEl, avatarEl) => {
        const changedToUnknown =
            (changedField === 'sex' && sexEl.value === 'unknown') ||
            (changedField === 'species' && speciesEl.value === 'unknown') ||
            (changedField === 'location' && locationEl.value === 'XX');

        if (changedToUnknown) {
            setUnknownDefaults(speciesEl, sexEl, locationEl, pronounsEl, speciesGroupEl, sexGroupEl, avatarEl);
            return;
        }

        if (sexEl.value === 'unknown') sexEl.value = 'male';
        if (speciesEl.value === 'unknown') speciesEl.value = 'human';
        if (locationEl.value === 'XX') locationEl.value = 'EA';

        syncIconGroup(speciesGroupEl, speciesEl);
        syncIconGroup(sexGroupEl, sexEl);
        refreshAvatarPreview(avatarEl, speciesEl, sexEl);
    };

    wireIconGroup(speciesIconGroup, speciesSelect);
    wireIconGroup(sexIconGroup, sexSelect);
    wireIconGroup(detailsSpeciesIconGroup, detailsSpecies);
    wireIconGroup(detailsSexIconGroup, detailsSex);

    admissionDateInput.textContent = formatDisplayDate(new Date().toISOString().slice(0, 10));
    setUnknownDefaults(speciesSelect, sexSelect, locationSelect, pronounsSelect, speciesIconGroup, sexIconGroup, avatarPreview);

    speciesSelect.addEventListener('change', () =>
        handleIdentityChange('species', speciesSelect, sexSelect, locationSelect, pronounsSelect, speciesIconGroup, sexIconGroup, avatarPreview)
    );
    sexSelect.addEventListener('change', () =>
        handleIdentityChange('sex', speciesSelect, sexSelect, locationSelect, pronounsSelect, speciesIconGroup, sexIconGroup, avatarPreview)
    );
    locationSelect.addEventListener('change', () =>
        handleIdentityChange('location', speciesSelect, sexSelect, locationSelect, pronounsSelect, speciesIconGroup, sexIconGroup, avatarPreview)
    );

    detailsSpecies.addEventListener('change', () =>
        handleIdentityChange('species', detailsSpecies, detailsSex, detailsLocation, detailsPronouns, detailsSpeciesIconGroup, detailsSexIconGroup, detailsAvatar)
    );
    detailsSex.addEventListener('change', () =>
        handleIdentityChange('sex', detailsSpecies, detailsSex, detailsLocation, detailsPronouns, detailsSpeciesIconGroup, detailsSexIconGroup, detailsAvatar)
    );
    detailsLocation.addEventListener('change', () =>
        handleIdentityChange('location', detailsSpecies, detailsSex, detailsLocation, detailsPronouns, detailsSpeciesIconGroup, detailsSexIconGroup, detailsAvatar)
    );

    const loadPatients = async () => {
        try {
            localPatients = await fetchPatients();
            renderPatients(localPatients);
        } catch (error) {
            console.error('API Error:', error);
            patientGallery.innerHTML = '<div class="col-12 text-center text-danger">Failed to connect to database.</div>';
            patientCount.textContent = 'API Error';
        }
    };

    const filterPatients = (patients, query) => {
        const normalizedQuery = query.trim().toLowerCase();
        if (!normalizedQuery) return patients;

        return patients.filter((patient) => {
            const displayId = `${patient.location}-${patient.id_number}`.toLowerCase();
            return patient.name.toLowerCase().includes(normalizedQuery) || displayId.includes(normalizedQuery);
        });
    };

    const renderPatients = (patients, query = '') => {
        if (patients.length === 0) {
            patientGallery.innerHTML = query
                ? '<p class="mlvh-card-subtitle text-center mb-0">No patients match your search.</p>'
                : '<p class="mlvh-card-subtitle text-center mb-0">No patients admitted yet.</p>';
            patientCount.textContent = query ? '0 patients found' : '0 patients';
            return;
        }

        patientGallery.innerHTML = patients.map((patient) => {
            const displayId = `${patient.location}-${patient.id_number}`;
            return `
            <div class="card h-100 border-0 text-center patient-card" data-id="${patient.id}" style="cursor: pointer; transition: transform 0.2s;">
                <img data-avatar-src="${AVATAR_BASE_PATH}/${patient.avatar_style}.png"
                     class="card-img-top p-2 mx-auto patient-avatar"
                     alt="${escapeHtml(patient.name)}"
                     style="max-height: 150px; width: auto;">
                <div class="card-body pt-0">
                    <h6 class="card-title fw-bold mb-1">${escapeHtml(patient.name)}</h6>
                    <p class="card-text small text-muted mb-0">${escapeHtml(displayId)}</p>
                </div>
            </div>
            `;
        }).join('');

        patientCount.textContent = query
            ? `${patients.length} of ${localPatients.length} patients`
            : `${patients.length} active patients`;

        patientGallery.querySelectorAll('.patient-avatar').forEach((img) => {
            setAvatarWithFallback(img, img.dataset.avatarSrc, DEFAULT_AVATAR);
        });
    };

    patientSearchInput.addEventListener('input', () => {
        renderPatients(filterPatients(localPatients, patientSearchInput.value), patientSearchInput.value);
    });

    // Listener for all cards
    patientGallery.addEventListener('click', (event) => {
        const card = event.target.closest('.patient-card');
        if (!card) return;
        openPatientDetails(card.dataset.id);
    });

    const openPatientDetails = (id) => {
        const patient = localPatients.find((p) => p.id == id);
        if (!patient) return;

        currentEditingPatientId = patient.id;

        setAvatarWithFallback(detailsAvatar, `${AVATAR_BASE_PATH}/${patient.avatar_style}.png`, DEFAULT_AVATAR);
        detailsPatientId.textContent = `[${patient.location}-${patient.id_number}]`;
        detailsName.value = patient.name;
        detailsPronouns.value = patient.pronouns;
        detailsAge.value = patient.age;
        detailsSpecies.value = patient.species;
        detailsSex.value = patient.sex;
        detailsLocation.value = patient.location;
        detailsIdNumber.value = patient.id_number;
        detailsAdmissionDate.textContent = patient.created_at ? formatDisplayDate(patient.created_at.slice(0, 10)) : '';
        detailsLatestRecord.value = formatRecordSummary(patient.latest_record);

        syncIconGroup(detailsSpeciesIconGroup, detailsSpecies);
        syncIconGroup(detailsSexIconGroup, detailsSex);

        setProfileEditable(false);
        editToggleIcon.src = 'assets/icons/misc/pencil.svg';

        bootstrap.Modal.getOrCreateInstance(detailsModalElement).show();
    };

    editToggleBtn.addEventListener('click', async () => {
        const isDisabled = patientFieldset.hasAttribute('disabled');

        if (isDisabled) {
            setProfileEditable(true);
            editToggleIcon.src = 'assets/icons/misc/check.svg';
            return;
        }

        editToggleBtn.disabled = true;

        const updatedPatient = {
            name: detailsName.value,
            age: parseInt(detailsAge.value, 10),
            species: detailsSpecies.value,
            sex: detailsSex.value,
            location: detailsLocation.value,
            pronouns: detailsPronouns.value,
            id_number: detailsIdNumber.value.toUpperCase(),
        };

        try {
            await updatePatient(currentEditingPatientId, updatedPatient);
            await loadPatients();

            setProfileEditable(false);
            editToggleIcon.src = 'assets/icons/misc/pencil.svg';

            // Refresh
            openPatientDetails(currentEditingPatientId);
            showToast('Patient updated successfully.');
        } catch (error) {
            console.error(error);
            showToast(error instanceof ApiError ? error.message : 'Error saving changes.', 'error');
        } finally {
            editToggleBtn.disabled = false;
        }
    });

    historyBtn.addEventListener('click', () => {
        bootstrap.Modal.getInstance(detailsModalElement)?.hide();
        document.dispatchEvent(new CustomEvent('mlvh:navigate', {
            detail: { route: 'medical-records', options: { patientId: currentEditingPatientId } },
        }));
    });

    dischargeBtn.addEventListener('click', async () => {
        const confirmed = await confirmAction(
            'This patient will be discharged and removed from the active roster.',
            'Yes, discharge'
        );
        if (!confirmed) return;

        dischargeBtn.disabled = true;

        try {
            await dischargePatient(currentEditingPatientId);
            bootstrap.Modal.getInstance(detailsModalElement)?.hide();
            await loadPatients();
            showToast('Patient discharged successfully.');
        } catch (error) {
            console.error(error);
            showToast(error instanceof ApiError ? error.message : 'Error discharging patient.', 'error');
        } finally {
            dischargeBtn.disabled = false;
        }
    });

    const updateAvatarPreview = () => {
        const src = `${AVATAR_BASE_PATH}/${speciesSelect.value}_${sexSelect.value}.png`;
        setAvatarWithFallback(avatarPreview, src, DEFAULT_AVATAR);
    };

    speciesSelect.addEventListener('change', updateAvatarPreview);
    sexSelect.addEventListener('change', updateAvatarPreview);

    patientForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = patientForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Admitting...';

        const newPatient = {
            name: nameInput.value,
            age: parseInt(document.getElementById('age').value, 10),
            species: speciesSelect.value,
            sex: sexSelect.value,
            location: locationSelect.value,
            pronouns: pronounsSelect.value,
            id_number: idNumberInput.value.toUpperCase(),
            consultation_type: consultationTypeSelect.value,
            assigned_professional: assignedProfessionalSelect.value,
            description: descriptionInput.value,
        };

        try {
            await createPatient(newPatient);
            await loadPatients();

            patientForm.reset();
            admissionDateInput.textContent = formatDisplayDate(new Date().toISOString().slice(0, 10));
            setUnknownDefaults(speciesSelect, sexSelect, locationSelect, pronounsSelect, speciesIconGroup, sexIconGroup, avatarPreview);

            bootstrap.Modal.getInstance(document.getElementById('createPatientModal'))?.hide();
            showToast('Patient admitted successfully.');
        } catch (error) {
            console.error(error);
            showToast(error instanceof ApiError ? error.message : 'Make sure the Django server (port 8000) is running.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });

    // Initial render
    loadPatients();
};
