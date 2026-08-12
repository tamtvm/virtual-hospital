const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export interface AdmissionsWeeklyPoint {
  week_start: string;
  admissions: number;
}

export interface AdmissionsWeeklyResponse {
  period: string;
  data: AdmissionsWeeklyPoint[];
}

export async function getAdmissionsWeekly(weeks = 8): Promise<AdmissionsWeeklyResponse> {
  const res = await fetch(`${API_BASE}/analytics/admissions-weekly/?weeks=${weeks}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch admissions data: ${res.status}`);
  }

  return res.json();
}