import Link from "next/link";
import { AppLogo } from "./app-logo";

const iconByHref: Record<string, string> = {
  dashboard: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  listings: "m12 3 9 5v8l-9 5-9-5V8l9-5Z",
  availability: "M4 5h16v16H4zM4 9h16M8 3v4M16 3v4",
  pricing: "M3 12V3h9l9 9-9 9-9-9Z",
  bookings: "M5 8h14l-1 12H6L5 8ZM9 8a3 3 0 0 1 6 0",
  reviews: "m12 3 2.7 5.5 6 .9-4.4 4.2 1 6-5.3-2.8-5.3 2.8 1-6-4.4-4.2 6-.9L12 3Z",
  analytics: "m3 17 6-6 4 4 8-8M14 7h7v7",
  profile: "M12 3 4 6v6c0 5 4 8 8 9 4-1 8-4 8-9V6l-8-3Z",
  users: "M9 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM2 21a7 7 0 0 1 14 0M17 11a4 4 0 0 0 0-7M22 21a7 7 0 0 0-5-6",
  disputes: "M12 3 2 21h20L12 3ZM12 9v5M12 17h.01",
  categories: "M8 6h13M8 12h13M8 18h13M4 6h.01M4 12h.01M4 18h.01",
  ranking: "M4 6h16M4 12h16M4 18h16M9 6h.01M15 12h.01M7 18h.01",
  audit: "M12 6v6l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0",
  favorites: "M12 20s-7-4.3-7-10a4.5 4.5 0 0 1 8-2 4.5 4.5 0 0 1 8 2c0 5.7-7 10-7 10h-2Z",
  "saved-searches": "M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14ZM20 20l-4-4",
  compare: "M12 3v18M5 7h14M3 14l4-7 4 7H3Zm10 0 4-7 4 7h-8Z",
  settings:
    "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3 1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8 1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1Z",
};

function NavIcon({ href }: { href: string }) {
  const key = href.split("/").filter(Boolean).at(-1) ?? "dashboard";
  const path = iconByHref[key] ?? iconByHref.dashboard;
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
}

export function DashboardShell({
  title,
  subtitle,
  navItems,
  activeHref,
  headerActions,
  children,
}: {
  title: string;
  subtitle: string;
  navItems: Array<{ href: string; label: string }>;
  activeHref?: string;
  headerActions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-grid min-h-screen">
      <aside className="border-l border-slate-200 bg-white/90 px-5 py-6 backdrop-blur">
        <Link href="/" className="mb-5 flex items-center gap-3">
          <AppLogo size={44} priority className="h-11 w-11" />
          <div className="text-xs text-slate-500">{title}</div>
        </Link>
        <div className="mb-5 rounded-[16px] bg-slate-50 p-3">
          <h1 className="text-sm font-bold text-slate-950">{title}</h1>
          <p className="mt-1 text-xs leading-5 text-slate-600">{subtitle}</p>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const active = item.href === activeHref;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "relative flex items-center gap-3 rounded-[14px] px-3.5 py-2.5 text-sm font-semibold transition",
                  active
                    ? "bg-slate-100 text-slate-950"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-950",
                ].join(" ")}
              >
                {active ? (
                  <span className="absolute inset-y-2 right-0 w-0.5 rounded-full bg-[var(--teal)]" />
                ) : null}
                <span className={active ? "text-[var(--teal)]" : "text-slate-500"}>
                  <NavIcon href={item.href} />
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-8 rounded-[16px] bg-slate-50 p-3 text-xs leading-6 text-slate-600">
          <div className="font-semibold text-slate-900">צריכים עזרה?</div>
          הצוות זמין בעברית בימים א'-ה', 09:00-18:00.
        </div>
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200/70 bg-white/80 px-7 py-3.5 backdrop-blur">
          <div className="text-sm text-slate-500">חיפוש מהיר...</div>
          <div className="flex items-center gap-2">{headerActions}</div>
        </header>
        <main className="px-7 py-6">{children}</main>
      </div>
    </div>
  );
}
