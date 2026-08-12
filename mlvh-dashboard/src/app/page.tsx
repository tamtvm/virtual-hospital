"use client";

import { useEffect, useState } from "react";
import AdmissionsPanel from "@/components/charts/AdmissionsPanel";
import PatientsBySpeciesChart from "@/components/charts/PatientsBySpeciesChart";
import ConsultationsByReasonChart from "@/components/charts/ConsultationsByReasonChart";
import { getAdmissionsWeekly, getPatientsBySpecies, getConsultationsByReason } from "@/lib/api";
import { PatientsBySpeciesRow, ConsultationsByReasonRow, AdmissionsWeeklyPoint } from "@/lib/types";

const INITIAL_WEEKS = 8;

export default function DashboardPage() {
  const [admissions, setAdmissions] = useState<AdmissionsWeeklyPoint[]>([]);
  const [species, setSpecies] = useState<PatientsBySpeciesRow[]>([]);
  const [consultations, setConsultations] = useState<ConsultationsByReasonRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      getAdmissionsWeekly(INITIAL_WEEKS),
      getPatientsBySpecies(),
      getConsultationsByReason(),
    ])
      .then(([admissionsRes, speciesRes, consultationsRes]) => {
        setAdmissions(admissionsRes.data);
        setSpecies(speciesRes.data);
        setConsultations(consultationsRes.data);
      })
      .catch(() => setError("Couldn't load the dashboard."))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <main className="dashboard-grid">
        {[1, 2, 3].map((key) => (
          <div key={key} className="mlvh-card mlvh-skeleton" />
        ))}
      </main>
    );
  }

  if (error) {
    return (
      <main className="dashboard-grid">
        <div className="mlvh-card mlvh-error-card">
          <p className="mlvh-card-title">Couldn&apos;t load the dashboard</p>
          <p>{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard-grid">
      <AdmissionsPanel initialWeeks={INITIAL_WEEKS} initialData={admissions} />
      <PatientsBySpeciesChart data={species} />
      <ConsultationsByReasonChart data={consultations} />
    </main>
  );
}