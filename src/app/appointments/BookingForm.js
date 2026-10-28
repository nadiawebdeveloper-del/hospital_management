"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { today, fmtDate, fmtTime } from "@/lib/dates";
import styles from "./booking.module.css";

const supabase = createClient();
const two = (n) => String(n).padStart(2, "0");
const SLOTS = (() => {
  const a = [];
  for (let h = 9; h < 17; h++) { a.push(`${two(h)}:00`); a.push(`${two(h)}:30`); }
  return a;
})();
const EMPTY = { department: "", doctor_id: "", date: "", time: "", reason: "", name: "", phone: "", email: "", website: "" };

export default function BookingForm() {
  const [mode, setMode] = useState("loading"); // loading | guest | patient | doctor
  const [me, setMe] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [f, setF] = useState(EMPTY);
  const [taken, setTaken] = useState([]);
  const [tick, setTick] = useState(0);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [done, setDone] = useState(null);
  const [nextUrl, setNextUrl] = useState("%2Fappointments");
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  useEffect(() => {
    (async () => {
      const params = new URLSearchParams(window.location.search);
      setNextUrl(encodeURIComponent("/appointments" + window.location.search));

      const [{ data: docs }, { data: { user } }] = await Promise.all([
        supabase.rpc("public_doctors"),
        supabase.auth.getUser(),
      ]);
      const list = docs || [];
      setDoctors(list);

      const next = { ...EMPTY };
      const hit = list.find((x) => x.id === params.get("doctor"));
      if (hit) { next.department = hit.department; next.doctor_id = hit.id; }
      else if (params.get("dept")) next.department = params.get("dept");
      const d = params.get("date");
      if (d && d >= today()) next.date = d;
      next.name = params.get("name") || "";
      next.phone = params.get("phone") || "";
      next.email = params.get("email") || "";

      let m = "guest";
      if (user) {
        const { data: p } = await supabase.from("profiles").select("*").eq("id", user.id).single();
        if (p) {
          setMe(p);
          m = p.role === "doctor" ? "doctor" : "patient";
          if (m === "patient") {
            next.name = p.full_name || next.name;
            next.phone = p.phone || next.phone;
            next.email = p.email || next.email;
          }
        }
      }
      setF(next);
      setMode(m);
    })();
  }, []);

  useEffect(() => {
    if (!f.doctor_id || !f.date) { setTaken([]); return; }
    supabase.rpc("taken_slots", { p_doctor: f.doctor_id, p_date: f.date })
      .then(({ data }) => setTaken((data || []).map((r) => r.appointment_time.slice(0, 5))));
  }, [f.doctor_id, f.date, tick]);

  const depts = [...new Set(doctors.map((d) => d.department).filter(Boolean))];
  const docsInDept = doctors.filter((d) => d.department === f.department);
  const now = new Date();
  const nowHM = `${two(now.getHours())}:${two(now.getMinutes())}`;

  async function submit(e) {
    e.preventDefault();
    setMsg("");
    const doctor = doctors.find((d) => d.id === f.doctor_id);

    if (f.website) { // honeypot: bots ke liye nakli success
      return setDone({ mode: "guest", code: "MC-" + Math.random().toString(36).slice(2, 8).toUpperCase(), doctor, date: f.date, time: f.time + ":00" });
    }
    if (!f.time) return setMsg("Please select a time slot.");
    if (mode === "guest") {
      if (f.name.trim().length < 2) return setMsg("Please enter your name.");
      if (f.phone.replace(/\D/g, "").length < 10) return setMsg("Please enter a valid phone number (for example 03XX XXXXXXX).");
      if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) return setMsg("Please enter a valid email, or leave it empty.");
    }

    setBusy(true);
    let code = null;
    let error = null;
    if (mode === "guest") {
      const res = await supabase.rpc("book_guest_appointment", {
        p_doctor: f.doctor_id, p_date: f.date, p_time: f.time + ":00",
        p_name: f.name, p_phone: f.phone, p_email: f.email || null, p_reason: f.reason || null,
      });
      code = res.data;
      error = res.error;
    } else {
      const res = await supabase.from("appointments").insert({
        patient_id: me.id, doctor_id: f.doctor_id, appointment_date: f.date,
        appointment_time: f.time + ":00", reason: f.reason || null,
      });
      error = res.error;
    }
    setBusy(false);

    if (error) {
      const slotTaken = error.code === "23505" || (error.message || "").includes("SLOT_TAKEN");
      if (slotTaken) {
        setF((s) => ({ ...s, time: "" }));
        setTick((t) => t + 1);
        return setMsg("Sorry, this slot was just taken. Please choose another time.");
      }
      return setMsg(error.message);
    }

    setDone({ mode, code, doctor, date: f.date, time: f.time + ":00" });
    setF((s) => ({
      ...EMPTY,
      name: mode === "patient" ? s.name : "",
      phone: mode === "patient" ? s.phone : "",
      email: mode === "patient" ? s.email : "",
    }));
  }

  if (mode === "loading")
    return <div className={`${styles.card} ${styles.center}`}><p className={styles.note}>Loading…</p></div>;

  if (mode === "doctor")
    return (
      <div className={`${styles.card} ${styles.center}`}>
        <h2>Doctor account</h2>
        <p className={styles.sub}>Appointments can only be booked from a patient account or as a guest. Use your dashboard to manage appointments.</p>
        <div className={styles.actions} style={{ justifyContent: "center" }}>
          <Link href="/doctor/dashboard" className={styles.btn}>Go to dashboard</Link>
        </div>
      </div>
    );

  if (done)
    return (
      <div className={`${styles.card} ${styles.center}`}>
        <div style={{ fontSize: 44 }}>✅</div>
        <h2>Request sent!</h2>
        <p className={styles.sub}>
          Dr. {done.doctor?.full_name} ({done.doctor?.department}) on <b>{fmtDate(done.date)}</b> at <b>{fmtTime(done.time)}</b>.
        </p>
        {done.mode === "guest" ? (
          <>
            <p className={styles.note} style={{ margin: 0 }}>Your reference code</p>
            <div className={styles.code}>{done.code}</div>
            <p className={styles.note}>
              Please save this code. Use it with your phone number to check the status of your appointment.
              The doctor will accept or reject your request.
            </p>
            <div className={styles.actions} style={{ justifyContent: "center" }}>
              <Link href={`/appointments/track?code=${done.code}`} className={styles.btn}>Check status</Link>
              <button className={`${styles.btn} ${styles.ghost}`} onClick={() => setDone(null)}>Book another</button>
            </div>
          </>
        ) : (
          <>
            <p className={styles.note}>The doctor will accept or reject your request. You can see the status in your dashboard.</p>
            <div className={styles.actions} style={{ justifyContent: "center" }}>
              <Link href="/patient/dashboard" className={styles.btn}>View my appointments</Link>
              <button className={`${styles.btn} ${styles.ghost}`} onClick={() => setDone(null)}>Book another</button>
            </div>
          </>
        )}
      </div>
    );

  return (
    <form className={styles.card} onSubmit={submit}>
      <h2>Appointment details</h2>
      <p className={styles.sub}>
        {mode === "patient" ? <>Booking as <b>{me.full_name}</b></> : "Choose your doctor and time first, then enter your details."}
      </p>

      <div className={styles.grid}>
        <div>
          <label>Department</label>
          <select required value={f.department}
            onChange={(e) => setF((s) => ({ ...s, department: e.target.value, doctor_id: "", time: "" }))}>
            <option value="">Select department</option>
            {depts.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label>Doctor</label>
          <select required disabled={!f.department} value={f.doctor_id}
            onChange={(e) => setF((s) => ({ ...s, doctor_id: e.target.value, time: "" }))}>
            <option value="">Select doctor</option>
            {docsInDept.map((d) => <option key={d.id} value={d.id}>Dr. {d.full_name}</option>)}
          </select>
        </div>
        <div>
          <label>Date</label>
          <input type="date" required min={today()} value={f.date}
            onChange={(e) => setF((s) => ({ ...s, date: e.target.value, time: "" }))} />
        </div>
      </div>

      {f.doctor_id && f.date && (
        <div style={{ marginTop: 18 }}>
          <label>Available time slots</label>
          <div className={styles.slots}>
            {SLOTS.map((t) => {
              const off = taken.includes(t) || (f.date === today() && t <= nowHM);
              return (
                <button type="button" key={t} disabled={off}
                  className={`${styles.slot} ${f.time === t ? styles.on : ""}`}
                  onClick={() => setF((s) => ({ ...s, time: t }))}>
                  {fmtTime(t + ":00")}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {mode === "guest" && (
        <>
          <h3 className={styles.sec}>Your details</h3>
          <div className={styles.grid}>
            <div><label>Full name *</label><input required value={f.name} onChange={set("name")} placeholder="Your name" /></div>
            <div><label>Phone number *</label><input required type="tel" value={f.phone} onChange={set("phone")} placeholder="03XX XXXXXXX" /></div>
            <div><label>Email (optional)</label><input type="email" value={f.email} onChange={set("email")} placeholder="you@example.com" /></div>
          </div>
        </>
      )}

      <div style={{ marginTop: 18 }}>
        <label>Reason / symptoms (optional)</label>
        <input value={f.reason} onChange={set("reason")} />
      </div>

      <input className={styles.hp} name="website" value={f.website} onChange={set("website")}
        tabIndex={-1} autoComplete="off" aria-hidden="true" />

      {msg && <div className={styles.err} role="alert">{msg}</div>}
      <div className={styles.actions}>
        <button className={styles.btn} disabled={busy}>{busy ? "Sending…" : "Book appointment"}</button>
      </div>

      {mode === "guest" && (
        <p className={styles.note}>
          Have an account? <Link href={`/login?next=${nextUrl}`} style={{ color: "#00787d" }}>Login</Link> to track all your appointments in one place.
        </p>
      )}
      {!doctors.length && <p className={styles.note}>No doctors are available yet.</p>}
    </form>
  );
}