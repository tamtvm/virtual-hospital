import { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  children: ReactNode;
}

export default function ChartCard({ title, children }: ChartCardProps) {
  return (
    <div className="mlvh-card">
      <p className="mlvh-card-title">{title}</p>
      {children}
    </div>
  );
}