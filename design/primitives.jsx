// Shared primitives: icons, illustrated category placeholders, brand mark
// Exposes globals: Icon, Logo, CategoryArt, Avatar, ScoreDonut, Sparkline

const Icon = ({ name, size = 18, stroke = 1.6, className = "", style = {} }) => {
  const s = size;
  const props = {
    width: s, height: s, viewBox: "0 0 24 24", fill: "none",
    stroke: "currentColor", strokeWidth: stroke,
    strokeLinecap: "round", strokeLinejoin: "round",
    className, style, "aria-hidden": "true",
  };
  switch (name) {
    case "search": return <svg {...props}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>;
    case "menu": return <svg {...props}><path d="M4 7h16M4 12h16M4 17h16"/></svg>;
    case "x": return <svg {...props}><path d="M6 6l12 12M18 6 6 18"/></svg>;
    case "plus": return <svg {...props}><path d="M12 5v14M5 12h14"/></svg>;
    case "minus": return <svg {...props}><path d="M5 12h14"/></svg>;
    case "check": return <svg {...props}><path d="m5 12 5 5L20 7"/></svg>;
    case "arrow-left": return <svg {...props}><path d="M19 12H5m6-6-6 6 6 6"/></svg>;
    case "arrow-right": return <svg {...props}><path d="M5 12h14m-6-6 6 6-6 6"/></svg>;
    case "arrow-up-right": return <svg {...props}><path d="M7 17 17 7M9 7h8v8"/></svg>;
    case "chevron": return <svg {...props}><path d="m9 18 6-6-6-6"/></svg>;
    case "chevron-down": return <svg {...props}><path d="m6 9 6 6 6-6"/></svg>;
    case "calendar": return <svg {...props}><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 9h18M8 3v4M16 3v4"/></svg>;
    case "map": return <svg {...props}><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z"/><path d="M9 4v14M15 6v14"/></svg>;
    case "pin": return <svg {...props}><path d="M12 22s7-7 7-12a7 7 0 1 0-14 0c0 5 7 12 7 12Z"/><circle cx="12" cy="10" r="2.5"/></svg>;
    case "star": return <svg {...props}><path d="m12 3 2.7 5.5 6 .9-4.4 4.2 1 6-5.3-2.8L6.7 19.6l1-6L3.3 9.4l6-.9L12 3Z"/></svg>;
    case "heart": return <svg {...props}><path d="M12 20s-7-4.3-7-10a4.5 4.5 0 0 1 8-2 4.5 4.5 0 0 1 8 2c0 5.7-7 10-7 10h-2Z"/></svg>;
    case "bell": return <svg {...props}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9Z"/><path d="M10 21a2 2 0 0 0 4 0"/></svg>;
    case "user": return <svg {...props}><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>;
    case "users": return <svg {...props}><circle cx="9" cy="8" r="3.5"/><path d="M2.5 21a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M22 21a6.5 6.5 0 0 0-5-6.3"/></svg>;
    case "settings": return <svg {...props}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3 1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8 1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1Z"/></svg>;
    case "bag": return <svg {...props}><path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8a3 3 0 0 1 6 0"/></svg>;
    case "package": return <svg {...props}><path d="m12 3 9 5v8l-9 5-9-5V8l9-5Z"/><path d="m3 8 9 5 9-5M12 13v9"/></svg>;
    case "filter": return <svg {...props}><path d="M3 5h18l-7 9v6l-4-2v-4L3 5Z"/></svg>;
    case "sliders": return <svg {...props}><path d="M4 6h16M4 12h16M4 18h16"/><circle cx="9" cy="6" r="2" fill="currentColor" stroke="none"/><circle cx="15" cy="12" r="2" fill="currentColor" stroke="none"/><circle cx="7" cy="18" r="2" fill="currentColor" stroke="none"/></svg>;
    case "shield": return <svg {...props}><path d="M12 3 4 6v6c0 5 4 8 8 9 4-1 8-4 8-9V6l-8-3Z"/><path d="m9 12 2 2 4-4"/></svg>;
    case "truck": return <svg {...props}><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>;
    case "clock": return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
    case "info": return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v5h1"/></svg>;
    case "alert": return <svg {...props}><path d="M12 3 2 21h20L12 3Z"/><path d="M12 10v5M12 18h.01"/></svg>;
    case "trend-up": return <svg {...props}><path d="m3 17 6-6 4 4 8-8"/><path d="M14 7h7v7"/></svg>;
    case "trend-down": return <svg {...props}><path d="m3 7 6 6 4-4 8 8"/><path d="M14 17h7v-7"/></svg>;
    case "dot": return <svg {...props}><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>;
    case "more": return <svg {...props}><circle cx="6" cy="12" r="1.6" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><circle cx="18" cy="12" r="1.6" fill="currentColor"/></svg>;
    case "edit": return <svg {...props}><path d="M4 20h4l10-10-4-4L4 16v4Z"/><path d="m13.5 6.5 4 4"/></svg>;
    case "trash": return <svg {...props}><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>;
    case "copy": return <svg {...props}><rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></svg>;
    case "eye": return <svg {...props}><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>;
    case "lock": return <svg {...props}><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 1 1 8 0v4"/></svg>;
    case "mail": return <svg {...props}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 7 9-7"/></svg>;
    case "phone": return <svg {...props}><path d="M5 3h3l2 5-2 1a12 12 0 0 0 7 7l1-2 5 2v3a2 2 0 0 1-2 2A18 18 0 0 1 3 5a2 2 0 0 1 2-2Z"/></svg>;
    case "moon": return <svg {...props}><path d="M21 13a9 9 0 1 1-10-10 7 7 0 0 0 10 10Z"/></svg>;
    case "sun": return <svg {...props}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2m-3-7-1.5 1.5M6.5 17.5 5 19m0-14 1.5 1.5M17.5 17.5 19 19"/></svg>;
    case "sparkles": return <svg {...props}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/></svg>;
    case "globe": return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>;
    case "logout": return <svg {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>;
    case "wallet": return <svg {...props}><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M16 14h2"/></svg>;
    case "tag": return <svg {...props}><path d="M3 12V3h9l9 9-9 9-9-9Z"/><circle cx="8" cy="8" r="1.5"/></svg>;
    case "send": return <svg {...props}><path d="m4 12 17-8-7 18-3-7-7-3Z"/></svg>;
    case "flag": return <svg {...props}><path d="M5 3v18M5 4h12l-2 4 2 4H5"/></svg>;
    case "link": return <svg {...props}><path d="M10 14a4 4 0 0 1 0-6l3-3a4 4 0 0 1 6 6l-1 1M14 10a4 4 0 0 1 0 6l-3 3a4 4 0 0 1-6-6l1-1"/></svg>;
    case "list": return <svg {...props}><path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/></svg>;
    case "grid": return <svg {...props}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>;
    case "image": return <svg {...props}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>;
    case "upload": return <svg {...props}><path d="M12 16V4m0 0-5 5m5-5 5 5M4 20h16"/></svg>;
    case "download": return <svg {...props}><path d="M12 4v12m0 0 5-5m-5 5-5-5M4 20h16"/></svg>;
    case "refresh": return <svg {...props}><path d="M21 12a9 9 0 1 1-3-6.7M21 4v5h-5"/></svg>;
    case "key": return <svg {...props}><circle cx="8" cy="14" r="4"/><path d="m11 11 9-9 2 2-2 2 2 2-3 3-2-2"/></svg>;
    case "scale": return <svg {...props}><path d="M12 3v18M5 7h14M3 14l4-7 4 7H3Zm10 0 4-7 4 7h-8Z"/></svg>;
    case "play": return <svg {...props}><path d="M7 4v16l13-8L7 4Z" fill="currentColor"/></svg>;
    default: return <svg {...props}><circle cx="12" cy="12" r="9"/></svg>;
  }
};

const Logo = ({ size = 36 }) => (
  <div style={{
    width: size, height: size, borderRadius: size * 0.32,
    background: "linear-gradient(135deg, var(--teal) 0%, var(--teal-ink) 100%)",
    color: "#fff", display: "grid", placeItems: "center",
    boxShadow: "0 6px 20px rgba(12,138,138,.25)",
    flexShrink: 0,
  }}>
    <svg width={size*0.55} height={size*0.55} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10 12 4l9 6"/>
      <path d="M5 10v9h14v-9"/>
      <path d="M9 19v-5h6v5"/>
    </svg>
  </div>
);

const Wordmark = ({ small = false }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <Logo size={small ? 30 : 38} />
    <div>
      <div style={{
        fontFamily: "var(--font-display)", fontWeight: 700,
        fontSize: small ? 17 : 20, letterSpacing: "-0.02em", color: "var(--ink)",
        lineHeight: 1,
      }}>RentMatch</div>
      {!small && <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 3 }}>שכרו ביחד, חכם יותר</div>}
    </div>
  </div>
);

// Illustrated category placeholders — soft, hand-drawn vibe
const CategoryArt = ({ kind = "camera", size = "100%", height = 160, tone = "teal" }) => {
  const tones = {
    teal:   { bg: "#E8F6F4", line: "#0C8A8A", accent: "#C76A4A", soft: "#FBF3EB" },
    clay:   { bg: "#F6E1D5", line: "#C76A4A", accent: "#0C8A8A", soft: "#FFFFFF" },
    sage:   { bg: "#E1ECDA", line: "#6B8F5E", accent: "#C76A4A", soft: "#FFF7E8" },
    amber:  { bg: "#F4E5C2", line: "#946715", accent: "#0C8A8A", soft: "#FFFFFF" },
    rose:   { bg: "#F3D9DF", line: "#B9456A", accent: "#0C8A8A", soft: "#FFF7E8" },
    cream:  { bg: "#F4EFE6", line: "#3A3733", accent: "#C76A4A", soft: "#FFFFFF" },
  };
  const c = tones[tone] || tones.teal;
  const Wrap = ({ children }) => (
    <div style={{
      width: size, height, borderRadius: 18, background: c.bg,
      position: "relative", overflow: "hidden",
    }}>
      <svg viewBox="0 0 240 160" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        {children}
      </svg>
    </div>
  );

  switch (kind) {
    case "camera":
      return <Wrap>
        <circle cx="200" cy="30" r="18" fill={c.soft}/>
        <circle cx="50" cy="130" r="22" fill={c.soft} opacity=".7"/>
        <rect x="60" y="55" width="120" height="68" rx="8" fill={c.soft} stroke={c.line} strokeWidth="2.5"/>
        <rect x="92" y="44" width="56" height="14" rx="4" fill={c.soft} stroke={c.line} strokeWidth="2.5"/>
        <circle cx="120" cy="89" r="22" fill={c.bg} stroke={c.line} strokeWidth="2.5"/>
        <circle cx="120" cy="89" r="12" fill={c.accent}/>
        <circle cx="120" cy="89" r="5" fill={c.soft}/>
        <circle cx="166" cy="68" r="3" fill={c.line}/>
      </Wrap>;
    case "lighting":
      return <Wrap>
        <circle cx="40" cy="40" r="24" fill={c.soft} opacity=".7"/>
        <path d="M120 30 L150 80 L90 80 Z" fill={c.accent}/>
        <rect x="115" y="80" width="10" height="40" fill={c.line}/>
        <ellipse cx="120" cy="125" rx="32" ry="6" fill={c.line}/>
        <path d="M170 50 q10 -10 20 0" stroke={c.line} strokeWidth="2.5" fill="none"/>
        <path d="M180 70 q10 -10 20 0" stroke={c.line} strokeWidth="2.5" fill="none"/>
        <circle cx="120" cy="55" r="4" fill={c.soft}/>
      </Wrap>;
    case "speakers":
      return <Wrap>
        <rect x="50" y="30" width="60" height="100" rx="6" fill={c.soft} stroke={c.line} strokeWidth="2.5"/>
        <circle cx="80" cy="60" r="12" fill={c.bg} stroke={c.line} strokeWidth="2"/>
        <circle cx="80" cy="100" r="18" fill={c.accent}/>
        <circle cx="80" cy="100" r="8" fill={c.soft}/>
        <rect x="130" y="30" width="60" height="100" rx="6" fill={c.soft} stroke={c.line} strokeWidth="2.5"/>
        <circle cx="160" cy="60" r="12" fill={c.bg} stroke={c.line} strokeWidth="2"/>
        <circle cx="160" cy="100" r="18" fill={c.accent}/>
        <circle cx="160" cy="100" r="8" fill={c.soft}/>
      </Wrap>;
    case "tools":
      return <Wrap>
        <circle cx="200" cy="130" r="22" fill={c.soft} opacity=".7"/>
        <path d="M50 100 L130 30" stroke={c.line} strokeWidth="10" strokeLinecap="round"/>
        <circle cx="135" cy="28" r="14" fill={c.accent}/>
        <rect x="70" y="80" width="100" height="22" rx="4" fill={c.soft} stroke={c.line} strokeWidth="2.5" transform="rotate(20 120 91)"/>
        <path d="M170 110 q15 -10 28 0" stroke={c.line} strokeWidth="2.5" fill="none"/>
      </Wrap>;
    case "tent":
      return <Wrap>
        <circle cx="40" cy="125" r="22" fill={c.soft} opacity=".5"/>
        <path d="M50 120 L120 40 L190 120 Z" fill={c.soft} stroke={c.line} strokeWidth="2.5"/>
        <path d="M120 40 L120 120" stroke={c.line} strokeWidth="2"/>
        <path d="M100 120 L120 90 L140 120 Z" fill={c.accent}/>
        <circle cx="200" cy="40" r="14" fill={c.soft} opacity=".7"/>
      </Wrap>;
    case "bike":
      return <Wrap>
        <circle cx="60" cy="100" r="32" fill="none" stroke={c.line} strokeWidth="3"/>
        <circle cx="180" cy="100" r="32" fill="none" stroke={c.line} strokeWidth="3"/>
        <circle cx="60" cy="100" r="3" fill={c.line}/>
        <circle cx="180" cy="100" r="3" fill={c.line}/>
        <path d="M60 100 L120 50 L180 100 L120 70 Z" fill="none" stroke={c.line} strokeWidth="3"/>
        <path d="M120 50 L130 35" stroke={c.line} strokeWidth="3" strokeLinecap="round"/>
        <rect x="125" y="30" width="14" height="4" rx="2" fill={c.accent}/>
        <circle cx="120" cy="100" r="6" fill={c.accent}/>
      </Wrap>;
    case "kitchen":
      return <Wrap>
        <ellipse cx="120" cy="135" rx="80" ry="6" fill={c.line} opacity=".15"/>
        <rect x="60" y="60" width="120" height="60" rx="6" fill={c.soft} stroke={c.line} strokeWidth="2.5"/>
        <circle cx="90" cy="90" r="12" fill={c.accent}/>
        <circle cx="130" cy="90" r="12" fill={c.bg} stroke={c.line} strokeWidth="2"/>
        <circle cx="170" cy="90" r="12" fill={c.bg} stroke={c.line} strokeWidth="2"/>
        <rect x="80" y="40" width="80" height="20" rx="4" fill={c.soft} stroke={c.line} strokeWidth="2.5"/>
      </Wrap>;
    case "furniture":
      return <Wrap>
        <rect x="60" y="60" width="120" height="50" rx="8" fill={c.soft} stroke={c.line} strokeWidth="2.5"/>
        <rect x="50" y="80" width="20" height="50" rx="4" fill={c.accent}/>
        <rect x="170" y="80" width="20" height="50" rx="4" fill={c.accent}/>
        <rect x="75" y="70" width="90" height="14" rx="4" fill={c.bg}/>
        <circle cx="40" cy="40" r="14" fill={c.soft} opacity=".7"/>
      </Wrap>;
    case "drone":
      return <Wrap>
        <circle cx="60" cy="60" r="24" fill="none" stroke={c.line} strokeWidth="2.5"/>
        <circle cx="180" cy="60" r="24" fill="none" stroke={c.line} strokeWidth="2.5"/>
        <circle cx="60" cy="120" r="24" fill="none" stroke={c.line} strokeWidth="2.5"/>
        <circle cx="180" cy="120" r="24" fill="none" stroke={c.line} strokeWidth="2.5"/>
        <rect x="100" y="80" width="40" height="20" rx="6" fill={c.accent}/>
        <path d="M84 76 L100 80 M156 76 L140 80 M84 104 L100 100 M156 104 L140 100" stroke={c.line} strokeWidth="2"/>
      </Wrap>;
    case "music":
      return <Wrap>
        <rect x="50" y="40" width="140" height="90" rx="8" fill={c.soft} stroke={c.line} strokeWidth="2.5"/>
        <circle cx="120" cy="85" r="28" fill={c.bg} stroke={c.line} strokeWidth="2"/>
        <circle cx="120" cy="85" r="6" fill={c.accent}/>
        <rect x="65" y="55" width="20" height="6" rx="2" fill={c.line}/>
        <rect x="65" y="68" width="14" height="6" rx="2" fill={c.line} opacity=".5"/>
      </Wrap>;
    default:
      return <Wrap><rect x="40" y="40" width="160" height="80" rx="10" fill={c.soft} stroke={c.line} strokeWidth="2.5"/></Wrap>;
  }
};

const Avatar = ({ name = "א", color = "var(--teal)", size = 32 }) => (
  <div style={{
    width: size, height: size, borderRadius: "50%",
    background: color, color: "#fff",
    display: "grid", placeItems: "center",
    fontSize: size * 0.42, fontWeight: 600, flexShrink: 0,
  }}>{name.slice(0, 1)}</div>
);

const ScoreDonut = ({ score = 8.5, size = 80, label = "" }) => {
  const r = size / 2 - 6;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(10, score)) / 10;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--bg-alt)" strokeWidth="6"/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--teal)" strokeWidth="6"
          strokeLinecap="round" strokeDasharray={`${c*pct} ${c}`}/>
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "grid", placeItems: "center",
        textAlign: "center", lineHeight: 1,
      }}>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: size * 0.32, fontWeight: 700, color: "var(--ink)" }}>{score.toFixed(1)}</div>
          {label && <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 3 }}>{label}</div>}
        </div>
      </div>
    </div>
  );
};

const Sparkline = ({ data = [], width = 120, height = 36, color = "var(--teal)" }) => {
  if (!data.length) return null;
  const max = Math.max(...data), min = Math.min(...data), span = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / span) * (height - 4) - 2}`).join(" ");
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points={`0,${height} ${pts} ${width},${height}`} fill={color} opacity=".08" stroke="none"/>
    </svg>
  );
};

// Metric bar (used in many places)
const MetricBars = ({ items = [] }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
    {items.map((m) => (
      <div key={m.label} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--ink-2)" }}>
          <span>{m.label}</span>
          <span style={{ color: "var(--muted)" }}>{m.score.toFixed(1)}<span style={{ opacity: .5 }}>/10</span></span>
        </div>
        <div className="metric-bar"><i style={{ width: `${Math.max(6, m.score * 10)}%`, background: m.color }}/></div>
      </div>
    ))}
  </div>
);

Object.assign(window, { Icon, Logo, Wordmark, CategoryArt, Avatar, ScoreDonut, Sparkline, MetricBars });
