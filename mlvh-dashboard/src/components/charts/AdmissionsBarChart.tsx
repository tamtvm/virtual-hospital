"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AdmissionsWeeklyPoint } from "@/lib/types";
import ChartCard from "@/components/ui/ChartCard";

interface AdmissionsBarChartProps {
  data: AdmissionsWeeklyPoint[];
}

export default function AdmissionsBarChart({ data }: AdmissionsBarChartProps) {
  const chartData = data.map((point) => ({
    week: new Date(point.week_start).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    admissions: point.admissions,
  }));

  return (
    <ChartCard title="Admissions per week" isEmpty={data.length === 0}>
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
          <Bar dataKey="admissions" fill="var(--mlvh-blue-deep)" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}