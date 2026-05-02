// Site shells (public + dashboard) and supporting layout pieces.
// Globals: SiteShell, DashShell, ThemeBadge, SectionTitle, Stat, EmptyHint

const SiteShell = ({ children, active = "/" }) => {
  const nav = [
    { href: "/", label: "דף הבית" },
    { href: "/search", label: "קטלוג" },
    { href: "/bundle-request", label: "בקשת חבילה" },
    { href: "/about", label: "איך זה עובד" },
  ];
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "auto" }}>
      <header style={{
        position: "sticky", top: 0, zIndex: 20,
        background: "color-mix(in srgb, var(--bg) 88%, transparent)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid var(--line)",
      }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
          <Wordmark small />
          <nav style={{ display: "flex", gap: 4 }}>
            {nav.map((n) => (
              <a key={n.href} href="#" style={{
                padding: "8px 16px", borderRadius: 999, fontSize: 14, fontWeight: 500,
                color: n.href === active ? "var(--ink)" : "var(--ink-2)",
                background: n.href === active ? "var(--bg-alt)" : "transparent",
              }}>{n.label}</a>
            ))}
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button className="btn btn-ghost btn-sm">כניסה</button>
            <button className="btn btn-primary btn-sm">פתיחת חשבון</button>
          </div>
        </div>
      </header>
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
};

const DashShell = ({ children, role = "renter", active = "" }) => {
  const navs = {
    renter: {
      title: "לוח מזמין", subtitle: "חיפושים, חבילות והזמנות במקום אחד.",
      avatar: { name: "ד", color: "var(--clay)" }, who: "דניאל ברק",
      items: [
        { href: "/renter/dashboard", label: "סקירה", icon: "grid" },
        { href: "/renter/bundle-results", label: "תוצאות חבילה", icon: "sparkles" },
        { href: "/renter/orders", label: "הזמנות", icon: "package" },
        { href: "/renter/favorites", label: "מועדפים", icon: "heart" },
        { href: "/renter/saved-searches", label: "חיפושים שמורים", icon: "search" },
        { href: "/renter/compare", label: "השוואות", icon: "scale" },
        { href: "/renter/settings", label: "הגדרות", icon: "settings" },
      ],
    },
    lender: {
      title: "לוח משכיר", subtitle: "ניהול קטלוג, זמינות ותמחור.",
      avatar: { name: "מ", color: "var(--teal)" }, who: "מאיה לוי",
      items: [
        { href: "/lender/dashboard", label: "סקירה", icon: "grid" },
        { href: "/lender/listings", label: "פריטים", icon: "package" },
        { href: "/lender/availability", label: "זמינות", icon: "calendar" },
        { href: "/lender/pricing", label: "תמחור", icon: "tag" },
        { href: "/lender/bookings", label: "הזמנות", icon: "bag" },
        { href: "/lender/reviews", label: "ביקורות", icon: "star" },
        { href: "/lender/analytics", label: "אנליטיקה", icon: "trend-up" },
        { href: "/lender/profile", label: "פרופיל ואמינות", icon: "shield" },
      ],
    },
    admin: {
      title: "לוח אדמין", subtitle: "ניטור, מודרציה ודירוג.",
      avatar: { name: "צ", color: "var(--ink)" }, who: "צוות אופ׳",
      items: [
        { href: "/admin/dashboard", label: "סקירה", icon: "grid" },
        { href: "/admin/users", label: "משתמשים", icon: "users" },
        { href: "/admin/listings", label: "מודרציה", icon: "shield" },
        { href: "/admin/bookings", label: "הזמנות", icon: "bag" },
        { href: "/admin/disputes", label: "מחלוקות", icon: "alert" },
        { href: "/admin/reviews", label: "ביקורות", icon: "star" },
        { href: "/admin/categories", label: "קטגוריות", icon: "list" },
        { href: "/admin/ranking", label: "הגדרות דירוג", icon: "sliders" },
        { href: "/admin/audit", label: "יומן ביקורת", icon: "clock" },
      ],
    },
  };
  const cfg = navs[role];

  return (
    <div style={{
      display: "grid", gridTemplateColumns: "260px 1fr",
      height: "100%", background: "var(--bg)",
    }}>
      <aside style={{
        background: "var(--surface)",
        borderInlineStart: "1px solid var(--line)",
        padding: "22px 18px", display: "flex", flexDirection: "column", gap: 18,
        overflow: "auto",
      }}>
        <Wordmark small />
        <div style={{
          padding: "12px 14px", borderRadius: 16, background: "var(--bg-alt)",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <Avatar {...cfg.avatar} size={36}/>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{cfg.who}</div>
            <div style={{ fontSize: 11, color: "var(--muted)" }}>{cfg.title}</div>
          </div>
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {cfg.items.map((it) => {
            const isActive = it.href === active;
            return (
              <a key={it.href} href="#" style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 14px", borderRadius: 14, fontSize: 13,
                color: isActive ? "var(--ink)" : "var(--ink-2)",
                background: isActive ? "var(--bg-alt)" : "transparent",
                fontWeight: isActive ? 600 : 500,
                position: "relative",
              }}>
                {isActive && <span style={{ position: "absolute", insetInlineStart: 0, top: 10, bottom: 10, width: 3, background: "var(--teal)", borderRadius: 4 }}/>}
                <Icon name={it.icon} size={16} stroke={1.7} style={{ color: isActive ? "var(--teal)" : "var(--muted)" }}/>
                <span>{it.label}</span>
              </a>
            );
          })}
        </nav>
        <div style={{ marginTop: "auto", padding: 14, borderRadius: 16, background: "var(--bg-alt)", fontSize: 12, color: "var(--muted)", lineHeight: 1.6 }}>
          <div style={{ fontWeight: 600, color: "var(--ink-2)", marginBottom: 4 }}>צריכים עזרה?</div>
          הצוות שלנו זמין בעברית בימים א׳–ה׳, 09:00–18:00.
        </div>
      </aside>
      <div style={{ overflow: "auto" }}>
        <header style={{
          position: "sticky", top: 0, zIndex: 5,
          background: "color-mix(in srgb, var(--bg) 90%, transparent)",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid var(--line)",
          padding: "14px 28px",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--muted)", fontSize: 13 }}>
            <Icon name="search" size={16}/>
            <span>חיפוש מהיר…</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button className="btn btn-ghost btn-sm" style={{ padding: 8 }}><Icon name="bell" size={16}/></button>
            <button className="btn btn-ghost btn-sm" style={{ padding: 8 }}><Icon name="moon" size={16}/></button>
            <button className="btn btn-soft btn-sm">+ פריט חדש</button>
          </div>
        </header>
        <div style={{ padding: "24px 28px 56px" }}>
          {children}
        </div>
      </div>
    </div>
  );
};

const SectionTitle = ({ eyebrow, title, sub, action }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, marginBottom: 18 }}>
    <div>
      {eyebrow && <div className="eyebrow" style={{ marginBottom: 8 }}>{eyebrow}</div>}
      <h2 className="rm-display" style={{ fontSize: 28, fontWeight: 700, marginBottom: sub ? 6 : 0 }}>{title}</h2>
      {sub && <p style={{ color: "var(--muted)", maxWidth: 560 }}>{sub}</p>}
    </div>
    {action}
  </div>
);

const Stat = ({ label, value, delta, deltaDir = "up", icon, accent = "var(--teal)" }) => (
  <div className="card" style={{ display: "flex", flexDirection: "column", gap: 8, padding: 18 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: 12, color: "var(--muted)" }}>{label}</span>
      {icon && <div style={{ width: 28, height: 28, borderRadius: 10, background: "var(--bg-alt)", display: "grid", placeItems: "center", color: accent }}><Icon name={icon} size={14} stroke={1.8}/></div>}
    </div>
    <div style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 700, lineHeight: 1, color: "var(--ink)" }}>{value}</div>
    {delta && (
      <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: deltaDir === "up" ? "var(--sage)" : "var(--rose)" }}>
        <Icon name={deltaDir === "up" ? "trend-up" : "trend-down"} size={12}/>
        <span>{delta}</span>
        <span style={{ color: "var(--muted)" }}>מהשבוע שעבר</span>
      </div>
    )}
  </div>
);

Object.assign(window, { SiteShell, DashShell, SectionTitle, Stat });
