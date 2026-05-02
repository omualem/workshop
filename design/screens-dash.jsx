// Renter, Lender, Admin dashboards
// Globals: ScreenRenterDash, ScreenRenterOrders, ScreenRenterFavorites, ScreenRenterSavedSearches, ScreenRenterSettings,
//          ScreenLenderDash, ScreenLenderListings, ScreenLenderAvailability, ScreenLenderPricing, ScreenLenderBookings, ScreenLenderReviews, ScreenLenderAnalytics, ScreenLenderProfile,
//          ScreenAdminDash, ScreenAdminUsers, ScreenAdminListings, ScreenAdminBookings, ScreenAdminDisputes, ScreenAdminReviews, ScreenAdminCategories, ScreenAdminRanking, ScreenAdminAudit

const Tag = ({ kind, children }) => {
  const map = {
    ok: "pill-sage", warn: "pill-amber", info: "pill-teal", bad: "pill-rose", neutral: "",
  };
  return <span className={`pill ${map[kind] || ""}`}>{children}</span>;
};

const Table = ({ cols, rows }) => (
  <div className="card" style={{ padding: 0, overflow: "hidden" }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
      <thead style={{ background: "var(--bg-alt)" }}>
        <tr>{cols.map((c) => <th key={c} style={{ padding: "12px 18px", textAlign: "right", fontWeight: 500, color: "var(--muted)", fontSize: 11, textTransform: "uppercase", letterSpacing: ".1em" }}>{c}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} style={{ borderTop: "1px solid var(--line)" }}>
            {r.map((c, j) => <td key={j} style={{ padding: "14px 18px" }}>{c}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// =================== RENTER DASHBOARD ===================
const ScreenRenterDash = () => (
  <DashShell role="renter" active="/renter/dashboard">
    <SectionTitle eyebrow="סקירה" title="ברוכים השבים, דניאל" sub="חיפושים פעילים, החבילות שלכם והזמנות קרובות."
      action={<button className="btn btn-teal btn-sm"><Icon name="sparkles" size={14}/>בקשת חבילה חדשה</button>}/>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 22 }}>
      <Stat label="חיפושים פעילים" value="4" delta="+2" deltaDir="up" icon="search" accent="var(--teal)"/>
      <Stat label="הזמנות פעילות" value="2" delta="+1" deltaDir="up" icon="bag" accent="var(--clay)"/>
      <Stat label="מועדפים" value="11" delta="+3" deltaDir="up" icon="heart" accent="var(--rose)"/>
      <Stat label="חיסכון השנה" value="₪2,840" delta="+18%" deltaDir="up" icon="wallet" accent="var(--sage)"/>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1.4fr 0.6fr", gap: 16 }}>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between" }}>
          <h3 style={{ fontSize: 15, fontWeight: 600 }}>הזמנות קרובות</h3>
          <a href="#" style={{ fontSize: 12, color: "var(--teal)" }}>לכל ההזמנות</a>
        </div>
        <Table cols={["חבילה","תאריך","סה״כ","סטטוס",""]} rows={[
          [<span style={{ display: "flex", gap: 10, alignItems: "center" }}><div style={{ width: 36, height: 36, borderRadius: 10, overflow: "hidden" }}><CategoryArt kind="camera" tone="teal" height={36}/></div><span style={{ fontWeight: 500 }}>ערכת צילום עירונית</span></span>, "02-05.05.2026", "₪1,280", <Tag kind="ok">מאושרת</Tag>, <button className="btn btn-ghost btn-sm">פרטים</button>],
          [<span style={{ display: "flex", gap: 10, alignItems: "center" }}><div style={{ width: 36, height: 36, borderRadius: 10, overflow: "hidden" }}><CategoryArt kind="speakers" tone="clay" height={36}/></div><span style={{ fontWeight: 500 }}>חבילת הקרנה לקהילה</span></span>, "08-09.05.2026", "₪2,040", <Tag kind="warn">ממתינה</Tag>, <button className="btn btn-ghost btn-sm">פרטים</button>],
          [<span style={{ display: "flex", gap: 10, alignItems: "center" }}><div style={{ width: 36, height: 36, borderRadius: 10, overflow: "hidden" }}><CategoryArt kind="tent" tone="rose" height={36}/></div><span style={{ fontWeight: 500 }}>אירוע חצר 60 איש</span></span>, "21-22.05.2026", "₪3,460", <Tag kind="info">בתיאום</Tag>, <button className="btn btn-ghost btn-sm">פרטים</button>],
        ]}/>
      </div>

      <div className="card" style={{ padding: 22 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>חיפושים אחרונים</h3>
        {[
          { t: "ערכת אירוע 80 איש", d: "לפני 2 ימים · 3 פריטים", k: "tent", tone: "rose" },
          { t: "חבילת הסרטה לחתונה", d: "לפני 5 ימים · 5 פריטים", k: "camera", tone: "teal" },
          { t: "תאורה לסטודיו ביתי", d: "השבוע שעבר · 2 פריטים", k: "lighting", tone: "amber" },
        ].map((s) => (
          <a key={s.t} href="#" style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid var(--line)" }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, overflow: "hidden" }}><CategoryArt kind={s.k} tone={s.tone} height={40}/></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500, fontSize: 13 }}>{s.t}</div>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>{s.d}</div>
            </div>
            <Icon name="arrow-left" size={14} style={{ color: "var(--muted)" }}/>
          </a>
        ))}
        <button className="btn btn-soft btn-block btn-sm" style={{ marginTop: 14 }}>חיפושים שמורים</button>
      </div>
    </div>
  </DashShell>
);

const ScreenRenterOrders = () => (
  <DashShell role="renter" active="/renter/orders">
    <SectionTitle eyebrow="הזמנות" title="כל ההזמנות שלכם" sub="עוקבים אחרי סטטוס, מסמכים ופיקדונות."
      action={<div style={{ display: "flex", gap: 6 }}><button className="btn btn-soft btn-sm"><Icon name="filter" size={14}/>סינון</button><button className="btn btn-soft btn-sm"><Icon name="download" size={14}/>ייצוא</button></div>}/>

    <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
      {[{l:"הכל",n:14,a:true},{l:"פעילות",n:3},{l:"היסטוריה",n:11},{l:"בוטלו",n:0}].map((t) => (
        <button key={t.l} className={`btn ${t.a?"btn-primary":"btn-ghost"} btn-sm`}>{t.l}<span style={{ marginInlineStart: 6, fontSize: 11, opacity: .7 }}>{t.n}</span></button>
      ))}
    </div>

    <Table cols={["#","חבילה","משכירים","תאריכים","סה״כ","פיקדון","סטטוס",""]} rows={[
      ["#21048", <span style={{ display: "flex", gap: 10, alignItems: "center" }}><div style={{ width: 32, height: 32, borderRadius: 8, overflow: "hidden" }}><CategoryArt kind="camera" tone="teal" height={32}/></div><span style={{ fontWeight: 500 }}>ערכת צילום עירונית</span></span>, "סטודיו לוז · Compact AV", "02-05.05", "₪1,280", "₪500", <Tag kind="ok">מאושרת</Tag>, <button className="btn btn-ghost btn-sm">צפייה</button>],
      ["#21039", <span style={{ display: "flex", gap: 10, alignItems: "center" }}><div style={{ width: 32, height: 32, borderRadius: 8, overflow: "hidden" }}><CategoryArt kind="speakers" tone="clay" height={32}/></div><span style={{ fontWeight: 500 }}>חבילת הקרנה לקהילה</span></span>, "Bundle Hub", "08-09.05", "₪2,040", "₪700", <Tag kind="warn">ממתינה לאישור</Tag>, <button className="btn btn-ghost btn-sm">צפייה</button>],
      ["#21022", <span style={{ display: "flex", gap: 10, alignItems: "center" }}><div style={{ width: 32, height: 32, borderRadius: 8, overflow: "hidden" }}><CategoryArt kind="tent" tone="rose" height={32}/></div><span style={{ fontWeight: 500 }}>אירוע חצר 60 איש</span></span>, "ערב טוב הפקות + 2", "21-22.05", "₪3,460", "₪1,200", <Tag kind="info">בתיאום</Tag>, <button className="btn btn-ghost btn-sm">צפייה</button>],
      ["#20988", <span style={{ display: "flex", gap: 10, alignItems: "center" }}><div style={{ width: 32, height: 32, borderRadius: 8, overflow: "hidden" }}><CategoryArt kind="lighting" tone="amber" height={32}/></div><span style={{ fontWeight: 500 }}>תאורת סטודיו ביתי</span></span>, "Compact AV", "12-14.04", "₪585", "₪200", <Tag kind="neutral">הסתיימה</Tag>, <button className="btn btn-ghost btn-sm">צפייה</button>],
      ["#20956", <span style={{ display: "flex", gap: 10, alignItems: "center" }}><div style={{ width: 32, height: 32, borderRadius: 8, overflow: "hidden" }}><CategoryArt kind="drone" tone="teal" height={32}/></div><span style={{ fontWeight: 500 }}>צילום אווירי לחתונה</span></span>, "סטודיו לוז", "06.04", "₪410", "₪600", <Tag kind="bad">בוטלה</Tag>, <button className="btn btn-ghost btn-sm">צפייה</button>],
    ]}/>
  </DashShell>
);

const ScreenRenterFavorites = () => (
  <DashShell role="renter" active="/renter/favorites">
    <SectionTitle eyebrow="מועדפים" title="פריטים שמרתם לאחר כך" sub="הוסיפו אותם לבקשת חבילה כשתהיו מוכנים."/>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
      {LISTINGS.slice(0, 6).map((l) => <ListingCard key={l.id} l={l}/>)}
    </div>
  </DashShell>
);

const ScreenRenterSavedSearches = () => (
  <DashShell role="renter" active="/renter/saved-searches">
    <SectionTitle eyebrow="חיפושים שמורים" title="התראות על חיפושים פעילים" sub="נודיע לכם כשמופיעות חבילות חדשות שמתאימות לתבחינים."/>
    <Table cols={["שם","פריטים","תאריכים","פריסט","התראות",""]} rows={[
      ["ערכת אירוע 80 איש","תאורה · הגברה · אוהל","21-22.05","מאוזן",<Tag kind="ok">פעילות</Tag>,<button className="btn btn-ghost btn-sm">ערוך</button>],
      ["צילום חתונה","מצלמה · רחפן · תאורה","12.06","איכות תחילה",<Tag kind="ok">פעילות</Tag>,<button className="btn btn-ghost btn-sm">ערוך</button>],
      ["תאורת סטודיו","תאורה","גמיש","מחיר תחילה",<Tag kind="neutral">הושתקו</Tag>,<button className="btn btn-ghost btn-sm">ערוך</button>],
    ]}/>
  </DashShell>
);

const ScreenRenterSettings = () => (
  <DashShell role="renter" active="/renter/settings">
    <SectionTitle eyebrow="הגדרות" title="פרטים והעדפות" sub="פרטים אישיים, פרטי תשלום והעדפות התראה."/>
    <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 24 }}>
      <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {[
          { l: "פרופיל", a: true },
          { l: "אבטחה" },
          { l: "תשלום" },
          { l: "התראות" },
          { l: "פרטיות" },
        ].map((t) => (
          <a key={t.l} href="#" style={{ padding: "10px 14px", borderRadius: 12, fontSize: 13, fontWeight: 500, background: t.a ? "var(--bg-alt)" : "transparent", color: t.a ? "var(--ink)" : "var(--ink-2)" }}>{t.l}</a>
        ))}
      </nav>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>פרטים אישיים</h3>
          <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 22 }}>
            <Avatar name="ד" color="var(--clay)" size={64}/>
            <div>
              <button className="btn btn-soft btn-sm">שנו תמונה</button>
              <button className="btn btn-ghost btn-sm" style={{ color: "var(--rose)" }}>מחקו</button>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div><label className="label">שם פרטי</label><input className="input" defaultValue="דניאל"/></div>
            <div><label className="label">שם משפחה</label><input className="input" defaultValue="ברק"/></div>
            <div><label className="label">דוא״ל</label><input className="input" defaultValue="daniel@example.com"/></div>
            <div><label className="label">טלפון</label><input className="input" defaultValue="050-1234567"/></div>
            <div style={{ gridColumn: "span 2" }}><label className="label">כתובת ברירת מחדל</label><input className="input" defaultValue="רחוב דיזנגוף 142, תל אביב"/></div>
          </div>
          <div style={{ marginTop: 22, display: "flex", gap: 8, justifyContent: "flex-start" }}>
            <button className="btn btn-primary">שמרו שינויים</button>
            <button className="btn btn-ghost">בטלו</button>
          </div>
        </div>
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>שפה ומטבע</h3>
          <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 16 }}>מתורגם אוטומטית ב-RTL.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div><label className="label">שפה</label><select className="select"><option>עברית</option><option>English</option></select></div>
            <div><label className="label">מטבע</label><select className="select"><option>שקל (₪)</option><option>USD ($)</option></select></div>
          </div>
        </div>
      </div>
    </div>
  </DashShell>
);

// =================== LENDER ===================
const ScreenLenderDash = () => (
  <DashShell role="lender" active="/lender/dashboard">
    <SectionTitle eyebrow="סקירה" title="ברוכה השבה, מאיה" sub="מצב הקטלוג, האמינות והתרומה לחבילות."
      action={<button className="btn btn-teal btn-sm"><Icon name="plus" size={14}/>פריט חדש</button>}/>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 22 }}>
      <Stat label="פריטים פעילים" value="12" delta="+2" icon="package" accent="var(--teal)"/>
      <Stat label="אמינות משוקללת" value="8.9" delta="+0.3" icon="shield" accent="var(--sage)"/>
      <Stat label="הופעות בחבילות" value="31" delta="+8" icon="sparkles" accent="var(--clay)"/>
      <Stat label="הכנסה החודש" value="₪14,820" delta="+22%" icon="wallet" accent="var(--rose)"/>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1.4fr 0.6fr", gap: 16, marginBottom: 16 }}>
      <div className="card" style={{ padding: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600 }}>הכנסות 30 יום אחרונים</h3>
          <div style={{ display: "flex", gap: 6 }}>
            {["יום","שבוע","חודש","שנה"].map((p,i) => <button key={p} className={`btn btn-sm ${i===2?"btn-soft":"btn-ghost"}`} style={{ fontSize: 12 }}>{p}</button>)}
          </div>
        </div>
        <ChartArea/>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--line)" }}>
          {[{l:"השבוע",v:"₪3,420"},{l:"שבוע שעבר",v:"₪2,810"},{l:"ממוצע יומי",v:"₪493"}].map((s) => (
            <div key={s.l}><div style={{ fontSize: 11, color: "var(--muted)" }}>{s.l}</div><div className="rm-display" style={{ fontSize: 20, fontWeight: 700, marginTop: 2 }}>{s.v}</div></div>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 22 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>הזדמנויות לשיפור</h3>
        {[
          { i: "image", t: "הוסיפו 2 תמונות לחצובה", d: "ישפר ציון איכות ב-0.8", c: "var(--clay)" },
          { i: "calendar", t: "עדכנו זמינות ל-3 פריטים", d: "פוטרים מבלוקים בחבילות", c: "var(--teal)" },
          { i: "tag", t: "הנחת duration ל-3+ ימים", d: "עליה ב-Best Price", c: "var(--sage)" },
        ].map((s) => (
          <div key={s.t} style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: "1px solid var(--line)" }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: "var(--bg-alt)", color: s.c, display: "grid", placeItems: "center", flexShrink: 0 }}><Icon name={s.i} size={14}/></div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{s.t}</div>
              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{s.d}</div>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between" }}>
        <h3 style={{ fontSize: 15, fontWeight: 600 }}>הזמנות שדורשות תשומת לב</h3>
        <a href="#" style={{ fontSize: 12, color: "var(--teal)" }}>לכל ההזמנות</a>
      </div>
      <Table cols={["שוכר","פריט","תאריכים","סה״כ","סטטוס",""]} rows={[
        [<span style={{ display: "flex", gap: 8, alignItems: "center" }}><Avatar name="ד" color="var(--clay)" size={28}/>דניאל ברק</span>, "Sony α7 IV", "02-05.05", "₪835", <Tag kind="warn">דורש אישור</Tag>, <button className="btn btn-teal btn-sm">אשרו</button>],
        [<span style={{ display: "flex", gap: 8, alignItems: "center" }}><Avatar name="א" color="var(--teal)" size={28}/>אורי אלון</span>, "Aputure 120D × 2", "06-08.05", "₪580", <Tag kind="info">בתיאום</Tag>, <button className="btn btn-soft btn-sm">צ׳אט</button>],
        [<span style={{ display: "flex", gap: 8, alignItems: "center" }}><Avatar name="ש" color="var(--sage)" size={28}/>שירה מזרחי</span>, "DJI Mavic 3", "11.05", "₪410", <Tag kind="ok">מאושרת</Tag>, <button className="btn btn-ghost btn-sm">פרטים</button>],
      ]}/>
    </div>
  </DashShell>
);

const ChartArea = () => {
  const data = [120, 180, 150, 210, 240, 195, 260, 220, 280, 310, 295, 340, 380, 360];
  const w = 600, h = 140;
  const max = Math.max(...data);
  const pts = data.map((v, i) => `${(i/(data.length-1))*w},${h - (v/max)*(h-10) - 4}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none">
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--teal)" stopOpacity=".25"/>
          <stop offset="1" stopColor="var(--teal)" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polyline points={`0,${h} ${pts} ${w},${h}`} fill="url(#grad)" stroke="none"/>
      <polyline points={pts} fill="none" stroke="var(--teal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {data.map((v, i) => i === data.length - 2 && (
        <circle key={i} cx={(i/(data.length-1))*w} cy={h - (v/max)*(h-10) - 4} r="4" fill="var(--clay)"/>
      ))}
    </svg>
  );
};

const ScreenLenderListings = () => (
  <DashShell role="lender" active="/lender/listings">
    <SectionTitle eyebrow="פריטים" title="הקטלוג שלי" sub="ניהול 12 פריטים פעילים, איכות ההצגה ודירוג בחבילות."
      action={<div style={{ display: "flex", gap: 6 }}><button className="btn btn-soft btn-sm"><Icon name="filter" size={14}/>סינון</button><button className="btn btn-teal btn-sm"><Icon name="plus" size={14}/>פריט חדש</button></div>}/>

    <Table cols={["פריט","קטגוריה","מחיר/יום","ציון איכות","הופעות","סטטוס",""]} rows={LISTINGS.slice(0,5).map((l) => [
      <span style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ width: 48, height: 36, borderRadius: 8, overflow: "hidden", flexShrink: 0 }}><CategoryArt kind={l.catKind} tone={l.tone} height={36}/></div>
        <div><div style={{ fontWeight: 500, fontSize: 13 }}>{l.title}</div><div style={{ fontSize: 11, color: "var(--muted)" }}>SKU-{l.id.toString().padStart(4,"0")}</div></div>
      </span>,
      l.cat, `₪${l.price}`,
      <span style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 60 }} className="metric-bar"><i style={{ width: `${(l.rating/5)*100}%` }}/></div><span style={{ fontSize: 12 }}>{l.rating}</span></span>,
      `${l.deals} השבוע`,
      l.id === 4 ? <Tag kind="warn">פרטים חסרים</Tag> : <Tag kind="ok">פעיל</Tag>,
      <span style={{ display: "flex", gap: 4 }}><button className="btn btn-ghost btn-sm" style={{ padding: 6 }}><Icon name="edit" size={14}/></button><button className="btn btn-ghost btn-sm" style={{ padding: 6 }}><Icon name="more" size={14}/></button></span>,
    ])}/>
  </DashShell>
);

const ScreenLenderAvailability = () => (
  <DashShell role="lender" active="/lender/availability">
    <SectionTitle eyebrow="זמינות" title="לוח שנה לפריטים" sub="חסימה, תיאומים, ותקופות פעילות. גרירה כדי לסמן."/>
    <div className="card" style={{ padding: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-soft btn-sm"><Icon name="chevron" size={14}/></button>
          <h3 style={{ fontSize: 15, fontWeight: 600 }}>מאי 2026</h3>
          <button className="btn btn-soft btn-sm" style={{ transform: "scaleX(-1)" }}><Icon name="chevron" size={14}/></button>
        </div>
        <select className="select" style={{ width: "auto", padding: "8px 12px", fontSize: 12 }}>
          <option>Sony α7 IV</option><option>Aputure 120D</option><option>כל הפריטים</option>
        </select>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
        {["א","ב","ג","ד","ה","ו","ש"].map((d) => <div key={d} style={{ textAlign: "center", fontSize: 11, color: "var(--muted)", padding: 6 }}>{d}</div>)}
        {Array.from({length: 35}).map((_, i) => {
          const day = i - 3;
          const out = day < 1 || day > 31;
          const status = [2,3,4,5].includes(day) ? "booked" : [11,12].includes(day) ? "blocked" : [22,23].includes(day) ? "pending" : "free";
          const colors = { free: "var(--surface)", booked: "var(--teal-soft)", pending: "var(--amber-soft)", blocked: "var(--bg-alt)" };
          const ink = { free: "var(--ink)", booked: "var(--teal-ink)", pending: "var(--amber)", blocked: "var(--muted)" };
          return (
            <div key={i} style={{
              aspectRatio: "1.1/1", borderRadius: 10, border: "1px solid var(--line)",
              background: out ? "transparent" : colors[status], color: out ? "var(--muted-2)" : ink[status],
              padding: 8, fontSize: 12, display: "flex", flexDirection: "column", justifyContent: "space-between",
              opacity: out ? .3 : 1,
            }}>
              <span style={{ fontWeight: 500 }}>{out ? "" : day}</span>
              {!out && status !== "free" && <span style={{ fontSize: 9, fontWeight: 500 }}>{({booked:"מוזמן",pending:"בתיאום",blocked:"חסום"})[status]}</span>}
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 16, marginTop: 18, fontSize: 12, color: "var(--muted)" }}>
        {[{c:"var(--surface)",l:"זמין",b:"var(--line)"},{c:"var(--teal-soft)",l:"מוזמן"},{c:"var(--amber-soft)",l:"בתיאום"},{c:"var(--bg-alt)",l:"חסום"}].map((x)=>(
          <span key={x.l} style={{ display: "flex", gap: 6, alignItems: "center" }}><span style={{ width: 14, height: 14, borderRadius: 4, background: x.c, border: x.b ? `1px solid ${x.b}` : 0 }}/>{x.l}</span>
        ))}
      </div>
    </div>
  </DashShell>
);

const ScreenLenderPricing = () => (
  <DashShell role="lender" active="/lender/pricing">
    <SectionTitle eyebrow="תמחור" title="מחירים, הנחות ומבצעים" sub="הנחות לפי מספר ימים והנחת חבילה משוקללת."/>
    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 16 }}>
      <div className="card" style={{ padding: 22 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>הנחת משך השכרה</h3>
        <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 18 }}>מומלץ — הנחת duration מעלה אתכם בפריסט Best Price ב-15-25%.</p>
        {[
          { d: "1-2 ימים", v: 0, max: 0 },
          { d: "3-4 ימים", v: 8, max: 30 },
          { d: "5-7 ימים", v: 15, max: 30 },
          { d: "8+ ימים", v: 22, max: 30 },
        ].map((r) => (
          <div key={r.d} style={{ display: "grid", gridTemplateColumns: "100px 1fr 60px", gap: 14, alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 13 }}>{r.d}</span>
            <div style={{ position: "relative", height: 8, background: "var(--bg-alt)", borderRadius: 4 }}>
              <div style={{ position: "absolute", insetInlineStart: 0, top: 0, bottom: 0, width: `${(r.v/30)*100}%`, background: "var(--clay)", borderRadius: 4 }}/>
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, textAlign: "left" }}>{r.v}%</span>
          </div>
        ))}
        <button className="btn btn-soft btn-sm" style={{ marginTop: 8 }}>שמרו הגדרות</button>
      </div>

      <div className="card" style={{ padding: 22 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>הצעת מחיר חכמה</h3>
        <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 18 }}>השוואת המחיר שלכם לקטגוריה ולפריטים דומים באזור.</p>
        <div className="card-soft" style={{ padding: 16, marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: "var(--muted)" }}>Sony α7 IV</span>
            <span className="pill pill-sage">תחרותי</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, fontSize: 12 }}>
            <div><div style={{ color: "var(--muted)" }}>אתם</div><div className="rm-display" style={{ fontSize: 19, fontWeight: 700 }}>₪280</div></div>
            <div><div style={{ color: "var(--muted)" }}>ממוצע אזור</div><div className="rm-display" style={{ fontSize: 19, fontWeight: 700 }}>₪295</div></div>
            <div><div style={{ color: "var(--muted)" }}>חציון קטגוריה</div><div className="rm-display" style={{ fontSize: 19, fontWeight: 700 }}>₪310</div></div>
          </div>
        </div>
        <div className="card-soft" style={{ padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: "var(--muted)" }}>Aputure 120D × 2</span>
            <span className="pill pill-amber">יקר ב-12%</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--ink-2)", lineHeight: 1.6 }}>שיקלו להוריד ב-₪25 כדי להיכנס לחבילות מאוזנות בעדיפות גבוהה.</div>
        </div>
      </div>
    </div>
  </DashShell>
);

const ScreenLenderBookings = () => (
  <DashShell role="lender" active="/lender/bookings">
    <SectionTitle eyebrow="הזמנות" title="כל ההזמנות הנכנסות" sub="טיפול מהיר במצב 'דורש אישור' משפר את ציון האמינות."/>
    <Table cols={["#","שוכר","פריט","תאריכים","סה״כ","סטטוס",""]} rows={[
      ["#21048", <span style={{ display: "flex", gap: 8, alignItems: "center" }}><Avatar name="ד" color="var(--clay)" size={28}/>דניאל ברק</span>, "Sony α7 IV", "02-05.05", "₪835", <Tag kind="warn">דורש אישור</Tag>, <span style={{ display: "flex", gap: 4 }}><button className="btn btn-teal btn-sm">אשרו</button><button className="btn btn-ghost btn-sm">דחו</button></span>],
      ["#21042", <span style={{ display: "flex", gap: 8, alignItems: "center" }}><Avatar name="א" color="var(--teal)" size={28}/>אורי אלון</span>, "Aputure 120D × 2", "06-08.05", "₪580", <Tag kind="info">בתיאום</Tag>, <button className="btn btn-soft btn-sm">צ׳אט</button>],
      ["#21035", <span style={{ display: "flex", gap: 8, alignItems: "center" }}><Avatar name="נ" color="var(--rose)" size={28}/>נועה כהן</span>, "DJI Mavic 3", "11.05", "₪410", <Tag kind="ok">מאושרת</Tag>, <button className="btn btn-ghost btn-sm">פרטים</button>],
      ["#21027", <span style={{ display: "flex", gap: 8, alignItems: "center" }}><Avatar name="ש" color="var(--sage)" size={28}/>שירה מזרחי</span>, "Sony α7 IV", "16-18.05", "₪720", <Tag kind="ok">מאושרת</Tag>, <button className="btn btn-ghost btn-sm">פרטים</button>],
    ]}/>
  </DashShell>
);

const ScreenLenderReviews = () => (
  <DashShell role="lender" active="/lender/reviews">
    <SectionTitle eyebrow="ביקורות" title="מה השוכרים אומרים" sub="ממוצע 4.9 מתוך 184 ביקורות."/>
    <div style={{ display: "grid", gridTemplateColumns: "0.6fr 1.4fr", gap: 16 }}>
      <div className="card" style={{ padding: 24 }}>
        <div className="rm-display" style={{ fontSize: 56, fontWeight: 700, lineHeight: 1 }}>4.9</div>
        <div style={{ display: "flex", gap: 2, marginTop: 8, marginBottom: 14 }}>
          {Array.from({length:5}).map((_,i)=> <Icon key={i} name="star" size={18} style={{ color: "var(--amber)" }}/>)}
        </div>
        <div style={{ fontSize: 12, color: "var(--muted)" }}>על בסיס 184 ביקורות מאומתות</div>
        {[5,4,3,2,1].map((r) => (
          <div key={r} style={{ display: "grid", gridTemplateColumns: "20px 1fr 30px", gap: 8, alignItems: "center", marginTop: 12, fontSize: 12 }}>
            <span>{r}★</span>
            <div className="metric-bar"><i style={{ width: `${r===5?82:r===4?12:r===3?4:r===2?1:1}%`, background: "var(--amber)" }}/></div>
            <span style={{ color: "var(--muted)", textAlign: "left" }}>{({5:151,4:22,3:7,2:2,1:2})[r]}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {[
          { n: "דניאל ברק", c: "var(--clay)", r: 5, t: "ציוד מצוין, זמינות מהירה", b: "מאיה ענתה תוך 15 דקות, הציוד היה במצב מושלם והמסירה בזמן מדויק. ממליץ בחום.", d: "לפני שבוע", item: "Sony α7 IV" },
          { n: "אורי אלון", c: "var(--teal)", r: 5, t: "שירות מקצועי", b: "תיאום פשוט, הסבר מלא על השימוש בתאורה והמלצות שעבדו טוב באירוע.", d: "לפני שבועיים", item: "Aputure 120D" },
          { n: "נועה כהן", c: "var(--rose)", r: 4, t: "טוב, אבל אריזה הייתה בעייתית", b: "המוצר עצמו מצוין אבל הטרייפוד לא היה אבטח טוב והחזרנו אותו עם שריטה. הוסר מהדירוג.", d: "לפני 3 שבועות", item: "טרייפוד פחמן" },
        ].map((rv) => (
          <div key={rv.n} className="card" style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <Avatar name={rv.n[0]} color={rv.c}/>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{rv.n}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>{rv.item} · {rv.d}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 1 }}>{Array.from({length:5}).map((_,i)=> <Icon key={i} name="star" size={12} style={{ color: i<rv.r?"var(--amber)":"var(--line-2)" }}/>)}</div>
            </div>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{rv.t}</div>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--ink-2)" }}>{rv.b}</p>
            <button className="btn btn-soft btn-sm" style={{ marginTop: 12 }}>הגיבו</button>
          </div>
        ))}
      </div>
    </div>
  </DashShell>
);

const ScreenLenderAnalytics = () => (
  <DashShell role="lender" active="/lender/analytics">
    <SectionTitle eyebrow="אנליטיקה" title="מה עובד הכי טוב" sub="חודשים אחרונים, פרי-פריט, פרי-חבילה."/>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 16 }}>
      <Stat label="הכנסה (90 יום)" value="₪42,180" delta="+18%" icon="wallet"/>
      <Stat label="שיעור המרה" value="14.2%" delta="+2.1%" icon="trend-up"/>
      <Stat label="הופעות בחבילות" value="124" delta="+33" icon="sparkles" accent="var(--clay)"/>
      <Stat label="ביטולים" value="0.6%" delta="-0.3%" deltaDir="up" icon="check" accent="var(--sage)"/>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1.4fr 0.6fr", gap: 16 }}>
      <div className="card" style={{ padding: 22 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>הכנסה לפי חודש</h3>
        <ChartArea/>
      </div>
      <div className="card" style={{ padding: 22 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>הפריטים הפופולריים</h3>
        {LISTINGS.slice(0,4).map((l, i) => (
          <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderTop: i?"1px solid var(--line)":"none" }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, overflow: "hidden", flexShrink: 0 }}><CategoryArt kind={l.catKind} tone={l.tone} height={36}/></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{l.title}</div>
              <Sparkline data={[20,30,25,40,38,55,48,62,70]} width={120} height={20}/>
            </div>
            <div className="rm-display" style={{ fontSize: 16, fontWeight: 700 }}>₪{(l.price * 14).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  </DashShell>
);

const ScreenLenderProfile = () => (
  <DashShell role="lender" active="/lender/profile">
    <SectionTitle eyebrow="פרופיל ואמינות" title="הציון המשוקלל שלכם" sub="כך RentMatch מציגה אתכם בחבילות ובדפי פריטים."/>
    <div style={{ display: "grid", gridTemplateColumns: "0.6fr 1.4fr", gap: 16 }}>
      <div className="card" style={{ padding: 24, textAlign: "center" }}>
        <ScoreDonut score={8.9} size={120} label="אמינות"/>
        <div className="rm-display" style={{ fontSize: 22, fontWeight: 600, marginTop: 16 }}>סטודיו לוז</div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>חבר מאז 2023 · 184 עסקאות מוצלחות</div>
        <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 14, flexWrap: "wrap" }}>
          <Tag kind="ok">מאומת</Tag>
          <Tag kind="info">תגובה מהירה</Tag>
          <Tag kind="ok">98% הבטחות</Tag>
        </div>
      </div>
      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>פירוק הציון</h3>
        <MetricBars items={[
          { label: "זמן מענה", score: 9.4, color: "var(--teal)" },
          { label: "שמירה על הבטחות", score: 9.6, color: "var(--sage)" },
          { label: "איכות פריטים", score: 8.8, color: "var(--clay)" },
          { label: "שיעור ביטולים נמוך", score: 9.2, color: "var(--amber)" },
          { label: "שלמות פרטים", score: 7.6, color: "var(--rose)" },
        ]}/>
        <div style={{ marginTop: 18, padding: 14, borderRadius: 14, background: "var(--bg-alt)", fontSize: 13, color: "var(--ink-2)", lineHeight: 1.6 }}>
          <strong style={{ color: "var(--ink)" }}>איך לשפר:</strong> שלמות פרטים היא הממד החלש ביותר — הוסיפו תמונות לכל פריט והשלימו תיאורים בעברית. שיפור ל-9.0 יעלה אתכם ל-9.2 כללי.
        </div>
      </div>
    </div>
  </DashShell>
);

// =================== ADMIN ===================
const ScreenAdminDash = () => (
  <DashShell role="admin" active="/admin/dashboard">
    <SectionTitle eyebrow="סקירה" title="מצב המערכת" sub="לוח בקרה תפעולי. אזהרות בולטות בראש."
      action={<button className="btn btn-soft btn-sm"><Icon name="refresh" size={14}/>רענון</button>}/>

    <div className="card" style={{ padding: 18, marginBottom: 18, display: "flex", alignItems: "center", gap: 14, background: "var(--amber-soft)", border: "1px solid var(--amber)" }}>
      <Icon name="alert" size={20} style={{ color: "var(--amber)" }}/>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, color: "var(--ink)" }}>3 פריטים בתור מודרציה ארוך מ-24 שעות</div>
        <div style={{ fontSize: 12, color: "var(--ink-2)", marginTop: 2 }}>זמן SLA המומלץ: עד 8 שעות. התעדפו טיפול.</div>
      </div>
      <button className="btn btn-primary btn-sm">פתחו מודרציה</button>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 18 }}>
      <Stat label="משתמשים פעילים" value="3,284" delta="+142" icon="users"/>
      <Stat label="פריטים בקטלוג" value="12,403" delta="+88" icon="package"/>
      <Stat label="הזמנות 7 יום" value="487" delta="+12%" icon="bag" accent="var(--clay)"/>
      <Stat label="GMV חודשי" value="₪412k" delta="+22%" icon="wallet" accent="var(--sage)"/>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 16 }}>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--line)" }}><h3 style={{ fontSize: 15, fontWeight: 600 }}>תור מודרציה</h3></div>
        <Table cols={["פריט","משכיר","סיבה","גיל",""]} rows={[
          [<span style={{ fontWeight: 500 }}>מקרן קצר טווח</span>, "Compact AV Cluster", <Tag kind="warn">תיאור חלקי</Tag>, "שעה", <button className="btn btn-soft btn-sm">בדיקה</button>],
          [<span style={{ fontWeight: 500 }}>חבילת תאורה ניידת</span>, "Bundle Hub Central", <Tag kind="bad">התנגשות זמינות</Tag>, "3 שעות", <button className="btn btn-soft btn-sm">בדיקה</button>],
          [<span style={{ fontWeight: 500 }}>סט מקרופונים</span>, "Sound Co.", <Tag kind="info">תמונה חסרה</Tag>, "5 שעות", <button className="btn btn-soft btn-sm">בדיקה</button>],
          [<span style={{ fontWeight: 500 }}>אוהל אירועים</span>, "ערב טוב", <Tag kind="warn">פיקדון לא תקין</Tag>, "26 שעות", <button className="btn btn-clay btn-sm">דחוף</button>],
        ]}/>
      </div>

      <div className="card" style={{ padding: 22 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>מצב מערכות</h3>
        {[
          { l: "API", v: "תקין", c: "var(--sage)", lat: "82ms" },
          { l: "Bundle Engine", v: "תקין", c: "var(--sage)", lat: "240ms" },
          { l: "Database", v: "תקין", c: "var(--sage)", lat: "12ms" },
          { l: "Email", v: "האטה קלה", c: "var(--amber)", lat: "1.4s" },
          { l: "Redis Cache", v: "Fallback", c: "var(--amber)", lat: "in-mem" },
        ].map((s) => (
          <div key={s.l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderTop: "1px solid var(--line)" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.c }}/>
              <span style={{ fontSize: 13, fontWeight: 500 }}>{s.l}</span>
            </div>
            <div style={{ display: "flex", gap: 12, fontSize: 12, color: "var(--muted)" }}>
              <span>{s.lat}</span><span style={{ color: s.c, fontWeight: 500 }}>{s.v}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </DashShell>
);

const ScreenAdminUsers = () => (
  <DashShell role="admin" active="/admin/users">
    <SectionTitle eyebrow="משתמשים" title="ניהול משתמשים והרשאות"
      action={<div style={{ display: "flex", gap: 6 }}><button className="btn btn-soft btn-sm"><Icon name="filter" size={14}/>סינון</button><button className="btn btn-primary btn-sm"><Icon name="plus" size={14}/>משתמש חדש</button></div>}/>
    <Table cols={["משתמש","תפקיד","הרשמה","פעילות","סטטוס",""]} rows={[
      [<span style={{ display: "flex", gap: 10, alignItems: "center" }}><Avatar name="ד" color="var(--clay)" size={32}/><div><div style={{ fontWeight: 500 }}>דניאל ברק</div><div style={{ fontSize: 11, color: "var(--muted)" }}>daniel@example.com</div></div></span>, <Tag kind="info">שוכר</Tag>, "01.2024", "פעיל היום", <Tag kind="ok">מאומת</Tag>, <button className="btn btn-ghost btn-sm"><Icon name="more" size={14}/></button>],
      [<span style={{ display: "flex", gap: 10, alignItems: "center" }}><Avatar name="מ" color="var(--teal)" size={32}/><div><div style={{ fontWeight: 500 }}>מאיה לוי</div><div style={{ fontSize: 11, color: "var(--muted)" }}>maya@studio-luz.co.il</div></div></span>, <Tag kind="ok">משכירה Pro</Tag>, "11.2023", "פעילה", <Tag kind="ok">מאומתת</Tag>, <button className="btn btn-ghost btn-sm"><Icon name="more" size={14}/></button>],
      [<span style={{ display: "flex", gap: 10, alignItems: "center" }}><Avatar name="א" color="var(--sage)" size={32}/><div><div style={{ fontWeight: 500 }}>אורי אלון</div><div style={{ fontSize: 11, color: "var(--muted)" }}>uri@compactav.com</div></div></span>, <Tag kind="ok">משכיר</Tag>, "06.2024", "אתמול", <Tag kind="warn">תעודה חסרה</Tag>, <button className="btn btn-ghost btn-sm"><Icon name="more" size={14}/></button>],
      [<span style={{ display: "flex", gap: 10, alignItems: "center" }}><Avatar name="ש" color="var(--rose)" size={32}/><div><div style={{ fontWeight: 500 }}>שירה מזרחי</div><div style={{ fontSize: 11, color: "var(--muted)" }}>shira@example.com</div></div></span>, <Tag kind="info">שוכרת</Tag>, "08.2025", "לפני 3 ימים", <Tag kind="bad">דווחה</Tag>, <button className="btn btn-ghost btn-sm"><Icon name="more" size={14}/></button>],
    ]}/>
  </DashShell>
);

const ScreenAdminListings = () => (
  <DashShell role="admin" active="/admin/listings">
    <SectionTitle eyebrow="מודרציה" title="תור פריטים לאישור" sub="ארבעה פריטים ממתינים."/>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
      {LISTINGS.slice(0, 4).map((l, i) => (
        <div key={l.id} className="card" style={{ padding: 18, display: "grid", gridTemplateColumns: "120px 1fr", gap: 14 }}>
          <div style={{ borderRadius: 12, overflow: "hidden" }}><CategoryArt kind={l.catKind} tone={l.tone} height={120}/></div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <div className="eyebrow">{l.cat}</div>
              <Tag kind={i===0?"warn":i===1?"bad":"info"}>{["תיאור חלקי","תמונה חסרה","פיקדון גבוה","חדש"][i]}</Tag>
            </div>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{l.title}</div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 12 }}>{l.lender} · ₪{l.price}/יום</div>
            <div style={{ display: "flex", gap: 6 }}>
              <button className="btn btn-teal btn-sm"><Icon name="check" size={13}/>אישור</button>
              <button className="btn btn-soft btn-sm">בקשה לתיקון</button>
              <button className="btn btn-ghost btn-sm" style={{ color: "var(--rose)" }}>דחייה</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </DashShell>
);

const ScreenAdminBookings = () => (
  <DashShell role="admin" active="/admin/bookings">
    <SectionTitle eyebrow="הזמנות" title="כל ההזמנות במערכת"/>
    <Table cols={["#","שוכר","משכיר","סה״כ","תאריכים","סטטוס",""]} rows={[
      ["#21048","דניאל ברק","סטודיו לוז","₪835","02-05.05",<Tag kind="ok">פעילה</Tag>,<button className="btn btn-ghost btn-sm">פרטים</button>],
      ["#21042","אורי אלון","Compact AV","₪580","06-08.05",<Tag kind="info">בתיאום</Tag>,<button className="btn btn-ghost btn-sm">פרטים</button>],
      ["#21035","נועה כהן","סטודיו לוז","₪410","11.05",<Tag kind="ok">פעילה</Tag>,<button className="btn btn-ghost btn-sm">פרטים</button>],
      ["#21027","שירה מזרחי","Bundle Hub","₪720","16-18.05",<Tag kind="warn">דורשת בדיקה</Tag>,<button className="btn btn-soft btn-sm">בדיקה</button>],
      ["#21015","יואב שלום","ערב טוב","₪3,460","21-22.05",<Tag kind="bad">בוטלה</Tag>,<button className="btn btn-ghost btn-sm">פרטים</button>],
    ]}/>
  </DashShell>
);

const ScreenAdminDisputes = () => (
  <DashShell role="admin" active="/admin/disputes">
    <SectionTitle eyebrow="מחלוקות" title="מקרים פתוחים" sub="טיפול נדרש תוך 48 שעות מפתיחת מקרה."/>
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {[
        { id: "DSP-118", t: "פיקדון לא הוחזר", r: "נועה כהן", l: "סטודיו לוז", a: "לפני 6 שעות", k: "warn", s: "ממתין למשכיר" },
        { id: "DSP-117", t: "ציוד פגום בקבלה", r: "אורי אלון", l: "Sound Co.", a: "לפני 2 ימים", k: "bad", s: "בבדיקה" },
        { id: "DSP-115", t: "איחור בהחזרה", r: "ערב טוב", l: "יואב שלום", a: "לפני 3 ימים", k: "info", s: "נסגר 50/50" },
      ].map((d) => (
        <div key={d.id} className="card" style={{ padding: 20, display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 18, alignItems: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: "var(--bg-alt)", display: "grid", placeItems: "center", color: d.k === "bad" ? "var(--rose)" : d.k === "warn" ? "var(--amber)" : "var(--teal)" }}>
            <Icon name="alert" size={22}/>
          </div>
          <div>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 4 }}>
              <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 11, color: "var(--muted)" }}>{d.id}</span>
              <Tag kind={d.k}>{d.s}</Tag>
            </div>
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{d.t}</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>{d.r} ↔ {d.l} · נפתח {d.a}</div>
          </div>
          <button className="btn btn-soft btn-sm">פתחו מקרה</button>
        </div>
      ))}
    </div>
  </DashShell>
);

const ScreenAdminReviews = () => (
  <DashShell role="admin" active="/admin/reviews">
    <SectionTitle eyebrow="ביקורות" title="מודרציה של ביקורות"/>
    <Table cols={["ביקורת","שוכר","משכיר","דירוג","דווחה","סטטוס",""]} rows={[
      [<span style={{ fontWeight: 500, maxWidth: 280, display: "block" }}>"ציוד מצוין, זמינות מהירה"</span>, "דניאל ברק", "סטודיו לוז", "5★", "—", <Tag kind="ok">פורסמה</Tag>, <button className="btn btn-ghost btn-sm">צפייה</button>],
      [<span style={{ fontWeight: 500, maxWidth: 280, display: "block" }}>"שרות מאכזב, איחר למסירה"</span>, "אנונימי", "Compact AV", "2★", <Tag kind="warn">2 דיווחים</Tag>, <Tag kind="warn">בבדיקה</Tag>, <span style={{ display: "flex", gap: 4 }}><button className="btn btn-soft btn-sm">אשר</button><button className="btn btn-ghost btn-sm" style={{ color: "var(--rose)" }}>הסר</button></span>],
      [<span style={{ fontWeight: 500, maxWidth: 280, display: "block" }}>"שירות מקצועי לאורך כל הדרך"</span>, "אורי אלון", "סטודיו לוז", "5★", "—", <Tag kind="ok">פורסמה</Tag>, <button className="btn btn-ghost btn-sm">צפייה</button>],
    ]}/>
  </DashShell>
);

const ScreenAdminCategories = () => (
  <DashShell role="admin" active="/admin/categories">
    <SectionTitle eyebrow="קטגוריות" title="עץ הקטגוריות" action={<button className="btn btn-primary btn-sm"><Icon name="plus" size={14}/>קטגוריה חדשה</button>}/>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
      {CATS.map((c, i) => (
        <div key={c.slug} className="card" style={{ padding: 0, overflow: "hidden" }}>
          <CategoryArt kind={c.icon} tone={c.tone} height={110}/>
          <div style={{ padding: 14 }}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>{c.label}</div>
            <div style={{ fontSize: 11, color: "var(--muted)" }}>{[248,132,84,412,36,98,156,72][i]} פריטים</div>
            <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
              <button className="btn btn-ghost btn-sm" style={{ padding: 6 }}><Icon name="edit" size={13}/></button>
              <button className="btn btn-ghost btn-sm" style={{ padding: 6 }}><Icon name="trash" size={13}/></button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </DashShell>
);

const ScreenAdminRanking = () => (
  <DashShell role="admin" active="/admin/ranking">
    <SectionTitle eyebrow="הגדרות דירוג" title="פריסטים, משקלים ועונשים" sub="שינויים נשמרים כגרסה — תוכלו לחזור אחורה בכל רגע."/>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 16 }}>
      <div className="card" style={{ padding: 22 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>פריסטים</h3>
        {[
          { l: "מאוזן", a: true, d: "ברירת מחדל" },
          { l: "מחיר תחילה", d: "מבצעי המוני" },
          { l: "אמינות תחילה", d: "VIP" },
          { l: "לוגיסטיקה תחילה", d: "אזורים פריפריאליים" },
        ].map((p) => (
          <button key={p.l} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", textAlign: "right",
            padding: 14, borderRadius: 14, marginBottom: 6,
            background: p.a ? "var(--teal-soft-2)" : "var(--surface)",
            border: p.a ? "2px solid var(--teal)" : "1px solid var(--line)",
          }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{p.l}</div>
              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{p.d}</div>
            </div>
            {p.a && <Icon name="check" size={16} style={{ color: "var(--teal)" }}/>}
          </button>
        ))}
        <button className="btn btn-soft btn-block btn-sm" style={{ marginTop: 8 }}><Icon name="plus" size={13}/>פריסט חדש</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div className="card" style={{ padding: 22 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>משקלים — מאוזן</h3>
          <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 18 }}>סך הכל חייב להיות 100%.</p>
          {[
            { l: "מחיר", v: 25, c: "var(--teal)" },
            { l: "אמינות", v: 25, c: "var(--sage)" },
            { l: "לוגיסטיקה", v: 20, c: "var(--clay)" },
            { l: "זמינות", v: 15, c: "var(--amber)" },
            { l: "איכות", v: 15, c: "var(--rose)" },
          ].map((w) => (
            <div key={w.l} style={{ display: "grid", gridTemplateColumns: "100px 1fr 50px", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <span style={{ fontSize: 13 }}>{w.l}</span>
              <div style={{ position: "relative", height: 6, background: "var(--bg-alt)", borderRadius: 4 }}>
                <div style={{ position: "absolute", insetInlineStart: 0, top: 0, bottom: 0, width: `${w.v * 4}%`, background: w.c, borderRadius: 4 }}/>
                <div style={{ position: "absolute", top: -6, insetInlineStart: `calc(${w.v * 4}% - 9px)`, width: 18, height: 18, borderRadius: "50%", background: "#fff", border: `2px solid ${w.c}` }}/>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, textAlign: "left" }}>{w.v}%</span>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: 22 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>פרמטרי יציבות</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
            <div><label className="label">α (סטיית תקן)</label><input className="input" defaultValue="0.30"/></div>
            <div><label className="label">β (ציון נמוך)</label><input className="input" defaultValue="0.45"/></div>
            <div><label className="label">סף מינ׳</label><input className="input" defaultValue="5.0"/></div>
            <div><label className="label">בונוס bottleneck</label><input className="input" defaultValue="0.20"/></div>
            <div><label className="label">חיתוך תחתון</label><input className="input" defaultValue="0.0"/></div>
            <div><label className="label">חיתוך עליון</label><input className="input" defaultValue="10.0"/></div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
            <button className="btn btn-primary">שמרו גרסה</button>
            <button className="btn btn-ghost">תצוגה מקדימה</button>
            <button className="btn btn-ghost" style={{ marginInlineStart: "auto", color: "var(--muted)" }}>גרסאות קודמות</button>
          </div>
        </div>
      </div>
    </div>
  </DashShell>
);

const ScreenAdminAudit = () => (
  <DashShell role="admin" active="/admin/audit">
    <SectionTitle eyebrow="יומן ביקורת" title="כל הפעולות הרגישות" sub="ניתן לסנן לפי משתמש, סוג פעולה ותאריך."
      action={<div style={{ display: "flex", gap: 6 }}><button className="btn btn-soft btn-sm"><Icon name="filter" size={14}/>סינון</button><button className="btn btn-soft btn-sm"><Icon name="download" size={14}/>ייצוא CSV</button></div>}/>
    <Table cols={["זמן","משתמש","פעולה","ישות","IP","תוצאה"]} rows={[
      ["09:42:11", "צוות אופ׳", <Tag kind="info">UPDATE</Tag>, "RankingConfig:default", "10.0.2.4", <Tag kind="ok">OK</Tag>],
      ["09:38:02", "מאיה לוי", <Tag kind="ok">CREATE</Tag>, "Listing:5128", "94.190.12.8", <Tag kind="ok">OK</Tag>],
      ["09:21:55", "system", <Tag kind="warn">REJECT</Tag>, "Booking:21027", "—", <Tag kind="ok">OK</Tag>],
      ["09:15:03", "צוות אופ׳", <Tag kind="bad">DELETE</Tag>, "Review:8842", "10.0.2.4", <Tag kind="ok">OK</Tag>],
      ["08:58:31", "אורי אלון", <Tag kind="info">LOGIN</Tag>, "Session", "188.64.22.1", <Tag kind="bad">FAIL</Tag>],
      ["08:42:10", "מאיה לוי", <Tag kind="info">UPDATE</Tag>, "Pricing:128", "94.190.12.8", <Tag kind="ok">OK</Tag>],
    ]}/>
  </DashShell>
);

Object.assign(window, {
  ScreenRenterDash, ScreenRenterOrders, ScreenRenterFavorites, ScreenRenterSavedSearches, ScreenRenterSettings,
  ScreenLenderDash, ScreenLenderListings, ScreenLenderAvailability, ScreenLenderPricing, ScreenLenderBookings, ScreenLenderReviews, ScreenLenderAnalytics, ScreenLenderProfile,
  ScreenAdminDash, ScreenAdminUsers, ScreenAdminListings, ScreenAdminBookings, ScreenAdminDisputes, ScreenAdminReviews, ScreenAdminCategories, ScreenAdminRanking, ScreenAdminAudit,
});
