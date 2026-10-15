"use client";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import DashShell from "@/components/DashShell";
import { today, fmtDate, fmtTime } from "@/lib/dates";

const supabase = createClient();

export default function DoctorBoard({ me }) {
  const locked = !me.is_verified;
  const [rows, setRows] = useState([]);
  const [view, setView] = useState("overview");
  const [tab, setTab] = useState("pending");
  const [q, setQ] = useState("");
  const [p, setP] = useState({ full_name: me.full_name, phone: me.phone || "" });
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    if (locked) return;
    const { data } = await supabase
      .from("appointments")
      .select("*, patient:profiles!appointments_patient_id_fkey(full_name, phone, age)")
      .eq("doctor_id", me.id)
      .order("appointment_date")
      .order("appointment_time");
    setRows(data || []);
  }, [me.id, locked]);

  useEffect(() => {
    load();
    if (locked) return;
    const ch = supabase
      .channel("doctor-appts")
      .on("postgres_changes",
        { event: "*", schema: "public", table: "appointments", filter: `doctor_id=eq.${me.id}` },
        load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [load, me.id, locked]);

  async function update(id, patch) {
    const { error } = await supabase.from("appointments").update(patch).eq("id", id);
    if (error) alert(error.message);
    load();
  }
  function accept(a) {
    const clash = rows.some((r) => r.id !== a.id && r.status === "accepted" &&
      r.appointment_date === a.appointment_date && r.appointment_time === a.appointment_time);
    if (clash && !confirm("You already have an accepted appointment at this time. Accept anyway?")) return;
    update(a.id, { status: "accepted" });
  }
  function reject(a) {
    const reason = prompt("Reason for rejecting (optional):");
    if (reason === null) return;
    update(a.id, { status: "rejected", doctor_note: reason || null });
  }
  function note(a) {
    const t = prompt("Note / prescription:", a.doctor_note || "");
    if (t !== null) update(a.id, { doctor_note: t });
  }
  async function saveProfile(e) {
    e.preventDefault();
    const { error } = await supabase.from("profiles")
      .update({ full_name: p.full_name, phone: p.phone }).eq("id", me.id);
    setMsg(error ? error.message : "Profile saved.");
  }

  const count = (s) => rows.filter((r) => r.status === s).length;
  const pending = rows.filter((r) => r.status === "pending");
  const todays = rows.filter((r) => r.appointment_date === today() && r.status === "accepted");
  const shown = tab === "all" ? rows : rows.filter((r) => r.status === tab);

  const pmap = {};
  rows.forEach((r) => {
    const e = pmap[r.patient_id] || (pmap[r.patient_id] = { ...r.patient, visits: 0, last: "" });
    e.visits++;
    if (r.appointment_date > e.last) e.last = r.appointment_date;
  });
  const patients = Object.values(pmap).filter((x) => (x.full_name || "").toLowerCase().includes(q.toLowerCase()));

  const Actions = ({ a }) => (
    <>
      {a.status === "pending" && (
        <>
          <button className="b" onClick={() => accept(a)}>Accept</button>
          <button className="b no" onClick={() => reject(a)}>Reject</button>
        </>
      )}
      {a.status === "accepted" && (
        <button className="b" onClick={() => update(a.id, { status: "completed" })}>Complete</button>
      )}
      <button className="b ghost" onClick={() => note(a)}>Note</button>
    </>
  );

  const items = [
    { key: "overview", label: "Overview" },
    { key: "appointments", label: "Appointments", badge: pending.length },
    { key: "patients", label: "Patients" },
    { key: "profile", label: "My Profile" },
  ];

  return (
    <DashShell title="Doctor Panel" name={`Dr. ${p.full_name}`}
      subtitle={`${me.department || ""} department`} items={items} view={view} setView={setView}>
      {locked ? (
        <div className="panel">
          <h2>Account pending approval</h2>
          <p className="muted">Your doctor account is being verified by the hospital admin. You will get access to appointments once it is approved.</p>
        </div>
      ) : (
        <>
          {view === "overview" && (
            <>
              <div className="stats">
                <div className="stat"><b>{pending.length}</b>Waiting for response</div>
                <div className="stat"><b>{todays.length}</b>Today's appointments</div>
                <div className="stat"><b>{count("accepted")}</b>Upcoming accepted</div>
                <div className="stat"><b>{Object.keys(pmap).length}</b>Total patients</div>
              </div>
              <section className="panel">
                <h2>Needs your response</h2>
                <table>
                  <thead><tr><th>Patient</th><th>Date</th><th>Time</th><th>Reason</th><th></th></tr></thead>
                  <tbody>
                    {pending.slice(0, 5).map((a) => (
                      <tr key={a.id}>
                        <td>{a.patient?.full_name}</td><td>{fmtDate(a.appointment_date)}</td>
                        <td>{fmtTime(a.appointment_time)}</td><td><div className="wrap">{a.reason || "-"}</div></td>
                        <td><Actions a={a} /></td>
                      </tr>
                    ))}
                    {!pending.length && <tr><td colSpan={5} className="muted">No pending requests.</td></tr>}
                  </tbody>
                </table>
              </section>
              <section className="panel">
                <h2>Today's schedule</h2>
                <table>
                  <thead><tr><th>Time</th><th>Patient</th><th>Reason</th><th></th></tr></thead>
                  <tbody>
                    {todays.map((a) => (
                      <tr key={a.id}>
                        <td>{fmtTime(a.appointment_time)}</td><td>{a.patient?.full_name}</td>
                        <td><div className="wrap">{a.reason || "-"}</div></td><td><Actions a={a} /></td>
                      </tr>
                    ))}
                    {!todays.length && <tr><td colSpan={4} className="muted">Nothing scheduled for today.</td></tr>}
                  </tbody>
                </table>
              </section>
            </>
          )}

          {view === "appointments" && (
            <section className="panel">
              <h2>All appointments</h2>
              <div className="tabs2">
                {["pending", "accepted", "completed", "rejected", "cancelled", "all"].map((t) => (
                  <button key={t} className={`b ghost ${tab === t ? "on" : ""}`} onClick={() => setTab(t)}>
                    {t[0].toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
              <table>
                <thead><tr><th>Patient</th><th>Phone</th><th>Date</th><th>Time</th><th>Reason</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {shown.map((a) => (
                    <tr key={a.id}>
                      <td>{a.patient?.full_name}</td><td>{a.patient?.phone || "-"}</td>
                      <td>{fmtDate(a.appointment_date)}</td><td>{fmtTime(a.appointment_time)}</td>
                      <td><div className="wrap">{a.reason || "-"}{a.doctor_note && <div className="note">Note: {a.doctor_note}</div>}</div></td>
                      <td><span className={`pill ${a.status}`}>{a.status}</span></td>
                      <td><Actions a={a} /></td>
                    </tr>
                  ))}
                  {!shown.length && <tr><td colSpan={7} className="muted">No appointments here.</td></tr>}
                </tbody>
              </table>
            </section>
          )}

          {view === "patients" && (
            <section className="panel">
              <h2>My patients</h2>
              <input placeholder="Search by name…" value={q} onChange={(e) => setQ(e.target.value)} style={{ maxWidth: 320, marginBottom: 12 }} />
              <table>
                <thead><tr><th>Name</th><th>Age</th><th>Phone</th><th>Visits</th><th>Last visit</th></tr></thead>
                <tbody>
                  {patients.map((x, i) => (
                    <tr key={i}><td>{x.full_name}</td><td>{x.age ?? "-"}</td><td>{x.phone || "-"}</td><td>{x.visits}</td><td>{fmtDate(x.last)}</td></tr>
                  ))}
                  {!patients.length && <tr><td colSpan={5} className="muted">No patients found.</td></tr>}
                </tbody>
              </table>
            </section>
          )}

          {view === "profile" && (
            <section className="panel">
              <h2>My profile</h2>
              <form onSubmit={saveProfile}>
                <div className="form-row">
                  <div><label>Full name</label><input required value={p.full_name} onChange={(e) => setP({ ...p, full_name: e.target.value })} /></div>
                  <div><label>Phone</label><input value={p.phone} onChange={(e) => setP({ ...p, phone: e.target.value })} /></div>
                  <div><label>Email</label><input disabled value={me.email || ""} /></div>
                  <div><label>Department</label><input disabled value={me.department || ""} /></div>
                  <div><label>License no.</label><input disabled value={me.license_no || ""} /></div>
                </div>
                <button className="b" style={{ marginTop: 14 }}>Save changes</button>
                {msg && <p className={msg.includes("saved") ? "ok" : "err"}>{msg}</p>}
              </form>
            </section>
          )}
        </>
      )}
    </DashShell>
  );
}
