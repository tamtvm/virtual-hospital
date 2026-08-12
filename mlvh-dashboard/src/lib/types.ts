export interface AdmissionsWeeklyPoint {
  week_start: string;
  admissions: number;
}

export interface AdmissionsWeeklyResponse {
  period: string;
  data: AdmissionsWeeklyPoint[];
}

export interface PatientsBySpeciesRow {
  species: string;
  label: string;
  count: number;
}

export interface PatientsBySpeciesResponse {
  data: PatientsBySpeciesRow[];
}

export interface ConsultationsByReasonRow {
  consultation_type: string;
  label: string;
  count: number;
}

export interface ConsultationsByReasonResponse {
  data: ConsultationsByReasonRow[];
}