import Link from "next/link";
import { Button } from "@rental/ui";
import { AppLogo } from "./app-logo";

const navItems = [
  { href: "/", label: "דף הבית" },
  { href: "/search", label: "קטלוג" },
  { href: "/bundle-request", label: "בקשת חבילה" },
  { href: "/about", label: "איך זה עובד" },
];

export function SiteShell({
  children,
  activeHref,
}: {
  children: React.ReactNode;
  activeHref?: string;
}) {
  return (
    <div className="surface-shell">
      <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 backdrop-blur">
        <div className="surface-section flex items-center justify-between gap-6 py-3.5">
          <Link href="/" className="flex items-center">
            <AppLogo size={44} priority className="h-11 w-11" />
          </Link>
          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const active = item.href === activeHref;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "rounded-full px-4 py-2 text-sm font-semibold transition",
                    active
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-950",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/auth/sign-in">
              <Button variant="ghost">כניסה</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button>פתיחת חשבון</Button>
            </Link>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
