"use client";
import { useState } from "react";
import { today } from "@/lib/dates";

export const defaultFilter = { range: "all", month: "", date: "", slot: "all" };

const pad = (n) => String(n).padStart(2, "0");
const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const addDays = (s, n) => {
  const d = new Date(s + "T00:00:00");
  d.setDate(d.getDate() + n);
  return iso(d);
};
const nextMonthKey = (s) => {
  const d = new Date(s.slice(0, 7) + "-01T00:00:00");
  d.setMonth(d.getMonth() + 1);
  return iso(d).slice(0, 7);
};
const monthLabel = (m) =>
  new Date(m + "-01T00:00:00").toLocaleDateString("en-GB", { month: "long", year: "numeric" });

function slotOf(t) {
  const h = Number((t || "00:00").slice(0, 2));
  return h < 12 ? "morning" : h < 17 ? "afternoon" : "evening";
}

export function applyFilter(list, f) {
  const t = today();
  return list.filter((r) => {
    const d = r.appointment_date;
    if (f.date && d !== f.date) return false;
    if (f.month && d.slice(0, 7) !== f.month) return false;
    if (f.range === "today" && d !== t) return false;
    if (f.range === "tomorrow" && d !== addDays(t, 1)) return false;
    if (f.range === "week" && !(d >= t && d <= addDays(t, 6))) return false;
    if (f.range === "month" && d.slice(0, 7) !== t.slice(0, 7)) return false;
    if (f.range === "next" && d.slice(0, 7) !== nextMonthKey(t)) return false;
    if (f.slot !== "all" && slotOf(r.appointment_time) !== f.slot) return false;
    return true;
  });
}

const CHIPS = [
  ["all", "All"],
  ["today", "Today"],
  ["tomorrow", "Tomorrow"],
  ["week", "Next 7 days"],
  ["month", "This month"],
  ["next", "Next month"],
];

export function FilterBar({ value, onChange, rows, children }) {
  const months = [...new Set(rows.map((r) => r.appointment_date.slice(0, 7)))].sort();
  const set = (patch) => onChange({ ...value, ...patch });
  const active = value.range !== "all" || value.month || value.date || value.slot !== "all";

  return (
    <div className="fbar">
      <div className="seg">
        {CHIPS.map(([k, label]) => (
          <button
            key={k}
            className={`b ghost ${value.range === k && !value.month && !value.date ? "on" : ""}`}
            onClick={() => set({ range: k, month: "", date: "" })}
          >
            {label}
          </button>
        ))}
      </div>

      <select value={value.month} onChange={(e) => set({ month: e.target.value, range: "all", date: "" })}>
        <option value="">All months</option>
        {months.map((m) => (
          <option key={m} value={m}>{monthLabel(m)}</option>
        ))}
      </select>

      <input type="date" title="Pick a date" value={value.date}
        onChange={(e) => set({ date: e.target.value, range: "all", month: "" })} />

      <select value={value.slot} onChange={(e) => set({ slot: e.target.value })}>
        <option value="all">Any time</option>
        <option value="morning">Morning (before 12)</option>
        <option value="afternoon">Afternoon (12 - 5)</option>
        <option value="evening">Evening (after 5)</option>
      </select>

      {children}

      {active && (
        <button className="b no" onClick={() => onChange(defaultFilter)}>Clear</button>
      )}
    </div>
  );
}

export function Pager({ page, pages, total, per, onPage, onPer }) {
  if (!total) return null;
  const from = (page - 1) * per + 1;
  const to = Math.min(total, page * per);
  return (
    <div className="pager">
      <span className="muted">Showing {from}-{to} of {total}</span>
      <div className="pager-ctl">
        <span className="muted">Rows</span>
        <select value={per} onChange={(e) => onPer(Number(e.target.value))}>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={25}>25</option>
        </select>
        <button className="b ghost" disabled={page <= 1} onClick={() => onPage(page - 1)}>Prev</button>
        <b>{page} / {pages}</b>
        <button className="b ghost" disabled={page >= pages} onClick={() => onPage(page + 1)}>Next</button>
      </div>
    </div>
  );
}

export function MonthCalendar({ rows, selected, onPick }) {
  const [cur, setCur] = useState(today().slice(0, 7));
  const [y, m] = cur.split("-").map(Number);

  const counts = {};
  rows.forEach((r) => {
    if (["pending", "accepted", "completed"].includes(r.status)) {
      counts[r.appointment_date] = (counts[r.appointment_date] || 0) + 1;
    }
  });

  const offset = (new Date(y, m - 1, 1).getDay() + 6) % 7; // Monday se shuru
  const days = new Date(y, m, 0).getDate();
  const cells = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(`${cur}-${pad(d)}`);

  const shift = (n) => {
    const d = new Date(y, m - 1 + n, 1);
    setCur(`${d.getFullYear()}-${pad(d.getMonth() + 1)}`);
  };

  return (
    <div className="cal">
      <div className="cal-head">
        <button onClick={() => shift(-1)}>&lt;</button>
        <span>{monthLabel(cur)}</span>
        <button onClick={() => shift(1)}>&gt;</button>
      </div>
      <div className="cal-grid">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((x) => (
          <div key={x} className="cal-dow">{x}</div>
        ))}
        {cells.map((c, i) =>
          c ? (
            <button
              key={c}
              className={`cal-day ${c === today() ? "today" : ""} ${c === selected ? "sel" : ""}`}
              onClick={() => onPick(c)}
            >
              <span>{Number(c.slice(8))}</span>
              {counts[c] ? <i title={`${counts[c]} appointment(s)`}>{counts[c]}</i> : null}
            </button>
          ) : (
            <div key={`b${i}`} className="cal-day blank" />
          )
        )}
      </div>
    </div>
  );
}