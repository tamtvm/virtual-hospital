import { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  children: ReactNode;
  isEmpty?: boolean;
  actions?: ReactNode;
}

export default function ChartCard({ title, children, isEmpty = false, actions }: ChartCardProps) {
  return (
    <div className="mlvh-card">
      <div className="mlvh-card-header-row">
        <p className="mlvh-card-title">{title}</p>
        {actions}
      </div>
      {isEmpty ? <p className="mlvh-empty-state">No data yet.</p> : children}
    </div>
  );
}