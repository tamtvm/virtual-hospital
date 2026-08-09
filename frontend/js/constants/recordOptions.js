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
export const formatRecordType = (record) => {
    if (!record) return '';

    const typeLabel = RECORD_TYPE_LABELS[record.record_type] ?? record.record_type;
    const consultationLabel = CONSULTATION_TYPE_LABELS[record.consultation_type];

    return consultationLabel ? `${typeLabel} (${consultationLabel})` : typeLabel;
};

export const formatRecordSummary = (record) => {
    if (!record) return 'No records yet.';

    return `${formatRecordType(record)}: ${record.description}`;
};