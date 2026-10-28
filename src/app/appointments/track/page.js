"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { fmtDate, fmtTime } from "@/lib/dates";
import styles from "../booking.module.css";

const supabase = createClient();

const LABEL = {
  pending: "Waiting for the doctor's response",
  accepted: "Confirmed",
  rejected: "Not accepted by the doctor",
  cancelled: "Cancelled",
  completed: "Completed",
};

function Track() {
  const sp = useSearchParams();
  const [code, setCode] = useState(sp.get("code") || "");
  const [phone, setPhone] = useState("");
  const [res, setRes] = useState(null);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function check(e) {
    if (e) e.preventDefault();
    setMsg("");
    setBusy(true);
    const { data, error } = await supabase.rpc("track_appointment", { p_code: code, p_phone: phone });
    setBusy(false);
    if (error) return setMsg(error.message);
    if (!data || !data.length) {
      setRes(null);
      return setMsg("No appointment found. Please check the reference code and phone number.");
    }
    setRes(data[0]);
  }

  async function cancel() {
    if (!confirm("Cancel this appointment?")) return;
    const { error } = await supabase.rpc("cancel_guest_appointment", { p_code: code, p_phone: phone });
    if (error) return setMsg(error.message);
    check();
  }

  return (
    <>
      <section className={styles.hero}>
        <span>Appointments</span>
        <h1>Check Your Appointment</h1>
        <p>Enter the reference code you received when booking, and your phone number.</p>
      </section>

      <main className={styles.wrap}>
        <form className={styles.card} onSubmit={check}>
          <div className={styles.grid}>
            <div>
              <label>Reference code</label>
              <input required value={code} onChange={(e) => setCode(e.target.value)} placeholder="MC-XXXXXX" />
            </div>
            <div>
              <label>Phone number</label>
              <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="03XX XXXXXXX" />
            </div>
          </div>
          {msg && <div className={styles.err} role="alert">{msg}</div>}
          <div className={styles.actions}>
            <button className={styles.btn} disabled={busy}>{busy ? "Checking…" : "Check status"}</button>
            <Link href="/appointments" className={`${styles.btn} ${styles.ghost}`}>Book new appointment</Link>
          </div>
        </form>

        {res && (
          <div className={`${styles.card} ${styles.center}`} style={{ marginTop: 20 }}>
            <span className={`${styles.pill} ${styles["s_" + res.status]}`}>{res.status}</span>
            <h2 style={{ marginTop: 10 }}>{LABEL[res.status]}</h2>
            <div className={styles.kv}>
              <div><span>Reference</span><b>{res.reference_code}</b></div>
              <div><span>Doctor</span><b>Dr. {res.doctor_name}</b></div>
              <div><span>Department</span><b>{res.department}</b></div>
              <div><span>Date</span><b>{fmtDate(res.appointment_date)}</b></div>
              <div><span>Time</span><b>{fmtTime(res.appointment_time)}</b></div>
              {res.doctor_note && <div><span>Doctor's note</span><b>{res.doctor_note}</b></div>}
            </div>
            {["pending", "accepted"].includes(res.status) && (
              <div className={styles.actions} style={{ justifyContent: "center" }}>
                <button className={`${styles.btn} ${styles.ghost}`} style={{ color: "#b91c1c", borderColor: "#b91c1c" }} onClick={cancel}>
                  Cancel appointment
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<main className={styles.wrap}><p>Loading…</p></main>}>
      <Track />
    </Suspense>
  );
}