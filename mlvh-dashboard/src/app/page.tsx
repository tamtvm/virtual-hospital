import AdmissionsBarChart from "@/components/charts/AdmissionsBarChart";
import { getAdmissionsWeekly } from "@/lib/api";

export default async function DashboardPage() {
  const { data } = await getAdmissionsWeekly(8);

  return (
    <main style={{ padding: "2rem" }}>
      <AdmissionsBarChart data={data} />
    </main>
  );
}