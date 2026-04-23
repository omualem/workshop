import { cn } from "../lib/utils";

type MetricBar = {
  label: string;
  score: number;
};

export const MetricBars = ({ metrics, className }: { metrics: MetricBar[]; className?: string }) => (
  <div className={cn("space-y-3", className)}>
    {metrics.map((metric) => (
      <div key={metric.label} className="space-y-1">
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>{metric.label}</span>
          <span>{metric.score.toFixed(1)}/10</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-l from-emerald-500 to-cyan-500"
            style={{ width: `${Math.max(8, Math.min(100, metric.score * 10))}%` }}
          />
        </div>
      </div>
    ))}
  </div>
);
