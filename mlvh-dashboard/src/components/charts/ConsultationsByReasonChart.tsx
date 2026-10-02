"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ConsultationsByReasonRow } from "@/lib/types";
import ChartCard from "@/components/ui/ChartCard";
import { useI18n } from "@/lib/i18n";

interface ConsultationsByReasonChartProps {
  data: ConsultationsByReasonRow[];
}

export default function ConsultationsByReasonChart({ data }: ConsultationsByReasonChartProps) {
  const { t, optionLabel } = useI18n();
  const chartData = data.map((row) => ({ name: optionLabel("consultationTypes", row.consultation_type), count: row.count }));

  return (
    <ChartCard title={t("dashboard.consultations.title")} isEmpty={data.length === 0}>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--mlvh-blue)" />
          <XAxis dataKey="name" stroke="var(--mlvh-text)" fontSize={12} tickLine={false} />
          <YAxis stroke="var(--mlvh-text)" fontSize={12} tickLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--mlvh-cream)",
              border: "1px solid var(--mlvh-blue)",
              borderRadius: 14,
              color: "var(--mlvh-text)",
            }}
          />
          <Bar dataKey="count" name={t("dashboard.consultations.series")} fill="var(--mlvh-blue-dark)" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}