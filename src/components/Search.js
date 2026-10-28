"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { matchDepartments } from "@/lib/searchData";
import styles from "../../assets/styles/searchbox.module.css";

const supabase = createClient();

const CHIPS = [
  { label: "Medicine Specialist", dept: "General Medicine" },
  { label: "Emergency", href: "/services/emergency-care" },
  { label: "Female Disease", dept: "Gynecology" },
  { label: "Child Disease", dept: "Pediatrics" },
  { label: "COVID 19", dept: "General Medicine" },
  { label: "Orthopedic Surgery", dept: "Orthopedics" },
  { label: "Heart Disease", dept: "Cardiology" },
];

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" />
  </svg>
);
const PinIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" />
  </svg>
);
const LocateIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="3" /><circle cx="12" cy="12" r="8" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
  </svg>
);

export default function Search() {
  const router = useRouter();
  const box = useRef(null);
  const input = useRef(null);
  const [q, setQ] = useState("");
  const [loc, setLoc] = useState("");
  const [coords, setCoords] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [open, setOpen] = useState(false);
  const [hint, setHint] = useState("");

  useEffect(() => {
    supabase.rpc("public_doctors").then(({ data }) => setDoctors(data || []));
  }, []);

  useEffect(() => {
    const close = (e) => { if (box.current && !box.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const term = q.trim().toLowerCase();
  const suggestions = [];
  if (term.length >= 2) {
    matchDepartments(term).slice(0, 3).forEach((m) =>
      suggestions.push({
        key: "d" + m.dept,
        label: m.dept,
        tag: m.via === "symptom" ? `Symptom: ${m.term}` : "Department",
        href: `/search?dept=${encodeURIComponent(m.dept)}`,
      })
    );
    doctors.filter((d) => d.full_name.toLowerCase().includes(term)).slice(0, 4).forEach((d) =>
      suggestions.push({ key: "p" + d.id, label: `Dr. ${d.full_name}`, tag: d.department, href: `/appointments?doctor=${d.id}` })
    );
  }

  function go(href) {
    setOpen(false);
    router.push(href);
  }

  function submit(e) {
    e.preventDefault();
    const where = coords || loc.trim();
    if (!term && !where) {
      setHint("Type a doctor, symptom or department to search.");
      input.current?.focus();
      return;
    }
    setHint("");
    const p = new URLSearchParams();
    if (q.trim()) p.set("q", q.trim());
    if (where) p.set("loc", where);
    go(`/search?${p.toString()}`);
  }

  function useMyLocation() {
    if (!navigator.geolocation) return setHint("Location is not supported on this device.");
    setHint("Getting your location…");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords(`${pos.coords.latitude.toFixed(5)},${pos.coords.longitude.toFixed(5)}`);
        setHint("");
      },
      () => setHint("Could not get your location. Please type it instead."),
      { timeout: 8000 }
    );
  }

  return (
    <section className={styles.wrap}>
      <div className={styles.card}>
        <form className={styles.row} onSubmit={submit}>
          <div className={styles.field} ref={box}>
            <span className={styles.ic}><SearchIcon /></span>
            <input
              ref={input}
              value={q}
              onChange={(e) => { setQ(e.target.value); setOpen(true); setHint(""); }}
              onFocus={() => setOpen(true)}
              onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
              placeholder="Search by doctor, symptoms or department"
              autoComplete="off"
              aria-label="Search by doctor, symptoms or department"
            />
            {open && suggestions.length > 0 && (
              <ul className={styles.sug}>
                {suggestions.map((s) => (
                  <li key={s.key}>
                    <button type="button" onClick={() => go(s.href)}>
                      <span>{s.label}</span><small>{s.tag}</small>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={styles.field}>
            <span className={styles.ic}><PinIcon /></span>
            <input
              value={coords ? "My current location" : loc}
              onChange={(e) => { setCoords(""); setLoc(e.target.value); }}
              placeholder="Set your location"
              autoComplete="off"
              aria-label="Set your location"
            />
            <button type="button" className={styles.pin} onClick={useMyLocation} title="Use my current location" aria-label="Use my current location">
              <LocateIcon />
            </button>
          </div>

          <button type="submit" className={styles.go} aria-label="Search"><SearchIcon /></button>
        </form>

        {hint && <p className={styles.hint}>{hint}</p>}

        <p className={styles.label}>You may be looking for</p>
        <div className={styles.chips}>
          {CHIPS.map((c) => (
            <button type="button" key={c.label} className={styles.chip}
              onClick={() => go(c.href || `/search?dept=${encodeURIComponent(c.dept)}`)}>
              {c.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}