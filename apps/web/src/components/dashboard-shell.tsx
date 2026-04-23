import Link from "next/link";

export function DashboardShell({
  title,
  subtitle,
  navItems,
  activeHref,
  children,
}: {
  title: string;
  subtitle: string;
  navItems: Array<{ href: string; label: string }>;
  activeHref?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-grid min-h-screen bg-slate-50/70">
      <aside className="border-l border-slate-200 bg-white/90 px-6 py-8 backdrop-blur">
        <div className="mb-8 flex items-center gap-3">
          <img src="/brand/logo-mark.svg" alt="RentMatch" className="h-12 w-12 rounded-2xl" />
          <div>
            <h1 className="text-xl font-semibold text-slate-950">{title}</h1>
            <p className="mt-1 text-sm leading-6 text-slate-600">{subtitle}</p>
          </div>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const active = item.href === activeHref;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "block rounded-2xl px-4 py-3 text-sm font-medium transition",
                  active
                    ? "bg-slate-900 text-white shadow-[0_12px_40px_rgba(15,23,42,0.14)]"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-950",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="px-6 py-8">{children}</div>
    </div>
  );
}
