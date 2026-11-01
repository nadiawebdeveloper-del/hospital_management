"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import DashShell from "@/components/DashShell";
import { IconOverview, IconCalendar, IconPatients, IconProfile } from "@/components/NavIcons";
import { fmtDate, fmtTime } from "@/lib/dates";

const supabase = createClient();

const FREQ = ["Once daily", "Twice daily", "Three times daily", "Four times daily", "Every 8 hours", "At night", "As needed"];
const WHEN = ["After meal", "Before meal", "With meal", "Empty stomach", "Any time"];
const blank = () => ({ medicine: "", dose: "", frequency: "Twice daily", duration: "", instructions: "After meal" });
const dec = (v) => (v === "" || v == null ? null : Number(v));
const int = (v) => (v === "" || v == null ? null : Math.round(Number(v)));

const NAV = [
  { key: "overview", icon: IconOverview, label: "Overview" },
  { key: "appointments", icon: IconCalendar, label: "Appointments" },
  { key: "patients", icon: IconPatients, label: "Patients" },
  { key: "profile", icon: IconProfile, label: "My Profile" },
];

export default function ConsultationForm({ appt, patient, consult, savedMeds }) {
  const router = useRouter();
  const c = consult;
  const [cid, setCid] = useState(c?.id || null);
  const [finalized, setFinalized] = useState(c?.status === "final");
  const locked = !!c && c.status === "final" && Date.now() - new Date(c.finalized_at).getTime() > 24 * 3600 * 1000;

  const [f, setF] = useState({
    bp: c?.bp ?? "",
    pulse: c?.pulse ?? "",
    temperature: c?.temperature ?? "",
    weight: c?.weight ?? "",
    height: c?.height ?? "",
    spo2: c?.spo2 ?? "",
    sugar: c?.sugar ?? "",
    complaints: c?.complaints ?? appt.reason ?? "",
    diagnosis: c?.diagnosis ?? "",
    tests: c?.tests ?? "",
    advice: c?.advice ?? "",
    follow_up_date: c?.follow_up_date ?? "",
  });
  const [meds, setMeds] = useState(
    savedMeds.length
      ? savedMeds.map((m) => ({
          medicine: m.medicine || "",
          dose: m.dose || "",
          frequency: m.frequency || "Twice daily",
          duration: m.duration || "",
          instructions: m.instructions || "After meal",
        }))
      : [blank()]
  );
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));
  const setMed = (i, k, v) => setMeds((list) => list.map((m, j) => (j === i ? { ...m, [k]: v } : m)));
  const addMed = () => setMeds((list) => [...list, blank()]);
  const delMed = (i) => setMeds((list) => (list.length === 1 ? [blank()] : list.filter((_, j) => j !== i)));

  async function save(finish) {
    if (locked) return;
    setMsg(null);
    if (finish && !f.diagnosis.trim()) return setMsg({ t: "err", s: "Please write the diagnosis before finishing." });

    setBusy(true);
    const fields = {
      bp: f.bp.trim() || null,
      pulse: int(f.pulse),
      temperature: dec(f.temperature),
      weight: dec(f.weight),
      height: dec(f.height),
      spo2: int(f.spo2),
      sugar: dec(f.sugar),
      complaints: f.complaints.trim() || null,
      diagnosis: f.diagnosis.trim() || null,
      tests: f.tests.trim() || null,
      advice: f.advice.trim() || null,
      follow_up_date: f.follow_up_date || null,
      status: finish || finalized ? "final" : "draft",
    };

    let id = cid;
    if (!id) {
      const { data, error } = await supabase
        .from("consultations").insert({ appointment_id: appt.id, ...fields }).select("id").single();
      if (error) { setBusy(false); return setMsg({ t: "err", s: error.message }); }
      id = data.id;
      setCid(id);
    } else {
      const { error } = await supabase.from("consultations").update(fields).eq("id", id);
      if (error) { setBusy(false); return setMsg({ t: "err", s: error.message }); }
    }

    // Dawaiyan: purani hata kar nayi likhna
    const del = await supabase.from("prescription_items").delete().eq("consultation_id", id);
    if (del.error) { setBusy(false); return setMsg({ t: "err", s: del.error.message }); }

    const rows = meds
      .filter((m) => m.medicine.trim())
      .map((m, i) => ({
        consultation_id: id,
        medicine: m.medicine.trim(),
        dose: m.dose.trim() || null,
        frequency: m.frequency || null,
        duration: m.duration.trim() || null,
        instructions: m.instructions || null,
        position: i,
      }));
    if (rows.length) {
      const ins = await supabase.from("prescription_items").insert(rows);
      if (ins.error) { setBusy(false); return setMsg({ t: "err", s: ins.error.message }); }
    }

    if (finish) {
      await supabase.from("appointments").update({ status: "completed" }).eq("id", appt.id);
      setFinalized(true);
      setBusy(false);
      router.push("/doctor/dashboard?view=appointments");
      router.refresh();
      return;
    }
    setBusy(false);
    setMsg({ t: "ok", s: finalized ? "Changes saved." : "Draft saved. You can continue later." });
  }

  return (
    <DashShell
      title="Doctor Panel"
      name="Consultation"
      subtitle={`${patient.full_name} · ${fmtDate(appt.appointment_date)} at ${fmtTime(appt.appointment_time)}`}
      items={NAV}
      view="appointments"
      setView={(k) => router.push(`/doctor/dashboard?view=${k}`)}
    >
      <p style={{ margin: "0 0 14px" }}>
        <Link href="/doctor/dashboard?view=appointments" className="b ghost">← Back to appointments</Link>
      </p>

      <section className="panel">
        <h2>Patient</h2>
        <div className="pbar">
          <div><span>Name</span><b>{patient.full_name}{patient.guest && <span className="pill" style={{ marginLeft: 6 }}>Guest</span>}</b></div>
          <div><span>Age</span><b>{patient.age ?? "-"}</b></div>
          <div><span>Phone</span><b>{patient.phone || "-"}</b></div>
          <div><span>Reason for visit</span><b>{appt.reason || "-"}</b></div>
        </div>
      </section>

      {locked && (
        <div className="panel"><b>This prescription is locked.</b> It was finalized more than 24 hours ago and can no longer be edited.</div>
      )}
      {!locked && finalized && (
        <div className="panel"><b>Finalized.</b> You can still edit this for 24 hours after finishing.</div>
      )}

      <fieldset disabled={locked || busy} style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
        <section className="panel">
          <h2>Vitals</h2>
          <div className="form-row">
            <div><label>Blood pressure</label><input value={f.bp} onChange={set("bp")} placeholder="120/80" /></div>
            <div><label>Pulse (bpm)</label><input type="number" value={f.pulse} onChange={set("pulse")} /></div>
            <div><label>Temperature (°F)</label><input type="number" step="0.1" value={f.temperature} onChange={set("temperature")} /></div>
            <div><label>Weight (kg)</label><input type="number" step="0.1" value={f.weight} onChange={set("weight")} /></div>
            <div><label>Height (cm)</label><input type="number" step="0.1" value={f.height} onChange={set("height")} /></div>
            <div><label>SpO2 (%)</label><input type="number" value={f.spo2} onChange={set("spo2")} /></div>
            <div><label>Sugar (mg/dL)</label><input type="number" step="0.1" value={f.sugar} onChange={set("sugar")} /></div>
          </div>
        </section>

        <section className="panel">
          <h2>Complaints and diagnosis</h2>
          <label>Complaints / symptoms</label>
          <textarea value={f.complaints} onChange={set("complaints")} />
          <label style={{ marginTop: 12 }}>Diagnosis *</label>
          <textarea value={f.diagnosis} onChange={set("diagnosis")} />
        </section>

        <section className="panel">
          <h2>Medicines</h2>
          {meds.map((m, i) => (
            <div className="med-row" key={i}>
              <div><label>Medicine</label><input value={m.medicine} onChange={(e) => setMed(i, "medicine", e.target.value)} placeholder="e.g. Paracetamol 500mg" /></div>
              <div><label>Dose</label><input value={m.dose} onChange={(e) => setMed(i, "dose", e.target.value)} placeholder="1 tablet" /></div>
              <div><label>How often</label>
                <select value={m.frequency} onChange={(e) => setMed(i, "frequency", e.target.value)}>
                  {FREQ.map((x) => <option key={x}>{x}</option>)}
                </select></div>
              <div><label>Duration</label><input value={m.duration} onChange={(e) => setMed(i, "duration", e.target.value)} placeholder="5 days" /></div>
              <div><label>Instructions</label>
                <select value={m.instructions} onChange={(e) => setMed(i, "instructions", e.target.value)}>
                  {WHEN.map((x) => <option key={x}>{x}</option>)}
                </select></div>
              <button type="button" className="b no" onClick={() => delMed(i)} aria-label="Remove medicine">✕</button>
            </div>
          ))}
          <button type="button" className="b ghost" onClick={addMed}>+ Add medicine</button>
        </section>

        <section className="panel">
          <h2>Tests, advice and follow-up</h2>
          <label>Lab tests / investigations</label>
          <textarea value={f.tests} onChange={set("tests")} placeholder="e.g. CBC, Blood sugar fasting" />
          <label style={{ marginTop: 12 }}>Advice / notes for the patient</label>
          <textarea value={f.advice} onChange={set("advice")} />
          <div style={{ maxWidth: 260, marginTop: 12 }}>
            <label>Follow-up date</label>
            <input type="date" value={f.follow_up_date} onChange={set("follow_up_date")} />
          </div>
        </section>
      </fieldset>

      {msg && <p className={msg.t === "ok" ? "ok" : "err"}>{msg.s}</p>}

      {!locked && (
        <div className="actionbar">
          {!finalized && (
            <button type="button" className="b ghost" disabled={busy} onClick={() => save(false)}>Save draft</button>
          )}
          <button type="button" className="b" disabled={busy} onClick={() => save(true)}>
            {busy ? "Saving…" : finalized ? "Save changes" : "Save & Finish"}
          </button>
        </div>
      )}
    </DashShell>
  );
}