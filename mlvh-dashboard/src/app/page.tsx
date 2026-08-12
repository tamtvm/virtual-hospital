import AdmissionsBarChart from "@/components/charts/AdmissionsBarChart";
import PatientsBySpeciesChart from "@/components/charts/PatientsBySpeciesChart";
import { getAdmissionsWeekly, getPatientsBySpecies } from "@/lib/api";

export default async function DashboardPage() {
  const [admissions, species] = await Promise.all([
    getAdmissionsWeekly(8),
    getPatientsBySpecies(),
  ]);

  return (
    <main className="dashboard-grid">
      <AdmissionsBarChart data={admissions.data} />
      <PatientsBySpeciesChart data={species.data} />
    </main>
  );
}