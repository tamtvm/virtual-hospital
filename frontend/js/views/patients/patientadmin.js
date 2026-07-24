// --- MODULE: patient administration view ---

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
                                <img id="avatar-preview" src="assets/default-avatar.png" alt="Avatar Preview" class="img-fluid rounded mb-2" style="max-height: 200px; image-rendering: pixelated;">
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
                                    <input type="number" class="form-control form-control-sm" id="age" required>
                                </div>
                                <div class="row">
                                    <div class="col-6 mb-2">
                                        <label class="form-label small text-muted mb-0">Species</label>
                                        <select class="form-select form-select-sm" id="species">
                                            <option value="human">Human</option>
                                            <option value="cat">Cat</option>
                                            <option value="bunny">Bunny</option>
                                        </select>
                                    </div>
                                    <div class="col-6 mb-2">
                                        <label class="form-label small text-muted mb-0">Sex</label>
                                        <select class="form-select form-select-sm" id="sex">
                                            <option value="unknown">Unknown</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
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
                                <img id="details-avatar" src="assets/default-avatar.png" alt="Patient Avatar" class="img-fluid rounded mb-2" style="max-height: 200px; image-rendering: pixelated;">
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
                                        <input type="number" class="form-control form-control-sm" id="details-age">
                                    </div>
                                    <div class="row">
                                        <div class="col-6 mb-2">
                                            <label class="form-label small text-muted mb-0">Species</label>
                                            <select class="form-select form-select-sm" id="details-species">
                                                <option value="human">Human</option>
                                                <option value="cat">Cat</option>
                                                <option value="bunny">Bunny</option>
                                            </select>
                                        </div>
                                        <div class="col-6 mb-2">
                                            <label class="form-label small text-muted mb-0">Sex</label>
                                            <select class="form-select form-select-sm" id="details-sex">
                                                <option value="unknown">Unknown</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                            </select>
                                        </div>
                                    </div>
                                </fieldset>
                                <div class="text-end mt-3">
                                    <button type="button" class="btn btn-outline-primary w-100" id="edit-toggle-btn">Edit Profile</button>
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

// --- Mock data ---

let mockPatients = [
    { id: 'VH-001', name: 'dinky', age: 4, species: 'bunny', sex: 'female' },
    { id: 'VH-002', name: 'stinky', age: 2, species: 'cat', sex: 'male' },
    { id: 'VH-003', name: 'minky', age: 35, species: 'human', sex: 'male' }
];

// --- LOGIC: event listeners and dom manipulation ---

export const initPatientAdminLogic = () => {
    
    // DOM elements
    const patientForm = document.getElementById('patient-form');
    const avatarPreview = document.getElementById('avatar-preview');
    const speciesSelect = document.getElementById('species');
    const sexSelect = document.getElementById('sex');
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
    const patientFieldset = document.getElementById('patient-fieldset');
    const editToggleBtn = document.getElementById('edit-toggle-btn');

    if (!patientForm || !patientGallery) {
        console.error('Patient Admin DOM elements not found.');
        return;
    }

    // Render patients to the DOM
    const renderPatients = (patients) => {
        patientGallery.innerHTML = '';
        
        if (patients.length === 0) {
            patientGallery.innerHTML = '<div class="col-12 text-center text-muted">no patients admitted yet.</div>';
            patientCount.textContent = '0 patients';
            return;
        }

        const cardsHtml = patients.map(patient => `
            <div class="col">
                <div class="card h-100 shadow-sm border-0 text-center patient-card" data-id="${patient.id}" style="cursor: pointer; transition: transform 0.2s;">
                    <img src="assets/avatars/${patient.species}_${patient.sex}.png" 
                         class="card-img-top p-3 mx-auto" 
                         alt="${patient.name}" 
                         style="image-rendering: pixelated; max-height: 120px; width: auto;"
                         onerror="this.onerror=null; this.src='assets/default-avatar.png'">
                    <div class="card-body pt-0">
                        <h6 class="card-title fw-bold mb-1">${patient.name}</h6>
                        <p class="card-text small text-muted mb-0">${patient.id}</p>
                    </div>
                </div>
            </div>
        `).join('');

        patientGallery.innerHTML = cardsHtml;
        patientCount.textContent = `${patients.length} active patients`;

        // Attach click event
        document.querySelectorAll('.patient-card').forEach(card => {
            card.addEventListener('click', () => {
                const patientId = card.getAttribute('data-id');
                openPatientDetails(patientId);
            });
        });
    };

    // Open and populate details
    const openPatientDetails = (id) => {
        const patient = mockPatients.find(p => p.id === id);
        if (!patient) return;

        detailsAvatar.src = `assets/avatars/${patient.species}_${patient.sex}.png`;
        detailsAvatar.onerror = function() { this.onerror=null; this.src='assets/default-avatar.png'; };
        detailsPatientId.textContent = patient.id;
        detailsName.value = patient.name;
        detailsAge.value = patient.age;
        detailsSpecies.value = patient.species;
        detailsSex.value = patient.sex;

        // Read-only mode
        patientFieldset.setAttribute('disabled', 'true');
        editToggleBtn.textContent = 'Edit Profile';
        editToggleBtn.classList.replace('btn-success', 'btn-outline-primary');

        const modal = new bootstrap.Modal(detailsModalElement);
        modal.show();
    };

    // Toggle edit mode
    editToggleBtn.addEventListener('click', () => {
        const isDisabled = patientFieldset.hasAttribute('disabled');
        
        if (isDisabled) {
            patientFieldset.removeAttribute('disabled');
            editToggleBtn.textContent = 'Save Changes';
            editToggleBtn.classList.replace('btn-outline-primary', 'btn-success');
        } else {
            // Save logic for later aaaaaaaaaa
            patientFieldset.setAttribute('disabled', 'true');
            editToggleBtn.textContent = 'Edit Profile';
            editToggleBtn.classList.replace('btn-success', 'btn-outline-primary');
        }
    });

    // Initial render
    renderPatients(mockPatients);

    // Avatar update
    const updateAvatarPreview = () => {
        const species = speciesSelect.value;
        const sex = sexSelect.value;
        avatarPreview.src = `assets/avatars/${species}_${sex}.png`; 
    };

    speciesSelect.addEventListener('change', updateAvatarPreview);
    sexSelect.addEventListener('change', updateAvatarPreview);

    patientForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newPatient = {
            id: `VH-00${mockPatients.length + 1}`,
            name: document.getElementById('name').value,
            age: document.getElementById('age').value,
            species: speciesSelect.value,
            sex: sexSelect.value
        };

        mockPatients.push(newPatient);
        renderPatients(mockPatients);
        
        patientForm.reset();
        updateAvatarPreview();
        
        const modalElement = document.getElementById('createPatientModal');
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
            modalInstance.hide();
        }
    });
};