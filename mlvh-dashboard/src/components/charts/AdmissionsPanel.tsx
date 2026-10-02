"use client";

import { useEffect, useState } from "react";
import AdmissionsBarChart from "@/components/charts/AdmissionsBarChart";
import ChartCard from "@/components/ui/ChartCard";
import { getAdmissionsWeekly } from "@/lib/api";
import { AdmissionsWeeklyPoint } from "@/lib/types";
import { useI18n } from "@/lib/i18n";

const RANGE_OPTIONS = [4, 8, 12, 26];

interface AdmissionsPanelProps {
  initialWeeks: number;
  initialData: AdmissionsWeeklyPoint[];
}

export default function AdmissionsPanel({ initialWeeks, initialData }: AdmissionsPanelProps) {
  const { t } = useI18n();
  const [weeks, setWeeks] = useState(initialWeeks);
  const [data, setData] = useState(initialData);
  const [isFetching, setIsFetching] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (weeks === initialWeeks) return;

    let cancelled = false;
    setIsFetching(true);
    setHasError(false);

    getAdmissionsWeekly(weeks)
      .then((response) => {
        if (!cancelled) setData(response.data);
      })
      .catch(() => {
        if (!cancelled) setHasError(true);
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
      title={t("dashboard.admissions.title")}
      isEmpty={data.length === 0 && !isFetching}
      actions={
        <select
          className="mlvh-rounded-input mlvh-range-select"
          aria-label={t("dashboard.admissions.rangeLabel")}
          value={weeks}
          onChange={(event) => setWeeks(Number(event.target.value))}
        >
          {RANGE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {t("dashboard.admissions.range", { count: option })}
            </option>
          ))}
        </select>
      }
    >
      {hasError ? (
        <p className="mlvh-empty-state">{t("dashboard.admissions.rangeError")}</p>
      ) : (
        <div style={{ opacity: isFetching ? 0.5 : 1, transition: "opacity 0.15s" }}>
          <AdmissionsBarChart data={data} />
        </div>
      )}
    </ChartCard>
  );
}