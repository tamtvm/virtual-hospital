// --- Display helpers for patient records (admission, edits, discharge, etc) ---
import { PROFESSIONALS } from './patientOptions.js';
import { t, tOption } from '../i18n.js';

export const PROFESSIONAL_LABELS = Object.fromEntries(
    PROFESSIONALS.map(({ value, label }) => [value, label])
);

/**
 * Generates summary string from PatientRecord, 
 * combining its type, consultation category, and description.
 */
export const formatRecordType = (record) => {
    if (!record) return '';

    const typeLabel = tOption('recordTypes', record.record_type);

    return record.consultation_type ? `${typeLabel} (${tOption('consultationTypes', record.consultation_type)})` : typeLabel;
};

export const formatRecordSummary = (record) => {
    if (!record) return t('records.empty');

    return `${formatRecordType(record)}: ${record.description}`;
};