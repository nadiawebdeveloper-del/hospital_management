// UTC helpers (website + mobile ke liye ek jaisa code)
const p2 = (n) => String(n).padStart(2, "0");

// Browser / phone ka local date + time  ->  UTC ISO string (database ke liye)
export function toUtcISO(dateStr, timeStr) {
  const t = (timeStr || "00:00").slice(0, 5);
  const d = new Date(`${dateStr}T${t}:00`);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

// Database ka starts_at (UTC)  ->  is device ke local date + time
// Baqi saara code appointment_date / appointment_time hi istemal karta hai,
// is liye yahan unhein local waqt se badal dete hain.
export function localizeRow(r) {
  if (!r || !r.starts_at) return r;
  const d = new Date(r.starts_at);
  if (isNaN(d.getTime())) return r;
  return {
    ...r,
    appointment_date: `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`,
    appointment_time: `${p2(d.getHours())}:${p2(d.getMinutes())}:00`,
  };
}