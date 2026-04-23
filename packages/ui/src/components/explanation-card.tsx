import { Card } from "./card";

export const ExplanationCard = ({
  title,
  subtitle,
  strengths,
  tradeoffs,
}: {
  title: string;
  subtitle: string;
  strengths: string[];
  tradeoffs: string[];
}) => (
  <Card className="space-y-4">
    <div>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
    </div>
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">חוזקות</p>
      <div className="flex flex-wrap gap-2">
        {strengths.map((item) => (
          <span key={item} className="rounded-full bg-emerald-50 px-3 py-1 text-sm text-emerald-700">
            {item}
          </span>
        ))}
      </div>
    </div>
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">פשרות</p>
      <div className="flex flex-wrap gap-2">
        {tradeoffs.map((item) => (
          <span key={item} className="rounded-full bg-amber-50 px-3 py-1 text-sm text-amber-700">
            {item}
          </span>
        ))}
      </div>
    </div>
  </Card>
);
