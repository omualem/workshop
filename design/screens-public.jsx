// Public site screens: Home, Search, Listing detail, Auth, About, Bundle Request
// Globals: ScreenHome, ScreenSearch, ScreenListing, ScreenAuth, ScreenAbout, ScreenBundleRequest

const CATS = [
  { slug: "camera", label: "צילום ווידאו", icon: "camera", tone: "teal" },
  { slug: "lighting", label: "תאורה", icon: "lighting", tone: "amber" },
  { slug: "speakers", label: "הגברה", icon: "speakers", tone: "clay" },
  { slug: "tools", label: "כלי עבודה", icon: "tools", tone: "sage" },
  { slug: "tent", label: "אירועים", icon: "tent", tone: "rose" },
  { slug: "kitchen", label: "מטבח וקייטרינג", icon: "kitchen", tone: "amber" },
  { slug: "bike", label: "ספורט וטיולים", icon: "bike", tone: "sage" },
  { slug: "drone", label: "רחפנים", icon: "drone", tone: "teal" },
];

const LISTINGS = [
  { id: 1, title: "מצלמת Sony α7 IV עם עדשת זום 24-105", cat: "צילום ווידאו", catKind: "camera", tone: "teal",  price: 280, lender: "סטודיו לוז", rating: 4.9, deals: 184, desc: "מצלמת מירורלס מקצועית עם עדשה צמודה, סוללה רזרבית וכרטיס SD מהיר." },
  { id: 2, title: "סט תאורת Aputure עם דיפוזיה", cat: "תאורה", catKind: "lighting", tone: "amber", price: 195, lender: "Compact AV", rating: 4.8, deals: 92, desc: "שתי יחידות 120D עם רכים, מעמדים וחבילת מסנני CTO." },
  { id: 3, title: "מערכת הגברה Bose L1 Pro", cat: "הגברה", catKind: "speakers", tone: "clay", price: 340, lender: "Bundle Hub", rating: 4.7, deals: 211, desc: "הגברה מקצועית עד 200 איש, הגעה עד הבית, התקנה וכיול." },
  { id: 4, title: "אוהל אירועים 6×8 לבן עם דפנות", cat: "אירועים", catKind: "tent", tone: "rose", price: 720, lender: "ערב טוב הפקות", rating: 4.6, deals: 67, desc: "אוהל לאירועי גן עם תאורת לדים, דפנות אטומות ושטיח." },
  { id: 5, title: "מקדחה רוטרית Bosch + מקבילי", cat: "כלי עבודה", catKind: "tools", tone: "sage", price: 95, lender: "מחסן הכלים", rating: 4.9, deals: 304, desc: "מקדחה אקומולטור עם שני סוללות, כיסוי מקצועי וערכת ביטים." },
  { id: 6, title: "רחפן DJI Mavic 3 + פילטרים", cat: "רחפנים", catKind: "drone", tone: "teal", price: 410, lender: "סטודיו לוז", rating: 5.0, deals: 41, desc: "רחפן מקצועי עם מצלמת Hasselblad, פילטרי ND ובוקסת נשיאה." },
];

// =================== HOME ===================
const ScreenHome = () => (
  <SiteShell active="/">
    {/* Hero */}
    <section style={{ position: "relative" }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(60% 80% at 70% 20%, rgba(12,138,138,.10), transparent 60%), radial-gradient(40% 60% at 20% 80%, rgba(199,106,74,.08), transparent 60%)",
        pointerEvents: "none",
      }}/>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "72px 28px 48px", position: "relative" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 48, alignItems: "center" }}>
          <div>
            <span className="pill pill-teal" style={{ marginBottom: 18 }}>
              <Icon name="sparkles" size={12}/>
              דירוג חכם של חבילות ציוד
            </span>
            <h1 className="rm-display" style={{ fontSize: 64, fontWeight: 500, marginBottom: 22, color: "var(--ink)" }}>
              שכרו <em style={{ fontStyle: "italic", color: "var(--clay)" }}>הכל</em> לאירוע אחד —<br/>
              ממשכירים מאומתים, בחבילה אחת.
            </h1>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: "var(--ink-2)", maxWidth: 540, marginBottom: 28 }}>
              RentMatch מאתרת קומבינציות ציוד ממספר משכירים, מדרגת אותן לפי מחיר, אמינות, לוגיסטיקה, זמינות ואיכות —
              ומסבירה בעברית למה כל חבילה מדורגת איך שהיא.
            </p>
            <div style={{ display: "flex", gap: 10, marginBottom: 32 }}>
              <button className="btn btn-primary btn-lg"><Icon name="sparkles" size={16}/>בנו בקשת חבילה</button>
              <button className="btn btn-outline btn-lg">עיינו בקטלוג<Icon name="arrow-left" size={16}/></button>
            </div>
            <div style={{ display: "flex", gap: 28, paddingTop: 22, borderTop: "1px solid var(--line)" }}>
              {[
                { k: "12,400+", v: "פריטים" },
                { k: "920", v: "משכירים" },
                { k: "4.8★", v: "ממוצע אמינות" },
              ].map((s) => (
                <div key={s.v}>
                  <div className="rm-display" style={{ fontSize: 26, fontWeight: 700 }}>{s.k}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{s.v}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Hero card — sample bundle preview */}
          <div style={{ position: "relative" }}>
            <div className="card" style={{
              padding: 22, borderRadius: 28, boxShadow: "var(--shadow-lg)",
              transform: "rotate(-1.5deg)", background: "var(--surface)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <span className="pill pill-sage"><Icon name="sparkles" size={11}/>חבילה מאוזנת</span>
                <ScoreDonut score={9.2} size={56}/>
              </div>
              <div className="rm-display" style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>ערכת צילום אירוע מלא</div>
              <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>3 פריטים · 2 משכירים · נתל אביב</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                {[
                  { kind: "camera", title: "Sony α7 IV", lender: "סטודיו לוז" },
                  { kind: "lighting", title: "סט תאורה Aputure", lender: "Compact AV" },
                  { kind: "speakers", title: "הגברה Bose L1", lender: "Bundle Hub" },
                ].map((x) => (
                  <div key={x.title} style={{ display: "flex", alignItems: "center", gap: 12, padding: 8, borderRadius: 14, background: "var(--bg-alt)" }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, overflow: "hidden", flexShrink: 0 }}>
                      <CategoryArt kind={x.kind} height={44} tone="teal"/>
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{x.title}</div>
                      <div style={{ fontSize: 11, color: "var(--muted)" }}>{x.lender}</div>
                    </div>
                  </div>
                ))}
              </div>
              <MetricBars items={[
                { label: "מחיר", score: 8.4, color: "var(--teal)" },
                { label: "אמינות", score: 9.5, color: "var(--sage)" },
                { label: "לוגיסטיקה", score: 9.0, color: "var(--clay)" },
              ]}/>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18, paddingTop: 16, borderTop: "1px solid var(--line)" }}>
                <div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>סה"כ ליום</div>
                  <div className="rm-display" style={{ fontSize: 24, fontWeight: 700 }}>₪815</div>
                </div>
                <button className="btn btn-teal">צפו בפרטים<Icon name="arrow-left" size={14}/></button>
              </div>
            </div>
            {/* sticker */}
            <div style={{
              position: "absolute", top: -16, insetInlineStart: -20,
              background: "var(--clay)", color: "#fff",
              borderRadius: 999, padding: "10px 18px",
              fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14,
              transform: "rotate(-8deg)", boxShadow: "var(--shadow)",
            }}>
              ₪240 חיסכון מול בודדים
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Categories */}
    <section style={{ maxWidth: 1240, margin: "0 auto", padding: "32px 28px 48px" }}>
      <SectionTitle eyebrow="קטגוריות" title="כל מה שצריך, מסודר לפי שימוש" sub="בחרו קטגוריה ועברו ישר לקטלוג, או הוסיפו מספר פריטים לבקשת חבילה."/>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        {CATS.map((c) => (
          <a key={c.slug} href="#" className="card" style={{ padding: 0, overflow: "hidden", borderRadius: 22 }}>
            <CategoryArt kind={c.icon} height={130} tone={c.tone}/>
            <div style={{ padding: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontWeight: 600 }}>{c.label}</div>
              <Icon name="arrow-left" size={16} stroke={1.6} style={{ color: "var(--muted)" }}/>
            </div>
          </a>
        ))}
      </div>
    </section>

    {/* Featured listings */}
    <section style={{ maxWidth: 1240, margin: "0 auto", padding: "32px 28px 48px" }}>
      <SectionTitle eyebrow="פריטים בולטים" title="מהציוד שמשכירים מדורגים ביותר" action={<button className="btn btn-ghost btn-sm">לכל הפריטים<Icon name="arrow-left" size={14}/></button>}/>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
        {LISTINGS.slice(0, 3).map((l) => <ListingCard key={l.id} l={l}/>)}
      </div>
    </section>

    {/* How it works */}
    <section style={{ maxWidth: 1240, margin: "0 auto", padding: "48px 28px 80px" }}>
      <div className="card" style={{ padding: 0, borderRadius: 28, overflow: "hidden", background: "var(--ink)", color: "var(--bg)" }}>
        <div style={{ padding: 40, display: "grid", gridTemplateColumns: "1fr 2fr", gap: 32 }}>
          <div>
            <div className="eyebrow" style={{ color: "var(--clay)", marginBottom: 12 }}>איך זה עובד</div>
            <h2 className="rm-display" style={{ fontSize: 40, fontWeight: 500, color: "var(--bg)" }}>
              שלוש פעולות, חבילה מנוצחת.
            </h2>
            <p style={{ fontSize: 14, color: "rgba(241,236,226,.7)", marginTop: 14, lineHeight: 1.7 }}>
              במקום לחפש פריט-פריט, ספרו לנו מה אתם צריכים ומתי. נמצא את הקומבינציה הכי מתאימה לכם.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
            {[
              { n: "01", t: "תארו את הפרויקט", d: "פריטים, תאריכים, מיקום והעדפה — מחיר, אמינות, או איזון." },
              { n: "02", t: "קבלו חבילות מדורגות", d: "Best Balanced, Best Price ו-Easiest Pickup, מנוקדות במחיר/אמינות/לוגיסטיקה/זמינות/איכות." },
              { n: "03", t: "הזמינו בלחיצה", d: "תיאום מול כל המשכירים בחבילה, פיקדון אחד, חוויה אחת." },
            ].map((s) => (
              <div key={s.n}>
                <div className="rm-display" style={{ fontSize: 36, fontWeight: 700, color: "var(--clay)", marginBottom: 6 }}>{s.n}</div>
                <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 6 }}>{s.t}</div>
                <div style={{ fontSize: 13, color: "rgba(241,236,226,.65)", lineHeight: 1.65 }}>{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    <footer style={{ borderTop: "1px solid var(--line)", padding: "32px 28px", background: "var(--bg-alt)" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", color: "var(--muted)", fontSize: 12 }}>
        <Wordmark small/>
        <div>© 2026 RentMatch · ת"א</div>
      </div>
    </footer>
  </SiteShell>
);

const ListingCard = ({ l }) => (
  <a href="#" className="card" style={{ padding: 14, borderRadius: 22, display: "flex", flexDirection: "column", gap: 12 }}>
    <CategoryArt kind={l.catKind} tone={l.tone} height={170}/>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
      <div style={{ minWidth: 0 }}>
        <div className="eyebrow" style={{ marginBottom: 6 }}>{l.cat}</div>
        <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.35 }}>{l.title}</div>
      </div>
      <button style={{ background: "transparent", border: 0, color: "var(--muted)", padding: 4 }}><Icon name="heart" size={18}/></button>
    </div>
    <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{l.desc}</p>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10, borderTop: "1px solid var(--line)" }}>
      <div>
        <div style={{ fontSize: 11, color: "var(--muted)" }}>החל מ־ליום</div>
        <div className="rm-display" style={{ fontSize: 22, fontWeight: 700 }}>₪{l.price}</div>
      </div>
      <div style={{ textAlign: "left" }}>
        <div style={{ fontSize: 12, fontWeight: 500 }}>{l.lender}</div>
        <div style={{ fontSize: 11, color: "var(--muted)", display: "flex", gap: 6, justifyContent: "flex-end", alignItems: "center" }}>
          <Icon name="star" size={11} style={{ color: "var(--amber)" }}/>{l.rating} · {l.deals} עסקאות
        </div>
      </div>
    </div>
  </a>
);

// =================== SEARCH ===================
const ScreenSearch = () => (
  <SiteShell active="/search">
    <div style={{ maxWidth: 1240, margin: "0 auto", padding: "32px 28px 64px" }}>
      <div style={{ marginBottom: 24 }}>
        <div className="eyebrow">קטלוג</div>
        <h1 className="rm-display" style={{ fontSize: 44, fontWeight: 500, marginTop: 8 }}>חיפוש ציוד</h1>
        <p style={{ color: "var(--muted)", maxWidth: 600, marginTop: 6 }}>סננו לפי קטגוריה, מחיר ותאריכים. הוסיפו פריטים שמעניינים אתכם לבקשת חבילה אחת.</p>
      </div>

      {/* Search bar */}
      <div className="card" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", gap: 8, padding: 8, borderRadius: 999, marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 16px" }}>
          <Icon name="search" size={16} style={{ color: "var(--muted)" }}/>
          <input className="input" placeholder="חפשו ציוד, מותג או קטגוריה" style={{ border: 0, padding: "12px 0", background: "transparent" }}/>
        </div>
        <button className="btn btn-ghost" style={{ justifyContent: "space-between", padding: "0 16px" }}>
          <span style={{ display: "flex", gap: 8, alignItems: "center" }}><Icon name="pin" size={14} style={{ color: "var(--muted)" }}/>תל אביב</span>
          <Icon name="chevron-down" size={14} style={{ color: "var(--muted)" }}/>
        </button>
        <button className="btn btn-ghost" style={{ justifyContent: "space-between", padding: "0 16px" }}>
          <span style={{ display: "flex", gap: 8, alignItems: "center" }}><Icon name="calendar" size={14} style={{ color: "var(--muted)" }}/>2-5 במאי</span>
          <Icon name="chevron-down" size={14} style={{ color: "var(--muted)" }}/>
        </button>
        <button className="btn btn-primary">חיפוש</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 28, alignItems: "flex-start" }}>
        {/* Sidebar filters */}
        <aside className="card" style={{ padding: 20, position: "sticky", top: 80 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontWeight: 600 }}>סינון</div>
            <button style={{ background: "transparent", border: 0, fontSize: 12, color: "var(--clay)" }}>נקה הכל</button>
          </div>
          <FilterGroup title="קטגוריה" defaultOpen>
            {CATS.slice(0, 5).map((c) => (
              <label key={c.slug} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, padding: "6px 0", cursor: "pointer" }}>
                <input type="checkbox" defaultChecked={c.slug === "camera"} style={{ accentColor: "var(--teal)" }}/>
                <span>{c.label}</span>
                <span style={{ marginInlineStart: "auto", color: "var(--muted)", fontSize: 11 }}>{({camera:248,lighting:132,speakers:84,tools:412,tent:36})[c.slug]}</span>
              </label>
            ))}
          </FilterGroup>
          <FilterGroup title="מחיר ליום">
            <div style={{ padding: "8px 4px" }}>
              <div style={{ position: "relative", height: 4, background: "var(--bg-alt)", borderRadius: 4 }}>
                <div style={{ position: "absolute", insetInlineStart: "20%", insetInlineEnd: "30%", top: 0, bottom: 0, background: "var(--teal)", borderRadius: 4 }}/>
                <div style={{ position: "absolute", top: -6, insetInlineStart: "20%", width: 16, height: 16, borderRadius: "50%", background: "#fff", border: "2px solid var(--teal)" }}/>
                <div style={{ position: "absolute", top: -6, insetInlineEnd: "30%", width: 16, height: 16, borderRadius: "50%", background: "#fff", border: "2px solid var(--teal)" }}/>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontSize: 12, color: "var(--muted)" }}>
                <span>₪{60}</span><span>₪{490}</span>
              </div>
            </div>
          </FilterGroup>
          <FilterGroup title="דירוג משכיר">
            {[5,4,3].map((n) => (
              <label key={n} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, padding: "6px 0" }}>
                <input type="radio" name="rate" defaultChecked={n===4} style={{ accentColor: "var(--teal)" }}/>
                <span style={{ display: "flex", gap: 2 }}>
                  {Array.from({length:5}).map((_,i)=> <Icon key={i} name="star" size={12} style={{ color: i<n ? "var(--amber)" : "var(--line-2)" }}/>)}
                </span>
                <span style={{ color: "var(--muted)" }}>ומעלה</span>
              </label>
            ))}
          </FilterGroup>
          <FilterGroup title="זמינות">
            <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, padding: "6px 0" }}><input type="checkbox" defaultChecked style={{ accentColor: "var(--teal)" }}/> זמין בכל התאריכים</label>
            <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, padding: "6px 0" }}><input type="checkbox" style={{ accentColor: "var(--teal)" }}/> משלוח עד הבית</label>
            <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, padding: "6px 0" }}><input type="checkbox" style={{ accentColor: "var(--teal)" }}/> איסוף עצמי</label>
          </FilterGroup>
        </aside>

        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <div style={{ fontSize: 13, color: "var(--muted)" }}>248 פריטים נמצאו · עמוד 1 מתוך 12</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button className="btn btn-soft btn-sm"><Icon name="grid" size={14}/></button>
              <button className="btn btn-ghost btn-sm" style={{ color: "var(--muted)" }}><Icon name="list" size={14}/></button>
              <select className="select" style={{ width: "auto", padding: "8px 12px", fontSize: 13 }}>
                <option>הרלוונטיים ביותר</option><option>מחיר עולה</option><option>מחיר יורד</option><option>הכי פופולרי</option>
              </select>
            </div>
          </div>

          {/* Active filter chips */}
          <div style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap" }}>
            <span className="pill pill-teal">צילום ווידאו <Icon name="x" size={11}/></span>
            <span className="pill pill-teal">תל אביב <Icon name="x" size={11}/></span>
            <span className="pill pill-teal">2-5 במאי <Icon name="x" size={11}/></span>
            <span className="pill pill-teal">₪60-₪490 <Icon name="x" size={11}/></span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {LISTINGS.map((l) => <ListingCard key={l.id} l={l}/>)}
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 32 }}>
            <button className="btn btn-soft btn-sm">הקודם</button>
            {[1,2,3,4,5].map((n) => <button key={n} className={`btn btn-sm ${n===1?"btn-primary":"btn-ghost"}`} style={{ minWidth: 36 }}>{n}</button>)}
            <span style={{ padding: "8px 6px", color: "var(--muted)" }}>…</span>
            <button className="btn btn-soft btn-sm">הבא</button>
          </div>
        </div>
      </div>
    </div>
  </SiteShell>
);

const FilterGroup = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div style={{ borderTop: "1px solid var(--line)", padding: "14px 0" }}>
      <button onClick={() => setOpen(!open)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", background: "transparent", border: 0, padding: 0, fontSize: 13, fontWeight: 600, color: "var(--ink)", marginBottom: open ? 10 : 0 }}>
        {title}<Icon name="chevron-down" size={14} style={{ color: "var(--muted)", transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }}/>
      </button>
      {open && <div>{children}</div>}
    </div>
  );
};

// =================== LISTING DETAIL ===================
const ScreenListing = () => (
  <SiteShell active="/search">
    <div style={{ maxWidth: 1240, margin: "0 auto", padding: "24px 28px 64px" }}>
      <div style={{ display: "flex", gap: 8, fontSize: 12, color: "var(--muted)", marginBottom: 18 }}>
        <a href="#">קטלוג</a><span>›</span><a href="#">צילום ווידאו</a><span>›</span><span style={{ color: "var(--ink-2)" }}>Sony α7 IV</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 32 }}>
        <div>
          <div style={{ borderRadius: 28, overflow: "hidden", marginBottom: 12 }}>
            <CategoryArt kind="camera" tone="teal" height={400}/>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {["camera","lighting","camera","camera"].map((k, i) => (
              <div key={i} style={{ borderRadius: 14, overflow: "hidden", border: i===0?"2px solid var(--teal)":"1px solid var(--line)" }}>
                <CategoryArt kind={k} tone={["teal","amber","sage","clay"][i]} height={80}/>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 32 }}>
            <div className="eyebrow" style={{ marginBottom: 8 }}>צילום ווידאו</div>
            <h1 className="rm-display" style={{ fontSize: 36, fontWeight: 600, marginBottom: 12 }}>מצלמת Sony α7 IV עם עדשת 24-105mm f/4</h1>
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 24 }}>
              <span className="pill pill-sage"><Icon name="check" size={12}/>זמין בתאריכים שלכם</span>
              <span className="pill"><Icon name="truck" size={12}/>משלוח עד הבית</span>
              <span style={{ fontSize: 13, color: "var(--muted)" }}><Icon name="pin" size={12}/> רמת גן · 4.2 ק"מ</span>
            </div>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--ink-2)" }}>
              מצלמת מירורלס מקצועית בדגם החדש של Sony, מגיעה עם עדשת זום 24-105mm f/4 G,
              שתי סוללות רזרביות, מטען מהיר, כרטיס SD V90 וטרייפוד ייעודי.
              מתאימה לחתונות, אירועי קורפורייט, צילום פרסומי וסרטונים ב-4K.
            </p>

            <div style={{ marginTop: 24 }}>
              <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 12 }}>מה כלול בהשכרה</h3>
              <ul style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {["גוף Sony α7 IV","עדשת 24-105mm f/4 G","2 סוללות + מטען","כרטיס SD V90 128GB","טרייפוד פחמן","תיק נשיאה מרופד"].map((x) => (
                  <li key={x} style={{ display: "flex", gap: 8, fontSize: 14, color: "var(--ink-2)" }}><Icon name="check" size={14} style={{ color: "var(--sage)", marginTop: 3 }}/>{x}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14, position: "sticky", top: 80, alignSelf: "flex-start" }}>
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 14 }}>
              <span className="rm-display" style={{ fontSize: 36, fontWeight: 700 }}>₪280</span>
              <span style={{ fontSize: 13, color: "var(--muted)" }}>/יום</span>
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 18 }}>פיקדון ₪1,200 · מוחזר 24 שעות אחרי החזרה</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
              <div><label className="label">מתאריך</label><div className="input" style={{ display: "flex", justifyContent: "space-between" }}><span>2 במאי</span><Icon name="calendar" size={14} style={{ color: "var(--muted)" }}/></div></div>
              <div><label className="label">עד תאריך</label><div className="input" style={{ display: "flex", justifyContent: "space-between" }}><span>5 במאי</span><Icon name="calendar" size={14} style={{ color: "var(--muted)" }}/></div></div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "16px 0", borderTop: "1px solid var(--line)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}><span style={{ color: "var(--muted)" }}>₪280 × 3 ימים</span><span>₪840</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}><span style={{ color: "var(--muted)" }}>הנחת duration</span><span style={{ color: "var(--sage)" }}>-₪40</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}><span style={{ color: "var(--muted)" }}>משלוח</span><span>₪35</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, paddingTop: 12, borderTop: "1px solid var(--line)", fontWeight: 600 }}><span>סה״כ לתשלום</span><span className="rm-display" style={{ fontSize: 20 }}>₪835</span></div>
            </div>
            <button className="btn btn-teal btn-block btn-lg" style={{ marginTop: 12 }}>הזמינו עכשיו</button>
            <button className="btn btn-outline btn-block" style={{ marginTop: 8 }}><Icon name="plus" size={14}/>הוסיפו לבקשת חבילה</button>
          </div>

          <div className="card" style={{ padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Avatar name="לוז" color="var(--teal)" size={48}/>
              <div>
                <div style={{ fontWeight: 600 }}>סטודיו לוז</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}><Icon name="star" size={11} style={{ color: "var(--amber)" }}/> 4.9 · 184 עסקאות</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 14, fontSize: 13, color: "var(--ink-2)" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span>זמן מענה</span><span style={{ color: "var(--sage)" }}>פחות משעה</span></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span>שיעור ביטולים</span><span>0.4%</span></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span>שמירה על הבטחות</span><span>98%</span></div>
            </div>
            <button className="btn btn-soft btn-block" style={{ marginTop: 14 }}>צרו קשר עם המשכיר</button>
          </div>

          <div className="card" style={{ padding: 18 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>איתותי איכות</h3>
            <MetricBars items={[
              { label: "איכות מוצר", score: 9.1, color: "var(--teal)" },
              { label: "אמינות משכיר", score: 9.0, color: "var(--sage)" },
              { label: "שלמות פרטים", score: 8.4, color: "var(--clay)" },
            ]}/>
          </div>
        </div>
      </div>
    </div>
  </SiteShell>
);

// =================== AUTH ===================
const ScreenAuth = ({ mode = "signin" }) => (
  <SiteShell active="/">
    <div style={{ maxWidth: 1100, margin: "32px auto", padding: 28 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderRadius: 28, overflow: "hidden", border: "1px solid var(--line)", background: "var(--surface)" }}>
        <div style={{ padding: 48, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>RentMatch</div>
          <h1 className="rm-display" style={{ fontSize: 36, fontWeight: 600, marginBottom: 8 }}>{mode === "signin" ? "ברוכים השבים" : "פותחים חשבון"}</h1>
          <p style={{ color: "var(--muted)", marginBottom: 28 }}>{mode === "signin" ? "התחברו כדי לראות את החבילות וההזמנות שלכם." : "הצטרפו לקהילת המשכירים והשוכרים החכמה."}</p>

          {mode === "signup" && (
            <div style={{ marginBottom: 14 }}>
              <label className="label">שם מלא</label>
              <input className="input input-lg" placeholder="דניאל ברק"/>
            </div>
          )}
          <div style={{ marginBottom: 14 }}>
            <label className="label">דוא״ל</label>
            <input className="input input-lg" placeholder="you@example.com"/>
          </div>
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <label className="label">סיסמה</label>
              {mode === "signin" && <a href="#" style={{ fontSize: 12, color: "var(--clay)" }}>שכחתם סיסמה?</a>}
            </div>
            <input className="input input-lg" type="password" placeholder="••••••••"/>
          </div>
          <button className="btn btn-primary btn-block btn-lg" style={{ marginTop: 16 }}>{mode === "signin" ? "כניסה" : "הרשמה"}</button>

          <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "20px 0", color: "var(--muted)", fontSize: 12 }}>
            <div style={{ flex: 1, height: 1, background: "var(--line)" }}/>
            או המשיכו עם
            <div style={{ flex: 1, height: 1, background: "var(--line)" }}/>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <button className="btn btn-outline">Google</button>
            <button className="btn btn-outline">Apple</button>
          </div>

          <div style={{ marginTop: 28, fontSize: 13, color: "var(--muted)" }}>
            {mode === "signin" ? "אין לכם חשבון? " : "כבר רשומים? "}
            <a href="#" style={{ color: "var(--teal)", fontWeight: 500 }}>{mode === "signin" ? "פתחו חשבון" : "התחברו"}</a>
          </div>
        </div>

        <div style={{ background: "var(--ink)", color: "var(--bg)", padding: 48, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -40, insetInlineEnd: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(199,106,74,.18)" }}/>
          <div style={{ position: "absolute", bottom: -60, insetInlineStart: -40, width: 220, height: 220, borderRadius: "50%", background: "rgba(12,138,138,.16)" }}/>
          <div style={{ position: "relative", display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
            <div>
              <div className="eyebrow" style={{ color: "var(--clay)" }}>למה RentMatch</div>
              <h2 className="rm-display" style={{ fontSize: 30, fontWeight: 500, marginTop: 12, color: "var(--bg)" }}>חבילה אחת. <em style={{ fontStyle: "italic", color: "var(--clay)" }}>חמישה</em> ממדי דירוג. אפס ניחושים.</h2>
            </div>
            <div className="card" style={{ background: "rgba(241,236,226,.08)", border: "1px solid rgba(241,236,226,.14)", color: "var(--bg)", padding: 20 }}>
              <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                <Avatar name="א" color="var(--clay)" size={36}/>
                <div>
                  <div style={{ fontWeight: 600 }}>אורי, הפקת אירועים</div>
                  <div style={{ fontSize: 12, opacity: .7 }}>השכיר 12 חבילות</div>
                </div>
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.7, opacity: .9 }}>
                "במקום להריץ 6 שיחות עם משכירים ולהשוות אקסלים, אני שולח בקשת חבילה ב-30 שניות ומקבל שלוש הצעות מנומקות."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </SiteShell>
);

// =================== ABOUT ===================
const ScreenAbout = () => (
  <SiteShell active="/about">
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 28px" }}>
      <div className="eyebrow">איך זה עובד</div>
      <h1 className="rm-display" style={{ fontSize: 56, fontWeight: 500, marginTop: 12, marginBottom: 16, maxWidth: 900 }}>
        מנוע דירוג שמסביר את עצמו —<br/>
        <em style={{ fontStyle: "italic", color: "var(--clay)" }}>בעברית, בשקיפות מלאה.</em>
      </h1>
      <p style={{ fontSize: 18, lineHeight: 1.7, color: "var(--ink-2)", maxWidth: 720, marginBottom: 56 }}>
        כל חבילה מקבלת ציון אחד לכל ממד — מחיר, אמינות, לוגיסטיקה, זמינות ואיכות —
        ולכל ציון יש הסבר אנושי על הסיבה. אין קופסה שחורה.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14, marginBottom: 64 }}>
        {[
          { icon: "wallet", label: "מחיר", color: "var(--teal)" },
          { icon: "shield", label: "אמינות", color: "var(--sage)" },
          { icon: "truck", label: "לוגיסטיקה", color: "var(--clay)" },
          { icon: "calendar", label: "זמינות", color: "var(--amber)" },
          { icon: "sparkles", label: "איכות", color: "var(--rose)" },
        ].map((d) => (
          <div key={d.label} className="card" style={{ textAlign: "center", padding: 22 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: "var(--bg-alt)", margin: "0 auto 12px", display: "grid", placeItems: "center", color: d.color }}>
              <Icon name={d.icon} size={20}/>
            </div>
            <div style={{ fontWeight: 600 }}>{d.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "center", marginBottom: 80 }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 10 }}>מה אנחנו בודקים</div>
          <h2 className="rm-display" style={{ fontSize: 32, fontWeight: 600, marginBottom: 14 }}>הציון הוא ממוצע משוקלל — אבל לא רק.</h2>
          <p style={{ color: "var(--ink-2)", lineHeight: 1.7, marginBottom: 14 }}>
            אנחנו מנרמלים כל ממד ל-0–10, מחשבים ממוצע משוקלל לפי ההעדפות שלכם, ואז מפעילים שלוש התאמות יציבות:
            עונש על חוסר איזון בין הממדים, עונש על ציונים נמוכים מדי בממד אחד, ובונוס על "צוואר בקבוק" שעובד טוב.
          </p>
          <ul style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {["עונש לסטיית תקן גבוהה בין ממדים","עונש לציון נמוך מסף שהגדרתם","בונוס מהממד הכי חלש כשהוא מספיק טוב"].map((x) => (
              <li key={x} style={{ display: "flex", gap: 8, fontSize: 14, color: "var(--ink-2)" }}><Icon name="check" size={16} style={{ color: "var(--teal)", marginTop: 2 }}/>{x}</li>
            ))}
          </ul>
        </div>
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div className="eyebrow">דוגמת ציון</div>
            <ScoreDonut score={8.7} size={64}/>
          </div>
          <MetricBars items={[
            { label: "מחיר", score: 7.8, color: "var(--teal)" },
            { label: "אמינות", score: 9.4, color: "var(--sage)" },
            { label: "לוגיסטיקה", score: 8.2, color: "var(--clay)" },
            { label: "זמינות", score: 9.1, color: "var(--amber)" },
            { label: "איכות", score: 8.9, color: "var(--rose)" },
          ]}/>
          <div style={{ marginTop: 18, padding: 14, borderRadius: 14, background: "var(--bg-alt)", fontSize: 13, color: "var(--ink-2)", lineHeight: 1.6 }}>
            <strong style={{ color: "var(--ink)" }}>למה דורג כך:</strong> אמינות מצוינת ואיכות גבוהה, מחיר ברף הבינוני בקטגוריה. הלוגיסטיקה הוקלה כי שני המשכירים נמצאים ברדיוס של 3 ק״מ.
          </div>
        </div>
      </div>
    </div>
  </SiteShell>
);

// =================== BUNDLE REQUEST ===================
const ScreenBundleRequest = () => (
  <SiteShell active="/bundle-request">
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 28px 64px" }}>
      <div style={{ marginBottom: 28 }}>
        <div className="eyebrow">בקשת חבילה</div>
        <h1 className="rm-display" style={{ fontSize: 44, fontWeight: 500, marginTop: 10, marginBottom: 8 }}>בנו את החבילה שלכם</h1>
        <p style={{ color: "var(--muted)", maxWidth: 600 }}>בחרו מה צריך, מתי, ואיפה. נחזיר לכם שלוש חבילות מדורגות תוך פחות מדקה.</p>
      </div>

      {/* Stepper */}
      <div className="card" style={{ padding: 12, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 24, borderRadius: 999 }}>
        {["פריטים","תאריכים ומיקום","העדפת דירוג","סקירה ושליחה"].map((s, i) => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 999, background: i===0?"var(--ink)":"transparent", color: i===0?"var(--bg)":"var(--ink-2)" }}>
            <span style={{ width: 22, height: 22, borderRadius: "50%", background: i===0?"var(--clay)":"var(--bg-alt)", color: i===0?"#fff":"var(--muted)", display: "grid", placeItems: "center", fontSize: 11, fontWeight: 600 }}>{i+1}</span>
            <span style={{ fontSize: 13, fontWeight: 500 }}>{s}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 0.6fr", gap: 20, alignItems: "flex-start" }}>
        <div className="card" style={{ padding: 28 }}>
          <h2 style={{ fontSize: 19, fontWeight: 600, marginBottom: 4 }}>אילו פריטים אתם צריכים?</h2>
          <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 22 }}>הוסיפו פריט אחד או יותר. נמצא קומבינציות שעונות על כל הרשימה.</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
            {[
              { kind: "camera", title: "מצלמת מירורלס", sub: "Sony α7 IV או דומה · עדשת 24-70mm", q: 1, tone: "teal" },
              { kind: "lighting", title: "סט תאורה רכה", sub: "2 פנסי LED + רכים", q: 1, tone: "amber" },
              { kind: "speakers", title: "מערכת הגברה", sub: "עד 100 איש · מצב סטריאו", q: 1, tone: "clay" },
            ].map((it) => (
              <div key={it.title} style={{ display: "grid", gridTemplateColumns: "60px 1fr auto auto", gap: 12, alignItems: "center", padding: 12, border: "1px solid var(--line)", borderRadius: 18 }}>
                <div style={{ borderRadius: 12, overflow: "hidden" }}><CategoryArt kind={it.kind} tone={it.tone} height={56}/></div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{it.title}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{it.sub}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 6px", border: "1px solid var(--line)", borderRadius: 999 }}>
                  <button style={{ width: 26, height: 26, borderRadius: "50%", border: 0, background: "var(--bg-alt)", display: "grid", placeItems: "center" }}><Icon name="minus" size={12}/></button>
                  <span style={{ minWidth: 18, textAlign: "center", fontWeight: 600 }}>{it.q}</span>
                  <button style={{ width: 26, height: 26, borderRadius: "50%", border: 0, background: "var(--bg-alt)", display: "grid", placeItems: "center" }}><Icon name="plus" size={12}/></button>
                </div>
                <button style={{ background: "transparent", border: 0, color: "var(--muted)", padding: 4 }}><Icon name="trash" size={16}/></button>
              </div>
            ))}
          </div>
          <button className="btn btn-soft btn-block" style={{ borderStyle: "dashed", borderColor: "var(--line-2)", border: "1px dashed var(--line-2)", background: "transparent" }}>
            <Icon name="plus" size={14}/> הוסיפו פריט
          </button>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 28 }}>
            <div>
              <label className="label">תאריך התחלה</label>
              <div className="input" style={{ display: "flex", justifyContent: "space-between" }}><span>2 במאי, 09:00</span><Icon name="calendar" size={14} style={{ color: "var(--muted)" }}/></div>
            </div>
            <div>
              <label className="label">תאריך סיום</label>
              <div className="input" style={{ display: "flex", justifyContent: "space-between" }}><span>5 במאי, 18:00</span><Icon name="calendar" size={14} style={{ color: "var(--muted)" }}/></div>
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <label className="label">מיקום</label>
              <div className="input" style={{ display: "flex", justifyContent: "space-between" }}><span>תל אביב — רדיוס עד 15 ק״מ</span><Icon name="pin" size={14} style={{ color: "var(--muted)" }}/></div>
            </div>
          </div>

          <div style={{ marginTop: 28 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>איך לדרג את החבילות</h3>
            <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 14 }}>בחרו פריסט, או עברו ידנית על המשקלים.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 18 }}>
              {[
                { t: "מחיר תחילה", d: "החבילה הזולה ביותר", active: false },
                { t: "מאוזן", d: "פשרה טובה בכל הממדים", active: true },
                { t: "אמינות תחילה", d: "משכירים עם פלאפון מלא", active: false },
              ].map((p) => (
                <button key={p.t} className="card" style={{
                  padding: 14, textAlign: "right", borderColor: p.active ? "var(--teal)" : "var(--line)",
                  background: p.active ? "var(--teal-soft-2)" : "var(--surface)",
                  cursor: "pointer", border: p.active ? "2px solid var(--teal)" : "1px solid var(--line)",
                }}>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{p.t}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>{p.d}</div>
                </button>
              ))}
            </div>

            <div style={{ padding: 18, borderRadius: 18, background: "var(--bg-alt)" }}>
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 12 }}>משקלים מותאמים אישית</div>
              {[
                { l: "מחיר", v: 25 },
                { l: "אמינות", v: 25 },
                { l: "לוגיסטיקה", v: 20 },
                { l: "זמינות", v: 15 },
                { l: "איכות", v: 15 },
              ].map((w) => (
                <div key={w.l} style={{ display: "grid", gridTemplateColumns: "80px 1fr 40px", alignItems: "center", gap: 12, marginBottom: 10 }}>
                  <span style={{ fontSize: 13 }}>{w.l}</span>
                  <div style={{ position: "relative", height: 4, background: "var(--line)", borderRadius: 4 }}>
                    <div style={{ position: "absolute", insetInlineStart: 0, top: 0, bottom: 0, width: `${w.v * 4}%`, background: "var(--teal)", borderRadius: 4 }}/>
                    <div style={{ position: "absolute", top: -6, insetInlineStart: `calc(${w.v * 4}% - 8px)`, width: 16, height: 16, borderRadius: "50%", background: "#fff", border: "2px solid var(--teal)" }}/>
                  </div>
                  <span style={{ fontSize: 13, color: "var(--muted)", textAlign: "left" }}>{w.v}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside style={{ position: "sticky", top: 100, display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="card" style={{ padding: 22 }}>
            <div className="eyebrow" style={{ marginBottom: 8 }}>סיכום הבקשה</div>
            <h3 className="rm-display" style={{ fontSize: 22, fontWeight: 600, marginBottom: 14 }}>3 פריטים · 4 ימים</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13, color: "var(--ink-2)", paddingBottom: 14, borderBottom: "1px solid var(--line)" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--muted)" }}>תאריכים</span><span>2-5 במאי</span></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--muted)" }}>מיקום</span><span>תל אביב</span></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--muted)" }}>פריסט דירוג</span><span>מאוזן</span></div>
            </div>
            <div style={{ marginTop: 14, fontSize: 12, color: "var(--muted)", lineHeight: 1.6 }}>
              <Icon name="info" size={12} style={{ marginInlineEnd: 4 }}/>
              נחזיר Best Balanced, Best Price ו-Easiest Pickup עם הסבר מלא.
            </div>
            <button className="btn btn-teal btn-block btn-lg" style={{ marginTop: 18 }}>
              <Icon name="sparkles" size={16}/>חפשו לי חבילות
            </button>
          </div>
          <div className="card-soft" style={{ padding: 18, fontSize: 13, color: "var(--ink-2)", lineHeight: 1.7 }}>
            <div style={{ fontWeight: 600, color: "var(--ink)", marginBottom: 6 }}>טיפ קטן</div>
            הוספת פריט נוסף לרוב מוזילה את העלות הממוצעת ל-15-25%, כי המשכירים נותנים הנחת חבילה.
          </div>
        </aside>
      </div>
    </div>
  </SiteShell>
);

Object.assign(window, { ScreenHome, ScreenSearch, ScreenListing, ScreenAuth, ScreenAbout, ScreenBundleRequest });
