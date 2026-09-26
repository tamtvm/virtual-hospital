"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { PatientsBySpeciesRow } from "@/lib/types";
import ChartCard from "@/components/ui/ChartCard";
import { useI18n } from "@/lib/i18n";

interface PatientsBySpeciesChartProps {
  data: PatientsBySpeciesRow[];
}

const COLORS = ["#6fa8c0", "#a8d8e8", "#cfe8f3", "#f3d9c4", "#d9c4e8", "#c4e8d0"];

export default function PatientsBySpeciesChart({ data }: PatientsBySpeciesChartProps) {
  const { t, optionLabel } = useI18n();
  const chartData = data.map((row) => ({ ...row, name: optionLabel("species", row.species) }));

  return (
    <ChartCard title={t("dashboard.species.title")} isEmpty={data.length === 0}>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="count"
            nameKey="name"
            innerRadius="55%"
            outerRadius="85%"
            paddingAngle={3}
            cornerRadius={8}
          >
            {chartData.map((entry, index) => (
              <Cell key={entry.species} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--mlvh-cream)",
              border: "1px solid var(--mlvh-blue)",
              borderRadius: 14,
              color: "var(--mlvh-text)",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}