"use client";

import { useEffect, useState } from "react";
import AdmissionsPanel from "@/components/charts/AdmissionsPanel";
import PatientsBySpeciesChart from "@/components/charts/PatientsBySpeciesChart";
import ConsultationsByReasonChart from "@/components/charts/ConsultationsByReasonChart";
import { getAdmissionsWeekly, getPatientsBySpecies, getConsultationsByReason } from "@/lib/api";
import { PatientsBySpeciesRow, ConsultationsByReasonRow, AdmissionsWeeklyPoint } from "@/lib/types";
import { useI18n } from "@/lib/i18n";

const INITIAL_WEEKS = 8;

export default function DashboardPage() {
  const { t } = useI18n();
  const [admissions, setAdmissions] = useState<AdmissionsWeeklyPoint[]>([]);
  const [species, setSpecies] = useState<PatientsBySpeciesRow[]>([]);
  const [consultations, setConsultations] = useState<ConsultationsByReasonRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

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
      .catch(() => setHasError(true))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="dashboard-grid">
        {[1, 2, 3].map((key) => (
          <div key={key} className="mlvh-card mlvh-skeleton" />
        ))}
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="dashboard-grid">
        <div className="mlvh-card mlvh-error-card">
          <p className="mlvh-card-title">{t("dashboard.loadError.title")}</p>
          <p>{t("dashboard.loadError.hint")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-grid">
      <AdmissionsPanel initialWeeks={INITIAL_WEEKS} initialData={admissions} />
      <PatientsBySpeciesChart data={species} />
      <ConsultationsByReasonChart data={consultations} />
    </div>
  );
}