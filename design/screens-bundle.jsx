// Bundle results, comparison, checkout
// Globals: ScreenBundleResults, ScreenCompare, ScreenCheckout

const BUNDLES = [
  {
    id: "bal", label: "מאוזנת", title: "ערכת צילום אירוע מלא", subtitle: "פשרה אופטימלית בין מחיר, אמינות ולוגיסטיקה.",
    score: 9.2, price: 815, lenders: 2, pickups: 2, distance: 4.2,
    scores: { price: 8.4, reliability: 9.5, logistics: 9.0, availability: 9.4, quality: 9.1 },
    items: [
      { kind: "camera", title: "Sony α7 IV + עדשת 24-105", lender: "סטודיו לוז", price: 280, tone: "teal" },
      { kind: "lighting", title: "סט תאורה Aputure 120D", lender: "סטודיו לוז", price: 195, tone: "amber" },
      { kind: "speakers", title: "מערכת הגברה Bose L1", lender: "Compact AV", price: 340, tone: "clay" },
    ],
    strengths: ["משכירים ברדיוס 4.2 ק״מ","שני משכירים בלבד","אמינות 9.5/10"],
    tradeoffs: ["מחיר ברף הבינוני","סוללה רזרבית במחיר נוסף"],
    accent: "var(--teal)",
  },
  {
    id: "cheap", label: "הכי זול", title: "חבילת מחיר חכמה", subtitle: "החיסכון המרבי, עם פשרות מינוריות באיכות.",
    score: 8.4, price: 660, lenders: 3, pickups: 3, distance: 12.6,
    scores: { price: 9.6, reliability: 8.0, logistics: 7.2, availability: 8.5, quality: 7.8 },
    items: [
      { kind: "camera", title: "Sony α7 III + 24-70", lender: "Bundle Hub", price: 220, tone: "teal" },
      { kind: "lighting", title: "סט LED בסיסי", lender: "AV Plus", price: 140, tone: "amber" },
      { kind: "speakers", title: "Bose S1 Pro × 2", lender: "Sound Co.", price: 300, tone: "clay" },
    ],
    strengths: ["חיסכון ₪155 מול המאוזנת","שלוש חלופות זמינות"],
    tradeoffs: ["3 איסופים ב-3 מיקומים","מצלמה דור קודם","אמינות 8.0/10"],
    accent: "var(--clay)",
  },
  {
    id: "easy", label: "איסוף קל", title: "כל הציוד ממשכיר אחד", subtitle: "משכיר אחד, נקודת איסוף אחת, ללא ריצות.",
    score: 8.9, price: 890, lenders: 1, pickups: 1, distance: 1.8,
    scores: { price: 7.6, reliability: 9.2, logistics: 9.8, availability: 9.0, quality: 9.3 },
    items: [
      { kind: "camera", title: "Sony α7 IV", lender: "Bundle Hub", price: 290, tone: "teal" },
      { kind: "lighting", title: "Aputure 120D × 2", lender: "Bundle Hub", price: 215, tone: "amber" },
      { kind: "speakers", title: "Bose L1 Pro 16", lender: "Bundle Hub", price: 385, tone: "clay" },
    ],
    strengths: ["נקודת איסוף יחידה","משלוח עד הבית בחינם","תיאום אחד מול משכיר"],
    tradeoffs: ["יקרה ב-₪75 מהמאוזנת"],
    accent: "var(--sage)",
  },
];

const ScreenBundleResults = () => (
  <DashShell role="renter" active="/renter/bundle-results">
    <SectionTitle eyebrow="תוצאות חבילה" title="שלוש חבילות מדורגות לבקשה שלכם" sub="ערכת צילום אירוע · 2-5 במאי · תל אביב · פריסט מאוזן"
      action={<div style={{ display: "flex", gap: 6 }}><button className="btn btn-soft btn-sm"><Icon name="sliders" size={14}/>שנו דירוג</button><button className="btn btn-soft btn-sm"><Icon name="scale" size={14}/>השוואה</button></div>}/>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
      {BUNDLES.map((b, i) => (
        <article key={b.id} className="card" style={{
          padding: 22, position: "relative", overflow: "hidden",
          border: i === 0 ? "2px solid var(--teal)" : "1px solid var(--line)",
        }}>
          {i === 0 && <div style={{ position: "absolute", top: 0, insetInlineStart: 0, padding: "4px 14px", background: "var(--teal)", color: "#fff", fontSize: 11, fontWeight: 600, borderEndEndRadius: 12 }}>המומלצת</div>}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, paddingTop: i === 0 ? 14 : 0 }}>
            <div>
              <span className="pill" style={{ background: `color-mix(in srgb, ${b.accent} 14%, transparent)`, color: b.accent }}>{b.label}</span>
              <h3 className="rm-display" style={{ fontSize: 22, fontWeight: 600, marginTop: 8 }}>{b.title}</h3>
              <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>{b.subtitle}</p>
            </div>
            <ScoreDonut score={b.score} size={64} label="ציון"/>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 14, marginBottom: 14 }}>
            {b.items.map((it) => (
              <div key={it.title} style={{ display: "flex", alignItems: "center", gap: 10, padding: 8, borderRadius: 12, background: "var(--bg-alt)" }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, overflow: "hidden", flexShrink: 0 }}><CategoryArt kind={it.kind} tone={it.tone} height={36}/></div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.title}</div>
                  <div style={{ fontSize: 10, color: "var(--muted)" }}>{it.lender} · ₪{it.price}/יום</div>
                </div>
              </div>
            ))}
          </div>

          <MetricBars items={[
            { label: "מחיר", score: b.scores.price, color: "var(--teal)" },
            { label: "אמינות", score: b.scores.reliability, color: "var(--sage)" },
            { label: "לוגיסטיקה", score: b.scores.logistics, color: "var(--clay)" },
            { label: "זמינות", score: b.scores.availability, color: "var(--amber)" },
            { label: "איכות", score: b.scores.quality, color: "var(--rose)" },
          ]}/>

          <div style={{ marginTop: 16, padding: 14, borderRadius: 14, background: "var(--bg-alt)" }}>
            <div className="eyebrow" style={{ color: "var(--sage)", marginBottom: 6 }}>חוזקות</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
              {b.strengths.map((s) => <span key={s} className="pill pill-sage">{s}</span>)}
            </div>
            <div className="eyebrow" style={{ color: "var(--clay)", marginBottom: 6 }}>פשרות</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {b.tradeoffs.map((s) => <span key={s} className="pill pill-clay">{s}</span>)}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--line)" }}>
            <div>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>סה״כ ל-4 ימים</div>
              <div className="rm-display" style={{ fontSize: 22, fontWeight: 700 }}>₪{b.price.toLocaleString()}</div>
            </div>
            <button className="btn btn-primary">צפו והזמינו<Icon name="arrow-left" size={14}/></button>
          </div>
        </article>
      ))}
    </div>

    {/* Comparison row */}
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h3 style={{ fontSize: 17, fontWeight: 600 }}>השוואה צד-לצד</h3>
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>אותם פריטים, שלוש דרכים שונות לבחור.</p>
        </div>
        <button className="btn btn-soft btn-sm">פתחו השוואה מלאה<Icon name="arrow-left" size={12}/></button>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead style={{ background: "var(--bg-alt)" }}>
          <tr>
            <th style={{ padding: "12px 18px", textAlign: "right", fontWeight: 500, color: "var(--muted)", fontSize: 11, textTransform: "uppercase", letterSpacing: ".1em" }}>מדד</th>
            {BUNDLES.map((b) => <th key={b.id} style={{ padding: "12px 18px", textAlign: "right", fontWeight: 600 }}>{b.title}</th>)}
          </tr>
        </thead>
        <tbody>
          {[
            { l: "ציון כולל", get: (b) => <strong>{b.score.toFixed(1)}</strong> },
            { l: "מחיר", get: (b) => `₪${b.price}` },
            { l: "מספר משכירים", get: (b) => `${b.lenders}` },
            { l: "נקודות איסוף", get: (b) => `${b.pickups}` },
            { l: "מרחק לוגיסטי", get: (b) => `${b.distance} ק״מ` },
          ].map((row) => (
            <tr key={row.l} style={{ borderTop: "1px solid var(--line)" }}>
              <td style={{ padding: "12px 18px", color: "var(--muted)" }}>{row.l}</td>
              {BUNDLES.map((b) => <td key={b.id} style={{ padding: "12px 18px" }}>{row.get(b)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </DashShell>
);

// =================== COMPARE ===================
const ScreenCompare = () => (
  <DashShell role="renter" active="/renter/compare">
    <SectionTitle eyebrow="השוואה" title="ניתוח מעמיק של החבילות" sub="כל ממד, כל פריט, ולמה זה משנה. מומלץ לעבור על החוזקות והפשרות לפני הזמנה."/>

    <div className="card" style={{ padding: 0, overflow: "hidden", marginBottom: 18 }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead>
          <tr style={{ background: "var(--bg-alt)" }}>
            <th style={{ padding: 18, textAlign: "right", fontSize: 11, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--muted)", width: 180 }}></th>
            {BUNDLES.map((b, i) => (
              <th key={b.id} style={{ padding: 18, textAlign: "right" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <ScoreDonut score={b.score} size={56}/>
                  <div>
                    <span className="pill" style={{ background: `color-mix(in srgb, ${b.accent} 14%, transparent)`, color: b.accent, marginBottom: 4 }}>{b.label}</span>
                    <div className="rm-display" style={{ fontSize: 17, fontWeight: 600 }}>{b.title}</div>
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            { l: "מחיר ל-4 ימים", get: (b) => <span className="rm-display" style={{ fontSize: 20, fontWeight: 700 }}>₪{b.price.toLocaleString()}</span> },
            { l: "מספר משכירים", get: (b) => `${b.lenders}` },
            { l: "נקודות איסוף", get: (b) => `${b.pickups}` },
            { l: "מרחק לוגיסטי", get: (b) => `${b.distance} ק״מ` },
          ].map((row) => (
            <tr key={row.l} style={{ borderTop: "1px solid var(--line)" }}>
              <td style={{ padding: 16, color: "var(--muted)", fontSize: 12, fontWeight: 500 }}>{row.l}</td>
              {BUNDLES.map((b) => <td key={b.id} style={{ padding: 16 }}>{row.get(b)}</td>)}
            </tr>
          ))}
          <tr style={{ borderTop: "1px solid var(--line)" }}>
            <td style={{ padding: 16, color: "var(--muted)", fontSize: 12, fontWeight: 500, verticalAlign: "top" }}>פירוק ציונים</td>
            {BUNDLES.map((b) => (
              <td key={b.id} style={{ padding: 16 }}>
                <MetricBars items={[
                  { label: "מחיר", score: b.scores.price, color: "var(--teal)" },
                  { label: "אמינות", score: b.scores.reliability, color: "var(--sage)" },
                  { label: "לוגיסטיקה", score: b.scores.logistics, color: "var(--clay)" },
                  { label: "זמינות", score: b.scores.availability, color: "var(--amber)" },
                  { label: "איכות", score: b.scores.quality, color: "var(--rose)" },
                ]}/>
              </td>
            ))}
          </tr>
          <tr style={{ borderTop: "1px solid var(--line)" }}>
            <td style={{ padding: 16, color: "var(--muted)", fontSize: 12, fontWeight: 500, verticalAlign: "top" }}>חוזקות</td>
            {BUNDLES.map((b) => (
              <td key={b.id} style={{ padding: 16 }}>
                <ul style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {b.strengths.map((s) => <li key={s} style={{ display: "flex", gap: 8, fontSize: 13 }}><Icon name="check" size={14} style={{ color: "var(--sage)", marginTop: 2 }}/>{s}</li>)}
                </ul>
              </td>
            ))}
          </tr>
          <tr style={{ borderTop: "1px solid var(--line)" }}>
            <td style={{ padding: 16, color: "var(--muted)", fontSize: 12, fontWeight: 500, verticalAlign: "top" }}>פשרות</td>
            {BUNDLES.map((b) => (
              <td key={b.id} style={{ padding: 16 }}>
                <ul style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {b.tradeoffs.map((s) => <li key={s} style={{ display: "flex", gap: 8, fontSize: 13 }}><Icon name="info" size={14} style={{ color: "var(--clay)", marginTop: 2 }}/>{s}</li>)}
                </ul>
              </td>
            ))}
          </tr>
          <tr style={{ borderTop: "1px solid var(--line)" }}>
            <td></td>
            {BUNDLES.map((b, i) => (
              <td key={b.id} style={{ padding: 16 }}>
                <button className={`btn ${i === 0 ? "btn-teal" : "btn-outline"} btn-block`}>בחרו חבילה זו</button>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  </DashShell>
);

// =================== CHECKOUT ===================
const ScreenCheckout = () => (
  <DashShell role="renter" active="/renter/orders">
    <div style={{ display: "flex", gap: 8, fontSize: 12, color: "var(--muted)", marginBottom: 18 }}>
      <a href="#">תוצאות</a><span>›</span><span style={{ color: "var(--ink-2)" }}>סיכום והזמנה</span>
    </div>
    <SectionTitle eyebrow="סיום הזמנה" title="ערכת צילום אירוע מלא" sub="2-5 במאי · 4 ימים · 3 פריטים · 2 משכירים"/>

    <div style={{ display: "grid", gridTemplateColumns: "1.4fr 0.6fr", gap: 20, alignItems: "flex-start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div className="card" style={{ padding: 22 }}>
          <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 14 }}>פרטי איסוף</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
            {[
              { active: true, t: "משלוח עד הבית", d: "₪35 לכל המשכירים בחבילה" },
              { active: false, t: "איסוף עצמי", d: "0 ₪ — נקודות איסוף לפי המשכיר" },
            ].map((o) => (
              <button key={o.t} className="card" style={{
                padding: 14, textAlign: "right",
                border: o.active ? "2px solid var(--teal)" : "1px solid var(--line)",
                background: o.active ? "var(--teal-soft-2)" : "var(--surface)",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{o.t}</div>
                  {o.active && <Icon name="check" size={16} style={{ color: "var(--teal)" }}/>}
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>{o.d}</div>
              </button>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div><label className="label">כתובת</label><input className="input" defaultValue="רחוב דיזנגוף 142, תל אביב"/></div>
            <div><label className="label">טלפון לתיאום</label><input className="input" defaultValue="050-1234567"/></div>
          </div>
        </div>

        <div className="card" style={{ padding: 22 }}>
          <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 14 }}>פריטי החבילה</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {BUNDLES[0].items.map((it) => (
              <div key={it.title} style={{ display: "grid", gridTemplateColumns: "60px 1fr auto", alignItems: "center", gap: 14, padding: 12, borderRadius: 14, background: "var(--bg-alt)" }}>
                <div style={{ borderRadius: 10, overflow: "hidden" }}><CategoryArt kind={it.kind} tone={it.tone} height={56}/></div>
                <div>
                  <div style={{ fontWeight: 500 }}>{it.title}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{it.lender} · ₪{it.price}/יום × 4</div>
                </div>
                <div className="rm-display" style={{ fontSize: 17, fontWeight: 600 }}>₪{it.price * 4}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: 22 }}>
          <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 14 }}>תשלום</h3>
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            <button className="btn btn-outline" style={{ borderColor: "var(--teal)", color: "var(--teal)" }}><Icon name="wallet" size={14}/>כרטיס אשראי</button>
            <button className="btn btn-ghost">Bit</button>
            <button className="btn btn-ghost">PayPal</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 80px", gap: 10 }}>
            <div><label className="label">מספר כרטיס</label><input className="input" placeholder="0000 0000 0000 0000"/></div>
            <div><label className="label">תוקף</label><input className="input" placeholder="MM/YY"/></div>
            <div><label className="label">CVV</label><input className="input" placeholder="•••"/></div>
          </div>
          <div style={{ marginTop: 14, padding: 12, borderRadius: 14, background: "var(--teal-soft-2)", display: "flex", gap: 10, fontSize: 12, color: "var(--teal-ink)" }}>
            <Icon name="shield" size={14}/>
            <div>תשלום מאובטח. הפיקדון נשמר במאגד ומוחזר לחשבון 24 שעות אחרי החזרה.</div>
          </div>
        </div>
      </div>

      <aside style={{ position: "sticky", top: 100, display: "flex", flexDirection: "column", gap: 14 }}>
        <div className="card" style={{ padding: 22 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>סיכום עלויות</h3>
          {[
            { l: "סה״כ פריטים", v: "₪3,260" },
            { l: "הנחת חבילה", v: "-₪245", c: "var(--sage)" },
            { l: "משלוח", v: "₪35" },
            { l: "ביטוח", v: "₪65" },
          ].map((r) => (
            <div key={r.l} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "6px 0" }}>
              <span style={{ color: "var(--muted)" }}>{r.l}</span>
              <span style={{ color: r.c || "var(--ink-2)" }}>{r.v}</span>
            </div>
          ))}
          <div style={{ paddingTop: 12, marginTop: 8, borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontWeight: 600 }}>סה״כ לתשלום</span>
            <span className="rm-display" style={{ fontSize: 26, fontWeight: 700 }}>₪3,115</span>
          </div>
          <div style={{ marginTop: 4, fontSize: 11, color: "var(--muted)" }}>פיקדון נוסף: ₪1,500 (מוחזר)</div>
          <button className="btn btn-teal btn-block btn-lg" style={{ marginTop: 16 }}>אשרו והזמינו<Icon name="check" size={16}/></button>
          <div style={{ marginTop: 10, fontSize: 11, color: "var(--muted)", textAlign: "center" }}>בלחיצה אתם מסכימים <a href="#" style={{ color: "var(--teal)" }}>לתנאי השימוש</a></div>
        </div>
      </aside>
    </div>
  </DashShell>
);

Object.assign(window, { ScreenBundleResults, ScreenCompare, ScreenCheckout });
