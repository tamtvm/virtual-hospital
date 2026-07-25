// --- MODULE: patient administration view ---

import { AVATAR_BASE_PATH, DEFAULT_AVATAR } from '../../config.js';
import { fetchPatients, createPatient, updatePatient, dischargePatient, ApiError } from '../../api/patients.js';
import {
    LOCATIONS,
    SPECIES,
    SEXES,
    ID_NUMBER_PATTERN,
    ID_NUMBER_MAXLENGTH,
    renderOptions,
} from '../../constants/patientOptions.js';
import { escapeHtml, setAvatarWithFallback } from '../../utils/dom.js';
import { showToast, confirmAction } from '../../utils/toast.js';

export const getPatientAdminView = () => {
    return `
    <div class="container">
        <header class="text-center mb-5">
            <h1 class="display-5 fw-bold text-primary">Patient Administration</h1>
            <p class="text-muted">My Little Virtual Hospital - Patient Management System</p>
        </header>

        <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
            <span class="text-muted" id="patient-count">Loading roster...</span>
            <button class="btn btn-primary px-4 shadow-sm" data-bs-toggle="modal" data-bs-target="#createPatientModal">
                + Admit Patient
            </button>
        </div>

        <main>
            <div id="patient-gallery" class="row row-cols-2 row-cols-md-4 row-cols-lg-5 g-4"></div>
        </main>
    </div>
    `;
};

export const getPatientModal = () => {
    return `
    <!-- Create Patient Modal -->
    <div class="modal fade" id="createPatientModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header border-0 pb-0 justify-content-end">
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body pt-0">
                    <div class="row">
                        <div class="col-md-5 text-center border-end d-flex flex-column">
                            <h5 class="fw-bold mb-4 mt-2">Admit New Patient</h5>
                            <div class="mt-auto mb-auto">
                                <img id="avatar-preview" src="${DEFAULT_AVATAR}" alt="Avatar Preview" class="img-fluid rounded mb-2" style="max-height: 200px; image-rendering: pixelated;">
                                <p class="text-muted small mb-0">auto-generated avatar</p>
                            </div>
                        </div>
                        <div class="col-md-7">
                            <form id="patient-form">
                                <div class="mb-2">
                                    <label class="form-label small text-muted mb-0">Name</label>
                                    <input type="text" class="form-control form-control-sm" id="name" required>
                                </div>
                                <div class="mb-2">
                                    <label class="form-label small text-muted mb-0">Age</label>
                                    <input type="number" class="form-control form-control-sm" id="age" min="0" required>
                                </div>
                                <div class="row">
                                    <div class="col-6 mb-2">
                                        <label class="form-label small text-muted mb-0">Location</label>
                                        <select class="form-select form-select-sm" id="location" required>
                                            ${renderOptions(LOCATIONS)}
                                        </select>
                                    </div>
                                    <div class="col-6 mb-2">
                                        <label class="form-label small text-muted mb-0">ID Number</label>
                                        <input type="text" class="form-control form-control-sm" id="id_number" maxlength="${ID_NUMBER_MAXLENGTH}" pattern="${ID_NUMBER_PATTERN}" title="Up to 5 alphanumeric characters" required>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-6 mb-2">
                                        <label class="form-label small text-muted mb-0">Species</label>
                                        <select class="form-select form-select-sm" id="species">
                                            ${renderOptions(SPECIES)}
                                        </select>
                                    </div>
                                    <div class="col-6 mb-2">
                                        <label class="form-label small text-muted mb-0">Sex</label>
                                        <select class="form-select form-select-sm" id="sex">
                                            ${renderOptions(SEXES)}
                                        </select>
                                    </div>
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
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header border-0 pb-0 justify-content-end">
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body pt-0">
                    <div class="row">
                        <div class="col-md-5 text-center border-end d-flex flex-column">
                            <h5 class="fw-bold mb-4 mt-2" id="details-modal-title">Patient Profile</h5>
                            <div class="mt-auto mb-auto">
                                <img id="details-avatar" src="${DEFAULT_AVATAR}" alt="Patient Avatar" class="img-fluid rounded mb-2" style="max-height: 200px; image-rendering: pixelated;">
                                <p class="text-muted small mb-0" id="details-patient-id"></p>
                            </div>
                        </div>
                        <div class="col-md-7">
                            <form id="patient-details-form">
                                <fieldset id="patient-fieldset" disabled>
                                    <div class="mb-2">
                                        <label class="form-label small text-muted mb-0">Name</label>
                                        <input type="text" class="form-control form-control-sm" id="details-name">
                                    </div>
                                    <div class="mb-2">
                                        <label class="form-label small text-muted mb-0">Age</label>
                                        <input type="number" class="form-control form-control-sm" id="details-age" min="0">
                                    </div>
                                    <div class="row">
                                        <div class="col-6 mb-2">
                                            <label class="form-label small text-muted mb-0">Location</label>
                                            <select class="form-select form-select-sm" id="details-location">
                                                ${renderOptions(LOCATIONS)}
                                            </select>
                                        </div>
                                        <div class="col-6 mb-2">
                                            <label class="form-label small text-muted mb-0">ID Number</label>
                                            <input type="text" class="form-control form-control-sm" id="details-id_number" maxlength="${ID_NUMBER_MAXLENGTH}" pattern="${ID_NUMBER_PATTERN}" title="Up to 5 alphanumeric characters">
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-6 mb-2">
                                            <label class="form-label small text-muted mb-0">Species</label>
                                            <select class="form-select form-select-sm" id="details-species">
                                                ${renderOptions(SPECIES)}
                                            </select>
                                        </div>
                                        <div class="col-6 mb-2">
                                            <label class="form-label small text-muted mb-0">Sex</label>
                                            <select class="form-select form-select-sm" id="details-sex">
                                                ${renderOptions(SEXES)}
                                            </select>
                                        </div>
                                    </div>
                                </fieldset>
                                <div class="d-flex gap-2 mt-3">
                                    <button type="button" class="btn btn-outline-danger" id="discharge-btn">Discharge</button>
                                    <button type="button" class="btn btn-outline-primary flex-grow-1" id="edit-toggle-btn">Edit Profile</button>
                                </div>
                            </form>
                        </div>
                    </div>
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
    const speciesSelect = document.getElementById('species');
    const sexSelect = document.getElementById('sex');
    const locationSelect = document.getElementById('location');
    const idNumberInput = document.getElementById('id_number');
    const patientGallery = document.getElementById('patient-gallery');
    const patientCount = document.getElementById('patient-count');

    // Details modal elements
    const detailsModalElement = document.getElementById('patientDetailsModal');
    const detailsAvatar = document.getElementById('details-avatar');
    const detailsPatientId = document.getElementById('details-patient-id');
    const detailsName = document.getElementById('details-name');
    const detailsAge = document.getElementById('details-age');
    const detailsSpecies = document.getElementById('details-species');
    const detailsSex = document.getElementById('details-sex');
    const detailsLocation = document.getElementById('details-location');
    const detailsIdNumber = document.getElementById('details-id_number');
    const patientFieldset = document.getElementById('patient-fieldset');
    const editToggleBtn = document.getElementById('edit-toggle-btn');
    const dischargeBtn = document.getElementById('discharge-btn');

    let localPatients = [];
    let currentEditingPatientId = null;

    if (!patientForm || !patientGallery) {
        console.error('Patient Admin DOM elements not found.');
        return;
    }

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

    const renderPatients = (patients) => {
        if (patients.length === 0) {
            patientGallery.innerHTML = '<div class="col-12 text-center text-muted">no patients admitted yet.</div>';
            patientCount.textContent = '0 patients';
            return;
        }

        patientGallery.innerHTML = patients.map((patient) => {
            const displayId = `${patient.location}-${patient.id_number}`;
            return `
            <div class="col">
                <div class="card h-100 shadow-sm border-0 text-center patient-card" data-id="${patient.id}" style="cursor: pointer; transition: transform 0.2s;">
                    <img data-avatar-src="${AVATAR_BASE_PATH}/${patient.avatar_style}.png"
                         class="card-img-top p-3 mx-auto patient-avatar"
                         alt="${escapeHtml(patient.name)}"
                         style="image-rendering: pixelated; max-height: 120px; width: auto;">
                    <div class="card-body pt-0">
                        <h6 class="card-title fw-bold mb-1">${escapeHtml(patient.name)}</h6>
                        <p class="card-text small text-muted mb-0">${escapeHtml(displayId)}</p>
                    </div>
                </div>
            </div>
            `;
        }).join('');

        patientCount.textContent = `${patients.length} active patients`;

        patientGallery.querySelectorAll('.patient-avatar').forEach((img) => {
            setAvatarWithFallback(img, img.dataset.avatarSrc, DEFAULT_AVATAR);
        });
    };

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
        detailsAge.value = patient.age;
        detailsSpecies.value = patient.species;
        detailsSex.value = patient.sex;
        detailsLocation.value = patient.location;
        detailsIdNumber.value = patient.id_number;

        patientFieldset.setAttribute('disabled', 'true');
        editToggleBtn.textContent = 'Edit Profile';
        editToggleBtn.classList.replace('btn-success', 'btn-outline-primary');

        bootstrap.Modal.getOrCreateInstance(detailsModalElement).show();
    };

    editToggleBtn.addEventListener('click', async () => {
        const isDisabled = patientFieldset.hasAttribute('disabled');

        if (isDisabled) {
            patientFieldset.removeAttribute('disabled');
            editToggleBtn.textContent = 'Save Changes';
            editToggleBtn.classList.replace('btn-outline-primary', 'btn-success');
            return;
        }

        editToggleBtn.disabled = true;
        editToggleBtn.textContent = 'Saving...';

        const updatedPatient = {
            name: detailsName.value,
            age: parseInt(detailsAge.value, 10),
            species: detailsSpecies.value,
            sex: detailsSex.value,
            location: detailsLocation.value,
            id_number: detailsIdNumber.value.toUpperCase(),
        };

        try {
            await updatePatient(currentEditingPatientId, updatedPatient);
            await loadPatients();

            patientFieldset.setAttribute('disabled', 'true');
            editToggleBtn.textContent = 'Edit Profile';
            editToggleBtn.classList.replace('btn-success', 'btn-outline-primary');

            // Refresh
            openPatientDetails(currentEditingPatientId);
            showToast('Patient updated successfully.');
        } catch (error) {
            console.error(error);
            showToast(error instanceof ApiError ? error.message : 'Error saving changes.', 'error');
            editToggleBtn.textContent = 'Save Changes';
        } finally {
            editToggleBtn.disabled = false;
        }
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
            name: document.getElementById('name').value,
            age: parseInt(document.getElementById('age').value, 10),
            species: speciesSelect.value,
            sex: sexSelect.value,
            location: locationSelect.value,
            id_number: idNumberInput.value.toUpperCase(),
        };

        try {
            await createPatient(newPatient);
            await loadPatients();

            patientForm.reset();
            updateAvatarPreview();

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
