export const ReputationBadge = ({
  rating,
  completedTransactions,
  label,
}: {
  rating: number;
  completedTransactions: number;
  label?: string;
}) => (
  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
    <div className="font-semibold text-slate-900">{label ?? "אמינות מלווה"}</div>
    <div className="mt-1 flex items-center gap-2">
      <span>{rating.toFixed(1)}★</span>
      <span className="text-slate-500">{completedTransactions} עסקאות</span>
    </div>
  </div>
);
