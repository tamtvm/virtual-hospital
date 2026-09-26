"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AdmissionsWeeklyPoint } from "@/lib/types";
import { useI18n } from "@/lib/i18n";

interface AdmissionsBarChartProps {
  data: AdmissionsWeeklyPoint[];
}

export default function AdmissionsBarChart({ data }: AdmissionsBarChartProps) {
  const { locale, t } = useI18n();
  const weekFormat = new Intl.DateTimeFormat(locale, { month: "short", day: "numeric", timeZone: "UTC" });
  const chartData = data.map((point) => ({
    week: weekFormat.format(new Date(point.week_start)),
    admissions: point.admissions,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--mlvh-blue)" />
        <XAxis dataKey="week" stroke="var(--mlvh-text)" fontSize={12} tickLine={false} />
        <YAxis stroke="var(--mlvh-text)" fontSize={12} tickLine={false} allowDecimals={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--mlvh-cream)",
            border: "1px solid var(--mlvh-blue)",
            borderRadius: 14,
            color: "var(--mlvh-text)",
          }}
        />
        <Bar dataKey="admissions" name={t("dashboard.admissions.series")} fill="var(--mlvh-blue-deep)" radius={[10, 10, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}