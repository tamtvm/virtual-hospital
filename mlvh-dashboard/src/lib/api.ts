import {
  AdmissionsWeeklyResponse,
  PatientsBySpeciesResponse,
  ConsultationsByReasonResponse,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://virtual-hospital-b471.onrender.com/api";

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { next: { revalidate: 60 } });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${path}: ${res.status}`);
  }

  return res.json();
}

export function getAdmissionsWeekly(weeks = 8): Promise<AdmissionsWeeklyResponse> {
  return fetchJson(`/analytics/admissions-weekly/?weeks=${weeks}`);
}

export function getPatientsBySpecies(): Promise<PatientsBySpeciesResponse> {
  return fetchJson("/analytics/patients-by-species/");
}

export function getConsultationsByReason(): Promise<ConsultationsByReasonResponse> {
  return fetchJson("/analytics/consultations-by-reason/");
}