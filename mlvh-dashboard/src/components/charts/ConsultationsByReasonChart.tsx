"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ConsultationsByReasonRow } from "@/lib/types";
import ChartCard from "@/components/ui/ChartCard";

interface ConsultationsByReasonChartProps {
  data: ConsultationsByReasonRow[];
}

export default function ConsultationsByReasonChart({ data }: ConsultationsByReasonChartProps) {
  return (
    <ChartCard title="Consultations by type" isEmpty={data.length === 0}>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--mlvh-blue)" />
          <XAxis dataKey="label" stroke="var(--mlvh-text)" fontSize={12} tickLine={false} />
          <YAxis stroke="var(--mlvh-text)" fontSize={12} tickLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--mlvh-cream)",
              border: "1px solid var(--mlvh-blue)",
              borderRadius: 14,
              color: "var(--mlvh-text)",
            }}
          />
          <Bar dataKey="count" fill="var(--mlvh-blue-dark)" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}