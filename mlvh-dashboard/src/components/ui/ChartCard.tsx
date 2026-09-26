"use client";

import { ReactNode } from "react";
import { useI18n } from "@/lib/i18n";

interface ChartCardProps {
  title: string;
  children: ReactNode;
  isEmpty?: boolean;
  actions?: ReactNode;
}

export default function ChartCard({ title, children, isEmpty = false, actions }: ChartCardProps) {
  const { t } = useI18n();

  return (
    <div className="mlvh-card">
      <div className="mlvh-card-header-row">
        <p className="mlvh-card-title">{title}</p>
        {actions}
      </div>
      {isEmpty ? <p className="mlvh-empty-state">{t("dashboard.emptyChart")}</p> : children}
    </div>
  );
}