// --- Display helpers for patient records (admission, edits, discharge, etc) ---
import { CONSULTATION_TYPES, PROFESSIONALS } from './patientOptions.js';

const CONSULTATION_TYPE_LABELS = Object.fromEntries(
    CONSULTATION_TYPES.map(({ value, label }) => [value, label])
);

export const PROFESSIONAL_LABELS = Object.fromEntries(
    PROFESSIONALS.map(({ value, label }) => [value, label])
);

const RECORD_TYPE_LABELS = {
    admission: 'Admission',
    consultation: 'Consultation',
};

/**
 * Generates summary string from PatientRecord, 
 * combining its type, consultation category, and description.
 */
export const formatRecordSummary = (record) => {
    if (!record) return 'No records yet.';

    const typeLabel = RECORD_TYPE_LABELS[record.record_type] ?? record.record_type;
    const consultationLabel = CONSULTATION_TYPE_LABELS[record.consultation_type];
    const header = consultationLabel ? `${typeLabel} (${consultationLabel})` : typeLabel;

    return `${header}: ${record.description}`;
};