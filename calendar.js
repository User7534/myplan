// Netlify Edge Function — serves a live .ics calendar feed
// URL patterns:
//   /calendar/{userId}.ics              — full calendar
//   /calendar/{userId}/br.ics           — BR events only
//   /calendar/{userId}/lane/{laneId}.ics — single swim lane

const SUPA_URL = "https://lbbmoazozmasvhtalwsg.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxiYm1vYXpvem1hc3ZodGFsd3NnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM4ODQ1MTQsImV4cCI6MjA5OTQ2MDUxNH0.3_NjaeXQSW3eSu3LBTIYISFFOjEtKXi5yO5CFERF_AI";

// ── ICS helpers ───────────────────────────────────────────────────────────────
function icsDate(dateStr, timeStr) {
  // dateStr: "YYYY-MM-DD", timeStr: "HH:MM" or ""
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split("-");
  if (!timeStr) {
    // All-day event — date-only format
    return `${y}${m}${d}`;
  }
  const [hh, mm] = timeStr.split(":");
  // Return UTC datetime (Z suffix) — treats input as local time approximation
  return `${y}${m}${d}T${hh}${mm}00`;
}

function icsText(str) {
  if (!str) return "";
  // Escape special chars per RFC 5545
  return str
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "");
}

function foldLine(line) {
  // RFC 5545: lines must be <= 75 octets, fold with CRLF + space
  if (line.length <= 75) return line;
  let out = "";
  while (line.length > 75) {
    out += line.slice(0, 75) + "\r\n ";
    line = line.slice(75);
  }
  return out + line;
}

function makeUID(id, userId) {
  return `myplan-${userId}-${id}@cosmic-nougat-a9346c.netlify.app`;
}

function eventToVEVENT(ev, cats, lanes, userId) {
  const cat  = cats.find(c => c.id === ev.catId)  || {};
  const lane = lanes.find(l => l.id === ev.laneId) || {};
  const uid  = makeUID(ev.id, userId);

  const startDate = icsDate(ev.sd, ev.st || "");
  const endDate   = icsDate(ev.ed, ev.et || "");
  if (!startDate) return null;

  // For all-day events use DATE value type; for timed events use DATETIME
  const isAllDay = !ev.st;
  const dtStart  = isAllDay
    ? `DTSTART;VALUE=DATE:${startDate}`
    : `DTSTART:${startDate}`;
  // End date for all-day: add 1 day (ICS convention — end is exclusive)
  let dtEnd;
  if (isAllDay) {
    const [y, m, d] = ev.ed.split("-").map(Number);
    const next = new Date(y, m - 1, d + 1);
    const ny = next.getFullYear();
    const nm = String(next.getMonth() + 1).padStart(2, "0");
    const nd = String(next.getDate()).padStart(2, "0");
    dtEnd = `DTEND;VALUE=DATE:${ny}${nm}${nd}`;
  } else {
    dtEnd = `DTEND:${endDate}`;
  }

  const now = new Date().toISOString().replace(/[-:.]/g, "").slice(0, 15) + "Z";

  const descParts = [];
  if (lane.label)  descParts.push(`Lane: ${lane.label}`);
  if (cat.label)   descParts.push(`Category: ${cat.label}`);
  if (ev.att)      descParts.push(`Attendees: ${ev.att}`);
  if (ev.notes)    descParts.push(ev.notes);
  if (ev.isRec)    descParts.push("(Recurring instance)");
  if (ev.isBR || cat.isBR) descParts.push("[Battle Rhythm Event]");

  const lines = [
    "BEGIN:VEVENT",
    foldLine(`UID:${makeUID(ev.id, userId)}`),
    foldLine(`DTSTAMP:${now}`),
    foldLine(dtStart),
    foldLine(dtEnd),
    foldLine(`SUMMARY:${icsText(ev.title)}`),
  ];

  if (descParts.length)    lines.push(foldLine(`DESCRIPTION:${icsText(descParts.join("\\n"))}`));
  if (ev.loc)              lines.push(foldLine(`LOCATION:${icsText(ev.loc)}`));
  if (cat.color)           lines.push(foldLine(`COLOR:${cat.color}`));
  if (lane.label)          lines.push(foldLine(`CATEGORIES:${icsText(lane.label)}${cat.label ? "," + icsText(cat.label) : ""}`));

  lines.push("END:VEVENT");
  return lines.join("\r\n");
}

// ── Recurrence expansion (mirrors app logic, simplified for ICS) ──────────────
function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}
function dkey(d) {
  return d.getFullYear() + "-" +
    String(d.getMonth() + 1).padStart(2, "0") + "-" +
    String(d.getDate()).padStart(2, "0");
}
function pkey(k) {
  const [y, m, d] = k.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function expandRule(rule) {
  if (!rule.rs || !rule.re) return [];
  const rs  = pkey(rule.rs), re = pkey(rule.re);
  const iv  = Math.max(1, rule.iv || 1);
  const t   = rule.type || "weekly";
  const out = [];

  function mkInst(sd) {
    const ed = dkey(addDays(pkey(sd), Math.max(0, (rule.dur || 1) - 1)));
    return { ...rule, id: rule.id + "_" + sd, sd, ed, isRec: true };
  }

  if (t === "daily") {
    let d = new Date(rs);
    while (d <= re) { out.push(mkInst(dkey(d))); d = addDays(d, iv); }
  } else if (t === "weekly") {
    const dows = (rule.dows && rule.dows.length > 0) ? rule.dows : [rule.dow != null ? rule.dow : 1];
    let cur = addDays(rs, -(rs.getDay())), seen = {};
    while (cur <= re) {
      for (const dow of dows) {
        const c = addDays(cur, dow), ck = dkey(c);
        if (c >= rs && c <= re && !seen[ck]) { seen[ck] = 1; out.push(mkInst(ck)); }
      }
      cur = addDays(cur, 7 * iv);
    }
  } else if (t === "monthly-date") {
    const dom = rule.dom || 1;
    let m = new Date(rs.getFullYear(), rs.getMonth(), 1);
    while (m <= re) {
      const c = new Date(m.getFullYear(), m.getMonth(), dom);
      if (c.getMonth() === m.getMonth() && c >= rs && c <= re) out.push(mkInst(dkey(c)));
      m = new Date(m.getFullYear(), m.getMonth() + iv, 1);
    }
  } else if (t === "annual") {
    let y = rs.getFullYear();
    while (y <= re.getFullYear()) {
      const c = new Date(y, rule.amo || 0, rule.ady || 1);
      if (c >= rs && c <= re) out.push(mkInst(dkey(c)));
      y++;
    }
  }
  return out;
}

// ── Main handler ──────────────────────────────────────────────────────────────
export default async function handler(req) {
  const url      = new URL(req.url);
  const parts    = url.pathname.split("/").filter(Boolean);
  // parts: ["calendar", "{userId}.ics"]  or
  //        ["calendar", "{userId}", "br.ics"]  or
  //        ["calendar", "{userId}", "lane", "{laneId}.ics"]

  if (parts[0] !== "calendar") {
    return new Response("Not found", { status: 404 });
  }

  // Parse userId and filter type
  let userId, filterType, filterId;
  if (parts[1] && parts[1].endsWith(".ics")) {
    userId     = parts[1].replace(".ics", "");
    filterType = "all";
  } else if (parts[2] === "br.ics") {
    userId     = parts[1];
    filterType = "br";
  } else if (parts[2] === "lane" && parts[3]) {
    userId     = parts[1];
    filterType = "lane";
    filterId   = parts[3].replace(".ics", "");
  } else {
    return new Response("Invalid calendar URL", { status: 400 });
  }

  if (!userId || userId.length < 10) {
    return new Response("Invalid user ID", { status: 400 });
  }

  // Fetch calendar state from Supabase
  let state;
  try {
    const res  = await fetch(
      `${SUPA_URL}/rest/v1/lrtc_calendars?user_id=eq.${userId}&select=state`,
      { headers: { "apikey": SUPA_KEY, "Authorization": `Bearer ${SUPA_KEY}` } }
    );
    const rows = await res.json();
    if (!rows || !rows.length || !rows[0].state) {
      return new Response("Calendar not found", { status: 404 });
    }
    state = rows[0].state;
  } catch (e) {
    return new Response("Database error", { status: 500 });
  }

  const { evs = [], rules = [], cats = [], lanes = [], unit = "MyPlan" } = state;

  // Expand recurring rules into instances
  const recurInstances = rules.flatMap(r => expandRule(r));
  const allEvents = [...evs, ...recurInstances];

  // Apply filter
  let filtered = allEvents;
  if (filterType === "br") {
    filtered = allEvents.filter(ev => {
      const cat = cats.find(c => c.id === ev.catId);
      return ev.isBR || (cat && cat.isBR);
    });
  } else if (filterType === "lane") {
    filtered = allEvents.filter(ev => ev.laneId === filterId);
  }

  // Filter to a sensible window: 1 year back, 2 years forward
  const now  = new Date();
  const past = new Date(now.getFullYear() - 1, now.getMonth(), 1);
  const fut  = new Date(now.getFullYear() + 2, now.getMonth(), 1);
  filtered = filtered.filter(ev => {
    if (!ev.sd) return false;
    const d = pkey(ev.sd);
    return d >= past && d <= fut;
  });

  // Build feed name
  const laneForName = filterType === "lane"
    ? (lanes.find(l => l.id === filterId) || {}).label
    : null;
  const feedName = filterType === "all" ? `${unit} — Full Calendar`
    : filterType === "br"               ? `${unit} — Battle Rhythm`
    : `${unit} — ${laneForName || filterId}`;

  // Build .ics content
  const vevents = filtered
    .map(ev => eventToVEVENT(ev, cats, lanes, userId))
    .filter(Boolean)
    .join("\r\n");

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//MyPlan//LRTC Calendar//EN`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    foldLine(`X-WR-CALNAME:${feedName}`),
    foldLine(`X-WR-CALDESC:${feedName} — exported from MyPlan`),
    "X-WR-TIMEZONE:America/New_York",
    "REFRESH-INTERVAL;VALUE=DURATION:PT1H",
    "X-PUBLISHED-TTL:PT1H",
    vevents,
    "END:VCALENDAR",
  ].join("\r\n");

  return new Response(ics, {
    status: 200,
    headers: {
      "Content-Type":        "text/calendar; charset=utf-8",
      "Content-Disposition": `inline; filename="${filterType}.ics"`,
      "Cache-Control":       "no-cache, max-age=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export const config = { path: "/calendar/*" };
