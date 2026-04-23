type BundleBuilderRowProps = {
  title: string;
  subtitle: string;
  quantity: number;
};

export const BundleBuilderRow = ({ title, subtitle, quantity }: BundleBuilderRowProps) => (
  <div className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
    <div>
      <div className="font-medium text-slate-900">{title}</div>
      <div className="text-sm text-slate-500">{subtitle}</div>
    </div>
    <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
      {quantity}
    </div>
  </div>
);
