// --- API layer ---
import { API_BASE_URL } from '../config.js';

const PATIENTS_URL = `${API_BASE_URL}/patients/`;

export class ApiError extends Error {
    constructor(message, fieldErrors = {}) {
        super(message);
        this.name = 'ApiError';
        this.fieldErrors = fieldErrors;
    }
}


// --- Error report --
const buildErrorFromResponse = async (response, fallbackMessage) => {
    let payload = {};
    try {
        payload = await response.json();
    } catch {
    }

    if (typeof payload.detail === 'string') {
        return new ApiError(payload.detail, payload);
    }

    const firstFieldWithError = Object.keys(payload).find(
        (key) => Array.isArray(payload[key]) && payload[key].length > 0
    );

    if (firstFieldWithError) {
        const message = firstFieldWithError === 'non_field_errors'
            ? payload[firstFieldWithError][0]
            : `${firstFieldWithError}: ${payload[firstFieldWithError][0]}`;
        return new ApiError(message, payload);
    }

    return new ApiError(fallbackMessage, payload);
};

export const fetchPatients = async () => {
    const response = await fetch(PATIENTS_URL);
    if (!response.ok) {
        throw new ApiError('Could not load the patient roster.');
    }
    return response.json();
};

export const fetchPatientRecords = async (id) => {
    const response = await fetch(`${PATIENTS_URL}${id}/records/`);
    if (!response.ok) {
        throw new ApiError("Could not load this patient's record history.");
    }
    return response.json();
};

export const addPatientRecord = async (id, payload) => {
    const response = await fetch(`${PATIENTS_URL}${id}/add_record/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        throw await buildErrorFromResponse(response, 'Could not save this record.');
    }
    return response.json();
};

export const createPatient = async (patientData) => {
    const response = await fetch(PATIENTS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patientData),
    });
    if (!response.ok) {
        throw await buildErrorFromResponse(response, 'Failed to save patient to the database.');
    }
    return response.json();
};

export const updatePatient = async (id, patientData) => {
    const response = await fetch(`${PATIENTS_URL}${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patientData),
    });
    if (!response.ok) {
        throw await buildErrorFromResponse(response, 'Failed to update patient.');
    }
    return response.json();
};

export const dischargePatient = async (id) => {
    const response = await fetch(`${PATIENTS_URL}${id}/`, { method: 'DELETE' });
    if (!response.ok) {
        throw await buildErrorFromResponse(response, 'Failed to discharge patient.');
    }
};