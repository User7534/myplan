var useState = React.useState, useRef = React.useRef;
var useEffect = React.useEffect, useMemo = React.useMemo;
var PALETTES = {
  army: { name: "Army Night", bg: "#0A1628", panel: "#0f2540", card: "#1a3355", hi: "#C8A84B", tx: "#F0F4F8", mu: "#8aabcc", dim: "#4a6fa5", bd: "#1a2f4a", bd2: "#2a4a7f" },
  slate: { name: "Slate", bg: "#0f172a", panel: "#1e293b", card: "#1e2d3d", hi: "#38bdf8", tx: "#e2e8f0", mu: "#94a3b8", dim: "#475569", bd: "#1e293b", bd2: "#334155" },
  forest: { name: "Forest", bg: "#0a1a0f", panel: "#1a3a25", card: "#1a3020", hi: "#4ade80", tx: "#dcfce7", mu: "#86efac", dim: "#4ade80", bd: "#14532d", bd2: "#166534" },
  crimson: { name: "Crimson", bg: "#1a0a0a", panel: "#3a1a1a", card: "#3a2020", hi: "#f87171", tx: "#fee2e2", mu: "#fca5a5", dim: "#f87171", bd: "#7f1d1d", bd2: "#991b1b" },
  sand: { name: "Desert Sand", bg: "#1c1a15", panel: "#2d2a1e", card: "#2a2718", hi: "#f59e0b", tx: "#fef3c7", mu: "#d4a853", dim: "#92400e", bd: "#3d3520", bd2: "#4d4228" },
  mono: { name: "Monochrome", bg: "#0a0a0a", panel: "#1a1a1a", card: "#1f1f1f", hi: "#e5e5e5", tx: "#ffffff", mu: "#a3a3a3", dim: "#525252", bd: "#262626", bd2: "#404040" },
  dusk: { name: "Dusk Lilac", bg: "#1b1825", panel: "#2a2438", card: "#332c47", hi: "#c4a7e7", tx: "#f1edf8", mu: "#b8a8d4", dim: "#7c6a99", bd: "#332c47", bd2: "#473d61" },
  sage: { name: "Sage", bg: "#161d18", panel: "#202b22", card: "#28352a", hi: "#a3c9a8", tx: "#e8f0e9", mu: "#9bb89f", dim: "#5e7a63", bd: "#28352a", bd2: "#36473a" },
  terra: { name: "Terracotta", bg: "#1f1712", panel: "#33241a", card: "#3d2c1f", hi: "#e08e5b", tx: "#fbe9dc", mu: "#dcab85", dim: "#a3744f", bd: "#3d2c1f", bd2: "#4f3a28" },
  ocean: { name: "Deep Ocean", bg: "#071a24", panel: "#0e2b3a", card: "#123545", hi: "#5ec8d8", tx: "#e3f5f9", mu: "#8fc4d1", dim: "#4a8b9c", bd: "#123545", bd2: "#1a4458" },
  rose: { name: "Dusty Rose", bg: "#1f1316", panel: "#321e22", card: "#3d262b", hi: "#e8a0ab", tx: "#fbe9ec", mu: "#d39aa3", dim: "#a3636e", bd: "#3d262b", bd2: "#4f3138" },
  myplan: { name: "MyPlan", bg: "#1e1c17", panel: "#2c2a20", card: "#35321f", hi: "#8aaa7c", tx: "#f0ece0", mu: "#a89e80", dim: "#6e6548", bd: "#3a3720", bd2: "#4a4728" },
  parchment: { name: "Parchment", bg: "#1a1812", panel: "#2b271d", card: "#352f22", hi: "#d9c08a", tx: "#f3edda", mu: "#c4b48c", dim: "#8a7a52", bd: "#352f22", bd2: "#473f2c" }
};
var MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
var MLONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var DOWH = ["S", "M", "T", "W", "T", "F", "S"];
var DOWF = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var DOWS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var ORD = ["", "st", "nd", "rd", "th", "th"];
var VIEWS = [
  { id: "day", label: "Day", dw: 44, showDow: true, showWk: true, showBR: true },
  { id: "week", label: "Week", dw: 18, showDow: true, showWk: true, showBR: true },
  { id: "month", label: "Month", dw: 9, showDow: false, showWk: false, showBR: true },
  { id: "quarter", label: "Quarter", dw: 4, showDow: false, showWk: false, showBR: false },
  { id: "year", label: "Year", dw: 2, showDow: false, showWk: false, showBR: false }
];
var DEF_LANES = [
  { id: "ops", label: "OPERATIONS", locked: false },
  { id: "trng", label: "TRAINING EVENTS", locked: false },
  { id: "rng", label: "RANGES / LIVE FIRE", locked: false },
  { id: "mnt", label: "MAINTENANCE", locked: false },
  { id: "med", label: "MEDICAL / DENTAL", locked: false },
  { id: "adm", label: "ADMIN / PERSONNEL", locked: false },
  { id: "lv", label: "PASS & LEAVE", locked: false },
  { id: "nts", label: "NOTES / REMARKS", locked: false }
];
var DEF_CATS = [
  { id: "c1", label: "Training", color: "#2563EB", text: "#fff", isBR: false },
  { id: "c2", label: "Live Fire", color: "#DC2626", text: "#fff", isBR: false },
  { id: "c3", label: "Maintenance", color: "#D97706", text: "#fff", isBR: false },
  { id: "c4", label: "Admin", color: "#7C3AED", text: "#fff", isBR: true },
  { id: "c5", label: "Pass/Leave", color: "#059669", text: "#fff", isBR: false },
  { id: "c6", label: "EXEVAL", color: "#C8A84B", text: "#1a1a1a", isBR: false },
  { id: "c7", label: "Other", color: "#6B7280", text: "#fff", isBR: false }
];
var DEF_BR = {
  enabled: false,
  anchorDow: 2,
  cycleLen: 4,
  labels: ["BR1", "BR2", "BR3", "BR4"],
  colors: ["#1d4ed8", "#b45309", "#065f46", "#6d28d9"],
  hidden: []
};
var PAPERS = [
  { id: "letter", label: "Letter 8.5x11", w: 8.5, h: 11 },
  { id: "tabloid", label: "Tabloid 11x17", w: 11, h: 17 },
  { id: "a4", label: "A4 210x297", w: 8.27, h: 11.69 }
];
var HORIZONS = [
  { id: "daily", label: "Day", min: 0 },
  { id: "weekly", label: "Week", min: 1 },
  { id: "monthly", label: "Month", min: 2 },
  { id: "quarterly", label: "Quarter", min: 7 },
  { id: "annual", label: "Year", min: 14 }
];
var COLORS = ["#2563EB", "#DC2626", "#D97706", "#7C3AED", "#059669", "#C8A84B", "#6B7280", "#0891B2", "#DB2777", "#4F46E5", "#ea580c", "#65A30D"];
var LW = 140, BH = 24, BP = 3;
var NID = 100, NLID = 200, NCID = 300, NRID = 400;
function ymd(d) {
  return { y: d.getFullYear(), m: d.getMonth(), d: d.getDate(), dow: d.getDay() };
}
function addDays(d, n) {
  var r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}
function dkey(d) {
  var y = d.getFullYear();
  var m = String(d.getMonth() + 1).padStart(2, "0");
  var dy = String(d.getDate()).padStart(2, "0");
  return y + "-" + m + "-" + dy;
}
function pkey(k) {
  var p = k.split("-").map(Number);
  return new Date(p[0], p[1] - 1, p[2]);
}
function hdate(d) {
  var v = ymd(d);
  return MONTHS[v.m] + " " + v.d + ", " + v.y;
}
function isWE(dow) {
  return dow === 0 || dow === 6;
}
function dff(a, b) {
  return Math.round((b - a) / 864e5);
}
function nthWD(yr, mo, dow, nth) {
  if (nth > 0) {
    var cnt = 0, d = new Date(yr, mo, 1);
    while (d.getMonth() === mo) {
      if (d.getDay() === dow) {
        cnt++;
        if (cnt === nth) return new Date(d);
      }
      d = addDays(d, 1);
    }
  } else {
    var d = new Date(yr, mo + 1, 0);
    while (d.getDay() !== dow) d = addDays(d, -1);
    return new Date(d);
  }
  return null;
}
function brForDate(date, cfg) {
  if (!cfg || !cfg.enabled) return null;
  var ad = cfg.anchorDow;
  var dow = date.getDay();
  var mon = addDays(date, -((dow === 0 ? 7 : dow) - 1));
  var anc = addDays(mon, ad === 0 ? 6 : ad - 1);
  var am = anc.getMonth(), ay = anc.getFullYear(), occ = 0;
  var d = new Date(ay, am, 1);
  while (d.getMonth() === am && d <= anc) {
    if (d.getDay() === ad) occ++;
    d.setDate(d.getDate() + 1);
  }
  var idx = (occ - 1 + cfg.labels.length) % cfg.labels.length;
  return { label: cfg.labels[idx], occ };
}
function brMonthWeeks(yr, mo, cfg) {
  if (!cfg || !cfg.enabled) return [];
  var ad = cfg.anchorDow, out = [], occ = 0;
  var d = new Date(yr, mo, 1);
  while (d.getMonth() === mo) {
    if (d.getDay() === ad) {
      occ++;
      var idx = (occ - 1) % cfg.labels.length;
      var ofm = ad === 0 ? 6 : ad - 1;
      out.push({ occ, label: cfg.labels[idx], anc: new Date(d), mon: addDays(d, -ofm) });
    }
    d.setDate(d.getDate() + 1);
  }
  return out;
}
function mkInst(rec, sd) {
  var s = dkey(sd);
  var e = dkey(addDays(sd, Math.max(0, (rec.dur || 1) - 1)));
  return {
    id: rec.id + "_" + s,
    recurId: rec.id,
    isRec: true,
    isBR: !!rec.isBR,
    title: rec.title,
    laneId: rec.laneId,
    catId: rec.catId,
    sd: s,
    ed: e,
    st: rec.st || "",
    et: rec.et || "",
    loc: rec.loc || "",
    att: rec.att || "",
    attReq: !!rec.attReq,
    notes: rec.notes || "",
    files: rec.files || []
  };
}
function expand(rec, br) {
  if (!rec.rs || !rec.re) return [];
  var rs = pkey(rec.rs), re = pkey(rec.re);
  if (re < rs) return [];
  var out = [], iv = Math.max(1, rec.iv || 1), t = rec.type || "weekly";
  if (t === "daily") {
    var d = new Date(rs);
    while (d <= re) {
      out.push(mkInst(rec, d));
      d = addDays(d, iv);
    }
  } else if (t === "weekly") {
    var dows = rec.dows && rec.dows.length > 0 ? rec.dows : [rec.dow != null ? rec.dow : 1];
    var sun = addDays(rs, -rs.getDay()), cur = new Date(sun), seen = {};
    while (cur <= re) {
      for (var i = 0; i < dows.length; i++) {
        var c = addDays(cur, dows[i]), ck = dkey(c);
        if (c >= rs && c <= re && !seen[ck]) {
          seen[ck] = 1;
          out.push(mkInst(rec, c));
        }
      }
      cur = addDays(cur, 7 * iv);
    }
  } else if (t === "monthly-nth") {
    var m = new Date(rs.getFullYear(), rs.getMonth(), 1);
    while (m <= re) {
      var cd = nthWD(m.getFullYear(), m.getMonth(), rec.dow != null ? rec.dow : 1, rec.nth != null ? rec.nth : 1);
      if (cd && cd >= rs && cd <= re) out.push(mkInst(rec, cd));
      m = new Date(m.getFullYear(), m.getMonth() + 1, 1);
    }
  } else if (t === "monthly-date") {
    var dom = rec.dom || 1, m2 = new Date(rs.getFullYear(), rs.getMonth(), 1);
    while (m2 <= re) {
      var cd2 = new Date(m2.getFullYear(), m2.getMonth(), dom);
      if (cd2.getMonth() === m2.getMonth() && cd2 >= rs && cd2 <= re) out.push(mkInst(rec, cd2));
      m2 = new Date(m2.getFullYear(), m2.getMonth() + iv, 1);
    }
  } else if (t === "annual") {
    var y = rs.getFullYear();
    while (y <= re.getFullYear()) {
      var ca = new Date(y, rec.amo || 0, rec.ady || 1);
      if (ca >= rs && ca <= re) out.push(mkInst(rec, ca));
      y++;
    }
  } else if (t === "brWeek" && br && br.enabled) {
    var db = new Date(rs);
    while (db <= re) {
      var b = brForDate(db, br);
      if (b && b.occ === (rec.brNum || 1) && db.getDay() === (rec.dow != null ? rec.dow : 2)) out.push(mkInst(rec, db));
      db = addDays(db, 1);
    }
  }
  return out.filter(function(inst) {
    if (!rec.brf || rec.brf.length === 0) return true;
    if (!br || !br.enabled) return true;
    var b2 = brForDate(pkey(inst.sd), br);
    return b2 && rec.brf.indexOf(b2.occ) !== -1;
  }).sort(function(a, b2) {
    return pkey(a.sd) - pkey(b2.sd);
  });
}
function recLabel(rec, br) {
  var dur = rec.dur > 1 ? " (" + rec.dur + "d)" : "", t = rec.type || "", base = "";
  if (t === "daily") {
    base = rec.iv > 1 ? "Every " + rec.iv + " days" + dur : "Daily" + dur;
  } else if (t === "weekly") {
    var dl = (rec.dows || [rec.dow]).map(function(d) {
      return DOWS[d];
    }).join(", ");
    base = (rec.iv > 1 ? "Every " + rec.iv + " wks" : "Weekly") + " - " + dl + dur;
  } else if (t === "monthly-nth") {
    var ns = rec.nth === -1 ? "Last" : rec.nth + (ORD[rec.nth] || "th");
    base = "Monthly - " + ns + " " + DOWF[rec.dow || 1] + dur;
  } else if (t === "monthly-date") {
    base = (rec.iv > 1 ? "Every " + rec.iv + " mo" : "Monthly") + " on " + (rec.dom || 1) + (ORD[rec.dom] || "th") + dur;
  } else if (t === "annual") {
    base = "Annual - " + MONTHS[rec.amo || 0] + " " + (rec.ady || 1) + dur;
  } else if (t === "brWeek" && br && br.enabled) {
    var lbl = br.labels[(rec.brNum - 1) % br.labels.length];
    base = lbl + " - " + DOWF[rec.dow || 2] + "s" + dur;
  } else {
    base = "No recurrence";
  }
  if (rec.brf && rec.brf.length > 0 && br && br.enabled && t !== "brWeek") {
    var wn = rec.brf.map(function(n) {
      return br.labels[n - 1] || "BR" + n;
    }).join("+");
    base += " [" + wn + "]";
  }
  return base;
}
function stackEvs(list) {
  var sorted = list.slice().sort(function(a, b) {
    var d = pkey(a.sd) - pkey(b.sd);
    return d !== 0 ? d : dff(pkey(b.sd), pkey(b.ed)) - dff(pkey(a.sd), pkey(a.ed));
  });
  var ends = [];
  return sorted.map(function(ev) {
    var s = pkey(ev.sd), e = pkey(ev.ed), row = -1;
    for (var i = 0; i < ends.length; i++) {
      if (ends[i] < s) {
        row = i;
        break;
      }
    }
    if (row === -1) row = ends.length;
    ends[row] = e;
    return Object.assign({}, ev, { row });
  });
}
function mkI(P) {
  return {
    width: "100%",
    background: P.panel,
    border: "1px solid " + P.bd2,
    color: P.tx,
    padding: "5px 8px",
    fontSize: 12,
    fontFamily: "Arial,sans-serif",
    borderRadius: 3,
    boxSizing: "border-box"
  };
}
function isDark(hex) {
  try {
    var r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1e3 < 128;
  } catch (e) {
    return true;
  }
}
function Label(props) {
  return /* @__PURE__ */ React.createElement("label", { style: { fontSize: 10, color: props.P.mu, letterSpacing: 1, display: "block", marginBottom: 3, fontWeight: 600 } }, props.children);
}
function Fld(props) {
  var style = { marginBottom: 10 };
  if (props.col) style.gridColumn = props.col;
  return /* @__PURE__ */ React.createElement("div", { style }, props.label && /* @__PURE__ */ React.createElement(Label, { P: props.P }, props.label), props.children);
}
function PBtn(props) {
  var P = props.P;
  var style = {
    border: "none",
    padding: "6px 14px",
    fontSize: 11,
    fontWeight: 700,
    cursor: props.disabled ? "not-allowed" : "pointer",
    borderRadius: 3,
    background: P.hi,
    color: P.bg,
    whiteSpace: "nowrap",
    flexShrink: 0,
    opacity: props.disabled ? 0.5 : 1
  };
  if (props.full) style.width = "100%";
  return /* @__PURE__ */ React.createElement("button", { style, onClick: props.disabled ? void 0 : props.onClick }, props.children);
}
function SBtn(props) {
  var P = props.P, active = !!props.active;
  var style = {
    border: "1px solid " + (active ? P.hi : P.bd2),
    padding: "6px 12px",
    fontSize: 11,
    fontWeight: active ? 700 : 500,
    cursor: props.disabled ? "not-allowed" : "pointer",
    borderRadius: 3,
    background: active ? P.hi + "22" : "transparent",
    color: active ? P.hi : P.mu,
    whiteSpace: "nowrap",
    flexShrink: 0,
    opacity: props.disabled ? 0.5 : 1
  };
  if (props.full) style.width = "100%";
  return /* @__PURE__ */ React.createElement("button", { style, onClick: props.disabled ? void 0 : props.onClick, title: props.title || "" }, props.children);
}
function DBtn(props) {
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      style: { border: "none", padding: "6px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer", borderRadius: 3, background: "#7f1d1d", color: "#fca5a5", whiteSpace: "nowrap", flexShrink: 0 },
      onClick: props.onClick
    },
    props.children
  );
}
function Tog(props) {
  var P = props.P, on = !!props.on;
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      style: { position: "relative", width: 32, height: 18, flexShrink: 0, cursor: "pointer", display: "inline-block" },
      onClick: props.onClick
    },
    /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: 0, right: 0, bottom: 0, left: 0, background: on ? P.hi : P.bd2, borderRadius: 9, transition: "background 0.2s" } }),
    /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: 2, left: on ? 14 : 2, width: 14, height: 14, background: "#fff", borderRadius: "50%", transition: "left 0.2s" } })
  );
}
function Menu(props) {
  var P = props.P;
  var [open, setOpen] = useState(false);
  var ref = useRef(null);
  useEffect(function() {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return function() {
      document.removeEventListener("mousedown", onDoc);
    };
  }, []);
  function wrapChild(child) {
    if (!child || !child.props || typeof child.props.onClick !== "function") return child;
    var origOnClick = child.props.onClick;
    var wrapped = function(e) {
      origOnClick(e);
      setOpen(false);
    };
    return { ...child, props: Object.assign({}, child.props, { onClick: wrapped }) };
  }
  var wrappedChildren = Array.isArray(props.children) ? props.children.map(wrapChild) : wrapChild(props.children);
  return /* @__PURE__ */ React.createElement("div", { ref, style: { position: "relative", flexShrink: 0 } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      style: { border: "1px solid " + P.bd2, padding: "6px 12px", fontSize: 11, fontWeight: 500, cursor: "pointer", borderRadius: 3, background: open ? P.card : "transparent", color: P.mu, whiteSpace: "nowrap", display: "flex", alignItems: "center", columnGap: 5 },
      onClick: function() {
        setOpen(function(p) {
          return !p;
        });
      }
    },
    props.label,
    /* @__PURE__ */ React.createElement("span", { style: { fontSize: 8, opacity: 0.7 } }, open ? "\u25B2" : "\u25BC")
  ), open && /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: "calc(100% + 4px)", right: 0, background: P.panel, border: "1px solid " + P.bd2, borderRadius: 4, boxShadow: "0 6px 24px rgba(0,0,0,0.5)", minWidth: 200, zIndex: 100, overflow: "hidden" } }, wrappedChildren));
}
function MenuItem(props) {
  var P = props.P;
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      style: { display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", border: "none", background: "transparent", padding: "8px 12px", fontSize: 11, color: P.tx, cursor: "pointer", textAlign: "left", fontFamily: "Arial,sans-serif" },
      onClick: props.onClick,
      onMouseEnter: function(e) {
        e.currentTarget.style.background = P.card;
      },
      onMouseLeave: function(e) {
        e.currentTarget.style.background = "transparent";
      }
    },
    /* @__PURE__ */ React.createElement("span", null, props.children),
    props.tag && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, color: props.tagColor || P.hi, fontWeight: 600 } }, props.tag)
  );
}
function Mdl(props) {
  var P = props.P;
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      style: { position: "fixed", top: 0, right: 0, bottom: 0, left: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "flex-start", justifyContent: "center", zIndex: 300, overflowY: "auto", padding: "16px 0" },
      onClick: props.onClose
    },
    /* @__PURE__ */ React.createElement(
      "div",
      {
        style: { background: P.panel, border: "1px solid " + P.bd2, borderRadius: 6, padding: 20, width: props.w || 520, maxWidth: "96vw", boxShadow: "0 8px 40px rgba(0,0,0,0.8)", fontFamily: "Arial,sans-serif" },
        onClick: function(e) {
          e.stopPropagation();
        }
      },
      /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: P.hi, fontWeight: 700 } }, props.title), props.sub && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: P.mu, marginTop: 2 } }, props.sub)), /* @__PURE__ */ React.createElement("button", { style: { background: "none", border: "none", color: P.mu, fontSize: 16, cursor: "pointer", padding: "0 2px" }, onClick: props.onClose }, "x")),
      props.children
    )
  );
}
function DowPick(props) {
  var P = props.P, multi = !!props.multi;
  var val = props.value;
  var selArr = multi ? Array.isArray(val) ? val : [] : null;
  function isSel(i) {
    return multi ? selArr.indexOf(i) !== -1 : val === i;
  }
  function toggle(i) {
    if (!multi) {
      props.onChange(i);
      return;
    }
    var next = selArr.indexOf(i) !== -1 ? selArr.filter(function(v) {
      return v !== i;
    }) : selArr.concat([i]);
    props.onChange(next);
  }
  return /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 10 } }, props.label && /* @__PURE__ */ React.createElement(Label, { P }, props.label), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", columnGap: 3 } }, DOWF.map(function(nm, i) {
    var s = isSel(i);
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        key: i,
        style: { flex: 1, padding: "5px 2px", textAlign: "center", borderRadius: 3, cursor: "pointer", fontSize: 9, fontWeight: 700, userSelect: "none", border: "1px solid " + (s ? P.hi : P.bd2), background: s ? P.hi + "22" : P.panel, color: s ? P.hi : P.mu },
        onClick: function() {
          toggle(i);
        }
      },
      nm.slice(0, 2).toUpperCase()
    );
  })));
}
function PalModal(props) {
  var P = props.P;
  var keys = Object.keys(PALETTES);
  return /* @__PURE__ */ React.createElement(Mdl, { P, title: "Color Palette", sub: "Choose a theme", onClose: props.onClose, w: 420 }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 10, rowGap: 10 } }, keys.map(function(key) {
    var pal = PALETTES[key], active = props.current === key;
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        key,
        style: { border: "2px solid " + (active ? pal.hi : pal.bd2), borderRadius: 6, padding: 10, cursor: "pointer", background: pal.bg },
        onClick: function() {
          props.onSelect(key);
          props.onClose();
        }
      },
      /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", columnGap: 6, marginBottom: 4 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", columnGap: 3 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 12, height: 12, background: pal.hi, borderRadius: 2 } }), /* @__PURE__ */ React.createElement("div", { style: { width: 12, height: 12, background: pal.panel, borderRadius: 2 } }), /* @__PURE__ */ React.createElement("div", { style: { width: 12, height: 12, background: pal.mu, borderRadius: 2 } })), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontWeight: 700, color: pal.tx } }, pal.name), active && /* @__PURE__ */ React.createElement("span", { style: { marginLeft: "auto", fontSize: 9, color: pal.hi } }, "ACTIVE"))
    );
  })));
}
function RecPanel(props) {
  var P = props.P, rec = props.rec, br = props.br, hasBR = br && br.enabled;
  var is = mkI(P), type = rec.type || "weekly";
  function set(k, v) {
    props.onChange(Object.assign({}, rec, { [k]: v }));
  }
  var typeOpts = [
    { id: "daily", lbl: "Daily" },
    { id: "weekly", lbl: "Weekly" },
    { id: "monthly-nth", lbl: "Monthly (weekday)" },
    { id: "monthly-date", lbl: "Monthly (date)" },
    { id: "annual", lbl: "Annual" },
    { id: "brWeek", lbl: "BR Week Only" }
  ];
  var previewList = useMemo(function() {
    if (!rec.rs || !rec.re) return [];
    try {
      return expand(rec, br).slice(0, 6);
    } catch (e) {
      return [];
    }
  }, [rec.type, rec.iv, rec.dow, rec.dows, rec.nth, rec.dom, rec.amo, rec.ady, rec.brNum, rec.dur, rec.rs, rec.re, rec.brf, br]);
  var total = useMemo(function() {
    if (!rec.rs || !rec.re) return 0;
    try {
      return expand(rec, br).length;
    } catch (e) {
      return 0;
    }
  }, [rec.type, rec.iv, rec.dow, rec.dows, rec.nth, rec.dom, rec.amo, rec.ady, rec.brNum, rec.dur, rec.rs, rec.re, rec.brf, br]);
  return /* @__PURE__ */ React.createElement("div", { style: { background: P.bg, border: "1px solid " + P.bd2, borderRadius: 4, padding: 12, marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: P.hi, fontWeight: 700, letterSpacing: 1, marginBottom: 10 } }, "RECURRENCE"), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 10 } }, /* @__PURE__ */ React.createElement(Label, { P }, "PATTERN"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", columnGap: 4, rowGap: 4 } }, typeOpts.map(function(t) {
    var active = type === t.id;
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        key: t.id,
        style: { padding: "4px 10px", borderRadius: 3, cursor: "pointer", fontSize: 10, fontWeight: 600, border: "1px solid " + (active ? P.hi : P.bd2), background: active ? P.hi + "22" : P.panel, color: active ? P.hi : P.mu },
        onClick: function() {
          set("type", t.id);
        }
      },
      t.lbl
    );
  }))), type === "daily" && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", columnGap: 8, marginBottom: 10 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: P.mu } }, "Every"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "number",
      min: 1,
      max: 365,
      value: rec.iv || 1,
      onChange: function(e) {
        set("iv", +e.target.value);
      },
      style: Object.assign({}, is, { width: 60 })
    }
  ), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: P.mu } }, "day(s)")), type === "weekly" && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", columnGap: 8, marginBottom: 8 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: P.mu } }, "Every"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "number",
      min: 1,
      max: 52,
      value: rec.iv || 1,
      onChange: function(e) {
        set("iv", +e.target.value);
      },
      style: Object.assign({}, is, { width: 60 })
    }
  ), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: P.mu } }, "week(s)")), /* @__PURE__ */ React.createElement(DowPick, { P, label: "ON", value: rec.dows || [1], onChange: function(v) {
    set("dows", v);
  }, multi: true })), type === "monthly-nth" && /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 10 } }, /* @__PURE__ */ React.createElement(Fld, { P, label: "OCCURRENCE" }, /* @__PURE__ */ React.createElement("select", { value: rec.nth != null ? rec.nth : 1, onChange: function(e) {
    set("nth", +e.target.value);
  }, style: is }, /* @__PURE__ */ React.createElement("option", { value: 1 }, "1st"), /* @__PURE__ */ React.createElement("option", { value: 2 }, "2nd"), /* @__PURE__ */ React.createElement("option", { value: 3 }, "3rd"), /* @__PURE__ */ React.createElement("option", { value: 4 }, "4th"), /* @__PURE__ */ React.createElement("option", { value: -1 }, "Last"))), /* @__PURE__ */ React.createElement(Fld, { P, label: "WEEKDAY" }, /* @__PURE__ */ React.createElement("select", { value: rec.dow != null ? rec.dow : 1, onChange: function(e) {
    set("dow", +e.target.value);
  }, style: is }, DOWF.map(function(d, i) {
    return /* @__PURE__ */ React.createElement("option", { key: i, value: i }, d);
  })))), type === "monthly-date" && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", columnGap: 8, marginBottom: 10 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: P.mu } }, "Day"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "number",
      min: 1,
      max: 31,
      value: rec.dom || 1,
      onChange: function(e) {
        set("dom", +e.target.value);
      },
      style: Object.assign({}, is, { width: 60 })
    }
  ), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: P.mu } }, "of every"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "number",
      min: 1,
      max: 12,
      value: rec.iv || 1,
      onChange: function(e) {
        set("iv", +e.target.value);
      },
      style: Object.assign({}, is, { width: 60 })
    }
  ), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: P.mu } }, "month(s)")), type === "annual" && /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 10 } }, /* @__PURE__ */ React.createElement(Fld, { P, label: "MONTH" }, /* @__PURE__ */ React.createElement("select", { value: rec.amo || 0, onChange: function(e) {
    set("amo", +e.target.value);
  }, style: is }, MLONG.map(function(m, i) {
    return /* @__PURE__ */ React.createElement("option", { key: i, value: i }, m);
  }))), /* @__PURE__ */ React.createElement(Fld, { P, label: "DAY" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "number",
      min: 1,
      max: 31,
      value: rec.ady || 1,
      onChange: function(e) {
        set("ady", +e.target.value);
      },
      style: is
    }
  ))), type === "brWeek" && !hasBR && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "#fca5a5", padding: "6px 8px", background: "#7f1d1d22", borderRadius: 3, marginBottom: 8 } }, "Configure Battle Rhythm in Options first."), type === "brWeek" && hasBR && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Label, { P }, "WHICH BR WEEK"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", columnGap: 5, rowGap: 5, marginBottom: 8 } }, br.labels.map(function(lbl, i) {
    var color = br.colors[i] || P.panel, active = (rec.brNum || 1) === i + 1;
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        key: i,
        style: { flex: 1, minWidth: 60, padding: "6px 4px", textAlign: "center", borderRadius: 3, cursor: "pointer", border: "1px solid " + (active ? color : P.bd2), background: active ? color + "33" : P.panel },
        onClick: function() {
          set("brNum", i + 1);
        }
      },
      /* @__PURE__ */ React.createElement("div", { style: { width: 6, height: 6, borderRadius: "50%", background: color, margin: "0 auto 3px" } }),
      /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, fontWeight: 700, color: active ? color : P.mu } }, lbl)
    );
  })), /* @__PURE__ */ React.createElement(DowPick, { P, label: "ON DAY", value: rec.dow != null ? rec.dow : 2, onChange: function(v) {
    set("dow", v);
  }, multi: false })), hasBR && type !== "brWeek" && /* @__PURE__ */ React.createElement("div", { style: { borderTop: "1px solid " + P.bd, paddingTop: 10, marginTop: 6, marginBottom: 4 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", columnGap: 8, marginBottom: 6 } }, /* @__PURE__ */ React.createElement(
    Tog,
    {
      P,
      on: !!rec.brf,
      onClick: function() {
        props.onChange(Object.assign({}, rec, { brf: rec.brf ? null : [] }));
      }
    }
  ), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, fontWeight: 600, color: rec.brf ? P.hi : P.mu } }, "Assign to BR Week"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, color: P.dim, marginLeft: 6 } }, "only fire in selected BR weeks"))), rec.brf && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", columnGap: 5, rowGap: 5 } }, br.labels.map(function(lbl, i) {
    var color = br.colors[i] || P.panel;
    var bwf = rec.brf || [];
    var active = bwf.indexOf(i + 1) !== -1;
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        key: i,
        style: { flex: 1, minWidth: 60, padding: "6px 4px", textAlign: "center", borderRadius: 3, cursor: "pointer", border: "1px solid " + (active ? color : P.bd2), background: active ? color + "33" : P.panel },
        onClick: function() {
          var next = bwf.slice(), pos = next.indexOf(i + 1);
          if (pos !== -1) next.splice(pos, 1);
          else next.push(i + 1);
          props.onChange(Object.assign({}, rec, { brf: next }));
        }
      },
      /* @__PURE__ */ React.createElement("div", { style: { width: 6, height: 6, borderRadius: "50%", background: color, margin: "0 auto 3px" } }),
      /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, fontWeight: 700, color: active ? color : P.mu } }, lbl)
    );
  }))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "80px 1fr 1fr", columnGap: 8, marginTop: 10 } }, /* @__PURE__ */ React.createElement(Fld, { P, label: "DURATION (d)" }, /* @__PURE__ */ React.createElement("input", { type: "number", min: 1, max: 365, value: rec.dur || 1, onChange: function(e) {
    set("dur", +e.target.value);
  }, style: is })), /* @__PURE__ */ React.createElement(Fld, { P, label: "FROM" }, /* @__PURE__ */ React.createElement("input", { type: "date", value: rec.rs || "", onChange: function(e) {
    set("rs", e.target.value);
  }, style: is })), /* @__PURE__ */ React.createElement(Fld, { P, label: "UNTIL" }, /* @__PURE__ */ React.createElement("input", { type: "date", value: rec.re || "", onChange: function(e) {
    set("re", e.target.value);
  }, style: is }))), /* @__PURE__ */ React.createElement("div", { style: { background: P.panel, borderRadius: 3, padding: "6px 8px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 4 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, color: P.dim, fontWeight: 600 } }, "PREVIEW"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, fontWeight: 700, color: total > 0 ? P.hi : "#fca5a5" } }, total, " instance", total !== 1 ? "s" : "")), previewList.length > 0 ? /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", columnGap: 4, rowGap: 3 } }, previewList.map(function(inst, i) {
    return /* @__PURE__ */ React.createElement("span", { key: i, style: { fontSize: 8, color: P.mu, background: P.bg, borderRadius: 2, padding: "1px 5px" } }, hdate(pkey(inst.sd)));
  }), total > 6 && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 8, color: P.dim } }, "+", total - 6, " more")) : /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, color: P.dim } }, rec.rs && rec.re ? "No matches." : "Set date range above.")));
}
function EvModal(props) {
  var P = props.P, mode = props.mode, lanes = props.lanes, cats = props.cats, br = props.br;
  var is = mkI(P);
  var today = /* @__PURE__ */ new Date(), todayStr = dkey(today);
  var nextYr = dkey(new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()));
  var [f, setF] = useState(props.init);
  var [isRec, setIsRec] = useState(!!(props.init && props.init.type));
  var fileRef = useRef(null);
  function setF2(k, v) {
    setF(function(p) {
      return Object.assign({}, p, { [k]: v });
    });
  }
  var availLanes = lanes.filter(function(l) {
    return !l.locked || mode === "edit" && props.init && props.init.laneId === l.id;
  });
  var cat = cats.find(function(c) {
    return c.id === f.catId;
  });
  var rd = {
    type: f.type || "weekly",
    iv: f.iv || 1,
    dow: f.dow != null ? f.dow : 1,
    dows: f.dows || [1],
    nth: f.nth != null ? f.nth : 1,
    dom: f.dom || 1,
    amo: f.amo || 0,
    ady: f.ady || 1,
    brNum: f.brNum || 1,
    dur: f.dur || 1,
    rs: f.rs || todayStr,
    re: f.re || nextYr,
    brf: f.brf || null
  };
  function handleRec(v) {
    setF(function(p) {
      return Object.assign({}, p, v);
    });
  }
  function toggleRec() {
    var next = !isRec;
    setIsRec(next);
    if (next) {
      setF(function(p) {
        var defaults = { type: "weekly", iv: 1, dow: 1, dows: [1], nth: 1, dom: 1, amo: 0, ady: 1, brNum: 1, dur: 1, rs: todayStr, re: nextYr, brf: null };
        return Object.assign(defaults, p);
      });
    }
  }
  function addFiles(e) {
    Array.from(e.target.files).forEach(function(file) {
      var r = new FileReader();
      r.onload = function(ev) {
        setF(function(p) {
          var ex = (p.files || []).filter(function(x) {
            return x.name !== file.name;
          });
          var newFile = { name: file.name, size: file.size, data: ev.target.result };
          return Object.assign({}, p, { files: ex.concat([newFile]) });
        });
      };
      r.readAsDataURL(file);
    });
  }
  function save() {
    if (!f.title || !f.title.trim()) {
      alert("Title required.");
      return;
    }
    if (!availLanes.find(function(l) {
      return l.id === f.laneId;
    })) {
      alert("Lane is locked.");
      return;
    }
    if (isRec) {
      if (!rd.rs || !rd.re) {
        alert("Date range required.");
        return;
      }
      if (rd.re < rd.rs) {
        alert("End must be after start.");
        return;
      }
      props.onSave(Object.assign({}, f, rd, { isRecurringRule: true }));
    } else {
      if (!f.sd || !f.ed) {
        alert("Dates required.");
        return;
      }
      if (f.ed < f.sd) {
        alert("End >= start.");
        return;
      }
      props.onSave(Object.assign({}, f, { isRecurringRule: false }));
    }
  }
  var brRowBg = f.isBR ? "#1d4ed822" : P.panel;
  var brRowBd = f.isBR ? "#60a5fa" : P.bd2;
  var recRowBg = isRec ? P.hi + "18" : P.panel;
  var recRowBd = isRec ? P.hi : P.bd2;
  return /* @__PURE__ */ React.createElement(Mdl, { P, title: mode === "create" ? "New Event" : "Edit Event", sub: "Toggle recurrence for repeating events", onClose: props.onClose, w: 540 }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 12 } }, /* @__PURE__ */ React.createElement(Fld, { P, label: "TITLE", col: "1/-1" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      autoFocus: true,
      value: f.title || "",
      placeholder: "Event name",
      style: is,
      onChange: function(e) {
        setF2("title", e.target.value);
      }
    }
  )), /* @__PURE__ */ React.createElement(Fld, { P, label: "LANE" }, /* @__PURE__ */ React.createElement("select", { value: f.laneId || "", style: is, onChange: function(e) {
    setF2("laneId", e.target.value);
  } }, availLanes.map(function(l) {
    return /* @__PURE__ */ React.createElement("option", { key: l.id, value: l.id }, l.label);
  }))), /* @__PURE__ */ React.createElement(Fld, { P, label: "CATEGORY" }, /* @__PURE__ */ React.createElement("select", { value: f.catId || "", style: is, onChange: function(e) {
    setF2("catId", e.target.value);
  } }, cats.map(function(c) {
    return /* @__PURE__ */ React.createElement("option", { key: c.id, value: c.id }, c.label + (c.isBR ? " [BR]" : ""));
  })), cat && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", columnGap: 5, marginTop: 4 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 9, height: 9, background: cat.color, borderRadius: 2 } }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, color: P.mu } }, cat.label + (cat.isBR ? " \xB7 BR" : ""))))), /* @__PURE__ */ React.createElement(
    "div",
    {
      style: { display: "flex", alignItems: "center", columnGap: 8, padding: "7px 10px", borderRadius: 3, marginBottom: 10, cursor: "pointer", background: brRowBg, border: "1px solid " + brRowBd },
      onClick: function() {
        setF2("isBR", !f.isBR);
      }
    },
    /* @__PURE__ */ React.createElement(Tog, { P, on: !!f.isBR, onClick: function(e) {
      e.stopPropagation();
      setF2("isBR", !f.isBR);
    } }),
    /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, fontWeight: 600, color: f.isBR ? "#60a5fa" : P.mu } }, "Battle Rhythm Event"),
    /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, color: P.dim, marginLeft: 4 } }, f.isBR ? "Will appear in BR exports" : "Tag to include in BR exports")
  ), /* @__PURE__ */ React.createElement(
    "div",
    {
      style: { display: "flex", alignItems: "center", columnGap: 8, padding: "7px 10px", borderRadius: 3, marginBottom: 10, cursor: "pointer", background: recRowBg, border: "1px solid " + recRowBd },
      onClick: toggleRec
    },
    /* @__PURE__ */ React.createElement(Tog, { P, on: isRec, onClick: function(e) {
      e.stopPropagation();
      toggleRec();
    } }),
    /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, fontWeight: 600, color: isRec ? P.hi : P.mu } }, "Recurring Event " + (isRec ? "ON" : "OFF")),
    isRec && f.type && /* @__PURE__ */ React.createElement("span", { style: { marginLeft: "auto", fontSize: 9, color: P.mu, fontStyle: "italic" } }, recLabel(Object.assign({}, rd, { id: 0 }), br))
  ), !isRec && /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", columnGap: 8 } }, /* @__PURE__ */ React.createElement(Fld, { P, label: "START DATE" }, /* @__PURE__ */ React.createElement("input", { type: "date", value: f.sd || "", style: is, onChange: function(e) {
    setF2("sd", e.target.value);
  } })), /* @__PURE__ */ React.createElement(Fld, { P, label: "START TIME" }, /* @__PURE__ */ React.createElement("input", { type: "time", value: f.st || "08:00", style: is, onChange: function(e) {
    setF2("st", e.target.value);
  } })), /* @__PURE__ */ React.createElement(Fld, { P, label: "END DATE" }, /* @__PURE__ */ React.createElement("input", { type: "date", value: f.ed || "", style: is, onChange: function(e) {
    setF2("ed", e.target.value);
  } })), /* @__PURE__ */ React.createElement(Fld, { P, label: "END TIME" }, /* @__PURE__ */ React.createElement("input", { type: "time", value: f.et || "17:00", style: is, onChange: function(e) {
    setF2("et", e.target.value);
  } }))), isRec && /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 8, marginBottom: 8 } }, /* @__PURE__ */ React.createElement(Fld, { P, label: "START TIME" }, /* @__PURE__ */ React.createElement("input", { type: "time", value: f.st || "08:00", style: is, onChange: function(e) {
    setF2("st", e.target.value);
  } })), /* @__PURE__ */ React.createElement(Fld, { P, label: "END TIME" }, /* @__PURE__ */ React.createElement("input", { type: "time", value: f.et || "09:00", style: is, onChange: function(e) {
    setF2("et", e.target.value);
  } }))), isRec && /* @__PURE__ */ React.createElement(RecPanel, { P, rec: rd, onChange: handleRec, br }), /* @__PURE__ */ React.createElement(Fld, { P, label: "LOCATION" }, /* @__PURE__ */ React.createElement("input", { value: f.loc || "", placeholder: "Where", style: is, onChange: function(e) {
    setF2("loc", e.target.value);
  } })), /* @__PURE__ */ React.createElement(Fld, { P, label: "ATTENDEES" }, /* @__PURE__ */ React.createElement("textarea", { value: f.att || "", rows: 2, placeholder: "Names, units", style: Object.assign({}, is, { resize: "vertical" }), onChange: function(e) {
    setF2("att", e.target.value);
  } })), /* @__PURE__ */ React.createElement(Fld, { P, label: "NOTES" }, /* @__PURE__ */ React.createElement("textarea", { value: f.notes || "", rows: 2, style: Object.assign({}, is, { resize: "vertical" }), onChange: function(e) {
    setF2("notes", e.target.value);
  } })), /* @__PURE__ */ React.createElement(Fld, { P, label: "ATTACHMENTS" }, /* @__PURE__ */ React.createElement(
    "div",
    {
      style: { border: "1px dashed " + P.bd2, borderRadius: 3, padding: 8, background: P.card, cursor: "pointer", textAlign: "center" },
      onClick: function() {
        if (fileRef.current) fileRef.current.click();
      }
    },
    /* @__PURE__ */ React.createElement("input", { ref: fileRef, type: "file", multiple: true, style: { display: "none" }, onChange: addFiles }),
    /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: P.dim } }, "Click to attach files")
  ), (f.files || []).length > 0 && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 4, display: "flex", flexDirection: "column", rowGap: 2 } }, (f.files || []).map(function(file) {
    return /* @__PURE__ */ React.createElement("div", { key: file.name, style: { display: "flex", alignItems: "center", columnGap: 6, background: P.panel, borderRadius: 2, padding: "3px 6px" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: P.tx, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, file.name), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, color: P.dim } }, (file.size / 1024).toFixed(0), "KB"), /* @__PURE__ */ React.createElement(
      "button",
      {
        style: { background: "none", border: "none", color: "#fca5a5", cursor: "pointer", padding: 0 },
        onClick: function() {
          setF2("files", (f.files || []).filter(function(x) {
            return x.name !== file.name;
          }));
        }
      },
      "x"
    ));
  }))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", columnGap: 6, marginTop: 4 } }, /* @__PURE__ */ React.createElement(PBtn, { P, onClick: save, full: true }, mode === "create" ? isRec ? "Create Recurring" : "Add Event" : isRec ? "Save Rule" : "Save"), mode === "edit" && props.onDelete && /* @__PURE__ */ React.createElement(DBtn, { onClick: props.onDelete }, "Delete"), /* @__PURE__ */ React.createElement(SBtn, { P, onClick: props.onClose }, "Cancel")));
}
function EvDetail(props) {
  var P = props.P, ev = props.ev, lane = props.lane, cat = props.cat;
  var dur = dff(pkey(ev.sd), pkey(ev.ed)) + 1;
  var isBREv = ev.isBR || cat && cat.isBR;
  var rows = [
    ["Lane", lane && lane.label],
    ["Dates", hdate(pkey(ev.sd)) + (dur > 1 ? " - " + hdate(pkey(ev.ed)) : "") + " (" + dur + "d)"],
    ["Time", ev.st && ev.et ? ev.st + " - " + ev.et : null],
    ["Location", ev.loc],
    ["Attendees", ev.att],
    ["Notes", ev.notes]
  ].filter(function(r) {
    return !!r[1];
  });
  return /* @__PURE__ */ React.createElement(Mdl, { P, title: "Event Details", onClose: props.onClose, w: 420 }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", columnGap: 10, marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 6, height: 40, background: cat && cat.color || "#6B7280", borderRadius: 3, flexShrink: 0 } }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: P.tx } }, ev.title), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", columnGap: 6, marginTop: 3 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: cat && cat.color || P.mu } }, cat && cat.label), ev.isRec && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, background: P.panel, color: P.hi, padding: "1px 5px", borderRadius: 2 } }, "recurring"), isBREv && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, background: "#1d4ed822", color: "#60a5fa", padding: "1px 5px", borderRadius: 2 } }, "BR")))), ev.isRec && props.recRule && /* @__PURE__ */ React.createElement("div", { style: { background: P.panel, borderRadius: 3, padding: "5px 8px", marginBottom: 10, fontSize: 9, color: P.mu } }, /* @__PURE__ */ React.createElement("span", { style: { color: P.hi } }, "Pattern: "), recLabel(props.recRule, props.br), " \xB7 until " + hdate(pkey(props.recRule.re))), rows.map(function(r) {
    return /* @__PURE__ */ React.createElement("div", { key: r[0], style: { marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: P.dim, fontWeight: 600, letterSpacing: 0.5 } }, r[0].toUpperCase()), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: P.tx, marginTop: 1, lineHeight: 1.5 } }, r[1]));
  }), (ev.files || []).length > 0 && /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: P.dim, fontWeight: 600, marginBottom: 4 } }, "ATTACHMENTS"), (ev.files || []).map(function(fi) {
    return /* @__PURE__ */ React.createElement("div", { key: fi.name, style: { display: "flex", alignItems: "center", columnGap: 6, background: P.panel, borderRadius: 2, padding: "3px 8px", marginBottom: 2 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: P.mu, flex: 1 } }, fi.name), fi.data && /* @__PURE__ */ React.createElement("a", { href: fi.data, download: fi.name, style: { fontSize: 9, color: P.hi, textDecoration: "none" } }, "DL"));
  })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", columnGap: 6, marginTop: 12 } }, /* @__PURE__ */ React.createElement(PBtn, { P, onClick: props.onEdit, full: true }, ev.isRec ? "Edit Rule" : "Edit"), /* @__PURE__ */ React.createElement(SBtn, { P, onClick: props.onClose }, "Close")));
}
function LanesModal(props) {
  var P = props.P, is = mkI(P);
  var [rows, setRows] = useState(props.lanes.map(function(l) {
    return Object.assign({}, l);
  }));
  var [nv, setNv] = useState("");
  function add() {
    if (!nv.trim()) return;
    setRows(function(p) {
      return p.concat([{ id: "ln" + NLID++, label: nv.trim().toUpperCase(), locked: false }]);
    });
    setNv("");
  }
  function rm(id) {
    setRows(function(p) {
      return p.filter(function(l) {
        return l.id !== id;
      });
    });
  }
  function mv(i, d) {
    setRows(function(p) {
      var j = i + d;
      if (j < 0 || j >= p.length) return p;
      var a = p.slice(), t = a[i];
      a[i] = a[j];
      a[j] = t;
      return a;
    });
  }
  function upd(id, k, v) {
    setRows(function(p) {
      return p.map(function(l) {
        return l.id === id ? Object.assign({}, l, { [k]: v }) : l;
      });
    });
  }
  return /* @__PURE__ */ React.createElement(Mdl, { P, title: "Swim Lanes", onClose: props.onClose, w: 460 }, rows.map(function(lane, i) {
    return /* @__PURE__ */ React.createElement("div", { key: lane.id, style: { display: "flex", alignItems: "center", columnGap: 5, marginBottom: 5, background: P.panel, borderRadius: 3, padding: "4px 6px", border: "1px solid " + (lane.locked ? "#DC262633" : P.bd) } }, /* @__PURE__ */ React.createElement("div", { style: { width: 4, height: 24, background: lane.locked ? "#DC2626" : "#059669", borderRadius: 2, flexShrink: 0 } }), /* @__PURE__ */ React.createElement(
      "input",
      {
        value: lane.label,
        style: Object.assign({}, is, { flex: 1, padding: "3px 6px", fontSize: 11, background: P.panel }),
        onChange: function(e) {
          upd(lane.id, "label", e.target.value.toUpperCase());
        }
      }
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        style: { border: "1px solid " + P.bd2, borderRadius: 2, color: lane.locked ? "#fca5a5" : P.mu, cursor: "pointer", fontSize: 9, padding: "2px 5px", background: "transparent", whiteSpace: "nowrap" },
        onClick: function() {
          upd(lane.id, "locked", !lane.locked);
        }
      },
      lane.locked ? "LOCKED" : "OPEN"
    ), /* @__PURE__ */ React.createElement("button", { style: { background: "none", border: "none", color: P.mu, cursor: "pointer", fontSize: 10, padding: "1px 3px" }, onClick: function() {
      mv(i, -1);
    } }, "^"), /* @__PURE__ */ React.createElement("button", { style: { background: "none", border: "none", color: P.mu, cursor: "pointer", fontSize: 10, padding: "1px 3px" }, onClick: function() {
      mv(i, 1);
    } }, "v"), /* @__PURE__ */ React.createElement("button", { style: { background: "none", border: "none", color: "#fca5a5", cursor: "pointer", fontSize: 13, padding: "0 2px" }, onClick: function() {
      rm(lane.id);
    } }, "x"));
  }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", columnGap: 6, margin: "8px 0 14px" } }, /* @__PURE__ */ React.createElement("input", { value: nv, placeholder: "New lane name", style: Object.assign({}, is, { flex: 1 }), onChange: function(e) {
    setNv(e.target.value);
  }, onKeyDown: function(e) {
    if (e.key === "Enter") add();
  } }), /* @__PURE__ */ React.createElement(SBtn, { P, onClick: add }, "Add")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", columnGap: 6 } }, /* @__PURE__ */ React.createElement(PBtn, { P, onClick: function() {
    props.onSave(rows);
  }, full: true }, "Save"), /* @__PURE__ */ React.createElement(SBtn, { P, onClick: props.onClose }, "Cancel")));
}
function CatsModal(props) {
  var P = props.P, is = mkI(P);
  var [rows, setRows] = useState(props.cats.map(function(c) {
    return Object.assign({}, c);
  }));
  var [nv, setNv] = useState(""), [nc, setNc] = useState(COLORS[0]), [nBR, setNBR] = useState(false);
  function add() {
    if (!nv.trim()) return;
    setRows(function(p) {
      return p.concat([{ id: "cat" + NCID++, label: nv.trim(), color: nc, text: isDark(nc) ? "#fff" : "#1a1a1a", isBR: nBR }]);
    });
    setNv("");
  }
  function rm(id) {
    setRows(function(p) {
      return p.filter(function(c) {
        return c.id !== id;
      });
    });
  }
  function upd(id, k, v) {
    setRows(function(p) {
      return p.map(function(c) {
        if (c.id !== id) return c;
        if (k === "color") return Object.assign({}, c, { color: v, text: isDark(v) ? "#fff" : "#1a1a1a" });
        return Object.assign({}, c, { [k]: v });
      });
    });
  }
  return /* @__PURE__ */ React.createElement(Mdl, { P, title: "Categories", onClose: props.onClose, w: 480 }, rows.map(function(cat) {
    return /* @__PURE__ */ React.createElement("div", { key: cat.id, style: { display: "flex", alignItems: "center", columnGap: 6, marginBottom: 5, background: P.panel, borderRadius: 3, padding: "4px 8px" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 24, height: 24, background: cat.color, borderRadius: 3, flexShrink: 0, position: "relative", overflow: "hidden", cursor: "pointer", border: "1px solid rgba(255,255,255,0.2)" } }, /* @__PURE__ */ React.createElement("input", { type: "color", value: cat.color, style: { position: "absolute", top: 0, right: 0, bottom: 0, left: 0, opacity: 0, cursor: "pointer", width: "100%", height: "100%" }, onChange: function(e) {
      upd(cat.id, "color", e.target.value);
    } })), /* @__PURE__ */ React.createElement("input", { value: cat.label, style: Object.assign({}, is, { flex: 1, padding: "3px 6px", fontSize: 11 }), onChange: function(e) {
      upd(cat.id, "label", e.target.value);
    } }), /* @__PURE__ */ React.createElement("label", { style: { display: "flex", alignItems: "center", columnGap: 3, fontSize: 9, color: P.mu, cursor: "pointer" } }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: !!cat.isBR, style: { width: 12, height: 12 }, onChange: function(e) {
      upd(cat.id, "isBR", e.target.checked);
    } }), "BR"), /* @__PURE__ */ React.createElement("div", { style: { background: cat.color, color: cat.text, padding: "2px 6px", borderRadius: 2, fontSize: 9, fontWeight: 700, whiteSpace: "nowrap", minWidth: 50, textAlign: "center" } }, cat.label), /* @__PURE__ */ React.createElement("button", { style: { background: "none", border: "none", color: "#fca5a5", cursor: "pointer", fontSize: 13, padding: "0 2px" }, onClick: function() {
      rm(cat.id);
    } }, "x"));
  }), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", columnGap: 4, rowGap: 4, marginBottom: 6 } }, COLORS.map(function(col) {
    return /* @__PURE__ */ React.createElement("div", { key: col, style: { width: 20, height: 20, background: col, borderRadius: 2, cursor: "pointer", border: "2px solid " + (nc === col ? "#fff" : "transparent") }, onClick: function() {
      setNc(col);
    } });
  }), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", width: 20, height: 20, borderRadius: 2, overflow: "hidden", border: "2px solid rgba(255,255,255,0.3)", background: nc } }, /* @__PURE__ */ React.createElement("input", { type: "color", value: nc, style: { position: "absolute", top: 0, right: 0, bottom: 0, left: 0, opacity: 0, cursor: "pointer", width: "100%", height: "100%" }, onChange: function(e) {
    setNc(e.target.value);
  } }))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", columnGap: 6 } }, /* @__PURE__ */ React.createElement("input", { value: nv, placeholder: "Category name", style: Object.assign({}, is, { flex: 1 }), onChange: function(e) {
    setNv(e.target.value);
  }, onKeyDown: function(e) {
    if (e.key === "Enter") add();
  } }), /* @__PURE__ */ React.createElement("label", { style: { display: "flex", alignItems: "center", columnGap: 3, fontSize: 9, color: P.mu, cursor: "pointer", whiteSpace: "nowrap" } }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: nBR, style: { width: 12, height: 12 }, onChange: function(e) {
    setNBR(e.target.checked);
  } }), "BR"), /* @__PURE__ */ React.createElement(SBtn, { P, onClick: add }, "Add"))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", columnGap: 6, marginTop: 12 } }, /* @__PURE__ */ React.createElement(PBtn, { P, onClick: function() {
    props.onSave(rows);
  }, full: true }, "Save"), /* @__PURE__ */ React.createElement(SBtn, { P, onClick: props.onClose }, "Cancel")));
}
function BRModal(props) {
  var P = props.P, is = mkI(P);
  var [cfg, setCfg] = useState(Object.assign({}, DEF_BR, props.br));
  function set(k, v) {
    setCfg(function(p) {
      return Object.assign({}, p, { [k]: v });
    });
  }
  function setCL(n) {
    var la = [], co = [];
    for (var i = 0; i < n; i++) {
      la.push(cfg.labels[i] || "BR" + (i + 1));
      co.push(cfg.colors[i] || COLORS[i % COLORS.length]);
    }
    setCfg(function(p) {
      return Object.assign({}, p, { cycleLen: n, labels: la, colors: co });
    });
  }
  function updL(i, v) {
    var a = cfg.labels.slice();
    a[i] = v;
    setCfg(function(p) {
      return Object.assign({}, p, { labels: a });
    });
  }
  function updC(i, v) {
    var a = cfg.colors.slice();
    a[i] = v;
    setCfg(function(p) {
      return Object.assign({}, p, { colors: a });
    });
  }
  var today = /* @__PURE__ */ new Date();
  var preview = brMonthWeeks(today.getFullYear(), today.getMonth(), cfg.enabled ? cfg : Object.assign({}, cfg, { enabled: true }));
  return /* @__PURE__ */ React.createElement(Mdl, { P, title: "Battle Rhythm", onClose: props.onClose, w: 480 }, /* @__PURE__ */ React.createElement(
    "div",
    {
      style: { display: "flex", alignItems: "center", columnGap: 10, marginBottom: 16, background: P.panel, borderRadius: 4, padding: "8px 12px", cursor: "pointer", border: "1px solid " + (cfg.enabled ? P.hi : P.bd2) },
      onClick: function() {
        set("enabled", !cfg.enabled);
      }
    },
    /* @__PURE__ */ React.createElement(Tog, { P, on: cfg.enabled, onClick: function(e) {
      e.stopPropagation();
      set("enabled", !cfg.enabled);
    } }),
    /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, fontWeight: 700, color: cfg.enabled ? P.hi : P.mu } }, "Battle Rhythm " + (cfg.enabled ? "Enabled" : "Disabled")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: P.dim } }, "Shows BR week row on timeline and enables BR exports"))
  ), /* @__PURE__ */ React.createElement("div", { style: { opacity: cfg.enabled ? 1 : 0.4, pointerEvents: cfg.enabled ? "auto" : "none" } }, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement(Label, { P }, "ANCHOR DAY"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", columnGap: 4 } }, DOWF.map(function(d, i) {
    var a = cfg.anchorDow === i;
    return /* @__PURE__ */ React.createElement("div", { key: i, style: { flex: 1, padding: "5px 2px", textAlign: "center", borderRadius: 3, cursor: "pointer", fontSize: 9, fontWeight: 700, border: "1px solid " + (a ? P.hi : P.bd2), background: a ? P.hi + "22" : P.panel, color: a ? P.hi : P.mu }, onClick: function() {
      set("anchorDow", i);
    } }, d.slice(0, 3).toUpperCase());
  })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: P.dim, marginTop: 4 } }, "Week of 1st " + DOWF[cfg.anchorDow] + " = BR1, 2nd = BR2, etc.")), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement(Label, { P }, "CYCLE LENGTH"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", columnGap: 6 } }, [2, 3, 4, 5].map(function(n) {
    var a = cfg.cycleLen === n;
    return /* @__PURE__ */ React.createElement("div", { key: n, style: { flex: 1, padding: "6px", textAlign: "center", borderRadius: 3, cursor: "pointer", border: "1px solid " + (a ? P.hi : P.bd2), background: a ? P.hi + "22" : P.panel, fontSize: 14, fontWeight: 700, color: a ? P.hi : P.mu }, onClick: function() {
      setCL(n);
    } }, n);
  }))), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement(Label, { P }, "WEEK LABELS + COLORS"), cfg.labels.map(function(label, i) {
    return /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", alignItems: "center", columnGap: 8, marginBottom: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 26, height: 26, borderRadius: 3, flexShrink: 0, overflow: "hidden", background: cfg.colors[i] || P.panel, border: "1px solid rgba(255,255,255,0.2)", position: "relative", cursor: "pointer" } }, /* @__PURE__ */ React.createElement("input", { type: "color", value: cfg.colors[i] || "#2563EB", style: { position: "absolute", top: 0, right: 0, bottom: 0, left: 0, opacity: 0, cursor: "pointer", width: "100%", height: "100%" }, onChange: function(e) {
      updC(i, e.target.value);
    } })), /* @__PURE__ */ React.createElement("input", { value: label, style: Object.assign({}, is, { flex: 1, padding: "4px 6px", fontSize: 11 }), onChange: function(e) {
      updL(i, e.target.value);
    } }), /* @__PURE__ */ React.createElement("div", { style: { background: cfg.colors[i] || P.panel, color: "#fff", padding: "2px 8px", borderRadius: 2, fontSize: 9, fontWeight: 700, whiteSpace: "nowrap", minWidth: 60, textAlign: "center" } }, label || "BR" + (i + 1)));
  })), /* @__PURE__ */ React.createElement("div", { style: { background: P.panel, borderRadius: 4, padding: "8px 10px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: P.dim, fontWeight: 600, marginBottom: 6 } }, "PREVIEW \u2014 " + MONTHS[today.getMonth()] + " " + today.getFullYear()), preview.map(function(pw, i) {
    var ci = (pw.occ - 1) % cfg.cycleLen, color = cfg.colors[ci] || P.panel;
    return /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", alignItems: "center", columnGap: 8, marginBottom: 4 } }, /* @__PURE__ */ React.createElement("div", { style: { background: color, color: "#fff", padding: "2px 8px", borderRadius: 2, fontSize: 9, fontWeight: 700, minWidth: 50, textAlign: "center" } }, cfg.labels[ci] || "BR" + pw.occ), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: P.mu } }, "Week of " + hdate(pw.mon) + " \xB7 anchor: " + hdate(pw.anc)));
  }))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", columnGap: 6, marginTop: 14 } }, /* @__PURE__ */ React.createElement(PBtn, { P, onClick: function() {
    props.onSave(cfg);
  }, full: true }, "Save"), /* @__PURE__ */ React.createElement(SBtn, { P, onClick: props.onClose }, "Cancel")));
}
function PrintModal(props) {
  var P = props.P, is = mkI(P);
  var today = /* @__PURE__ */ new Date();
  var [pS, setPS] = useState(dkey(today));
  var [pE, setPE] = useState(dkey(addDays(today, 89)));
  var [hor, setHor] = useState("quarterly");
  var [paper, setPaper] = useState("tabloid");
  var [ori, setOri] = useState("landscape");
  var [catF, setCatF] = useState({});
  var [status, setStatus] = useState("");
  var pm = PAPERS.find(function(p) {
    return p.id === paper;
  }) || PAPERS[1];
  var pw = ori === "landscape" ? Math.max(pm.w, pm.h) : Math.min(pm.w, pm.h);
  var ph = ori === "landscape" ? Math.min(pm.w, pm.h) : Math.max(pm.w, pm.h);
  var minD = (HORIZONS.find(function(h) {
    return h.id === hor;
  }) || { min: 0 }).min;
  var filtered = useMemo(function() {
    if (!pS || !pE) return [];
    var rs = pkey(pS), re = pkey(pE);
    return props.evs.filter(function(ev) {
      var es = pkey(ev.sd), ee = pkey(ev.ed);
      if (ee < rs || es > re) return false;
      return dff(es, ee) >= minD && !catF[ev.catId];
    });
  }, [props.evs, pS, pE, minD, catF]);
  function buildHTML() {
    var rs = pkey(pS), re = pkey(pE), DPI = 96, M = 36, PW = Math.round(pw * DPI), PH = Math.round(ph * DPI), LL = 110;
    var cols = [];
    if (hor === "daily") {
      var d = new Date(rs);
      while (d <= re) {
        var v = ymd(d);
        cols.push({ lbl: MONTHS[v.m] + " " + v.d, s: new Date(d), e: new Date(d) });
        d = addDays(d, 1);
      }
    } else if (hor === "weekly") {
      var d = new Date(rs);
      while (d <= re) {
        var we = addDays(d, 6 - (d.getDay() || 7) + 7), ae = we > re ? re : we;
        cols.push({ lbl: MONTHS[ymd(d).m] + " " + ymd(d).d + "-" + ymd(ae).d, s: new Date(d), e: ae });
        d = addDays(ae, 1);
      }
    } else if (hor === "monthly") {
      var d = new Date(rs.getFullYear(), rs.getMonth(), 1);
      while (d <= re) {
        var me = new Date(d.getFullYear(), d.getMonth() + 1, 0), ae = me > re ? re : me, as2 = d < rs ? rs : d;
        cols.push({ lbl: MONTHS[ymd(d).m] + " " + d.getFullYear(), s: as2, e: ae });
        d = new Date(d.getFullYear(), d.getMonth() + 1, 1);
      }
    } else if (hor === "quarterly") {
      var d = new Date(rs.getFullYear(), Math.floor(rs.getMonth() / 3) * 3, 1);
      while (d <= re) {
        var qe = new Date(d.getFullYear(), d.getMonth() + 3, 0), ae = qe > re ? re : qe, as2 = d < rs ? rs : d;
        cols.push({ lbl: "Q" + (Math.floor(d.getMonth() / 3) + 1) + " " + d.getFullYear(), s: as2, e: ae });
        d = new Date(d.getFullYear(), d.getMonth() + 3, 1);
      }
    } else {
      var y = rs.getFullYear();
      while (y <= re.getFullYear()) {
        var ys = new Date(y, 0, 1), ye = new Date(y, 11, 31);
        cols.push({ lbl: "" + y, s: ys < rs ? rs : ys, e: ye > re ? re : ye });
        y++;
      }
    }
    var UW = PW - M * 2 - LL, CW = Math.max(30, Math.floor(UW / cols.length)), CPP = Math.max(1, Math.floor(UW / CW));
    var pages = [];
    for (var i = 0; i < cols.length; i += CPP) pages.push(cols.slice(i, i + CPP));
    var stacks = {};
    props.lanes.forEach(function(l) {
      stacks[l.id] = stackEvs(filtered.filter(function(e) {
        return e.laneId === l.id;
      }));
    });
    function lh(l) {
      return Math.max(24, Math.max.apply(null, [1].concat((stacks[l.id] || []).map(function(e) {
        return e.row + 1;
      }))) * (BH + 2) + BP * 2);
    }
    function evB(ev, col, cw) {
      var es = pkey(ev.sd), ee = pkey(ev.ed), tot = dff(col.s, col.e) + 1, cS = es < col.s ? col.s : es, cE = ee > col.e ? col.e : ee, off = dff(col.s, cS), len = dff(cS, cE) + 1;
      return { l: (off / tot * cw).toFixed(1), w: Math.max(4, len / tot * cw - 2).toFixed(1) };
    }
    var pgs = pages.map(function(pc, pi) {
      var nc = pc.length, cw = Math.floor(UW / nc), lt = 26;
      var hC = pc.map(function(col, ci) {
        return '<div style="position:absolute;left:' + (LL + ci * cw) + "px;top:0;width:" + cw + "px;height:26px;background:" + (ci % 2 === 0 ? "#1E3A5F" : "#0f2540") + ';border-right:1px solid #2a4a7f;display:flex;align-items:center;justify-content:center;overflow:hidden;"><span style="font-size:8px;font-weight:700;color:#C8A84B;">' + col.lbl + "</span></div>";
      }).join("");
      var lR = props.lanes.map(function(lane) {
        var h = lh(lane), rb = props.lanes.indexOf(lane) % 2 === 0 ? "#0f2540" : "#0A1628";
        var cC = pc.map(function(col, ci) {
          var bars = (stacks[lane.id] || []).filter(function(ev) {
            return pkey(ev.ed) >= col.s && pkey(ev.sd) <= col.e;
          }).map(function(ev) {
            var c = props.cats.find(function(x) {
              return x.id === ev.catId;
            }) || { color: "#6B7280", text: "#fff" };
            var b = evB(ev, col, cw);
            return '<div style="position:absolute;left:' + b.l + "px;width:" + b.w + "px;top:" + (BP + ev.row * (BH + 2)) + "px;height:" + BH + "px;background:" + c.color + ';border-radius:2px;overflow:hidden;display:flex;align-items:center;padding-left:3px;"><span style="font-size:7px;font-weight:700;color:' + c.text + ';white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + (ev.isRec ? "R " : "") + ev.title + "</span></div>";
          }).join("");
          return '<div style="position:absolute;left:' + (LL + ci * cw) + "px;top:" + lt + "px;width:" + cw + "px;height:" + h + "px;background:" + rb + ';border-right:1px solid #1a2f4a;position:relative;">' + bars + "</div>";
        }).join("");
        var lC = '<div style="position:absolute;left:0;top:' + lt + "px;width:" + LL + "px;height:" + h + "px;background:" + rb + ';border-right:2px solid #C8A84B;display:flex;align-items:center;padding:0 6px;"><span style="font-size:7px;font-weight:700;color:#C8A84B;">' + lane.label + "</span></div>";
        lt += h;
        return lC + cC;
      }).join("");
      return '<div style="width:' + PW + "px;height:" + PH + 'px;position:relative;overflow:hidden;background:#0A1628;page-break-after:always;"><div style="position:absolute;left:' + M + "px;top:" + M + "px;right:" + M + 'px;height:46px;display:flex;align-items:center;justify-content:space-between;border-bottom:2px solid #C8A84B;padding-bottom:5px;"><div><div style="font-size:7px;color:#C8A84B;font-weight:700;letter-spacing:3px;">U.S. ARMY</div><div style="font-size:10px;font-weight:700;color:#F0F4F8;">LONG RANGE TRAINING CALENDAR</div></div><div style="text-align:right;"><div style="font-size:9px;color:#C8A84B;font-weight:700;">' + props.unit + '</div><div style="font-size:7px;color:#8aabcc;">' + hdate(rs) + " to " + hdate(re) + " \u2014 Pg " + (pi + 1) + "/" + pages.length + '</div></div></div><div style="position:absolute;left:' + M + "px;top:" + (M + 50) + "px;width:" + (LL + nc * cw) + 'px;"><div style="position:relative;height:' + lt + 'px;"><div style="position:absolute;left:0;top:0;width:' + LL + 'px;height:26px;background:#1E3A5F;border-right:2px solid #C8A84B;border-bottom:2px solid #C8A84B;display:flex;align-items:center;justify-content:center;"><span style="font-size:7px;color:#C8A84B;">LANE</span></div>' + hC + lR + '</div></div><div style="position:absolute;left:' + M + "px;bottom:" + M + "px;right:" + M + 'px;height:18px;border-top:1px solid #1a2f4a;display:flex;align-items:center;justify-content:space-between;"><span style="font-size:7px;color:#4a6fa5;">UNCLASSIFIED</span><span style="font-size:7px;color:#4a6fa5;">' + pm.label + " " + ori + "</span></div></div>";
    }).join("");
    return '<!DOCTYPE html><html><head><meta charset="UTF-8"><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,sans-serif;background:#0A1628;}@media print{@page{size:' + pw + "in " + ph + "in;margin:0;}}</style></head><body>" + pgs + "</body></html>";
  }
  function doPrint() {
    setStatus("Opening...");
    setTimeout(function() {
      var html = buildHTML(), w = window.open("", "_blank");
      if (!w) {
        setStatus("Pop-up blocked.");
        return;
      }
      w.document.write(html);
      w.document.close();
      w.onload = function() {
        w.focus();
        w.print();
      };
      setStatus("Ready.");
    }, 60);
  }
  function doExport() {
    setStatus("Saving...");
    setTimeout(function() {
      var html = buildHTML(), a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([html], { type: "text/html" }));
      a.download = "LRTC_" + props.unit.replace(/\W/g, "_") + ".html";
      a.click();
      setStatus("Open in Chrome > Print > Save as PDF.");
    }, 60);
  }
  return /* @__PURE__ */ React.createElement(Mdl, { P, title: "Print / Export", onClose: props.onClose, w: 520 }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 12 } }, /* @__PURE__ */ React.createElement(Fld, { P, label: "START" }, /* @__PURE__ */ React.createElement("input", { type: "date", value: pS, style: is, onChange: function(e) {
    setPS(e.target.value);
  } })), /* @__PURE__ */ React.createElement(Fld, { P, label: "END" }, /* @__PURE__ */ React.createElement("input", { type: "date", value: pE, style: is, onChange: function(e) {
    setPE(e.target.value);
  } })), /* @__PURE__ */ React.createElement(Fld, { P, label: "HORIZON", col: "1/-1" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", columnGap: 4 } }, HORIZONS.map(function(h) {
    var a = hor === h.id;
    return /* @__PURE__ */ React.createElement("div", { key: h.id, style: { flex: 1, padding: "5px 4px", textAlign: "center", borderRadius: 3, cursor: "pointer", fontSize: 10, fontWeight: 600, border: "1px solid " + (a ? P.hi : P.bd2), background: a ? P.hi + "22" : P.panel, color: a ? P.hi : P.mu }, onClick: function() {
      setHor(h.id);
    } }, h.label);
  }))), /* @__PURE__ */ React.createElement(Fld, { P, label: "PAPER" }, /* @__PURE__ */ React.createElement("select", { value: paper, style: is, onChange: function(e) {
    setPaper(e.target.value);
  } }, PAPERS.map(function(p) {
    return /* @__PURE__ */ React.createElement("option", { key: p.id, value: p.id }, p.label);
  }))), /* @__PURE__ */ React.createElement(Fld, { P, label: "ORIENTATION" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", columnGap: 6 } }, ["landscape", "portrait"].map(function(o) {
    var a = ori === o;
    return /* @__PURE__ */ React.createElement("div", { key: o, style: { flex: 1, padding: "5px", textAlign: "center", borderRadius: 3, cursor: "pointer", border: "1px solid " + (a ? P.hi : P.bd2), background: a ? P.hi + "22" : P.panel, fontSize: 10, fontWeight: 600, color: a ? P.hi : P.mu }, onClick: function() {
      setOri(o);
    } }, o);
  })))), /* @__PURE__ */ React.createElement(Fld, { P, label: "HIDE CATEGORIES" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", columnGap: 4, rowGap: 4 } }, props.cats.map(function(cat) {
    var h = catF[cat.id];
    return /* @__PURE__ */ React.createElement("div", { key: cat.id, style: { padding: "3px 8px", borderRadius: 2, cursor: "pointer", background: h ? "#0f1e30" : cat.color, opacity: h ? 0.4 : 1 }, onClick: function() {
      setCatF(function(p) {
        return Object.assign({}, p, { [cat.id]: !p[cat.id] });
      });
    } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, fontWeight: 700, color: h ? P.mu : cat.text } }, cat.label));
  }))), /* @__PURE__ */ React.createElement("div", { style: { background: P.panel, borderRadius: 3, padding: "6px 10px", marginBottom: 10, fontSize: 10, color: P.mu } }, filtered.length, " of ", props.evs.length, " events in range"), status && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: P.hi, marginBottom: 8 } }, status), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", columnGap: 6 } }, /* @__PURE__ */ React.createElement(PBtn, { P, onClick: doPrint, full: true }, "Print"), /* @__PURE__ */ React.createElement(SBtn, { P, onClick: doExport }, "Export HTML/PDF"), /* @__PURE__ */ React.createElement(SBtn, { P, onClick: props.onClose }, "Cancel")));
}
function BRProdModal(props) {
  var P = props.P, is = mkI(P);
  var today = /* @__PURE__ */ new Date();
  var [pS, setPS] = useState(dkey(new Date(today.getFullYear(), today.getMonth(), 1)));
  var [pE, setPE] = useState(dkey(new Date(today.getFullYear(), today.getMonth() + 3, 0)));
  var [fmt, setFmt] = useState("both");
  var [paper, setPaper] = useState("tabloid");
  var [ori, setOri] = useState("landscape");
  var [status, setStatus] = useState("");
  var brEvs = useMemo(function() {
    if (!pS || !pE) return [];
    var rs = pkey(pS), re = pkey(pE);
    return props.evs.filter(function(ev) {
      var cat = props.cats.find(function(c) {
        return c.id === ev.catId;
      });
      if (!ev.isBR && !(cat && cat.isBR)) return false;
      return pkey(ev.ed) >= rs && pkey(ev.sd) <= re;
    });
  }, [props.evs, props.cats, pS, pE]);
  var byWk = useMemo(function() {
    if (!props.br || !props.br.enabled) return {};
    var map = {};
    brEvs.forEach(function(ev) {
      var b = brForDate(pkey(ev.sd), props.br);
      var lbl = b ? b.label : "Other";
      if (!map[lbl]) {
        var occ = b ? b.occ : 1;
        var ci = (occ - 1) % props.br.cycleLen;
        map[lbl] = { lbl, color: props.br.colors[ci] || P.panel, evs: [] };
      }
      map[lbl].evs.push(ev);
    });
    return map;
  }, [brEvs, props.br]);
  var pm = PAPERS.find(function(p) {
    return p.id === paper;
  }) || PAPERS[1];
  var pw = ori === "landscape" ? Math.max(pm.w, pm.h) : Math.min(pm.w, pm.h);
  var ph2 = ori === "landscape" ? Math.min(pm.w, pm.h) : Math.max(pm.w, pm.h);
  function bldInfographic() {
    var PW = Math.round(pw * 96), PH = Math.round(ph2 * 96), M = 36;
    var lbls = props.br && props.br.enabled ? props.br.labels : [];
    var cw = Math.floor((PW - M * 2) / Math.max(1, lbls.length));
    var cols = lbls.map(function(lbl, ci) {
      var color = props.br.colors[ci] || P.panel, evs = byWk[lbl] && byWk[lbl].evs || [];
      var cards = evs.map(function(ev) {
        var cat = props.cats.find(function(c) {
          return c.id === ev.catId;
        }), dur = dff(pkey(ev.sd), pkey(ev.ed)) + 1;
        return '<div style="border-left:3px solid ' + (cat && cat.color || "#6B7280") + ";padding:4px 6px;margin-bottom:5px;background:" + (cat && cat.color || "#6B7280") + '18;border-radius:0 2px 2px 0;"><div style="font-size:10px;font-weight:700;color:#F0F4F8;">' + ev.title + '</div><div style="font-size:8px;color:#8aabcc;">' + DOWS[pkey(ev.sd).getDay()] + (ev.st ? " " + ev.st : "") + (dur > 1 ? " (" + dur + "d)" : "") + (ev.loc ? " \xB7 " + ev.loc : "") + "</div></div>";
      }).join("");
      return '<div style="position:absolute;left:' + (M + ci * cw) + "px;top:" + (M + 64) + "px;width:" + (cw - 8) + "px;bottom:" + (M + 16) + 'px;overflow:hidden;"><div style="background:' + color + ';color:#fff;font-size:11px;font-weight:700;padding:7px 10px;border-radius:3px 3px 0 0;text-align:center;">' + lbl + '</div><div style="background:#0f2540;border:1px solid ' + color + '33;border-top:none;border-radius:0 0 3px 3px;padding:8px;overflow:hidden;">' + (evs.length > 0 ? cards : '<div style="font-size:9px;color:#4a6fa5;text-align:center;margin-top:16px;">No events</div>') + "</div></div>";
    }).join("");
    return '<!DOCTYPE html><html><head><meta charset="UTF-8"><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,sans-serif;background:#0A1628;}@media print{@page{size:' + pw + "in " + ph2 + 'in;margin:0;}}</style></head><body><div style="width:' + PW + "px;height:" + PH + 'px;position:relative;background:#0A1628;overflow:hidden;"><div style="position:absolute;left:' + M + "px;top:" + M + "px;right:" + M + 'px;height:54px;border-bottom:2px solid #C8A84B;padding-bottom:8px;display:flex;align-items:center;justify-content:space-between;"><div><div style="font-size:7px;color:#C8A84B;font-weight:700;letter-spacing:3px;">U.S. ARMY</div><div style="font-size:14px;font-weight:700;color:#F0F4F8;">BATTLE RHYTHM SUMMARY</div><div style="font-size:9px;color:#8aabcc;">' + props.unit + " \u2014 " + hdate(pkey(pS)) + " to " + hdate(pkey(pE)) + '</div></div><div style="text-align:right;font-size:9px;color:#C8A84B;font-weight:700;">' + brEvs.length + " BR EVENTS</div></div>" + cols + "</div></body></html>";
  }
  function bldMatrix() {
    var PW = Math.round(pw * 96), PH = Math.round(ph2 * 96), M = 36, CLBL = 120, RH = 50;
    var lbls = props.br && props.br.enabled ? props.br.labels : [];
    var cw = Math.max(70, Math.floor((PW - M * 2 - CLBL) / Math.max(1, lbls.length)));
    var hdr = lbls.map(function(lbl, ci) {
      return '<div style="position:absolute;left:' + (CLBL + ci * cw) + "px;top:0;width:" + cw + "px;height:30px;background:" + (props.br.colors[ci] || P.panel) + ';display:flex;align-items:center;justify-content:center;border-right:1px solid #0A1628;"><span style="font-size:10px;font-weight:700;color:#fff;">' + lbl + "</span></div>";
    }).join("");
    var rows2 = DOWF.map(function(day, di) {
      var rbg = di % 2 === 0 ? "#0f2540" : "#0A1628";
      var cells = lbls.map(function(lbl, ci) {
        var evs = brEvs.filter(function(ev) {
          var b = brForDate(pkey(ev.sd), props.br);
          return b && b.label === lbl && pkey(ev.sd).getDay() === di;
        });
        var bars = evs.slice(0, 2).map(function(ev) {
          var cat = props.cats.find(function(c) {
            return c.id === ev.catId;
          });
          return '<div style="background:' + (cat && cat.color || "#6B7280") + ";border-radius:2px;padding:2px 4px;margin-bottom:2px;font-size:7px;font-weight:700;color:" + (cat && cat.text || "#fff") + ';overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + (ev.isRec ? "R " : "") + ev.title + "</div>";
        }).join("");
        return '<div style="position:absolute;left:' + (CLBL + ci * cw) + "px;top:0;width:" + cw + "px;height:" + RH + "px;background:" + rbg + ';border-right:1px solid #1a2f4a;padding:4px;">' + bars + (evs.length > 2 ? '<div style="font-size:7px;color:#4a6fa5;">+' + (evs.length - 2) + " more</div>" : "") + "</div>";
      }).join("");
      return '<div style="position:relative;height:' + RH + 'px;border-bottom:1px solid #1a2f4a;"><div style="position:absolute;left:0;top:0;width:' + CLBL + "px;height:" + RH + "px;background:" + rbg + ';border-right:2px solid #C8A84B;display:flex;align-items:center;padding:0 8px;"><span style="font-size:10px;font-weight:700;color:#C8A84B;">' + day.slice(0, 3).toUpperCase() + "</span></div>" + cells + "</div>";
    }).join("");
    return '<!DOCTYPE html><html><head><meta charset="UTF-8"><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,sans-serif;background:#0A1628;}@media print{@page{size:' + pw + "in " + ph2 + 'in;margin:0;}}</style></head><body><div style="width:' + PW + "px;min-height:" + PH + "px;background:#0A1628;padding:" + M + 'px;"><div style="border-bottom:2px solid #C8A84B;padding-bottom:8px;margin-bottom:14px;display:flex;justify-content:space-between;align-items:flex-end;"><div><div style="font-size:7px;color:#C8A84B;font-weight:700;letter-spacing:3px;">U.S. ARMY</div><div style="font-size:13px;font-weight:700;color:#F0F4F8;">BATTLE RHYTHM MATRIX</div><div style="font-size:8px;color:#8aabcc;">' + props.unit + " \u2014 " + hdate(pkey(pS)) + " to " + hdate(pkey(pE)) + '</div></div><div style="font-size:7px;color:#4a6fa5;">UNCLASSIFIED</div></div><div style="position:relative;"><div style="position:relative;height:30px;background:#1E3A5F;border-bottom:2px solid #C8A84B;"><div style="position:absolute;left:0;top:0;width:' + CLBL + 'px;height:30px;background:#0f2540;border-right:2px solid #C8A84B;display:flex;align-items:center;justify-content:center;"><span style="font-size:8px;color:#C8A84B;font-weight:700;">DAY</span></div>' + hdr + "</div>" + rows2 + "</div></div></body></html>";
  }
  function openWin(html) {
    var w = window.open("", "_blank");
    if (!w) {
      setStatus("Pop-up blocked.");
      return;
    }
    w.document.write(html);
    w.document.close();
    w.onload = function() {
      w.focus();
      w.print();
    };
  }
  function saveFl(html, sfx) {
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([html], { type: "text/html" }));
    a.download = "BR_" + sfx + "_" + props.unit.replace(/\W/g, "_") + ".html";
    a.click();
  }
  function doPrint() {
    setStatus("Opening...");
    setTimeout(function() {
      if (fmt === "infographic" || fmt === "both") openWin(bldInfographic());
      if (fmt === "matrix" || fmt === "both") openWin(bldMatrix());
      setStatus("Done.");
    }, 60);
  }
  function doExp() {
    setStatus("Saving...");
    setTimeout(function() {
      if (fmt === "infographic" || fmt === "both") saveFl(bldInfographic(), "Infographic");
      if (fmt === "matrix" || fmt === "both") saveFl(bldMatrix(), "Matrix");
      setStatus("Open in Chrome > Print > Save as PDF.");
    }, 60);
  }
  var hasBR = props.br && props.br.enabled;
  return /* @__PURE__ */ React.createElement(Mdl, { P, title: "BR Product", sub: "Infographic or matrix from BR-tagged events", onClose: props.onClose, w: 500 }, !hasBR && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "#fca5a5", background: "#7f1d1d22", border: "1px solid #7f1d1d", borderRadius: 3, padding: "8px", marginBottom: 12 } }, "Configure Battle Rhythm in Options first."), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 12 } }, /* @__PURE__ */ React.createElement(Fld, { P, label: "FROM" }, /* @__PURE__ */ React.createElement("input", { type: "date", value: pS, style: is, onChange: function(e) {
    setPS(e.target.value);
  } })), /* @__PURE__ */ React.createElement(Fld, { P, label: "UNTIL" }, /* @__PURE__ */ React.createElement("input", { type: "date", value: pE, style: is, onChange: function(e) {
    setPE(e.target.value);
  } })), /* @__PURE__ */ React.createElement(Fld, { P, label: "FORMAT", col: "1/-1" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", columnGap: 5 } }, ["infographic", "matrix", "both"].map(function(fo) {
    var a = fmt === fo;
    return /* @__PURE__ */ React.createElement("div", { key: fo, style: { flex: 1, padding: "5px", textAlign: "center", borderRadius: 3, cursor: "pointer", border: "1px solid " + (a ? P.hi : P.bd2), background: a ? P.hi + "22" : P.panel, fontSize: 10, fontWeight: 600, color: a ? P.hi : P.mu }, onClick: function() {
      setFmt(fo);
    } }, fo.charAt(0).toUpperCase() + fo.slice(1));
  }))), /* @__PURE__ */ React.createElement(Fld, { P, label: "PAPER" }, /* @__PURE__ */ React.createElement("select", { value: paper, style: is, onChange: function(e) {
    setPaper(e.target.value);
  } }, PAPERS.map(function(p) {
    return /* @__PURE__ */ React.createElement("option", { key: p.id, value: p.id }, p.label);
  }))), /* @__PURE__ */ React.createElement(Fld, { P, label: "ORIENTATION" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", columnGap: 5 } }, ["landscape", "portrait"].map(function(o) {
    var a = ori === o;
    return /* @__PURE__ */ React.createElement("div", { key: o, style: { flex: 1, padding: "5px", textAlign: "center", borderRadius: 3, cursor: "pointer", border: "1px solid " + (a ? P.hi : P.bd2), background: a ? P.hi + "22" : P.panel, fontSize: 10, fontWeight: 600, color: a ? P.hi : P.mu }, onClick: function() {
      setOri(o);
    } }, o);
  })))), /* @__PURE__ */ React.createElement("div", { style: { background: P.panel, borderRadius: 3, padding: "6px 10px", marginBottom: 10 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: P.mu } }, /* @__PURE__ */ React.createElement("span", { style: { color: P.hi, fontWeight: 700 } }, brEvs.length), " BR events in range"), hasBR && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", columnGap: 6, rowGap: 4, marginTop: 5 } }, props.br.labels.map(function(lbl, i) {
    var cnt = byWk[lbl] && byWk[lbl].evs.length || 0;
    return /* @__PURE__ */ React.createElement("span", { key: i, style: { fontSize: 9, color: P.mu, background: props.br.colors[i] + "22", padding: "1px 6px", borderRadius: 2 } }, lbl + ": ", /* @__PURE__ */ React.createElement("span", { style: { color: P.hi, fontWeight: 700 } }, cnt));
  }))), status && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: P.hi, marginBottom: 8 } }, status), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", columnGap: 6 } }, /* @__PURE__ */ React.createElement(PBtn, { P, onClick: doPrint, disabled: !hasBR || brEvs.length === 0, full: true }, "Print"), /* @__PURE__ */ React.createElement(SBtn, { P, onClick: doExp, disabled: !hasBR || brEvs.length === 0 }, "Export PDF"), /* @__PURE__ */ React.createElement(SBtn, { P, onClick: props.onClose }, "Cancel")));
}
function FiveWModal(props) {
  var P = props.P, is = mkI(P);
  var today = /* @__PURE__ */ new Date();
  var [pS, setPS] = useState(dkey(today));
  var [pE, setPE] = useState(dkey(addDays(today, 89)));
  var [catF, setCatF] = useState({});
  var [incRec, setIncRec] = useState(true);
  var [status, setStatus] = useState("");
  var filtered = useMemo(function() {
    if (!pS || !pE) return [];
    var rs = pkey(pS), re = pkey(pE);
    return props.evs.filter(function(ev) {
      if (!incRec && ev.isRec) return false;
      if (catF[ev.catId]) return false;
      return pkey(ev.ed) >= rs && pkey(ev.sd) <= re;
    }).sort(function(a, b) {
      return pkey(a.sd) - pkey(b.sd);
    });
  }, [props.evs, pS, pE, catF, incRec]);
  function w5(ev) {
    var lane = props.lanes.find(function(l) {
      return l.id === ev.laneId;
    });
    var cat = props.cats.find(function(c) {
      return c.id === ev.catId;
    });
    var dur = dff(pkey(ev.sd), pkey(ev.ed)) + 1;
    var rule = ev.isRec ? props.rules.find(function(r) {
      return r.id === ev.recurId;
    }) : null;
    return {
      who: ev.att || lane && lane.label || "TBD",
      what: ev.title + (cat ? " [" + cat.label + "]" : "") + (ev.isRec ? " (R)" : ""),
      when: hdate(pkey(ev.sd)) + (dur > 1 ? " - " + hdate(pkey(ev.ed)) : "") + (" (" + dur + "d)") + (ev.st ? " " + ev.st + (ev.et ? "-" + ev.et : "") : ""),
      where: ev.loc || "TBD",
      why: ev.notes || (rule ? recLabel(rule, props.br) : ""),
      lane: lane && lane.label || "",
      cat: cat && cat.label || "",
      catColor: cat && cat.color || "#6B7280",
      catText: cat && cat.text || "#fff"
    };
  }
  function tHTML() {
    var rows = filtered.map(function(ev) {
      var r = w5(ev);
      return "<tr><td>" + r.lane + '</td><td><span style="background:' + r.catColor + ";color:" + r.catText + ';padding:1px 5px;border-radius:2px;font-size:10px;">' + r.cat + "</span></td><td>" + r.who + "</td><td>" + r.what + '</td><td style="white-space:nowrap;">' + r.when + "</td><td>" + r.where + "</td><td>" + r.why + "</td></tr>";
    }).join("");
    return '<!DOCTYPE html><html><head><meta charset="UTF-8"><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,sans-serif;background:#0A1628;color:#F0F4F8;padding:28px;}table{width:100%;border-collapse:collapse;font-size:11px;}th{background:#1E3A5F;color:#C8A84B;padding:7px 9px;text-align:left;font-size:10px;border-bottom:2px solid #C8A84B;}td{padding:6px 9px;border-bottom:1px solid #1a2f4a;vertical-align:top;line-height:1.4;}tr:nth-child(even){background:#0f2540;}@media print{@page{size:landscape;}}</style></head><body><div style="margin-bottom:14px;padding-bottom:10px;border-bottom:2px solid #C8A84B;"><div style="font-size:7px;color:#C8A84B;font-weight:700;letter-spacing:3px;">U.S. ARMY</div><div style="font-size:14px;font-weight:700;">5W EVENT SUMMARY</div><div style="font-size:9px;color:#8aabcc;">' + props.unit + " \u2014 " + filtered.length + " events</div></div><table><thead><tr><th>LANE</th><th>CAT</th><th>WHO</th><th>WHAT</th><th>WHEN</th><th>WHERE</th><th>WHY</th></tr></thead><tbody>" + rows + '</tbody></table><div style="margin-top:16px;font-size:7px;color:#4a6fa5;text-align:center;">UNCLASSIFIED</div></body></html>';
  }
  function expCSV() {
    var hdr = ["LANE", "CAT", "WHO", "WHAT", "WHEN", "WHERE", "WHY"];
    var rws = filtered.map(function(ev) {
      var r = w5(ev);
      return [r.lane, r.cat, r.who, r.what, r.when, r.where, r.why];
    });
    var csv = [hdr].concat(rws).map(function(r) {
      return r.map(function(c) {
        return '"' + String(c).replace(/"/g, '""') + '"';
      }).join(",");
    }).join("\n");
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "5W_" + props.unit.replace(/\W/g, "_") + ".csv";
    a.click();
    setStatus("CSV saved.");
  }
  function doPrint() {
    setStatus("Opening...");
    setTimeout(function() {
      var w = window.open("", "_blank");
      if (!w) {
        setStatus("Pop-up blocked.");
        return;
      }
      w.document.write(tHTML());
      w.document.close();
      w.onload = function() {
        w.focus();
        w.print();
      };
      setStatus("Ready.");
    }, 60);
  }
  function doExp() {
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([tHTML()], { type: "text/html" }));
    a.download = "5W_" + props.unit.replace(/\W/g, "_") + ".html";
    a.click();
    setStatus("Open in Chrome > Print > Save as PDF.");
  }
  return /* @__PURE__ */ React.createElement(Mdl, { P, title: "5W Export", sub: "Who / What / When / Where / Why", onClose: props.onClose, w: 520 }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 12 } }, /* @__PURE__ */ React.createElement(Fld, { P, label: "FROM" }, /* @__PURE__ */ React.createElement("input", { type: "date", value: pS, style: is, onChange: function(e) {
    setPS(e.target.value);
  } })), /* @__PURE__ */ React.createElement(Fld, { P, label: "UNTIL" }, /* @__PURE__ */ React.createElement("input", { type: "date", value: pE, style: is, onChange: function(e) {
    setPE(e.target.value);
  } }))), /* @__PURE__ */ React.createElement(Fld, { P, label: "HIDE CATEGORIES" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", columnGap: 4, rowGap: 4 } }, props.cats.map(function(cat) {
    var h = catF[cat.id];
    return /* @__PURE__ */ React.createElement("div", { key: cat.id, style: { padding: "3px 8px", borderRadius: 2, cursor: "pointer", background: h ? "#0f1e30" : cat.color, opacity: h ? 0.4 : 1 }, onClick: function() {
      setCatF(function(p) {
        return Object.assign({}, p, { [cat.id]: !p[cat.id] });
      });
    } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, fontWeight: 700, color: h ? P.mu : cat.text } }, cat.label));
  }))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", columnGap: 8, marginBottom: 10 } }, /* @__PURE__ */ React.createElement(Tog, { P, on: incRec, onClick: function() {
    setIncRec(function(p) {
      return !p;
    });
  } }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: P.mu } }, "Include recurring instances")), /* @__PURE__ */ React.createElement("div", { style: { background: P.panel, borderRadius: 3, padding: "5px 8px", marginBottom: 10, fontSize: 10, color: P.mu } }, filtered.length, " events"), /* @__PURE__ */ React.createElement("div", { style: { background: P.bg, border: "1px solid " + P.bd, borderRadius: 3, maxHeight: 160, overflowY: "auto", marginBottom: 10 } }, /* @__PURE__ */ React.createElement("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 9 } }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { style: { background: P.panel } }, ["WHO", "WHAT", "WHEN", "WHERE"].map(function(h) {
    return /* @__PURE__ */ React.createElement("th", { key: h, style: { padding: "4px 6px", color: P.hi, textAlign: "left", fontWeight: 700, borderBottom: "1px solid " + P.bd2 } }, h);
  }))), /* @__PURE__ */ React.createElement("tbody", null, filtered.slice(0, 10).map(function(ev, i) {
    var r = w5(ev);
    return /* @__PURE__ */ React.createElement("tr", { key: i, style: { background: i % 2 === 0 ? P.panel : P.bg } }, [r.who, r.what, r.when, r.where].map(function(v, j) {
      return /* @__PURE__ */ React.createElement("td", { key: j, style: { padding: "3px 6px", color: P.mu, borderBottom: "1px solid " + P.bd, maxWidth: 110, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, v);
    }));
  }), filtered.length > 10 && /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { colSpan: 4, style: { padding: "3px 6px", color: P.dim, textAlign: "center" } }, "+", filtered.length - 10, " more")))), filtered.length === 0 && /* @__PURE__ */ React.createElement("div", { style: { padding: "16px", textAlign: "center", fontSize: 10, color: P.dim } }, "No events in range.")), status && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: P.hi, marginBottom: 8 } }, status), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", columnGap: 5 } }, /* @__PURE__ */ React.createElement(PBtn, { P, onClick: doPrint, disabled: filtered.length === 0, full: true }, "Print"), /* @__PURE__ */ React.createElement(SBtn, { P, onClick: doExp, disabled: filtered.length === 0 }, "Export PDF"), /* @__PURE__ */ React.createElement(SBtn, { P, onClick: expCSV, disabled: filtered.length === 0 }, "CSV"), /* @__PURE__ */ React.createElement(SBtn, { P, onClick: props.onClose }, "Close")));
}
function Timeline(props) {
  var P = props.P, lanes = props.lanes, cats = props.cats, evs = props.evs, br = props.br, viewMode = props.viewMode;
  var vm = VIEWS.find(function(v) {
    return v.id === viewMode;
  }) || VIEWS[1];
  var DW = vm.dw;
  var today = useMemo(function() {
    var d = /* @__PURE__ */ new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  var ANCHOR = useMemo(function() {
    return new Date(today.getFullYear() - 2, 0, 1);
  }, [today]);
  var TOTAL = 365 * 4 + 2;
  var allDays = useMemo(function() {
    var arr = [];
    for (var i = 0; i < TOTAL; i++) {
      var dt = addDays(ANCHOR, i), v = ymd(dt);
      arr.push({ idx: i, date: dt, key: dkey(dt), y: v.y, m: v.m, d: v.d, dow: v.dow });
    }
    return arr;
  }, [ANCHOR, TOTAL]);
  var todayIdx = useMemo(function() {
    return dff(ANCHOR, today);
  }, [ANCHOR, today]);
  var brGrps = useMemo(function() {
    if (!br || !br.enabled || !vm.showBR) return [];
    var grps = [], cur = null, curLbl = null;
    allDays.forEach(function(day) {
      var b = brForDate(day.date, br);
      var lbl = b ? b.label : "", occ = b ? b.occ : 1;
      var ci = (occ - 1) % br.cycleLen, color = br.colors[ci] || P.panel;
      if (!cur || lbl !== curLbl) {
        cur = { lbl, color, si: day.idx, cnt: 0 };
        curLbl = lbl;
        grps.push(cur);
      }
      cur.cnt++;
    });
    return grps;
  }, [allDays, br, vm.showBR]);
  var stkByLane = useMemo(function() {
    var out = {};
    lanes.forEach(function(l) {
      out[l.id] = stackEvs(evs.filter(function(e) {
        return e.laneId === l.id;
      }));
    });
    return out;
  }, [lanes, evs]);
  var lhMap = useMemo(function() {
    var out = {};
    lanes.forEach(function(l) {
      var st = stkByLane[l.id] || [];
      var mr = st.length > 0 ? Math.max.apply(null, st.map(function(e) {
        return e.row;
      })) : -1;
      out[l.id] = Math.max(BH + BP * 2, (mr + 1) * (BH + 3) + BP * 2);
    });
    return out;
  }, [lanes, stkByLane]);
  var moGrps = useMemo(function() {
    var gs = [], cur = null;
    allDays.forEach(function(d) {
      var k = d.y + "-" + d.m;
      if (!cur || cur.k !== k) {
        cur = { k, lbl: MONTHS[d.m] + " " + d.y, si: d.idx, cnt: 0 };
        gs.push(cur);
      }
      cur.cnt++;
    });
    return gs;
  }, [allDays]);
  var wkGrps = useMemo(function() {
    var gs = [], cur = null;
    allDays.forEach(function(d) {
      if (!cur || d.dow === 1) {
        cur = { n: Math.floor(d.idx / 7) + 1, si: d.idx, cnt: 0 };
        gs.push(cur);
      }
      cur.cnt++;
    });
    return gs;
  }, [allDays]);
  var scrollRef = useRef(null);
  var [sel, setSel] = useState(null);
  useEffect(function() {
    if (scrollRef.current) scrollRef.current.scrollLeft = Math.max(0, todayIdx * DW - 300);
  }, [todayIdx, DW]);
  useEffect(function() {
    function up() {
      setSel(null);
    }
    window.addEventListener("mouseup", up);
    return function() {
      window.removeEventListener("mouseup", up);
    };
  }, []);
  function evPos(ev) {
    var si = dff(ANCHOR, pkey(ev.sd)), ei = dff(ANCHOR, pkey(ev.ed));
    return { left: si * DW, width: Math.max(DW, (ei - si + 1) * DW - 2) };
  }
  function onDown(laneId, idx, e) {
    var lane = lanes.find(function(l) {
      return l.id === laneId;
    });
    if (lane && lane.locked) return;
    e.preventDefault();
    setSel({ laneId, si: idx, ei: idx });
  }
  function onEnter(laneId, idx) {
    if (sel && sel.laneId === laneId) setSel(function(s) {
      return Object.assign({}, s, { ei: idx });
    });
  }
  function onUp(laneId, idx) {
    if (sel && sel.laneId === laneId) {
      var lane = lanes.find(function(l) {
        return l.id === laneId;
      });
      if (!lane || !lane.locked) {
        var s = Math.min(sel.si, idx), e = Math.max(sel.si, idx);
        props.onCreate(laneId, dkey(addDays(ANCHOR, s)), dkey(addDays(ANCHOR, e)));
      }
    }
    setSel(null);
  }
  var TW = TOTAL * DW, skip = DW <= 4;
  return /* @__PURE__ */ React.createElement("div", { style: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 0 } }, /* @__PURE__ */ React.createElement("div", { ref: scrollRef, style: { flex: 1, overflowX: "auto", overflowY: "auto" } }, /* @__PURE__ */ React.createElement("div", { style: { width: LW + TW, position: "relative" } }, /* @__PURE__ */ React.createElement("div", { style: { position: "sticky", top: 0, zIndex: 20, background: P.bg, display: "flex", flexDirection: "column" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", borderBottom: "1px solid " + P.bd, height: 20 } }, /* @__PURE__ */ React.createElement("div", { style: { width: LW, flexShrink: 0, background: P.bg, borderRight: "1px solid " + P.bd2 } }), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", flex: 1, height: 20, overflow: "hidden" } }, moGrps.map(function(g) {
    var text = g.cnt * DW > 50 ? g.lbl : DW > 4 ? MONTHS[parseInt(g.k.split("-")[1]) - 1] : "";
    return /* @__PURE__ */ React.createElement("div", { key: g.k, style: { position: "absolute", left: g.si * DW, width: g.cnt * DW, height: 20, background: P.panel, borderRight: "1px solid " + P.bd2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: P.hi, overflow: "hidden", whiteSpace: "nowrap" } }, text);
  }))), br && br.enabled && vm.showBR && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", borderBottom: "1px solid " + P.bd, height: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { width: LW, flexShrink: 0, background: P.bg, borderRight: "1px solid " + P.bd2, fontSize: 8, color: P.dim, display: "flex", alignItems: "center", justifyContent: "center" } }, "BR"), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", flex: 1, height: 16, overflow: "hidden" } }, brGrps.map(function(g, i) {
    var li = br.labels.indexOf(g.lbl);
    var hidden = li >= 0 && (br.hidden || []).indexOf(li) !== -1;
    return /* @__PURE__ */ React.createElement("div", { key: i, style: { position: "absolute", left: g.si * DW, width: g.cnt * DW, height: 16, background: hidden ? "transparent" : g.color + "28", borderRight: "1px solid " + (hidden ? "transparent" : g.color + "33"), display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" } }, !hidden && g.cnt * DW > 40 && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 7, fontWeight: 700, color: g.color, whiteSpace: "nowrap" } }, g.lbl));
  }))), vm.showWk && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", borderBottom: "1px solid " + P.bd, height: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { width: LW, flexShrink: 0, background: P.bg, borderRight: "1px solid " + P.bd2, fontSize: 7, color: P.dim, display: "flex", alignItems: "center", justifyContent: "center" } }, "WK"), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", flex: 1, height: 14, overflow: "hidden" } }, wkGrps.map(function(g, i) {
    return /* @__PURE__ */ React.createElement("div", { key: i, style: { position: "absolute", left: g.si * DW, width: g.cnt * DW, height: 14, background: P.card, borderRight: "1px solid " + P.bd, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 7, color: P.dim, overflow: "hidden" } }, g.cnt * DW > 18 ? "W" + g.n : "");
  }))), vm.showDow ? /* @__PURE__ */ React.createElement("div", { style: { display: "flex", borderBottom: "2px solid " + P.hi, height: 26 } }, /* @__PURE__ */ React.createElement("div", { style: { width: LW, flexShrink: 0, background: P.bg, borderRight: "1px solid " + P.bd2, fontSize: 8, color: P.dim, display: "flex", alignItems: "center", justifyContent: "center" } }, "LANE"), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", flex: 1, height: 26, overflow: "hidden" } }, allDays.map(function(d) {
    var isT = d.idx === todayIdx;
    return /* @__PURE__ */ React.createElement("div", { key: d.idx, style: { position: "absolute", left: d.idx * DW, width: DW, height: 26, background: isWE(d.dow) ? P.card : P.bg, borderRight: "1px solid " + P.bd, textAlign: "center", fontSize: Math.min(9, DW - 1), fontWeight: 700, color: isWE(d.dow) ? P.hi : P.mu, paddingTop: 2, boxShadow: isT ? "inset 0 -2px 0 " + P.hi : "none" } }, /* @__PURE__ */ React.createElement("div", null, DOWH[d.dow]), /* @__PURE__ */ React.createElement("div", { style: { fontSize: Math.min(8, DW - 2), color: isWE(d.dow) ? P.dim : P.bd2, fontWeight: 400 } }, d.d));
  }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", left: todayIdx * DW, width: DW, height: 26, borderLeft: "2px solid " + P.hi, borderRight: "2px solid " + P.hi, pointerEvents: "none", zIndex: 3 } }))) : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", borderBottom: "2px solid " + P.hi, height: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { width: LW, flexShrink: 0, background: P.bg, borderRight: "1px solid " + P.bd2 } }), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", flex: 1, height: 10, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", left: todayIdx * DW, width: Math.max(2, DW), height: 10, background: P.hi + "44", pointerEvents: "none", zIndex: 3 } })))), lanes.map(function(lane, li) {
    var h = lhMap[lane.id] || 40, laneEvs = stkByLane[lane.id] || [], locked = lane.locked;
    var laneBg = li % 2 === 0 ? P.card : P.bg;
    var sideBg = locked ? "#0d1a0d" : laneBg;
    var sideBd = locked ? "#DC262644" : P.bd2;
    return /* @__PURE__ */ React.createElement("div", { key: lane.id, style: { display: "flex", borderBottom: "1px solid " + P.bd, height: h, opacity: locked ? 0.78 : 1 } }, /* @__PURE__ */ React.createElement("div", { style: { position: "sticky", left: 0, zIndex: 10, width: LW, flexShrink: 0, background: sideBg, borderRight: "1px solid " + sideBd, display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "5px 7px", fontSize: 8, fontWeight: 700, color: locked ? "#6ee7b7" : P.mu } }, /* @__PURE__ */ React.createElement("span", null, lane.label), locked && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 8, color: "#6ee7b7" } }, "[L]")), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", flex: 1, height: h } }, !skip && allDays.map(function(d) {
      var inSel = sel && sel.laneId === lane.id && d.idx >= Math.min(sel.si, sel.ei) && d.idx <= Math.max(sel.si, sel.ei);
      var isT = d.idx === todayIdx;
      var bg = inSel ? P.hi + "22" : isT ? P.hi + "08" : isWE(d.dow) ? P.card : laneBg;
      return /* @__PURE__ */ React.createElement(
        "div",
        {
          key: d.idx,
          style: { position: "absolute", left: d.idx * DW, width: DW, height: h, background: bg, borderRight: "1px solid " + P.bd, cursor: locked ? "not-allowed" : "crosshair" },
          onMouseDown: function(e) {
            onDown(lane.id, d.idx, e);
          },
          onMouseEnter: function() {
            onEnter(lane.id, d.idx);
          },
          onMouseUp: function() {
            onUp(lane.id, d.idx);
          }
        }
      );
    }), skip && /* @__PURE__ */ React.createElement(
      "div",
      {
        style: { position: "absolute", top: 0, right: 0, bottom: 0, left: 0, background: laneBg, cursor: locked ? "not-allowed" : "crosshair" },
        onMouseDown: function(e) {
          if (!locked) onDown(lane.id, todayIdx, e);
        }
      }
    ), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", left: todayIdx * DW, width: Math.max(2, DW), height: h, borderLeft: "1px solid " + P.hi + "44", borderRight: "1px solid " + P.hi + "44", pointerEvents: "none", zIndex: 1 } }), laneEvs.map(function(ev) {
      var cat = cats.find(function(c) {
        return c.id === ev.catId;
      }) || cats[cats.length - 1];
      var pos = evPos(ev), top = BP + ev.row * (BH + 3);
      var isBREv = ev.isBR || cat && cat.isBR;
      return /* @__PURE__ */ React.createElement(
        "div",
        {
          key: ev.id,
          style: { position: "absolute", left: pos.left, top, width: pos.width, height: BH, background: cat && cat.color || "#6B7280", borderRadius: 3, display: "flex", alignItems: "center", paddingLeft: 5, cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.4)", overflow: "hidden", border: "1px solid " + (isBREv ? "rgba(255,220,100,0.5)" : "rgba(255,255,255,0.1)"), zIndex: 2 },
          title: ev.title,
          onClick: function(e) {
            e.stopPropagation();
            props.onDetail(ev.id);
          }
        },
        ev.isRec && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 8, marginRight: 2, flexShrink: 0, color: cat && cat.text || "#fff", opacity: 0.7 } }, "R"),
        isBREv && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 8, marginRight: 2, flexShrink: 0, color: "#fde68a", fontWeight: 700 } }, "*"),
        /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, fontWeight: 600, color: cat && cat.text || "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, ev.title),
        (ev.files || []).length > 0 && /* @__PURE__ */ React.createElement("span", { style: { marginLeft: 2, fontSize: 8, flexShrink: 0, color: cat && cat.text || "#fff", opacity: 0.7 } }, "[f]"),
        DW > 8 && dff(pkey(ev.sd), pkey(ev.ed)) > 1 && /* @__PURE__ */ React.createElement("span", { style: { marginLeft: "auto", marginRight: 3, fontSize: 8, flexShrink: 0, color: cat && cat.text || "#fff", opacity: 0.6 } }, dff(pkey(ev.sd), pkey(ev.ed)) + 1, "d")
      );
    })));
  }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", borderTop: "1px solid " + P.bd2, background: P.panel, position: "sticky", bottom: 0, zIndex: 20 } }, /* @__PURE__ */ React.createElement("div", { style: { width: LW, flexShrink: 0, borderRight: "1px solid " + P.bd2, padding: "4px 8px", fontSize: 9, color: P.hi, fontWeight: 700, position: "sticky", left: 0, background: P.panel } }, evs.length, " event", evs.length !== 1 ? "s" : ""), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, padding: "4px 8px", fontSize: 9, display: "flex", flexWrap: "wrap", columnGap: 12, rowGap: 2 } }, lanes.map(function(l) {
    var cnt = evs.filter(function(e) {
      return e.laneId === l.id;
    }).length;
    if (!cnt) return null;
    return /* @__PURE__ */ React.createElement("span", { key: l.id, style: { color: P.dim } }, l.label, l.locked ? " [L]" : "", ": ", /* @__PURE__ */ React.createElement("span", { style: { color: P.hi } }, cnt));
  }))))));
}
var SUPA_URL = "https://lbbmoazozmasvhtalwsg.supabase.co";
var SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxiYm1vYXpvem1hc3ZodGFsd3NnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM4ODQ1MTQsImV4cCI6MjA5OTQ2MDUxNH0.3_NjaeXQSW3eSu3LBTIYISFFOjEtKXi5yO5CFERF_AI";
var SESSION_KEY = "lrtc_sb_session";
function sbHeaders(token) {
  var h = { "Content-Type": "application/json", "apikey": SUPA_KEY, "Authorization": "Bearer " + (token || SUPA_KEY) };
  return h;
}
function sbSignUp(email, pw) {
  return fetch(SUPA_URL + "/auth/v1/signup", {
    method: "POST",
    headers: sbHeaders(),
    body: JSON.stringify({ email, password: pw })
  }).then(function(r) {
    return r.json();
  });
}
function sbSignIn(email, pw) {
  return fetch(SUPA_URL + "/auth/v1/token?grant_type=password", {
    method: "POST",
    headers: sbHeaders(),
    body: JSON.stringify({ email, password: pw })
  }).then(function(r) {
    return r.json();
  });
}
function sbRefresh(refreshToken) {
  return fetch(SUPA_URL + "/auth/v1/token?grant_type=refresh_token", {
    method: "POST",
    headers: sbHeaders(),
    body: JSON.stringify({ refresh_token: refreshToken })
  }).then(function(r) {
    return r.json();
  });
}
function sbResetPw(email) {
  return fetch(SUPA_URL + "/auth/v1/recover", {
    method: "POST",
    headers: sbHeaders(),
    body: JSON.stringify({ email })
  }).then(function(r) {
    return r.json();
  });
}
function sbSignOut(token) {
  return fetch(SUPA_URL + "/auth/v1/logout", {
    method: "POST",
    headers: sbHeaders(token)
  });
}
function getStoredSession() {
  try {
    var s = localStorage.getItem(SESSION_KEY);
    return s ? JSON.parse(s) : null;
  } catch (e) {
    return null;
  }
}
function storeSession(s) {
  try {
    if (s) localStorage.setItem(SESSION_KEY, JSON.stringify(s));
    else localStorage.removeItem(SESSION_KEY);
  } catch (e) {
  }
}
function loadState(token, userId) {
  return fetch(SUPA_URL + "/rest/v1/lrtc_calendars?user_id=eq." + userId + "&select=state", {
    headers: sbHeaders(token)
  }).then(function(r) {
    return r.json();
  }).then(function(rows) {
    if (!rows || !rows.length) return null;
    return rows[0].state || null;
  }).catch(function() {
    return null;
  });
}
function saveState(token, userId, state) {
  return fetch(SUPA_URL + "/rest/v1/lrtc_calendars", {
    method: "POST",
    headers: Object.assign({}, sbHeaders(token), {
      "Prefer": "resolution=merge-duplicates"
    }),
    body: JSON.stringify({ user_id: userId, state, updated_at: (/* @__PURE__ */ new Date()).toISOString() })
  }).then(function(r) {
    if (!r.ok) throw new Error("Save failed: " + r.status);
  });
}
function CalSubModal(props) {
  var P = props.P;
  var base = "https://cosmic-nougat-a9346c.netlify.app/calendar/";
  var uid = props.userId || "";
  var [copied, setCopied] = useState("");
  var feeds = [
    { id: "all", label: "Full Calendar", url: base + uid + ".ics", desc: "All events across all swim lanes" },
    { id: "br", label: "Battle Rhythm", url: base + uid + "/br.ics", desc: "BR-tagged events only" }
  ].concat(props.lanes.map(function(l) {
    return { id: l.id, label: l.label, url: base + uid + "/lane/" + l.id + ".ics", desc: "Events in the " + l.label + " lane" };
  }));
  function copy(url, id) {
    navigator.clipboard.writeText(url).then(function() {
      setCopied(id);
      setTimeout(function() {
        setCopied("");
      }, 2e3);
    }).catch(function() {
      var ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(id);
      setTimeout(function() {
        setCopied("");
      }, 2e3);
    });
  }
  return /* @__PURE__ */ React.createElement(Mdl, { P, title: "Subscribe to Calendar", sub: "Add your live calendar feed to Apple Calendar, Google Calendar, or Outlook", onClose: props.onClose, w: 520 }, /* @__PURE__ */ React.createElement("div", { style: { background: P.bg, borderRadius: 4, padding: "10px 12px", marginBottom: 14, fontSize: 10, color: P.mu, lineHeight: 1.7 } }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, color: P.hi, marginBottom: 4 } }, "How to subscribe"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { style: { color: P.tx } }, "Apple Calendar:"), " File \u2192 New Calendar Subscription \u2192 paste URL"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { style: { color: P.tx } }, "Google Calendar:"), " Other calendars + \u2192 From URL \u2192 paste URL"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { style: { color: P.tx } }, "Outlook:"), " Add calendar \u2192 From internet \u2192 paste URL"), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 6, color: P.dim } }, "Your calendar app will check for updates automatically every hour.")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", rowGap: 8 } }, feeds.map(function(feed) {
    var isCopied = copied === feed.id;
    return /* @__PURE__ */ React.createElement("div", { key: feed.id, style: { background: P.panel, border: "1px solid " + P.bd2, borderRadius: 4, padding: "10px 12px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, fontWeight: 700, color: P.tx } }, feed.label), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: P.dim, marginTop: 1 } }, feed.desc)), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: function() {
          copy(feed.url, feed.id);
        },
        style: { border: "1px solid " + (isCopied ? P.hi : P.bd2), padding: "5px 12px", fontSize: 10, fontWeight: 600, cursor: "pointer", borderRadius: 3, background: isCopied ? P.hi + "22" : "transparent", color: isCopied ? P.hi : P.mu, flexShrink: 0, whiteSpace: "nowrap" }
      },
      isCopied ? "Copied!" : "Copy URL"
    )), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: P.dim, fontFamily: "monospace", background: P.bg, padding: "4px 7px", borderRadius: 2, wordBreak: "break-all", lineHeight: 1.5 } }, feed.url));
  })), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 14, padding: "8px 12px", background: P.bg, borderRadius: 3, fontSize: 9, color: P.dim, lineHeight: 1.6 } }, "These are read-only feeds \u2014 subscribed calendars can view your events but cannot make changes. Your user ID is embedded in the URL; keep these links private."));
}
function AuthScreen(props) {
  var P = props.P;
  var is = mkI(P);
  var [mode, setMode] = useState("signin");
  var [email, setEmail] = useState("");
  var [pass, setPass] = useState("");
  var [status, setStatus] = useState("");
  var [busy, setBusy] = useState(false);
  function doSignIn() {
    if (!email || !pass) {
      setStatus("Enter email and password.");
      return;
    }
    setBusy(true);
    setStatus("");
    sbSignIn(email, pass).then(function(res) {
      setBusy(false);
      if (res.error || res.error_description) {
        setStatus(res.error_description || res.error || "Sign in failed.");
      } else if (res.access_token) {
        storeSession(res);
        props.onAuth(res);
      } else {
        setStatus("Sign in failed. Check your credentials.");
      }
    }).catch(function(e) {
      setBusy(false);
      setStatus("Network error \u2014 check connection.");
    });
  }
  function doSignUp() {
    if (!email || !pass) {
      setStatus("Enter email and password.");
      return;
    }
    if (pass.length < 6) {
      setStatus("Password must be at least 6 characters.");
      return;
    }
    setBusy(true);
    setStatus("");
    sbSignUp(email, pass).then(function(res) {
      setBusy(false);
      if (res.error || res.error_description) {
        setStatus(res.error_description || res.error || "Sign up failed.");
      } else if (res.access_token) {
        storeSession(res);
        props.onAuth(res);
      } else {
        setStatus("Account created! Check your email to confirm, then sign in.");
        setMode("signin");
      }
    }).catch(function(e) {
      setBusy(false);
      setStatus("Network error \u2014 check connection.");
    });
  }
  function doReset() {
    if (!email) {
      setStatus("Enter your email first.");
      return;
    }
    setBusy(true);
    setStatus("");
    sbResetPw(email).then(function(res) {
      setBusy(false);
      if (res.error) setStatus(res.error_description || "Error sending reset email.");
      else setStatus("Password reset email sent \u2014 check your inbox.");
    }).catch(function(e) {
      setBusy(false);
      setStatus("Network error \u2014 check connection.");
    });
  }
  var isOk = status.includes("sent") || status.includes("confirm");
  return /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "Arial,sans-serif", background: P.bg, height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: P.tx } }, /* @__PURE__ */ React.createElement("div", { style: { width: 360, maxWidth: "92vw", background: P.panel, border: "1px solid " + P.bd2, borderRadius: 8, padding: 28, boxShadow: "0 8px 40px rgba(0,0,0,0.5)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", columnGap: 8, marginBottom: 24 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 8, height: 8, background: P.hi, borderRadius: "50%" } }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 16, fontWeight: 700, color: P.hi, letterSpacing: 0.5 } }, "MyPlan"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: P.dim } }, "Long Range Training Calendar")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", background: P.bg, borderRadius: 4, padding: 2, marginBottom: 20 } }, ["signin", "signup"].map(function(m) {
    var a = mode === m;
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: m,
        style: { flex: 1, border: "none", padding: "7px", fontSize: 11, fontWeight: a ? 700 : 500, cursor: "pointer", borderRadius: 3, background: a ? P.hi : "transparent", color: a ? P.bg : P.mu },
        onClick: function() {
          setMode(m);
          setStatus("");
        }
      },
      m === "signin" ? "Sign In" : "Create Account"
    );
  })), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 14 } }, /* @__PURE__ */ React.createElement(Label, { P }, "EMAIL"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "email",
      value: email,
      placeholder: "you@example.com",
      style: is,
      autoComplete: "email",
      onChange: function(e) {
        setEmail(e.target.value);
      },
      onKeyDown: function(e) {
        if (e.key === "Enter") mode === "signin" ? doSignIn() : doSignUp();
      }
    }
  )), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 18 } }, /* @__PURE__ */ React.createElement(Label, { P }, "PASSWORD"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "password",
      value: pass,
      placeholder: mode === "signup" ? "At least 6 characters" : "",
      style: is,
      autoComplete: mode === "signup" ? "new-password" : "current-password",
      onChange: function(e) {
        setPass(e.target.value);
      },
      onKeyDown: function(e) {
        if (e.key === "Enter") mode === "signin" ? doSignIn() : doSignUp();
      }
    }
  )), status && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: isOk ? "#4ade80" : "#fca5a5", marginBottom: 12, lineHeight: 1.5 } }, status), /* @__PURE__ */ React.createElement(PBtn, { P, onClick: mode === "signin" ? doSignIn : doSignUp, full: true, disabled: busy }, busy ? "Please wait\u2026" : mode === "signin" ? "Sign In" : "Create Account"), mode === "signin" && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 10, textAlign: "center" } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      style: { background: "none", border: "none", color: P.dim, fontSize: 10, cursor: "pointer", textDecoration: "underline" },
      onClick: doReset
    },
    "Forgot password?"
  )), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 18, paddingTop: 14, borderTop: "1px solid " + P.bd, fontSize: 9, color: P.dim, textAlign: "center", lineHeight: 1.6 } }, "Your calendar syncs across iPhone, iPad, Mac and browser.", /* @__PURE__ */ React.createElement("br", null), "Sign in on any device to pick up where you left off.")));
}
function sbFetch(token, path) {
  return fetch(SUPA_URL + "/rest/v1/" + path, {
    headers: sbHeaders(token)
  }).then(function(r) {
    return r.json();
  });
}
function sbInsert(token, table, body) {
  return fetch(SUPA_URL + "/rest/v1/" + table, {
    method: "POST",
    headers: Object.assign({}, sbHeaders(token), { "Prefer": "return=representation" }),
    body: JSON.stringify(body)
  }).then(function(r) {
    return r.json();
  });
}
function sbUpdate(token, table, id, body) {
  return fetch(SUPA_URL + "/rest/v1/" + table + "?id=eq." + id, {
    method: "PATCH",
    headers: Object.assign({}, sbHeaders(token), { "Prefer": "return=representation" }),
    body: JSON.stringify(body)
  }).then(function(r) {
    return r.json();
  });
}
function sbDelete(token, table, id) {
  return fetch(SUPA_URL + "/rest/v1/" + table + "?id=eq." + id, {
    method: "DELETE",
    headers: sbHeaders(token)
  });
}
function sbUpsert(token, table, body, conflict) {
  return fetch(SUPA_URL + "/rest/v1/" + table, {
    method: "POST",
    headers: Object.assign({}, sbHeaders(token), {
      "Prefer": "resolution=merge-duplicates,return=representation",
      "on_conflict": conflict || "id"
    }),
    body: JSON.stringify(body)
  }).then(function(r) {
    return r.json();
  });
}
function TodayView(props) {
  var P = props.P, is = mkI(P);
  var tasks = props.tasks, routines = props.routines, todayEvs = props.todayEvs;
  var domains = props.domains;
  var today = dkey(/* @__PURE__ */ new Date());
  var top3 = tasks.filter(function(t) {
    return t.is_top3 && !t.done;
  });
  var todayTasks = tasks.filter(function(t) {
    return !t.done && t.due_date === today && !t.is_top3;
  });
  var overdueTasks = tasks.filter(function(t) {
    return !t.done && t.due_date && t.due_date < today;
  });
  var morningR = routines.filter(function(r) {
    return r.time_of_day === "morning" && r.active;
  });
  var eveningR = routines.filter(function(r) {
    return r.time_of_day === "evening" && r.active;
  });
  var anytimeR = routines.filter(function(r) {
    return r.time_of_day === "anytime" && r.active;
  });
  var isCompletedToday = function(r) {
    return (props.completions || []).some(function(c) {
      return c.routine_id === r.id && c.completed_on === today;
    });
  };
  function toggleTask(task) {
    props.onTaskToggle(task);
  }
  function toggleTop3(task) {
    props.onTaskTop3(task);
  }
  function toggleRoutine(routine) {
    props.onRoutineToggle(routine, today);
  }
  var priBg = { high: "#7f1d1d22", medium: P.panel, low: P.panel };
  var priColor = { high: "#fca5a5", medium: P.mu, low: P.dim };
  var priLabel = { high: "HIGH", medium: "MED", low: "LOW" };
  function TaskRow(tprops) {
    var t = tprops.task;
    var dom = domains.find(function(d) {
      return d.id === t.domain_id;
    });
    return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "flex-start", columnGap: 8, padding: "7px 10px", borderRadius: 3, background: priBg[t.priority || "medium"], border: "1px solid " + P.bd, marginBottom: 5 } }, /* @__PURE__ */ React.createElement(
      "div",
      {
        style: { width: 18, height: 18, borderRadius: 3, border: "1px solid " + P.bd2, flexShrink: 0, marginTop: 1, cursor: "pointer", background: t.done ? P.hi : "transparent", display: "flex", alignItems: "center", justifyContent: "center" },
        onClick: function() {
          toggleTask(t);
        }
      },
      t.done && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: P.bg, fontWeight: 700 } }, "\u2713")
    ), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: t.done ? P.dim : P.tx, textDecoration: t.done ? "line-through" : "none", fontWeight: 500 } }, t.title), (t.due_time || dom) && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: P.dim, marginTop: 2, display: "flex", columnGap: 8 } }, t.due_time && /* @__PURE__ */ React.createElement("span", null, t.due_time), dom && /* @__PURE__ */ React.createElement("span", { style: { color: dom.color || P.mu } }, "\u25CF ", dom.name))), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, color: priColor[t.priority || "medium"], flexShrink: 0, paddingTop: 2 } }, priLabel[t.priority || "medium"]), /* @__PURE__ */ React.createElement(
      "div",
      {
        style: { fontSize: 14, color: t.is_top3 ? P.hi : P.bd2, cursor: "pointer", flexShrink: 0 },
        title: t.is_top3 ? "Remove from top 3" : "Add to top 3",
        onClick: function() {
          toggleTop3(t);
        }
      },
      "\u2605"
    ));
  }
  function RoutineRow(rprops) {
    var r = rprops.routine;
    var done = isCompletedToday(r);
    return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", columnGap: 8, padding: "6px 10px", borderRadius: 3, border: "1px solid " + P.bd, marginBottom: 4, background: done ? P.hi + "18" : P.panel } }, /* @__PURE__ */ React.createElement(
      "div",
      {
        style: { width: 18, height: 18, borderRadius: "50%", border: "2px solid " + (done ? P.hi : P.bd2), flexShrink: 0, cursor: "pointer", background: done ? P.hi : "transparent", display: "flex", alignItems: "center", justifyContent: "center" },
        onClick: function() {
          toggleRoutine(r);
        }
      },
      done && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: P.bg, fontWeight: 700 } }, "\u2713")
    ), /* @__PURE__ */ React.createElement("span", { style: { flex: 1, fontSize: 12, color: done ? P.dim : P.tx, textDecoration: done ? "line-through" : "none" } }, r.title), r.streak_count > 0 && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: P.hi } }, "\u{1F525} ", r.streak_count));
  }
  return /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 14px", overflowY: "auto", flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: P.dim, marginBottom: 14, fontWeight: 500 } }, (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })), /* @__PURE__ */ React.createElement(
    "div",
    {
      style: { background: P.panel, border: "1px solid " + P.bd2, borderRadius: 4, padding: "10px 14px", marginBottom: 16, cursor: "pointer", display: "flex", alignItems: "center", columnGap: 10 },
      onClick: props.onQuickAdd
    },
    /* @__PURE__ */ React.createElement("span", { style: { fontSize: 18, color: P.hi } }, "+"),
    /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: P.dim } }, "Quick capture \u2014 add a task, note, or idea")
  ), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: P.hi, fontWeight: 700, letterSpacing: 1, marginBottom: 8 } }, "TOP 3 TODAY"), top3.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: P.dim, padding: "8px 10px", background: P.panel, borderRadius: 3, border: "1px solid " + P.bd } }, "Star any task below to pin it here") : top3.map(function(t) {
    return /* @__PURE__ */ React.createElement(TaskRow, { key: t.id, task: t });
  })), todayEvs.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: P.mu, fontWeight: 700, letterSpacing: 1, marginBottom: 8 } }, "TODAY ON CALENDAR"), todayEvs.map(function(ev) {
    var cat = props.cats.find(function(c) {
      return c.id === ev.catId;
    });
    return /* @__PURE__ */ React.createElement("div", { key: ev.id, style: { display: "flex", alignItems: "center", columnGap: 8, padding: "6px 10px", borderRadius: 3, border: "1px solid " + P.bd, marginBottom: 4, background: P.panel } }, /* @__PURE__ */ React.createElement("div", { style: { width: 4, height: 24, background: cat && cat.color || P.hi, borderRadius: 2, flexShrink: 0 } }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: P.tx, fontWeight: 500 } }, ev.title), ev.st && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: P.dim } }, ev.st, ev.et ? " \u2013 " + ev.et : "")), cat && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, color: cat.color } }, cat.label));
  })), overdueTasks.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "#fca5a5", fontWeight: 700, letterSpacing: 1, marginBottom: 8 } }, "OVERDUE"), overdueTasks.map(function(t) {
    return /* @__PURE__ */ React.createElement(TaskRow, { key: t.id, task: t });
  })), todayTasks.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: P.mu, fontWeight: 700, letterSpacing: 1, marginBottom: 8 } }, "DUE TODAY"), todayTasks.map(function(t) {
    return /* @__PURE__ */ React.createElement(TaskRow, { key: t.id, task: t });
  })), morningR.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: P.mu, fontWeight: 700, letterSpacing: 1, marginBottom: 6 } }, "MORNING"), morningR.map(function(r) {
    return /* @__PURE__ */ React.createElement(RoutineRow, { key: r.id, routine: r });
  })), eveningR.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: P.mu, fontWeight: 700, letterSpacing: 1, marginBottom: 6 } }, "EVENING"), eveningR.map(function(r) {
    return /* @__PURE__ */ React.createElement(RoutineRow, { key: r.id, routine: r });
  })), anytimeR.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: P.mu, fontWeight: 700, letterSpacing: 1, marginBottom: 6 } }, "ANYTIME"), anytimeR.map(function(r) {
    return /* @__PURE__ */ React.createElement(RoutineRow, { key: r.id, routine: r });
  })));
}
function TasksView(props) {
  var P = props.P, is = mkI(P);
  var [filter, setFilter] = useState("open");
  var [domFilter, setDomFilter] = useState("all");
  var [showAdd, setShowAdd] = useState(false);
  var domains = props.domains;
  var filtered = props.tasks.filter(function(t) {
    if (filter === "open" && t.done) return false;
    if (filter === "done" && !t.done) return false;
    if (domFilter !== "all" && t.domain_id !== domFilter) return false;
    return true;
  }).sort(function(a, b) {
    if (a.done !== b.done) return a.done ? 1 : -1;
    if (a.is_top3 !== b.is_top3) return a.is_top3 ? -1 : 1;
    var pa = { high: 0, medium: 1, low: 2 }[a.priority || "medium"];
    var pb = { high: 0, medium: 1, low: 2 }[b.priority || "medium"];
    if (pa !== pb) return pa - pb;
    if (a.due_date && b.due_date) return a.due_date.localeCompare(b.due_date);
    if (a.due_date) return -1;
    if (b.due_date) return 1;
    return 0;
  });
  var pillSt = function(active) {
    return { border: "1px solid " + (active ? P.hi : P.bd2), padding: "4px 10px", fontSize: 10, fontWeight: active ? 700 : 500, cursor: "pointer", borderRadius: 3, background: active ? P.hi + "22" : "transparent", color: active ? P.hi : P.mu };
  };
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 14px", borderBottom: "1px solid " + P.bd, display: "flex", alignItems: "center", flexWrap: "wrap", columnGap: 6, rowGap: 6, flexShrink: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", columnGap: 4 } }, ["open", "done", "all"].map(function(f) {
    return /* @__PURE__ */ React.createElement("button", { key: f, style: pillSt(filter === f), onClick: function() {
      setFilter(f);
    } }, f.charAt(0).toUpperCase() + f.slice(1));
  })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", columnGap: 4, flexWrap: "wrap", rowGap: 4 } }, /* @__PURE__ */ React.createElement("button", { style: pillSt(domFilter === "all"), onClick: function() {
    setDomFilter("all");
  } }, "All"), domains.map(function(d) {
    return /* @__PURE__ */ React.createElement("button", { key: d.id, style: pillSt(domFilter === d.id), onClick: function() {
      setDomFilter(d.id);
    } }, d.name);
  })), /* @__PURE__ */ React.createElement("div", { style: { marginLeft: "auto" } }, /* @__PURE__ */ React.createElement(PBtn, { P, onClick: function() {
    setShowAdd(true);
  } }, "+ Task"))), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, overflowY: "auto", padding: "10px 14px" } }, filtered.length === 0 && /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", padding: "32px", color: P.dim, fontSize: 12 } }, filter === "open" ? "No open tasks \u2014 add one above" : "No tasks here"), filtered.map(function(t) {
    var dom = domains.find(function(d) {
      return d.id === t.domain_id;
    });
    var priColor = { high: "#fca5a5", medium: P.mu, low: P.dim };
    return /* @__PURE__ */ React.createElement("div", { key: t.id, style: { display: "flex", alignItems: "flex-start", columnGap: 8, padding: "8px 10px", borderRadius: 3, border: "1px solid " + P.bd, marginBottom: 6, background: P.panel } }, /* @__PURE__ */ React.createElement(
      "div",
      {
        style: { width: 18, height: 18, borderRadius: 3, border: "1px solid " + P.bd2, flexShrink: 0, marginTop: 2, cursor: "pointer", background: t.done ? P.hi : "transparent", display: "flex", alignItems: "center", justifyContent: "center" },
        onClick: function() {
          props.onToggle(t);
        }
      },
      t.done && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: P.bg, fontWeight: 700 } }, "\u2713")
    ), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: t.done ? P.dim : P.tx, textDecoration: t.done ? "line-through" : "none", fontWeight: 500 } }, t.title), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: P.dim, marginTop: 3, display: "flex", flexWrap: "wrap", columnGap: 10, rowGap: 2 } }, t.due_date && /* @__PURE__ */ React.createElement("span", null, "Due ", t.due_date), t.time_slot && t.time_slot !== "any" && /* @__PURE__ */ React.createElement("span", { style: { textTransform: "capitalize" } }, t.time_slot), dom && /* @__PURE__ */ React.createElement("span", { style: { color: dom.color || P.mu } }, "\u25CF ", dom.name))), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, color: priColor[t.priority || "medium"], flexShrink: 0, paddingTop: 3, textTransform: "uppercase" } }, t.priority || "med"), /* @__PURE__ */ React.createElement(
      "button",
      {
        style: { background: "none", border: "none", color: t.is_top3 ? P.hi : P.bd2, cursor: "pointer", fontSize: 16, padding: "0 2px", flexShrink: 0 },
        onClick: function() {
          props.onTop3(t);
        },
        title: t.is_top3 ? "Remove from top 3" : "Add to top 3"
      },
      "\u2605"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        style: { background: "none", border: "none", color: P.dim, cursor: "pointer", fontSize: 12, padding: "0 2px", flexShrink: 0 },
        onClick: function() {
          props.onEdit(t);
        }
      },
      "\u270E"
    ));
  })), showAdd && /* @__PURE__ */ React.createElement(TaskEditModal, { P, domains, onSave: function(t) {
    props.onAdd(t);
    setShowAdd(false);
  }, onClose: function() {
    setShowAdd(false);
  } }));
}
function TaskEditModal(props) {
  var P = props.P, is = mkI(P);
  var init = props.task || {};
  var [title, setTitle] = useState(init.title || "");
  var [domId, setDomId] = useState(init.domain_id || "");
  var [priority, setPriority] = useState(init.priority || "medium");
  var [timeSlot, setTimeSlot] = useState(init.time_slot || "any");
  var [dueDate, setDueDate] = useState(init.due_date || "");
  var [notes, setNotes] = useState(init.notes || "");
  function save() {
    if (!title.trim()) {
      alert("Title required");
      return;
    }
    props.onSave({
      id: init.id,
      title: title.trim(),
      domain_id: domId || null,
      priority,
      time_slot: timeSlot,
      due_date: dueDate || null,
      notes,
      is_top3: init.is_top3 || false,
      done: init.done || false
    });
  }
  var pillSt = function(active, color) {
    return { border: "1px solid " + (active ? color || P.hi : P.bd2), padding: "4px 10px", fontSize: 10, fontWeight: active ? 700 : 500, cursor: "pointer", borderRadius: 3, background: active ? (color || P.hi) + "22" : "transparent", color: active ? color || P.hi : P.mu };
  };
  return /* @__PURE__ */ React.createElement(Mdl, { P, title: init.id ? "Edit Task" : "New Task", onClose: props.onClose, w: 440 }, /* @__PURE__ */ React.createElement(Fld, { P, label: "TITLE" }, /* @__PURE__ */ React.createElement("input", { autoFocus: true, value: title, onChange: function(e) {
    setTitle(e.target.value);
  }, style: is, placeholder: "What needs to be done?" })), /* @__PURE__ */ React.createElement(Fld, { P, label: "DOMAIN" }, /* @__PURE__ */ React.createElement("select", { value: domId, onChange: function(e) {
    setDomId(e.target.value);
  }, style: is }, /* @__PURE__ */ React.createElement("option", { value: "" }, "\u2014 No domain \u2014"), (props.domains || []).map(function(d) {
    return /* @__PURE__ */ React.createElement("option", { key: d.id, value: d.id }, d.name);
  }))), /* @__PURE__ */ React.createElement(Fld, { P, label: "PRIORITY" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", columnGap: 6 } }, ["high", "medium", "low"].map(function(p) {
    var colors = { high: "#fca5a5", medium: P.hi, low: P.mu };
    return /* @__PURE__ */ React.createElement("button", { key: p, style: pillSt(priority === p, colors[p]), onClick: function() {
      setPriority(p);
    } }, p);
  }))), /* @__PURE__ */ React.createElement(Fld, { P, label: "TIME SLOT" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", columnGap: 6, flexWrap: "wrap", rowGap: 4 } }, ["morning", "afternoon", "evening", "any"].map(function(s) {
    return /* @__PURE__ */ React.createElement("button", { key: s, style: pillSt(timeSlot === s), onClick: function() {
      setTimeSlot(s);
    } }, s);
  }))), /* @__PURE__ */ React.createElement(Fld, { P, label: "DUE DATE" }, /* @__PURE__ */ React.createElement("input", { type: "date", value: dueDate, onChange: function(e) {
    setDueDate(e.target.value);
  }, style: is })), /* @__PURE__ */ React.createElement(Fld, { P, label: "NOTES" }, /* @__PURE__ */ React.createElement("textarea", { value: notes, onChange: function(e) {
    setNotes(e.target.value);
  }, rows: 2, style: Object.assign({}, is, { resize: "vertical" }) })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", columnGap: 6, marginTop: 4 } }, /* @__PURE__ */ React.createElement(PBtn, { P, onClick: save, full: true }, init.id ? "Save" : "Add Task"), init.id && props.onDelete && /* @__PURE__ */ React.createElement(DBtn, { onClick: props.onDelete }, "Delete"), /* @__PURE__ */ React.createElement(SBtn, { P, onClick: props.onClose }, "Cancel")));
}
function RoutinesView(props) {
  var P = props.P, is = mkI(P);
  var [showAdd, setShowAdd] = useState(false);
  var today = dkey(/* @__PURE__ */ new Date());
  var isCompletedToday = function(r) {
    return (props.completions || []).some(function(c) {
      return c.routine_id === r.id && c.completed_on === today;
    });
  };
  var byTime = { morning: [], afternoon: [], evening: [], anytime: [] };
  (props.routines || []).forEach(function(r) {
    if (r.active) (byTime[r.time_of_day] || byTime.anytime).push(r);
  });
  function RoutineCard(rprops) {
    var r = rprops.r;
    var done = isCompletedToday(r);
    var pct = r.streak_type === "goal" && r.streak_goal > 0 ? Math.min(100, Math.round(r.streak_count / r.streak_goal * 100)) : null;
    return /* @__PURE__ */ React.createElement("div", { style: { border: "1px solid " + P.bd, borderRadius: 4, padding: "10px 12px", marginBottom: 6, background: done ? P.hi + "18" : P.panel } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", columnGap: 10 } }, /* @__PURE__ */ React.createElement(
      "div",
      {
        style: { width: 22, height: 22, borderRadius: "50%", border: "2px solid " + (done ? P.hi : P.bd2), flexShrink: 0, cursor: "pointer", background: done ? P.hi : "transparent", display: "flex", alignItems: "center", justifyContent: "center" },
        onClick: function() {
          props.onToggle(r, today);
        }
      },
      done && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: P.bg, fontWeight: 700 } }, "\u2713")
    ), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 500, color: done ? P.dim : P.tx, textDecoration: done ? "line-through" : "none" } }, r.title), r.description && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: P.dim, marginTop: 1 } }, r.description)), r.streak_count > 0 && /* @__PURE__ */ React.createElement("div", { style: { textAlign: "right", flexShrink: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: P.hi, fontWeight: 700 } }, "\u{1F525} ", r.streak_count), r.streak_best > 0 && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: P.dim } }, "best: ", r.streak_best)), /* @__PURE__ */ React.createElement("button", { onClick: function() {
      props.onEdit(r);
    }, style: { background: "none", border: "none", color: P.dim, cursor: "pointer", fontSize: 12, padding: "0 2px" } }, "\u270E")), pct !== null && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 3, fontSize: 10, color: P.dim } }, /* @__PURE__ */ React.createElement("span", null, "Goal progress"), /* @__PURE__ */ React.createElement("span", { style: { color: P.hi } }, r.streak_count, "/", r.streak_goal, " days (", pct, "%)")), /* @__PURE__ */ React.createElement("div", { style: { height: 4, background: P.bd2, borderRadius: 2, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { height: 4, width: pct + "%", background: P.hi, borderRadius: 2, transition: "width 0.3s" } }))));
  }
  var sections = [
    { key: "morning", label: "Morning" },
    { key: "afternoon", label: "Afternoon" },
    { key: "evening", label: "Evening" },
    { key: "anytime", label: "Anytime" }
  ];
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 14px", borderBottom: "1px solid " + P.bd, display: "flex", alignItems: "center", flexShrink: 0 } }, /* @__PURE__ */ React.createElement("span", { style: { flex: 1, fontSize: 13, fontWeight: 500, color: P.tx } }, "Routines"), /* @__PURE__ */ React.createElement(PBtn, { P, onClick: function() {
    setShowAdd(true);
  } }, "+ Routine")), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, overflowY: "auto", padding: "10px 14px" } }, sections.map(function(sec) {
    if (!byTime[sec.key] || byTime[sec.key].length === 0) return null;
    return /* @__PURE__ */ React.createElement("div", { key: sec.key, style: { marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: P.mu, fontWeight: 700, letterSpacing: 1, marginBottom: 8 } }, sec.label.toUpperCase()), byTime[sec.key].map(function(r) {
      return /* @__PURE__ */ React.createElement(RoutineCard, { key: r.id, r });
    }));
  }), (props.routines || []).filter(function(r) {
    return r.active;
  }).length === 0 && /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", padding: "32px", color: P.dim, fontSize: 12 } }, "No routines yet \u2014 add one above")), showAdd && /* @__PURE__ */ React.createElement(RoutineEditModal, { P, domains: props.domains || [], onSave: function(r) {
    props.onAdd(r);
    setShowAdd(false);
  }, onClose: function() {
    setShowAdd(false);
  } }));
}
function RoutineEditModal(props) {
  var P = props.P, is = mkI(P);
  var init = props.routine || {};
  var [title, setTitle] = useState(init.title || "");
  var [desc, setDesc] = useState(init.description || "");
  var [tod, setTod] = useState(init.time_of_day || "morning");
  var [sType, setSType] = useState(init.streak_type || "ongoing");
  var [sGoal, setSGoal] = useState(init.streak_goal || 30);
  var [notify, setNotify] = useState(!!init.notify);
  var [domId, setDomId] = useState(init.domain_id || "");
  function save() {
    if (!title.trim()) {
      alert("Title required");
      return;
    }
    props.onSave({
      id: init.id,
      title: title.trim(),
      description: desc,
      domain_id: domId || null,
      time_of_day: tod,
      streak_type: sType,
      streak_goal: sGoal,
      notify,
      active: true,
      streak_count: init.streak_count || 0,
      streak_best: init.streak_best || 0
    });
  }
  var pillSt = function(active) {
    return { border: "1px solid " + (active ? P.hi : P.bd2), padding: "4px 10px", fontSize: 10, fontWeight: active ? 700 : 500, cursor: "pointer", borderRadius: 3, background: active ? P.hi + "22" : "transparent", color: active ? P.hi : P.mu };
  };
  return /* @__PURE__ */ React.createElement(Mdl, { P, title: init.id ? "Edit Routine" : "New Routine", onClose: props.onClose, w: 440 }, /* @__PURE__ */ React.createElement(Fld, { P, label: "TITLE" }, /* @__PURE__ */ React.createElement("input", { autoFocus: true, value: title, onChange: function(e) {
    setTitle(e.target.value);
  }, style: is, placeholder: "e.g. Morning PT, Review emails" })), /* @__PURE__ */ React.createElement(Fld, { P, label: "DESCRIPTION (optional)" }, /* @__PURE__ */ React.createElement("input", { value: desc, onChange: function(e) {
    setDesc(e.target.value);
  }, style: is })), /* @__PURE__ */ React.createElement(Fld, { P, label: "TIME OF DAY" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", columnGap: 5, flexWrap: "wrap", rowGap: 4 } }, ["morning", "afternoon", "evening", "anytime"].map(function(t) {
    return /* @__PURE__ */ React.createElement("button", { key: t, style: pillSt(tod === t), onClick: function() {
      setTod(t);
    } }, t);
  }))), /* @__PURE__ */ React.createElement(Fld, { P, label: "DOMAIN" }, /* @__PURE__ */ React.createElement("select", { value: domId, onChange: function(e) {
    setDomId(e.target.value);
  }, style: is }, /* @__PURE__ */ React.createElement("option", { value: "" }, "\u2014 No domain \u2014"), (props.domains || []).map(function(d) {
    return /* @__PURE__ */ React.createElement("option", { key: d.id, value: d.id }, d.name);
  }))), /* @__PURE__ */ React.createElement(Fld, { P, label: "STREAK TYPE" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", columnGap: 6 } }, /* @__PURE__ */ React.createElement("button", { style: pillSt(sType === "ongoing"), onClick: function() {
    setSType("ongoing");
  } }, "Ongoing"), /* @__PURE__ */ React.createElement("button", { style: pillSt(sType === "goal"), onClick: function() {
    setSType("goal");
  } }, "Goal (N days)"))), sType === "goal" && /* @__PURE__ */ React.createElement(Fld, { P, label: "GOAL (days)" }, /* @__PURE__ */ React.createElement("input", { type: "number", min: 1, max: 365, value: sGoal, onChange: function(e) {
    setSGoal(+e.target.value);
  }, style: Object.assign({}, is, { width: 100 }) })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", columnGap: 6, marginTop: 4 } }, /* @__PURE__ */ React.createElement(PBtn, { P, onClick: save, full: true }, init.id ? "Save" : "Add Routine"), init.id && props.onDelete && /* @__PURE__ */ React.createElement(DBtn, { onClick: props.onDelete }, "Delete"), /* @__PURE__ */ React.createElement(SBtn, { P, onClick: props.onClose }, "Cancel")));
}
function DomainsSettings(props) {
  var P = props.P, is = mkI(P);
  var [showAdd, setShowAdd] = useState(false);
  var [newName, setNewName] = useState("");
  var [newColor, setNewColor] = useState("#8aaa7c");
  var domColors = ["#4a7c6f", "#8aaa7c", "#d4a853", "#5c8fa8", "#a87c5c", "#7c5ca8", "#c84b4b", "#4b8cc8"];
  function addDomain() {
    if (!newName.trim()) return;
    props.onAdd({ name: newName.trim(), color: newColor, icon: "circle", ord: props.domains.length });
    setNewName("");
    setShowAdd(false);
  }
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: P.hi, fontWeight: 700, letterSpacing: 1, marginBottom: 12 } }, "DOMAINS"), props.domains.map(function(d) {
    return /* @__PURE__ */ React.createElement("div", { key: d.id, style: { display: "flex", alignItems: "center", columnGap: 8, marginBottom: 6, padding: "7px 10px", borderRadius: 3, border: "1px solid " + P.bd, background: P.panel } }, /* @__PURE__ */ React.createElement("div", { style: { width: 12, height: 12, borderRadius: 3, background: d.color, flexShrink: 0 } }), /* @__PURE__ */ React.createElement("span", { style: { flex: 1, fontSize: 12, color: P.tx } }, d.name), /* @__PURE__ */ React.createElement("button", { onClick: function() {
      props.onDelete(d);
    }, style: { background: "none", border: "none", color: "#fca5a5", cursor: "pointer", fontSize: 12 } }, "\xD7"));
  }), !showAdd ? /* @__PURE__ */ React.createElement(SBtn, { P, onClick: function() {
    setShowAdd(true);
  } }, "+ Add Domain") : /* @__PURE__ */ React.createElement("div", { style: { marginTop: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", columnGap: 4, rowGap: 4, marginBottom: 8 } }, domColors.map(function(c) {
    return /* @__PURE__ */ React.createElement("div", { key: c, onClick: function() {
      setNewColor(c);
    }, style: { width: 20, height: 20, borderRadius: 3, background: c, cursor: "pointer", border: "2px solid " + (newColor === c ? "#fff" : "transparent") } });
  })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", columnGap: 6 } }, /* @__PURE__ */ React.createElement("input", { value: newName, onChange: function(e) {
    setNewName(e.target.value);
  }, placeholder: "Domain name", style: Object.assign({}, is, { flex: 1 }), onKeyDown: function(e) {
    if (e.key === "Enter") addDomain();
  } }), /* @__PURE__ */ React.createElement(PBtn, { P, onClick: addDomain }, "Add"), /* @__PURE__ */ React.createElement(SBtn, { P, onClick: function() {
    setShowAdd(false);
  } }, "Cancel"))));
}
function QuickCaptureModal(props) {
  var P = props.P, is = mkI(P);
  var [text, setText] = useState("");
  var [type, setType] = useState("task");
  var [domId, setDomId] = useState("");
  function save() {
    if (!text.trim()) return;
    props.onSave({ text: text.trim(), type, domain_id: domId || null });
  }
  return /* @__PURE__ */ React.createElement(Mdl, { P, title: "Quick Capture", sub: "Add a task, note, or idea fast", onClose: props.onClose, w: 400 }, /* @__PURE__ */ React.createElement(Fld, { P, label: "TYPE" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", columnGap: 5 } }, ["task", "note", "idea"].map(function(t) {
    var a = type === t;
    return /* @__PURE__ */ React.createElement("button", { key: t, style: { border: "1px solid " + (a ? P.hi : P.bd2), padding: "5px 12px", fontSize: 11, fontWeight: a ? 700 : 500, cursor: "pointer", borderRadius: 3, background: a ? P.hi + "22" : "transparent", color: a ? P.hi : P.mu }, onClick: function() {
      setType(t);
    } }, t.charAt(0).toUpperCase() + t.slice(1));
  }))), /* @__PURE__ */ React.createElement(Fld, { P, label: "CONTENT" }, /* @__PURE__ */ React.createElement("textarea", { autoFocus: true, value: text, onChange: function(e) {
    setText(e.target.value);
  }, rows: 3, placeholder: type === "task" ? "What needs to be done?" : type === "idea" ? "Capture the idea..." : "Quick note...", style: Object.assign({}, is, { resize: "vertical" }), onKeyDown: function(e) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) save();
  } })), /* @__PURE__ */ React.createElement(Fld, { P, label: "DOMAIN (optional)" }, /* @__PURE__ */ React.createElement("select", { value: domId, onChange: function(e) {
    setDomId(e.target.value);
  }, style: is }, /* @__PURE__ */ React.createElement("option", { value: "" }, "\u2014 None \u2014"), (props.domains || []).map(function(d) {
    return /* @__PURE__ */ React.createElement("option", { key: d.id, value: d.id }, d.name);
  }))), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: P.dim, marginBottom: 10 } }, "Tip: Cmd+Enter to save"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", columnGap: 6 } }, /* @__PURE__ */ React.createElement(PBtn, { P, onClick: save, full: true }, "Save"), /* @__PURE__ */ React.createElement(SBtn, { P, onClick: props.onClose }, "Cancel")));
}
function MyPlanApp() {
  var [session, setSession] = useState(null);
  var [authChecked, setAuthChecked] = useState(false);
  var [palKey, setPalKey] = useState("myplan");
  var P = PALETTES[palKey] || PALETTES.myplan || PALETTES.army;
  var [tab, setTab] = useState("today");
  var [unit, setUnit] = useState("1-68 AR, 3BCT, 4ID");
  var [lanes, setLanes] = useState(DEF_LANES);
  var [cats, setCats] = useState(DEF_CATS);
  var [evs, setEvs] = useState([]);
  var [rules, setRules] = useState([]);
  var [br, setBR] = useState(DEF_BR);
  var [view, setView] = useState("week");
  var [domains, setDomains] = useState([]);
  var [tasks, setTasks] = useState([]);
  var [routines, setRoutines] = useState([]);
  var [completions, setCompletions] = useState([]);
  var [evModal, setEvModal] = useState(null);
  var [detailId, setDetailId] = useState(null);
  var [lanesOpen, setLanesOpen] = useState(false);
  var [catsOpen, setCatsOpen] = useState(false);
  var [printOpen, setPrintOpen] = useState(false);
  var [brOpen, setBrOpen] = useState(false);
  var [brpOpen, setBrpOpen] = useState(false);
  var [fwOpen, setFwOpen] = useState(false);
  var [palOpen, setPalOpen] = useState(false);
  var [calSubOpen, setCalSubOpen] = useState(false);
  var [quickCapture, setQuickCapture] = useState(false);
  var [editTask, setEditTask] = useState(null);
  var [editRoutine, setEditRoutine] = useState(null);
  var [syncStatus, setSyncStatus] = useState("loading");
  var loadedRef = useRef(false);
  var saveTimerRef = useRef(null);
  useEffect(function() {
    var stored = getStoredSession();
    if (!stored || !stored.access_token) {
      setAuthChecked(true);
      return;
    }
    if (stored.refresh_token) {
      sbRefresh(stored.refresh_token).then(function(res) {
        if (res.access_token) {
          storeSession(res);
          setSession(res);
        } else {
          storeSession(null);
        }
        setAuthChecked(true);
      }).catch(function() {
        setSession(stored);
        setAuthChecked(true);
      });
    } else {
      setSession(stored);
      setAuthChecked(true);
    }
  }, []);
  useEffect(function() {
    if (!session) return;
    var uid = session.user ? session.user.id : session.id;
    var tok = session.access_token;
    setSyncStatus("loading");
    loadedRef.current = false;
    loadState(tok, uid).then(function(saved) {
      if (saved) {
        if (saved.unit != null) setUnit(saved.unit);
        if (saved.lanes != null) setLanes(saved.lanes);
        if (saved.cats != null) setCats(saved.cats);
        if (saved.evs != null) setEvs(saved.evs);
        if (saved.rules != null) setRules(saved.rules);
        if (saved.br != null) setBR(saved.br);
        if (saved.view != null) setView(saved.view);
        if (saved.palKey != null) setPalKey(saved.palKey);
        if (saved.nid != null) NID = saved.nid;
        if (saved.nlid != null) NLID = saved.nlid;
        if (saved.ncid != null) NCID = saved.ncid;
        if (saved.nrid != null) NRID = saved.nrid;
      }
    });
    var q = "user_id=eq." + uid + "&order=created_at.asc";
    Promise.all([
      sbFetch(tok, "domains?user_id=eq." + uid + "&order=ord.asc"),
      sbFetch(tok, "tasks?" + q),
      sbFetch(tok, "routines?user_id=eq." + uid + "&order=ord.asc"),
      sbFetch(tok, "routine_completions?user_id=eq." + uid + "&completed_on=gte." + getMonthAgo())
    ]).then(function(results) {
      var doms = Array.isArray(results[0]) ? results[0] : [];
      var tsks = Array.isArray(results[1]) ? results[1] : [];
      var ruts = Array.isArray(results[2]) ? results[2] : [];
      var comp = Array.isArray(results[3]) ? results[3] : [];
      if (doms.length === 0) {
        var defaults = [
          { name: "Professional", color: "#4a7c6f", icon: "building", ord: 0 },
          { name: "Personal", color: "#8aaa7c", icon: "home", ord: 1 },
          { name: "Projects & Ideas", color: "#d4a853", icon: "bulb", ord: 2 },
          { name: "Education", color: "#5c8fa8", icon: "school", ord: 3 },
          { name: "Health & Fitness", color: "#a87c5c", icon: "heart-rate-monitor", ord: 4 }
        ];
        defaults.forEach(function(d) {
          sbInsert(tok, "domains", Object.assign({ user_id: uid }, d));
        });
        setDomains(defaults.map(function(d, i) {
          return Object.assign({ id: "tmp_" + i }, d);
        }));
      } else {
        setDomains(doms);
      }
      setTasks(tsks);
      setRoutines(ruts);
      setCompletions(comp);
      loadedRef.current = true;
      setSyncStatus("idle");
    }).catch(function() {
      loadedRef.current = true;
      setSyncStatus("error");
    });
  }, [session]);
  function getMonthAgo() {
    var d = /* @__PURE__ */ new Date();
    d.setMonth(d.getMonth() - 1);
    return dkey(d);
  }
  useEffect(function() {
    if (!loadedRef.current || !session) return;
    setSyncStatus("saving");
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(function() {
      var uid2 = session.user ? session.user.id : session.id;
      saveState(session.access_token, uid2, {
        unit,
        lanes,
        cats,
        evs,
        rules,
        br,
        view,
        palKey,
        nid: NID,
        nlid: NLID,
        ncid: NCID,
        nrid: NRID
      }).then(function() {
        setSyncStatus("saved");
      }).catch(function() {
        setSyncStatus("error");
      });
    }, 800);
    return function() {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [unit, lanes, cats, evs, rules, br, view, palKey]);
  function addTask(task) {
    var uid = session.user ? session.user.id : session.id;
    var tok = session.access_token;
    sbInsert(tok, "tasks", Object.assign({ user_id: uid }, task)).then(function(res) {
      var created = Array.isArray(res) ? res[0] : res;
      if (created && created.id) setTasks(function(p) {
        return p.concat([created]);
      });
    });
  }
  function updateTask(task) {
    var tok = session.access_token;
    sbUpdate(tok, "tasks", task.id, task).then(function() {
      setTasks(function(p) {
        return p.map(function(t) {
          return t.id === task.id ? Object.assign({}, t, task) : t;
        });
      });
    });
  }
  function deleteTask(id) {
    var tok = session.access_token;
    sbDelete(tok, "tasks", id).then(function() {
      setTasks(function(p) {
        return p.filter(function(t) {
          return t.id !== id;
        });
      });
    });
  }
  function toggleTask(task) {
    var updated = Object.assign({}, task, { done: !task.done, done_at: !task.done ? (/* @__PURE__ */ new Date()).toISOString() : null });
    updateTask(updated);
  }
  function toggleTop3(task) {
    var updated = Object.assign({}, task, { is_top3: !task.is_top3 });
    updateTask(updated);
  }
  function addRoutine(routine) {
    var uid = session.user ? session.user.id : session.id;
    var tok = session.access_token;
    sbInsert(tok, "routines", Object.assign({ user_id: uid }, routine)).then(function(res) {
      var created = Array.isArray(res) ? res[0] : res;
      if (created && created.id) setRoutines(function(p) {
        return p.concat([created]);
      });
    });
  }
  function updateRoutine(routine) {
    var tok = session.access_token;
    sbUpdate(tok, "routines", routine.id, routine).then(function() {
      setRoutines(function(p) {
        return p.map(function(r) {
          return r.id === routine.id ? Object.assign({}, r, routine) : r;
        });
      });
    });
  }
  function deleteRoutine(id) {
    var tok = session.access_token;
    sbDelete(tok, "routines", id).then(function() {
      setRoutines(function(p) {
        return p.filter(function(r) {
          return r.id !== id;
        });
      });
    });
  }
  function toggleRoutine(routine, dateStr) {
    var uid = session.user ? session.user.id : session.id;
    var tok = session.access_token;
    var already = completions.some(function(c) {
      return c.routine_id === routine.id && c.completed_on === dateStr;
    });
    if (already) {
      var comp = completions.find(function(c) {
        return c.routine_id === routine.id && c.completed_on === dateStr;
      });
      if (comp) {
        sbDelete(tok, "routine_completions", comp.id).then(function() {
          setCompletions(function(p) {
            return p.filter(function(c) {
              return c.id !== comp.id;
            });
          });
          var newStreak = Math.max(0, routine.streak_count - 1);
          updateRoutine(Object.assign({}, routine, { streak_count: newStreak }));
        });
      }
    } else {
      sbInsert(tok, "routine_completions", { user_id: uid, routine_id: routine.id, completed_on: dateStr }).then(function(res) {
        var created = Array.isArray(res) ? res[0] : res;
        if (created) setCompletions(function(p) {
          return p.concat([created]);
        });
        var newStreak = (routine.streak_count || 0) + 1;
        var newBest = Math.max(routine.streak_best || 0, newStreak);
        updateRoutine(Object.assign({}, routine, { streak_count: newStreak, streak_best: newBest, last_completed: dateStr }));
      });
    }
  }
  function addDomain(domain) {
    var uid = session.user ? session.user.id : session.id;
    var tok = session.access_token;
    sbInsert(tok, "domains", Object.assign({ user_id: uid }, domain)).then(function(res) {
      var created = Array.isArray(res) ? res[0] : res;
      if (created && created.id) setDomains(function(p) {
        return p.concat([created]);
      });
    });
  }
  function deleteDomain(domain) {
    if (!confirm('Delete domain "' + domain.name + `"? Tasks in this domain won't be deleted.`)) return;
    var tok = session.access_token;
    sbDelete(tok, "domains", domain.id).then(function() {
      setDomains(function(p) {
        return p.filter(function(d) {
          return d.id !== domain.id;
        });
      });
    });
  }
  function handleQuickCapture(capture) {
    if (capture.type === "task") {
      addTask({
        title: capture.text,
        domain_id: capture.domain_id || null,
        priority: "medium",
        time_slot: "any",
        done: false,
        is_top3: false
      });
    }
    setQuickCapture(false);
  }
  function getCat(id) {
    return cats.find(function(c) {
      return c.id === id;
    }) || cats[cats.length - 1];
  }
  function getLane(id) {
    return lanes.find(function(l) {
      return l.id === id;
    });
  }
  var instances = useMemo(function() {
    return rules.reduce(function(acc, r) {
      var cat = getCat(r.catId);
      var insts = expand(r, br).map(function(inst) {
        return Object.assign({}, inst, { color: cat && cat.color || "#6B7280", isBR: inst.isBR || !!(cat && cat.isBR) });
      });
      return acc.concat(insts);
    }, []);
  }, [rules, br, cats]);
  var allEvs = useMemo(function() {
    return evs.concat(instances);
  }, [evs, instances]);
  var todayStr = dkey(/* @__PURE__ */ new Date());
  var todayEvs = useMemo(function() {
    return allEvs.filter(function(ev) {
      return ev.sd <= todayStr && ev.ed >= todayStr;
    }).sort(function(a, b) {
      return (a.st || "").localeCompare(b.st || "");
    });
  }, [allEvs, todayStr]);
  function openCreate(laneId, sd, ed) {
    var lane = lanes.find(function(l) {
      return l.id === laneId;
    });
    if (lane && lane.locked) return;
    setEvModal({ mode: "create", form: { title: "", laneId, catId: cats[0] && cats[0].id || "", sd, st: "08:00", ed, et: "17:00", loc: "", att: "", attReq: false, notes: "", files: [], isBR: false } });
  }
  function openEdit(ev) {
    setDetailId(null);
    if (ev.isRec) {
      var rule = rules.find(function(r) {
        return r.id === ev.recurId;
      });
      if (rule) {
        setEvModal({ mode: "edit", eid: rule.id, isRule: true, form: Object.assign({}, rule) });
        return;
      }
    }
    var lane = lanes.find(function(l) {
      return l.id === ev.laneId;
    });
    if (lane && lane.locked) return;
    setEvModal({ mode: "edit", eid: ev.id, form: Object.assign({}, ev) });
  }
  function saveEv(form) {
    var cat = getCat(form.catId), color = cat && cat.color || "#6B7280";
    if (form.isRecurringRule) {
      if (evModal.isRule) {
        setRules(function(p) {
          return p.map(function(r) {
            return r.id === evModal.eid ? Object.assign({}, r, form, { color }) : r;
          });
        });
      } else {
        setRules(function(p) {
          return p.concat([Object.assign({ id: NRID++ }, form, { color })]);
        });
      }
    } else {
      if (evModal.mode === "create") {
        setEvs(function(p) {
          return p.concat([Object.assign({ id: NID++ }, form, { color })]);
        });
      } else {
        setEvs(function(p) {
          return p.map(function(e) {
            return e.id === evModal.eid ? Object.assign({}, e, form, { color }) : e;
          });
        });
      }
    }
    setEvModal(null);
  }
  function delEv() {
    if (!evModal) return;
    if (evModal.isRule) {
      setRules(function(p) {
        return p.filter(function(r) {
          return r.id !== evModal.eid;
        });
      });
    } else {
      setEvs(function(p) {
        return p.filter(function(e) {
          return e.id !== evModal.eid;
        });
      });
    }
    setEvModal(null);
    setDetailId(null);
  }
  function saveCats(nc) {
    setCats(nc);
    setEvs(function(p) {
      return p.map(function(ev) {
        var c = nc.find(function(x) {
          return x.id === ev.catId;
        });
        return c ? Object.assign({}, ev, { color: c.color }) : ev;
      });
    });
    setRules(function(p) {
      return p.map(function(r) {
        var c = nc.find(function(x) {
          return x.id === r.catId;
        });
        return c ? Object.assign({}, r, { color: c.color }) : r;
      });
    });
    setCatsOpen(false);
  }
  function expCSV() {
    var hdr = ["Unit", "Lane", "Cat", "Title", "Start", "Time", "End", "Loc", "Att", "Mandatory", "Notes", "Recurring", "Pattern", "BR"];
    var rows = allEvs.map(function(ev) {
      var rule = ev.isRec ? rules.find(function(r) {
        return r.id === ev.recurId;
      }) : null;
      var isBREv = ev.isBR || !!(getCat(ev.catId) && getCat(ev.catId).isBR);
      return [unit, getLane(ev.laneId) && getLane(ev.laneId).label || "", getCat(ev.catId) && getCat(ev.catId).label || "", ev.title, ev.sd, ev.st || "", ev.ed, ev.loc || "", ev.att || "", ev.attReq ? "YES" : "NO", ev.notes || "", ev.isRec ? "YES" : "NO", rule ? recLabel(rule, br) : "", isBREv ? "YES" : "NO"];
    });
    var csv = [hdr].concat(rows).map(function(r) {
      return r.map(function(c) {
        return '"' + String(c).replace(/"/g, '""') + '"';
      }).join(",");
    }).join("\n");
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "LRTC_" + unit.replace(/\W/g, "_") + ".csv";
    a.click();
  }
  function signOut() {
    var tok = session ? session.access_token : null;
    if (tok) sbSignOut(tok).catch(function() {
    });
    storeSession(null);
    setUnit("1-68 AR, 3BCT, 4ID");
    setLanes(DEF_LANES);
    setCats(DEF_CATS);
    setEvs([]);
    setRules([]);
    setBR(DEF_BR);
    setView("week");
    setPalKey("myplan");
    setTasks([]);
    setRoutines([]);
    setDomains([]);
    setCompletions([]);
    loadedRef.current = false;
    setSyncStatus("loading");
    setSession(null);
  }
  var detailEv = detailId ? allEvs.find(function(e) {
    return e.id === detailId;
  }) : null;
  var detailRule = detailEv && detailEv.isRec ? rules.find(function(r) {
    return r.id === detailEv.recurId;
  }) : null;
  var firstOpen = lanes.find(function(l) {
    return !l.locked;
  }) || lanes[0];
  var is = mkI(P);
  if (!authChecked) {
    return /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "Arial,sans-serif", background: P.bg, height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: P.tx } }, /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 8, height: 8, background: P.hi, borderRadius: "50%", margin: "0 auto 10px" } }), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: P.mu } }, "Connecting\u2026")));
  }
  if (!session) {
    return /* @__PURE__ */ React.createElement(AuthScreen, { P, onAuth: function(s) {
      setSession(s);
      setAuthChecked(true);
    } });
  }
  if (syncStatus === "loading") {
    return /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "Arial,sans-serif", background: P.bg, height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: P.tx } }, /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 8, height: 8, background: P.hi, borderRadius: "50%", margin: "0 auto 10px" } }), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: P.mu } }, "Loading your plan\u2026")));
  }
  var tabs = [
    { id: "today", label: "Today", icon: "\u2600" },
    { id: "calendar", label: "Calendar", icon: "\u{1F4C5}" },
    { id: "tasks", label: "Tasks", icon: "\u2713" },
    { id: "routines", label: "Routines", icon: "\u{1F504}" },
    { id: "settings", label: "Settings", icon: "\u2699" }
  ];
  var syncColor = syncStatus === "error" ? "#f87171" : syncStatus === "saving" || syncStatus === "loading" ? P.dim : "#4ade80";
  return /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "Arial,sans-serif", background: P.bg, height: "100vh", display: "flex", flexDirection: "column", color: P.tx, userSelect: "none", overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { background: P.panel, borderBottom: "1px solid " + P.bd, padding: "8px 14px", display: "flex", alignItems: "center", flexWrap: "wrap", columnGap: 8, rowGap: 6, flexShrink: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", columnGap: 7, flexShrink: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 7, height: 7, background: P.hi, borderRadius: "50%" } }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14, fontWeight: 700, color: P.hi, letterSpacing: 0.5 } }, "MyPlan")), tab === "calendar" && /* @__PURE__ */ React.createElement("input", { value: unit, placeholder: "Unit designation", style: Object.assign({}, is, { width: 160, padding: "4px 8px", fontSize: 11, flexShrink: 0 }), onChange: function(e) {
    setUnit(e.target.value);
  } }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", columnGap: 5, fontSize: 9, color: P.dim } }, /* @__PURE__ */ React.createElement("div", { style: { width: 6, height: 6, borderRadius: "50%", background: syncColor } }), /* @__PURE__ */ React.createElement("span", null, syncStatus === "saving" ? "Saving\u2026" : syncStatus === "error" ? "Offline" : session && (session.user && session.user.email || session.email) || "Synced")), /* @__PURE__ */ React.createElement("button", { style: { border: "1px solid " + P.bd2, padding: "5px 9px", fontSize: 13, cursor: "pointer", borderRadius: 4, background: "transparent", color: P.hi, flexShrink: 0 }, title: "Color palette", onClick: function() {
    setPalOpen(true);
  } }, "\u25D1")), tab === "calendar" && /* @__PURE__ */ React.createElement("div", { style: { background: P.panel, borderBottom: "1px solid " + P.bd2, padding: "6px 14px", display: "flex", alignItems: "center", flexWrap: "wrap", columnGap: 5, rowGap: 5, flexShrink: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", background: P.bg, borderRadius: 3, padding: 2, flexShrink: 0 } }, VIEWS.map(function(vm) {
    var a = view === vm.id;
    return /* @__PURE__ */ React.createElement("button", { key: vm.id, style: { border: "none", padding: "4px 10px", fontSize: 10, fontWeight: a ? 700 : 500, cursor: "pointer", borderRadius: 3, background: a ? P.hi : "transparent", color: a ? P.bg : P.mu }, onClick: function() {
      setView(vm.id);
    } }, vm.label);
  })), /* @__PURE__ */ React.createElement("div", { style: { width: 1, height: 20, background: P.bd2, flexShrink: 0, alignSelf: "center" } }), /* @__PURE__ */ React.createElement("button", { style: { border: "none", padding: "6px 14px", fontSize: 11, fontWeight: 700, cursor: "pointer", borderRadius: 4, background: P.hi, color: P.bg, whiteSpace: "nowrap", flexShrink: 0 }, onClick: function() {
    openCreate(firstOpen && firstOpen.id || "", dkey(/* @__PURE__ */ new Date()), dkey(/* @__PURE__ */ new Date()));
  } }, "+ Add Event"), /* @__PURE__ */ React.createElement(Menu, { P, label: "Reports" }, /* @__PURE__ */ React.createElement(MenuItem, { P, onClick: function() {
    setBrpOpen(true);
  } }, "Battle Rhythm Product"), /* @__PURE__ */ React.createElement(MenuItem, { P, onClick: function() {
    setFwOpen(true);
  } }, "5W Table"), /* @__PURE__ */ React.createElement(MenuItem, { P, onClick: function() {
    setPrintOpen(true);
  } }, "Print Calendar"), /* @__PURE__ */ React.createElement(MenuItem, { P, onClick: expCSV }, "Export as CSV"), /* @__PURE__ */ React.createElement("div", { style: { height: 1, background: P.bd, margin: "4px 0" } }), /* @__PURE__ */ React.createElement(MenuItem, { P, onClick: function() {
    setCalSubOpen(true);
  } }, "Subscribe to Calendar")), /* @__PURE__ */ React.createElement(Menu, { P, label: "Setup" }, /* @__PURE__ */ React.createElement(MenuItem, { P, onClick: function() {
    setLanesOpen(true);
  }, tag: lanes.filter(function(l) {
    return l.locked;
  }).length > 0 ? lanes.filter(function(l) {
    return l.locked;
  }).length + " locked" : null }, "Swim Lanes"), /* @__PURE__ */ React.createElement(MenuItem, { P, onClick: function() {
    setCatsOpen(true);
  } }, "Categories"), /* @__PURE__ */ React.createElement(MenuItem, { P, onClick: function() {
    setBrOpen(true);
  }, tag: br.enabled ? "ON" : "OFF", tagColor: br.enabled ? P.hi : P.dim }, "Battle Rhythm"))), tab === "calendar" && /* @__PURE__ */ React.createElement("div", { style: { padding: "4px 14px 5px", display: "flex", flexWrap: "wrap", columnGap: 8, rowGap: 3, alignItems: "center", flexShrink: 0, borderBottom: "1px solid " + P.bd, background: P.bg } }, cats.map(function(c) {
    return /* @__PURE__ */ React.createElement("div", { key: c.id, style: { display: "flex", alignItems: "center", columnGap: 3 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 8, height: 8, background: c.color, borderRadius: 2, flexShrink: 0 } }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 8, color: P.dim } }, c.label + (c.isBR ? " *" : "")));
  }), br.enabled && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", flexWrap: "wrap", columnGap: 6, rowGap: 3, paddingLeft: 8, borderLeft: "1px solid " + P.bd } }, br.labels.map(function(lbl, i) {
    var hidden = (br.hidden || []).indexOf(i) !== -1;
    return /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", alignItems: "center", columnGap: 3, cursor: "pointer", opacity: hidden ? 0.3 : 1 }, onClick: function() {
      var hw = (br.hidden || []).slice(), pos = hw.indexOf(i);
      if (pos !== -1) hw.splice(pos, 1);
      else hw.push(i);
      setBR(function(p) {
        return Object.assign({}, p, { hidden: hw });
      });
    } }, /* @__PURE__ */ React.createElement("div", { style: { width: 8, height: 8, background: br.colors[i] || P.panel, borderRadius: 2, flexShrink: 0 } }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 8, color: P.dim, textDecoration: hidden ? "line-through" : "none" } }, lbl));
  }))), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", minHeight: 0 } }, tab === "today" && /* @__PURE__ */ React.createElement(
    TodayView,
    {
      P,
      tasks,
      routines,
      completions,
      todayEvs,
      cats,
      domains,
      onTaskToggle: toggleTask,
      onTaskTop3: toggleTop3,
      onRoutineToggle: toggleRoutine,
      onQuickAdd: function() {
        setQuickCapture(true);
      }
    }
  ), tab === "calendar" && /* @__PURE__ */ React.createElement(
    Timeline,
    {
      P,
      lanes,
      cats,
      evs: allEvs,
      br,
      viewMode: view,
      onCreate: openCreate,
      onDetail: function(id) {
        setDetailId(id);
      }
    }
  ), tab === "tasks" && /* @__PURE__ */ React.createElement(
    TasksView,
    {
      P,
      tasks,
      domains,
      onToggle: toggleTask,
      onTop3: toggleTop3,
      onAdd: addTask,
      onEdit: function(t) {
        setEditTask(t);
      }
    }
  ), tab === "routines" && /* @__PURE__ */ React.createElement(
    RoutinesView,
    {
      P,
      routines,
      completions,
      domains,
      onToggle: toggleRoutine,
      onAdd: addRoutine,
      onEdit: function(r) {
        setEditRoutine(r);
      }
    }
  ), tab === "settings" && /* @__PURE__ */ React.createElement("div", { style: { padding: "14px", overflowY: "auto", flex: 1 } }, /* @__PURE__ */ React.createElement(DomainsSettings, { P, domains, onAdd: addDomain, onDelete: deleteDomain }), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 20, paddingTop: 16, borderTop: "1px solid " + P.bd } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: P.hi, fontWeight: 700, letterSpacing: 1, marginBottom: 10 } }, "ACCOUNT"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: P.mu, marginBottom: 10 } }, session && (session.user && session.user.email || session.email)), /* @__PURE__ */ React.createElement(SBtn, { P, onClick: signOut }, "Sign Out")), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 20, paddingTop: 16, borderTop: "1px solid " + P.bd } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: P.hi, fontWeight: 700, letterSpacing: 1, marginBottom: 10 } }, "PALETTE"), /* @__PURE__ */ React.createElement(SBtn, { P, onClick: function() {
    setPalOpen(true);
  } }, "Change Color Theme")))), /* @__PURE__ */ React.createElement("div", { style: { background: P.panel, borderTop: "2px solid " + P.hi, display: "flex", flexShrink: 0, paddingTop: 8, paddingBottom: 34, paddingLeft: 4, paddingRight: 4, minHeight: 90 } }, tabs.map(function(t) {
    var active = tab === t.id;
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: t.id,
        style: { flex: 1, border: "none", background: "transparent", paddingTop: 8, paddingBottom: 4, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", rowGap: 4 },
        onClick: function() {
          setTab(t.id);
        }
      },
      /* @__PURE__ */ React.createElement("span", { style: { fontSize: 22, lineHeight: 1 } }, t.icon),
      /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, fontWeight: active ? 700 : 500, color: active ? P.hi : P.mu } }, t.label),
      active && /* @__PURE__ */ React.createElement("div", { style: { width: 20, height: 2, borderRadius: 1, background: P.hi, marginTop: 2 } })
    );
  })), evModal && /* @__PURE__ */ React.createElement(EvModal, { P, mode: evModal.mode, init: evModal.form, lanes, cats, br, onSave: saveEv, onDelete: evModal.mode === "edit" ? delEv : null, onClose: function() {
    setEvModal(null);
  } }), detailEv && /* @__PURE__ */ React.createElement(EvDetail, { P, ev: detailEv, lane: getLane(detailEv.laneId), cat: getCat(detailEv.catId), br, recRule: detailRule, onEdit: function() {
    openEdit(detailEv);
  }, onClose: function() {
    setDetailId(null);
  } }), lanesOpen && /* @__PURE__ */ React.createElement(LanesModal, { P, lanes, onSave: function(l) {
    setLanes(l);
    setLanesOpen(false);
  }, onClose: function() {
    setLanesOpen(false);
  } }), catsOpen && /* @__PURE__ */ React.createElement(CatsModal, { P, cats, onSave: saveCats, onClose: function() {
    setCatsOpen(false);
  } }), printOpen && /* @__PURE__ */ React.createElement(PrintModal, { P, evs: allEvs, unit, lanes, cats, onClose: function() {
    setPrintOpen(false);
  } }), brOpen && /* @__PURE__ */ React.createElement(BRModal, { P, br, onSave: function(c) {
    setBR(c);
    setBrOpen(false);
  }, onClose: function() {
    setBrOpen(false);
  } }), brpOpen && /* @__PURE__ */ React.createElement(BRProdModal, { P, evs: allEvs, unit, lanes, cats, rules, br, onClose: function() {
    setBrpOpen(false);
  } }), fwOpen && /* @__PURE__ */ React.createElement(FiveWModal, { P, evs: allEvs, unit, lanes, cats, rules, br, onClose: function() {
    setFwOpen(false);
  } }), palOpen && /* @__PURE__ */ React.createElement(PalModal, { P, current: palKey, onSelect: setPalKey, onClose: function() {
    setPalOpen(false);
  } }), calSubOpen && /* @__PURE__ */ React.createElement(CalSubModal, { P, userId: session && (session.user ? session.user.id : session.id), lanes, onClose: function() {
    setCalSubOpen(false);
  } }), quickCapture && /* @__PURE__ */ React.createElement(QuickCaptureModal, { P, domains, onSave: handleQuickCapture, onClose: function() {
    setQuickCapture(false);
  } }), editTask && /* @__PURE__ */ React.createElement(TaskEditModal, { P, task: editTask, domains, onSave: function(t) {
    updateTask(t);
    setEditTask(null);
  }, onDelete: function() {
    deleteTask(editTask.id);
    setEditTask(null);
  }, onClose: function() {
    setEditTask(null);
  } }), editRoutine && /* @__PURE__ */ React.createElement(RoutineEditModal, { P, routine: editRoutine, domains, onSave: function(r) {
    updateRoutine(r);
    setEditRoutine(null);
  }, onDelete: function() {
    deleteRoutine(editRoutine.id);
    setEditRoutine(null);
  }, onClose: function() {
    setEditRoutine(null);
  } }));
}
window.__MyPlanApp = MyPlanApp;
