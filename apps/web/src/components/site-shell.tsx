import Link from "next/link";
import { Button } from "@rental/ui";

const navItems = [
  { href: "/", label: "דף הבית" },
  { href: "/search", label: "חיפוש" },
  { href: "/bundle-request", label: "בקשת חבילה" },
  { href: "/about", label: "איך זה עובד" },
];

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="surface-shell">
      <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 backdrop-blur">
        <div className="surface-section flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <img src="/brand/logo-mark.svg" alt="RentMatch" className="h-11 w-11 rounded-2xl" />
            <div>
              <div className="text-lg font-semibold text-slate-900">RentMatch</div>
              <div className="text-xs text-slate-500">שוק השכרה חכם לריבוי פריטים</div>
            </div>
          </div>
          <nav className="hidden items-center gap-2 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
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
