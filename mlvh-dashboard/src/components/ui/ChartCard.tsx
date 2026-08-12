import { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  children: ReactNode;
  isEmpty?: boolean;
}

export default function ChartCard({ title, children, isEmpty = false }: ChartCardProps) {
  return (
    <div className="mlvh-card">
      <p className="mlvh-card-title">{title}</p>
      {isEmpty ? <p className="mlvh-empty-state">No data yet.</p> : children}
    </div>
  );
}