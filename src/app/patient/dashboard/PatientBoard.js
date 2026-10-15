"use client";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import DashShell from "@/components/DashShell";
import { today, fmtDate, fmtTime } from "@/lib/dates";

const supabase = createClient();
const EMPTY = { department: "", doctor_id: "", date: "", time: "", reason: "" };

export default function PatientBoard({ me }) {
  const [view, setView] = useState("overview");
  const [doctors, setDoctors] = useState([]);
  const [rows, setRows] = useState([]);
  const [f, setF] = useState(EMPTY);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [p, setP] = useState({ full_name: me.full_name, phone: me.phone || "", age: me.age ?? "" });
  const [pmsg, setPmsg] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("appointments")
      .select("*, doctor:profiles!appointments_doctor_id_fkey(full_name, department)")
      .eq("patient_id", me.id)
      .order("appointment_date", { ascending: false })
      .order("appointment_time", { ascending: false });
    setRows(data || []);
  }, [me.id]);

  useEffect(() => {
    supabase.from("profiles").select("id, full_name, department")
      .eq("role", "doctor").eq("is_verified", true)
      .then(({ data }) => setDoctors(data || []));
    load();
    const ch = supabase
      .channel("patient-appts")
      .on("postgres_changes",
        { event: "*", schema: "public", table: "appointments", filter: `patient_id=eq.${me.id}` },
        load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [load, me.id]);

  const depts = [...new Set(doctors.map((d) => d.department).filter(Boolean))];
  const docsInDept = doctors.filter((d) => d.department === f.department);

  async function book(e) {
    e.preventDefault();
    setBusy(true); setMsg("");
    const { error } = await supabase.from("appointments").insert({
      patient_id: me.id,
      doctor_id: f.doctor_id,
      appointment_date: f.date,
      appointment_time: f.time,
      reason: f.reason || null,
    });
    setBusy(false);
    if (error) return setMsg("Could not book: " + error.message);
    setF(EMPTY);
    await load();
    setView("appointments");
  }
  async function cancel(id) {
    if (!confirm("Cancel this appointment?")) return;
    await supabase.from("appointments").update({ status: "cancelled" }).eq("id", id);
    load();
  }
  async function saveProfile(e) {
    e.preventDefault();
    const { error } = await supabase.from("profiles")
      .update({ full_name: p.full_name, phone: p.phone, age: p.age === "" ? null : Number(p.age) })
      .eq("id", me.id);
    setPmsg(error ? error.message : "Profile saved.");
  }

  const count = (s) => rows.filter((r) => r.status === s).length;
  const upcoming = rows
    .filter((r) => r.status === "accepted" && r.appointment_date >= today())
    .sort((a, b) => (a.appointment_date + a.appointment_time).localeCompare(b.appointment_date + b.appointment_time))[0];

  const Table = ({ list }) => (
    <table>
      <thead><tr><th>Doctor</th><th>Department</th><th>Date</th><th>Time</th><th>Status</th><th>Doctor's note</th><th></th></tr></thead>
      <tbody>
        {list.map((a) => (
          <tr key={a.id}>
            <td>Dr. {a.doctor?.full_name}</td><td>{a.doctor?.department}</td>
            <td>{fmtDate(a.appointment_date)}</td><td>{fmtTime(a.appointment_time)}</td>
            <td><span className={`pill ${a.status}`}>{a.status}</span></td>
            <td><div className="wrap">{a.doctor_note || "-"}</div></td>
            <td>{["pending", "accepted"].includes(a.status) &&
              <button className="b no" onClick={() => cancel(a.id)}>Cancel</button>}</td>
          </tr>
        ))}
        {!list.length && <tr><td colSpan={7} className="muted">No appointments yet.</td></tr>}
      </tbody>
    </table>
  );

  const items = [
    { key: "overview", label: "Overview" },
    { key: "book", label: "Book Appointment" },
    { key: "appointments",  label: "My Appointments" },
    { key: "profile", label: "My Profile" },
  ];

  return (
    <DashShell title="Patient Panel" name={`Welcome, ${p.full_name}`}
      subtitle="Manage your appointments and health records" items={items} view={view} setView={setView}>
      {view === "overview" && (
        <>
          <div className="stats">
            <div className="stat"><b>{rows.length}</b>Total appointments</div>
            <div className="stat"><b>{count("pending")}</b>Waiting for doctor</div>
            <div className="stat"><b>{count("accepted")}</b>Accepted</div>
            <div className="stat"><b>{count("completed")}</b>Completed</div>
          </div>
          <section className="panel next">
            {upcoming ? (
              <>
                <h3>Your next appointment</h3>
                <p style={{ margin: 0 }}>
                  Dr. {upcoming.doctor?.full_name} ({upcoming.doctor?.department}) on{" "}
                  <b>{fmtDate(upcoming.appointment_date)}</b> at <b>{fmtTime(upcoming.appointment_time)}</b>
                </p>
              </>
            ) : (
              <>
                <h3>No upcoming appointment</h3>
                <p className="muted" style={{ margin: "0 0 10px" }}>Book a visit with one of our doctors.</p>
                <button className="b" onClick={() => setView("book")}>Book now</button>
              </>
            )}
          </section>
          <section className="panel">
            <h2>Recent appointments</h2>
            <Table list={rows.slice(0, 5)} />
          </section>
        </>
      )}

      {view === "book" && (
        <section className="panel">
          <h2>Book an appointment</h2>
          <form onSubmit={book}>
            <div className="form-row">
              <div><label>Department</label>
                <select required value={f.department} onChange={(e) => setF({ ...f, department: e.target.value, doctor_id: "" })}>
                  <option value="">Select department</option>
                  {depts.map((d) => <option key={d}>{d}</option>)}
                </select></div>
              <div><label>Doctor</label>
                <select required value={f.doctor_id} onChange={set("doctor_id")} disabled={!f.department}>
                  <option value="">Select doctor</option>
                  {docsInDept.map((d) => <option key={d.id} value={d.id}>Dr. {d.full_name}</option>)}
                </select></div>
              <div><label>Date</label><input type="date" required min={today()} value={f.date} onChange={set("date")} /></div>
              <div><label>Time</label><input type="time" required value={f.time} onChange={set("time")} /></div>
            </div>
            <div style={{ marginTop: 12 }}><label>Reason / symptoms</label><input value={f.reason} onChange={set("reason")} /></div>
            <button className="b" style={{ marginTop: 14 }} disabled={busy}>{busy ? "Sending…" : "Send request"}</button>
            {msg && <p className="err">{msg}</p>}
            {!doctors.length && <p className="muted">No verified doctors are available yet.</p>}
          </form>
        </section>
      )}

      {view === "appointments" && (
        <section className="panel">
          <h2>My appointments</h2>
          <Table list={rows} />
        </section>
      )}

      {view === "profile" && (
        <section className="panel">
          <h2>My profile</h2>
          <form onSubmit={saveProfile}>
            <div className="form-row">
              <div><label>Full name</label><input required value={p.full_name} onChange={(e) => setP({ ...p, full_name: e.target.value })} /></div>
              <div><label>Phone</label><input value={p.phone} onChange={(e) => setP({ ...p, phone: e.target.value })} /></div>
              <div><label>Age</label><input type="number" min="0" value={p.age} onChange={(e) => setP({ ...p, age: e.target.value })} /></div>
              <div><label>Email</label><input disabled value={me.email || ""} /></div>
            </div>
            <button className="b" style={{ marginTop: 14 }}>Save changes</button>
            {pmsg && <p className={pmsg.includes("saved") ? "ok" : "err"}>{pmsg}</p>}
          </form>
        </section>
      )}
    </DashShell>
  );
}
