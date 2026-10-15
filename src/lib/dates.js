export const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
export const fmtDate = (s) =>
  s ? new Date(s + "T00:00:00").toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-";
export const fmtTime = (t) => {
  if (!t) return "-";
  const [h, m] = t.split(":");
  const n = +h;
  return `${n % 12 || 12}:${m} ${n >= 12 ? "PM" : "AM"}`;
};
