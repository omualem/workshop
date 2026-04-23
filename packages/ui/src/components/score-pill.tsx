import { cn } from "../lib/utils";

export const ScorePill = ({
  score,
  label,
  className,
}: {
  score: number;
  label: string;
  className?: string;
}) => (
  <div
    className={cn(
      "inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700",
      className,
    )}
  >
    <span>{label}</span>
    <span>{score.toFixed(1)}</span>
  </div>
);
