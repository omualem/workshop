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
      "pill pill-sage",
      className,
    )}
  >
    <span>{label}</span>
    <span>{score.toFixed(1)}</span>
  </div>
);
