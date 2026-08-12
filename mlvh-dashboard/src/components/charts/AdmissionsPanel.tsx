"use client";

import { useEffect, useState } from "react";
import AdmissionsBarChart from "@/components/charts/AdmissionsBarChart";
import ChartCard from "@/components/ui/ChartCard";
import { getAdmissionsWeekly } from "@/lib/api";
import { AdmissionsWeeklyPoint } from "@/lib/types";

const RANGE_OPTIONS = [4, 8, 12, 26];

interface AdmissionsPanelProps {
  initialWeeks: number;
  initialData: AdmissionsWeeklyPoint[];
}

export default function AdmissionsPanel({ initialWeeks, initialData }: AdmissionsPanelProps) {
  const [weeks, setWeeks] = useState(initialWeeks);
  const [data, setData] = useState(initialData);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (weeks === initialWeeks) return;

    let cancelled = false;
    setIsFetching(true);
    setError(null);

    getAdmissionsWeekly(weeks)
      .then((response) => {
        if (!cancelled) setData(response.data);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load this range.");
      })
      .finally(() => {
        if (!cancelled) setIsFetching(false);
      });

    return () => {
      cancelled = true;
    };
  }, [weeks, initialWeeks]);

  return (
    <ChartCard
      title="Admissions per week"
      isEmpty={data.length === 0 && !isFetching}
      actions={
        <select
          className="mlvh-range-select"
          value={weeks}
          onChange={(event) => setWeeks(Number(event.target.value))}
        >
          {RANGE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              Last {option} weeks
            </option>
          ))}
        </select>
      }
    >
      {error ? (
        <p className="mlvh-empty-state">{error}</p>
      ) : (
        <div style={{ opacity: isFetching ? 0.5 : 1, transition: "opacity 0.15s" }}>
          <AdmissionsBarChart data={data} />
        </div>
      )}
    </ChartCard>
  );
}