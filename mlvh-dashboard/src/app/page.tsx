import AdmissionsBarChart from "@/components/charts/AdmissionsBarChart";
import PatientsBySpeciesChart from "@/components/charts/PatientsBySpeciesChart";
import ConsultationsByReasonChart from "@/components/charts/ConsultationsByReasonChart";
import { getAdmissionsWeekly, getPatientsBySpecies, getConsultationsByReason } from "@/lib/api";

export default async function DashboardPage() {
  const [admissions, species, consultations] = await Promise.all([
    getAdmissionsWeekly(8),
    getPatientsBySpecies(),
    getConsultationsByReason(),
  ]);

  return (
    <main className="dashboard-grid">
      <AdmissionsBarChart data={admissions.data} />
      <PatientsBySpeciesChart data={species.data} />
      <ConsultationsByReasonChart data={consultations.data} />
    </main>
  );
}