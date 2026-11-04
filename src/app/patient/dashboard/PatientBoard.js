"use client";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import DashShell from "@/components/DashShell";
import { IconOverview, IconBook, IconCalendar, IconProfile } from "@/components/NavIcons";
import { today, fmtDate, fmtTime } from "@/lib/dates";
import { toast } from "@/components/Toast";
import { toUtcISO, localizeRow } from "@/lib/utc";
import { FilterBar, MonthCalendar, Pager, applyFilter, defaultFilter } from "@/components/ApptFilters";

const supabase = createClient();
const EMPTY = { department: "", doctor_id: "", date: "", time: "", reason: "" };

const IconRx = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
    <path d="M9 3h6v4H9zM6 7h12v14H6z" />
    <path d="M12 11v6M9 14h6" />
  </svg>
);

function Empty({ title, text }) {
  return (
    <div className="empty">
      <b>{title}</b>
      {text}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="stat">
      <div>
        <span className="lab">{label}</span>
        <b>{value}</b>
      </div>
    </div>
  );
}

// Sorting: newly booked sab se upar
const byNew = (a, b) =>
  String(b.created_at || "").localeCompare(String(a.created_at || "")) ||
  (b.appointment_date + b.appointment_time).localeCompare(a.appointment_date + a.appointment_time);
const byDate = (a, b) =>
  (b.appointment_date + b.appointment_time).localeCompare(a.appointment_date + a.appointment_time);

function vitalsText(v) {
  if (!v) return "";
  if (typeof v === "object")
    return Object.entries(v).filter(([, x]) => x).map(([k, x]) => `${k}: ${x}`).join("  •  ");
  return String(v);
}

export default function PatientBoard({ me }) {
  const [view, setView] = useState("overview");
  const [doctors, setDoctors] = useState([]);
  const [rows, setRows] = useState([]);
  const [rx, setRx] = useState([]);
  const [rxErr, setRxErr] = useState("");
  const [printId, setPrintId] = useState(null);
  const [sortBy, setSortBy] = useState("new");
  const [flt, setFlt] = useState(defaultFilter);
  const [page, setPage] = useState(1);
  const [per, setPer] = useState(10);
  const [f, setF] = useState(EMPTY);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [p, setP] = useState({ full_name: me.full_name, phone: me.phone || "", age: me.age ?? "" });
  const [pmsg, setPmsg] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get("view");
    if (["overview", "book", "appointments", "prescriptions", "profile"].includes(v)) setView(v);
  }, []);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("appointments")
      .select("*, doctor:profiles!appointments_doctor_id_fkey(full_name, department)")
      .eq("patient_id", me.id)
      .order("appointment_date", { ascending: false })
      .order("appointment_time", { ascending: false });
    setRows((data || []).map(localizeRow));
  }, [me.id]);

  const loadRx = useCallback(async () => {
    const { data, error } = await supabase
      .from("consultations")
      .select("*, appointment:appointments(appointment_date, starts_at, doctor:profiles!appointments_doctor_id_fkey(full_name, department)), prescription_items(*)")
      .eq("status", "final")
      .order("finalized_at", { ascending: false });
    setRxErr(error ? error.message : "");
    setRx((data || []).map((c) => ({ ...c, appointment: localizeRow(c.appointment) })));
  }, []);

  useEffect(() => {
    supabase.rpc("public_doctors").then(({ data }) => setDoctors(data || []));
    load();
    loadRx();
    const ch = supabase
      .channel("patient-appts")
      .on("postgres_changes",
        { event: "*", schema: "public", table: "appointments", filter: `patient_id=eq.${me.id}` },
        () => { load(); loadRx(); })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [load, loadRx, me.id]);

  const depts = [...new Set(doctors.map((d) => d.department).filter(Boolean))];
  const docsInDept = doctors.filter((d) => d.department === f.department);

  async function book(e) {
    e.preventDefault();
    const startsAt = toUtcISO(f.date, f.time);
    if (!startsAt || new Date(startsAt).getTime() < Date.now()) {
      const m = "Please choose a time in the future.";
      setMsg(m);
      toast.error(m);
      return;
    }
    setBusy(true); setMsg("");
    const { error } = await supabase.from("appointments").insert({
      patient_id: me.id,
      doctor_id: f.doctor_id,
      starts_at: startsAt,
      appointment_date: f.date,
      appointment_time: f.time,
      reason: f.reason || null,
    });
    setBusy(false);
    if (error) {
      const m = error.code === "23505"
        ? "This time is already booked for this doctor. Please choose another time."
        : "Could not book: " + error.message;
      setMsg(m);
      toast.error(m);
      return;
    }
    setF(EMPTY);
    await load();
    setSortBy("new");
    toast.success("Request sent to doctor");
    setView("appointments");
  }

  function printRx(id) {
    setPrintId(id);
    setTimeout(() => {
      window.print();
      setPrintId(null);
    }, 150);
  }

  async function cancel(id) {
    if (!confirm("Cancel this appointment?")) return;
    const { error } = await supabase.from("appointments").update({ status: "cancelled" }).eq("id", id);
    if (error) toast.error(error.message);
    else toast.info("Appointment cancelled");
    load();
  }
  async function remove(id) {
    if (!confirm("Delete this appointment from your list? This cannot be undone.")) return;
    const { data, error } = await supabase.from("appointments").delete().eq("id", id).select();
    if (error) toast.error(error.message);
    else if (!data || !data.length) toast.error("This appointment cannot be deleted.");
    else toast.success("Appointment deleted");
    load();
  }
  async function saveProfile(e) {
    e.preventDefault();
    const { error } = await supabase.from("profiles")
      .update({ full_name: p.full_name, phone: p.phone, age: p.age === "" ? null : Number(p.age) })
      .eq("id", me.id);
    setPmsg(error ? error.message : "Profile saved.");
    if (error) toast.error(error.message);
    else toast.success("Profile saved");
  }

  const count = (s) => rows.filter((r) => r.status === s).length;
  const recent = [...rows].sort(byNew);
  const sortedRows = applyFilter([...rows].sort(sortBy === "new" ? byNew : byDate), flt);
  const pages = Math.max(1, Math.ceil(sortedRows.length / per));
  const pg = Math.min(page, pages);
  const paged = sortedRows.slice((pg - 1) * per, pg * per);
  const upcomingList = rows
    .filter((r) => r.status === "accepted" && r.appointment_date >= today())
    .sort((a, b) => (a.appointment_date + a.appointment_time).localeCompare(b.appointment_date + b.appointment_time));
  const upcoming = upcomingList[0];

  const Table = ({ list }) =>
    list.length ? (
      <div className="tablewrap"><table>
        <thead><tr><th>Doctor</th><th>Department</th><th>Date</th><th>Time</th><th>Status</th><th>Doctor's note</th><th></th></tr></thead>
        <tbody>
          {list.map((a) => (
            <tr key={a.id}>
              <td>Dr. {a.doctor?.full_name}</td><td>{a.doctor?.department}</td>
              <td>{fmtDate(a.appointment_date)}</td><td>{fmtTime(a.appointment_time)}</td>
              <td><span className={`pill ${a.status}`}>{a.status}</span></td>
              <td><div className="wrap">{a.doctor_note || "-"}</div></td>
              <td>
                {["pending", "accepted"].includes(a.status) &&
                  <button className="b no" onClick={() => cancel(a.id)}>Cancel</button>}
                {a.status === "completed" &&
                  <button className="b ghost" onClick={() => setView("prescriptions")}>View prescription</button>}
                {["cancelled", "rejected"].includes(a.status) &&
                  <button className="b no" onClick={() => remove(a.id)}>Delete</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table></div>
    ) : (
      <Empty title="No appointments yet" text="Apni pehli appointment book karein." />
    );

  const items = [
    { key: "overview", icon: IconOverview, label: "Overview" },
    { key: "book", icon: IconBook, label: "Book Appointment" },
    { key: "appointments", icon: IconCalendar, label: "My Appointments" },
    { key: "prescriptions", icon: IconRx, label: "My Prescriptions" },
    { key: "profile", icon: IconProfile, label: "My Profile" },
  ];

  return (
    <DashShell title="Patient Panel" name={`Welcome, ${p.full_name}`}
      subtitle="Manage your appointments and health records" items={items} view={view} setView={setView}>
      {view === "overview" && (
        <>
          <div className="stats">
            <Stat label="Upcoming appointments" value={upcomingList.length} />
            <Stat label="Waiting for doctor" value={count("pending")} />
            <Stat label="Completed visits" value={count("completed")} />
            <Stat label="Prescriptions" value={rx.length} />
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
            <Table list={recent.slice(0, 5)} />
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
        <div className="applayout">
          <section className="panel appmain">
            <h2>My appointments</h2>
            <FilterBar value={flt} onChange={(v) => { setFlt(v); setPage(1); }} rows={rows}>
              <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(1); }}>
                <option value="new">Sort: Newly booked</option>
                <option value="date">Sort: Appointment date</option>
              </select>
            </FilterBar>
            <Table list={paged} />
            <Pager page={pg} pages={pages} total={sortedRows.length} per={per} onPage={setPage}
              onPer={(n) => { setPer(n); setPage(1); }} />
          </section>

          <aside className="appside">
            <section className="panel">
              <h2>Calendar</h2>
              <MonthCalendar
                rows={rows}
                selected={flt.date}
                onPick={(d) => { setPage(1); setFlt({ ...defaultFilter, slot: flt.slot, date: flt.date === d ? "" : d }); }}
              />
            </section>
          </aside>
        </div>
      )}

      {view === "prescriptions" && (
        <section className="panel">
          <h2>My prescriptions</h2>
          {rxErr && <p className="err">Error: {rxErr}</p>}
          {rx.length ? (
            rx.map((c) => {
              const meds = [...(c.prescription_items || [])].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
              const v = vitalsText(c.vitals);
              return (
                <div className={`rx ${printId === c.id ? "print-this" : ""}`} key={c.id}>
                  <div className="print-only print-head">
                    <h2>MediCore Hospital</h2>
                    <p>Patient: <b>{p.full_name}</b>{me.age ? `  |  Age: ${me.age}` : ""}</p>
                    <p>Date: {fmtDate(c.appointment?.appointment_date)}</p>
                  </div>

                  <div className="rx-head">
                    <h3>Dr. {c.appointment?.doctor?.full_name} <span className="muted" style={{ fontWeight: 400, fontSize: 14 }}>({c.appointment?.doctor?.department})</span></h3>
                    <span className="pill completed">{fmtDate(c.appointment?.appointment_date)}</span>
                  </div>

                  <button className="b no-print" style={{ marginBottom: 12 }} onClick={() => printRx(c.id)}>
                    Print / Download PDF
                  </button>

                  <div className="rx-grid">
                    {c.diagnosis && <div><span>Diagnosis</span><p>{c.diagnosis}</p></div>}
                    {c.complaints && <div><span>Complaints</span><p>{c.complaints}</p></div>}
                    {v && <div><span>Vitals</span><p>{v}</p></div>}
                    {c.tests && <div><span>Tests</span><p>{c.tests}</p></div>}
                    {c.advice && <div><span>Advice</span><p>{c.advice}</p></div>}
                    {c.follow_up_date && <div><span>Follow-up</span><p>{fmtDate(c.follow_up_date)}</p></div>}
                  </div>

                  {meds.length ? (
                    <table>
                      <thead><tr><th>Medicine</th><th>Dose</th><th>Frequency</th><th>Duration</th><th>Instructions</th></tr></thead>
                      <tbody>
                        {meds.map((m) => (
                          <tr key={m.id}>
                            <td><b>{m.medicine}</b></td><td>{m.dose || "-"}</td>
                            <td>{m.frequency || "-"}</td><td>{m.duration || "-"}</td>
                            <td><div className="wrap">{m.instructions || "-"}</div></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="muted">Is visit mein koi dawai nahi likhi gayi.</p>
                  )}
                </div>
              );
            })
          ) : (
            <Empty title="No prescriptions yet" text="Doctor jab consultation finish karega to prescription yahan nazar aayegi." />
          )}
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