"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { DEPT_KEYWORDS, matchDepartments } from "@/lib/searchData";
import styles from "../../../assets/styles/results.module.css";

const supabase = createClient();
const ADDRESS = "Sector F-8/4, Islamabad, Punjab, 44000, Pakistan";
const COORDS = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/;

function Results() {
  const sp = useSearchParams();
  const q = (sp.get("q") || "").trim();
  const dept = (sp.get("dept") || "").trim();
  const loc = (sp.get("loc") || "").trim();
  const [doctors, setDoctors] = useState(null);

  useEffect(() => {
    supabase.rpc("public_doctors").then(({ data }) => setDoctors(data || []));
  }, []);

  const term = q.toLowerCase();
  const deptSet = new Set([...(dept ? [dept] : []), ...(q ? matchDepartments(term).map((m) => m.dept) : [])]);

  let list = [];
  if (doctors) {
    if (!q && !dept) list = doctors;
    else {
      const byName = q ? doctors.filter((d) => d.full_name.toLowerCase().includes(term)) : [];
      const byDept = doctors.filter((d) => deptSet.has(d.department));
      list = [...new Map([...byName, ...byDept].map((d) => [d.id, d])).values()];
    }
  }

  const title = dept ? `Doctors in ${dept}` : q ? `Results for “${q}”` : "Our doctors";
  const count = (d) => (doctors || []).filter((x) => x.department === d).length;
  const initials = (n) => n.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
  const fromText = COORDS.test(loc) ? "your current location" : loc;

  return (
    <>
      <section className="rs-hero">
        <h1>{title}</h1>
        <p>{doctors ? `${list.length} doctor${list.length === 1 ? "" : "s"} found` : "Searching…"}</p>
      </section>

      <main className="rs-wrap">
        {deptSet.size > 0 && (
          <>
            <h2 className="rs-h2">{q && !dept ? "Departments that may help" : "Department"}</h2>
            <div className="rs-depts">
              {[...deptSet].map((d) => (
                <Link key={d} href={`/search?dept=${encodeURIComponent(d)}`} className="rs-dept">
                  {d}<small>{doctors ? `${count(d)} doctor${count(d) === 1 ? "" : "s"}` : ""}</small>
                </Link>
              ))}
            </div>
          </>
        )}

        {doctors && list.length > 0 && (
          <>
            <h2 className="rs-h2">Doctors</h2>
            <div className="rs-grid">
              {list.map((d) => (
                <div key={d.id} className="rs-card">
                  <div className="rs-av">{initials(d.full_name)}</div>
                  <b>Dr. {d.full_name}</b>
                  <span className="rs-pill">{d.department}</span>
                  <Link href={`/appointments?doctor=${d.id}`} className="rs-btn">Book appointment</Link>
                </div>
              ))}
            </div>
          </>
        )}

        {doctors && list.length === 0 && (
          <div className="rs-empty">
            <p>No matching doctors found. Try a department name or a symptom such as “fever” or “chest pain”.</p>
            <div className="rs-depts" style={{ justifyContent: "center" }}>
              {Object.keys(DEPT_KEYWORDS).map((d) => (
                <Link key={d} href={`/search?dept=${encodeURIComponent(d)}`} className="rs-dept">{d}</Link>
              ))}
            </div>
          </div>
        )}

        <div className="rs-loc">
          <b>MediCore Hospital</b>
          <p>{ADDRESS}{fromText ? ` · From ${fromText}` : ""}</p>
          {loc && (
          
  <a
    className="rs-btn"
    target="_blank"
    rel="noopener noreferrer"
    href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(loc)}&destination=${encodeURIComponent(ADDRESS)}`}
  >
    Get directions
  </a>
)}

<a
  className="rs-btn ghost"
  target="_blank"
  rel="noopener noreferrer"
  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`}
>
  View on map
</a>
        </div>
      </main>
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<main className="rs-wrap"><p>Loading…</p></main>}>
      <Results />
    </Suspense>
  );
}