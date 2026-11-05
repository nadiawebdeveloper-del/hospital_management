"use client";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import DashShell from "@/components/DashShell";
import { IconOverview, IconCalendar, IconPatients, IconProfile } from "@/components/NavIcons";
import { today, fmtDate, fmtTime } from "@/lib/dates";
import { toast } from "@/components/Toast";
import { localizeRow } from "@/lib/utc";
import { FilterBar, MonthCalendar, Pager, applyFilter, defaultFilter } from "@/components/ApptFilters";

const supabase = createClient();

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

// Sorting
const byNew = (a, b) =>
  String(b.created_at || "").localeCompare(String(a.created_at || "")) ||
  (b.appointment_date + b.appointment_time).localeCompare(a.appointment_date + a.appointment_time);
const bySoon = (a, b) =>
  (a.appointment_date + a.appointment_time).localeCompare(b.appointment_date + b.appointment_time);

function isoDate(d) {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export default function DoctorBoard({ me }) {
  const locked = !me.is_verified;
  const [rows, setRows] = useState([]);
  const [view, setView] = useState("overview");
  const [tab, setTab] = useState("pending");
  const [scope, setScope] = useState("mine");
  const [q, setQ] = useState("");
  const [p, setP] = useState({ full_name: me.full_name, phone: me.phone || "" });
  const [sortBy, setSortBy] = useState("new");
  const [flt, setFlt] = useState(defaultFilter);
  const [page, setPage] = useState(1);
  const [per, setPer] = useState(10);

  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get("view");
    if (["overview", "appointments", "patients", "profile"].includes(v)) setView(v);
  }, []);

  const load = useCallback(async () => {
    if (locked) return;
    const { data } = await supabase
      .from("appointments")
      .select("*, patient:profiles!appointments_patient_id_fkey(full_name, phone, age), doctor:profiles!appointments_doctor_id_fkey(full_name, department)")
      .order("appointment_date")
      .order("appointment_time");
    setRows(
      (data || []).map(localizeRow).map((r) =>
        r.patient ? r : { ...r, isGuest: true, patient: { full_name: r.guest_name, phone: r.guest_phone, age: null } }
      )
    );
  }, [locked]);

  useEffect(() => {
    load();
    if (locked) return;
    const ch = supabase
      .channel("doctor-appts")
      .on("postgres_changes", { event: "*", schema: "public", table: "appointments" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [load, locked]);

  async function update(id, patch, okMsg) {
    const { error } = await supabase.from("appointments").update(patch).eq("id", id);
    if (error) toast.error(error.message);
    else if (okMsg) toast.success(okMsg);
    load();
  }
  function accept(a) {
    const clash = mine.some((r) => r.id !== a.id && r.status === "accepted" &&
      r.appointment_date === a.appointment_date && r.appointment_time === a.appointment_time);
    if (clash && !confirm("You already have an accepted appointment at this time. Accept anyway?")) return;
    update(a.id, { status: "accepted" }, "Appointment accepted");
  }
  function reject(a) {
    const reason = prompt("Reason for rejecting (optional):");
    if (reason === null) return;
    update(a.id, { status: "rejected", doctor_note: reason || null }, "Request rejected");
  }
  function note(a) {
    const t = prompt("Note / prescription:", a.doctor_note || "");
    if (t !== null) update(a.id, { doctor_note: t }, "Note saved");
  }
  async function saveProfile(e) {
    e.preventDefault();
    const { error } = await supabase.from("profiles")
      .update({ full_name: p.full_name, phone: p.phone }).eq("id", me.id);
    if (error) toast.error(error.message);
    else toast.success("Profile saved");
  }

  const mine = rows.filter((r) => r.doctor_id === me.id);
  const pending = mine.filter((r) => r.status === "pending").sort(byNew);
  const todays = mine.filter(
    (r) => r.appointment_date === today() && ["accepted", "completed"].includes(r.status)
  );
  const count = (s) => mine.filter((r) => r.status === s).length;

  // Aane wali accepted appointments (sab se qareeb wali pehle)
  const upcoming = mine
    .filter((r) => r.status === "accepted" && r.appointment_date >= today())
    .sort(bySoon);
  const nextPatient = upcoming[0];
  const tomorrowIso = isoDate(new Date(new Date(today() + "T00:00:00").getTime() + 86400000));
  const dayLabel = (d) => (d === today() ? "Today" : d === tomorrowIso ? "Tomorrow" : fmtDate(d));

  // Agle 7 din ka chart
  const week = [];
  const base = new Date(today() + "T00:00:00");
  for (let i = 0; i < 7; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    const iso = isoDate(d);
    week.push({
      iso,
      label: d.toLocaleDateString("en-GB", { weekday: "short" }),
      n: mine.filter((r) => r.appointment_date === iso && ["pending", "accepted", "completed"].includes(r.status)).length,
      isToday: i === 0,
    });
  }
  const weekMax = Math.max(1, ...week.map((w) => w.n));
  const weekTotal = week.reduce((s, w) => s + w.n, 0);

  // Recent activity (appointments se bani hui)
  const activity = [...mine]
    .sort((a, b) => (b.appointment_date + b.appointment_time).localeCompare(a.appointment_date + a.appointment_time))
    .slice(0, 6)
    .map((a) => {
      const who = a.patient?.full_name || "Patient";
      const text =
        a.status === "pending" ? `New request from ${who}`
        : a.status === "accepted" ? `You accepted ${who}'s appointment`
        : a.status === "completed" ? `Consultation completed for ${who}`
        : a.status === "rejected" ? `You rejected ${who}'s request`
        : `${who}'s appointment was cancelled`;
      return { id: a.id, status: a.status, text, when: `${fmtDate(a.appointment_date)} • ${fmtTime(a.appointment_time)}` };
    });

  const statusList = ["pending", "accepted", "completed", "rejected", "cancelled"];

  const scoped =
    scope === "mine" ? mine
    : scope === "department" ? rows.filter((r) => r.doctor?.department === me.department)
    : rows;
  const shown = applyFilter(tab === "all" ? scoped : scoped.filter((r) => r.status === tab), flt)
    .slice()
    .sort(sortBy === "new" ? byNew : bySoon);
  const pages = Math.max(1, Math.ceil(shown.length / per));
  const pg = Math.min(page, pages);
  const paged = shown.slice((pg - 1) * per, pg * per);

  const pmap = {};
  mine.forEach((r) => {
    const key = r.patient_id || r.guest_phone;
    const e = pmap[key] || (pmap[key] = { ...r.patient, isGuest: r.isGuest, visits: 0, last: "" });
    e.visits++;
    if (r.appointment_date > e.last) e.last = r.appointment_date;
  });
  const patients = Object.values(pmap).filter((x) => (x.full_name || "").toLowerCase().includes(q.toLowerCase()));

  const Who = ({ a }) => (
    <>
      {a.patient?.full_name}
      {a.isGuest && <span className="pill" style={{ marginLeft: 6 }}>Guest</span>}
      {a.isGuest && a.guest_email && <div className="note">{a.guest_email}</div>}
    </>
  );

  const Actions = ({ a }) =>
    a.doctor_id !== me.id ? (
      <span className="muted">View only</span>
    ) : (
      <>
        {a.status === "pending" && (
          <>
            <button className="b" onClick={() => accept(a)}>Accept</button>
            <button className="b no" onClick={() => reject(a)}>Reject</button>
          </>
        )}
        {a.status === "accepted" && (
          <Link className="b" href={`/doctor/consultation/${a.id}`}>Open consultation</Link>
        )}
        {a.status === "completed" && (
          <Link className="b ghost" href={`/doctor/consultation/${a.id}`}>View prescription</Link>
        )}
        <button className="b ghost" onClick={() => note(a)}>Note</button>
      </>
    );

  const items = [
    { key: "overview", icon: IconOverview, label: "Overview" },
    { key: "appointments", icon: IconCalendar, label: "Appointments", badge: pending.length },
    { key: "patients", icon: IconPatients, label: "Patients" },
    { key: "profile", icon: IconProfile, label: "My Profile" },
  ];
  const scopes = [["mine", "My appointments"], ["department", "My department"], ["all", "All doctors"]];

  return (
    <DashShell title="Doctor Panel" name={`Welcome, Dr. ${p.full_name}`}
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
              {nextPatient ? (
                <div className="nextbanner">
                  <div>
                    <small>Next appointment • {dayLabel(nextPatient.appointment_date)}</small>
                    <h2>{fmtTime(nextPatient.appointment_time)} — {nextPatient.patient?.full_name}</h2>
                    <p>{nextPatient.reason || "No reason given"}{nextPatient.patient?.phone ? `  •  ${nextPatient.patient.phone}` : ""}</p>
                  </div>
                  <Link className="b on" href={`/doctor/consultation/${nextPatient.id}`}>Start consultation</Link>
                </div>
              ) : (
                <div className="nextbanner">
                  <div>
                    <small>Next appointment</small>
                    <h2>No one waiting</h2>
                    <p>There are no accepted appointments left.</p>
                  </div>
                </div>
              )}

              <div className="stats">
                <Stat label="Today's appointments" value={todays.length} />
                <Stat label="Pending requests" value={pending.length} />
                <Stat label="Completed" value={count("completed")} />
                <Stat label="Total patients" value={Object.keys(pmap).length} />
              </div>

              <div className="dgrid">
                {/* ---------- Left column ---------- */}
                <div>
                  <section className="panel">
                    <h2>Incoming requests {pending.length > 0 && <span className="badge" style={{ marginLeft: 8 }}>{pending.length}</span>}</h2>
                    {pending.length ? (
                      <table>
                        <thead><tr><th>Patient</th><th>Phone</th><th>Date</th><th>Time</th><th>Reason</th><th></th></tr></thead>
                        <tbody>
                          {pending.slice(0, 5).map((a) => (
                            <tr key={a.id}>
                              <td><Who a={a} /></td><td>{a.patient?.phone || "-"}</td>
                              <td>{fmtDate(a.appointment_date)}</td><td>{fmtTime(a.appointment_time)}</td>
                              <td><div className="wrap">{a.reason || "-"}</div></td>
                              <td><Actions a={a} /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <Empty title="No pending requests" text="New appointment requests from patients will appear here." />
                    )}
                    {pending.length > 5 && (
                      <button className="b ghost" style={{ marginTop: 12 }} onClick={() => setView("appointments")}>
                        View all {pending.length} requests
                      </button>
                    )}
                  </section>

                  <section className="panel">
                    <h2>Today's schedule</h2>
                    {todays.length ? (
                      <table>
                        <thead><tr><th>Time</th><th>Patient</th><th>Phone</th><th>Reason</th><th>Status</th><th></th></tr></thead>
                        <tbody>
                          {todays.map((a) => (
                            <tr key={a.id}>
                              <td>{fmtTime(a.appointment_time)}</td>
                              <td><Who a={a} /></td>
                              <td>{a.patient?.phone || "-"}</td>
                              <td><div className="wrap">{a.reason || "-"}</div></td>
                              <td><span className={`pill ${a.status}`}>{a.status}</span></td>
                              <td><Actions a={a} /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <Empty title="Nothing scheduled for today" text="You have no accepted appointments today." />
                    )}
                  </section>

                  <section className="panel">
                    <h2>Upcoming appointments</h2>
                    {upcoming.length ? (
                      <table>
                        <thead><tr><th>Date</th><th>Time</th><th>Patient</th><th>Reason</th><th></th></tr></thead>
                        <tbody>
                          {upcoming.slice(0, 5).map((a) => (
                            <tr key={a.id}>
                              <td>{fmtDate(a.appointment_date)}</td>
                              <td>{fmtTime(a.appointment_time)}</td>
                              <td><Who a={a} /></td>
                              <td><div className="wrap">{a.reason || "-"}</div></td>
                              <td><Actions a={a} /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <Empty title="No upcoming appointments" text="Accepted upcoming appointments will appear here." />
                    )}
                    <button className="b ghost" style={{ marginTop: 12 }} onClick={() => { setTab("all"); setView("appointments"); }}>
                      Open calendar
                    </button>
                  </section>
                </div>

                {/* ---------- Right column ---------- */}
                <div>
                  <section className="panel">
                    <h2>Next 7 days</h2>
                    <div className="week">
                      {week.map((w) => (
                        <div key={w.iso} className={`col ${w.isToday ? "today" : ""}`}>
                          <span className="num">{w.n}</span>
                          <div className="bar" style={{ height: `${(w.n / weekMax) * 80}px` }} />
                          <span className="day">{w.isToday ? "Today" : w.label}</span>
                        </div>
                      ))}
                    </div>
                    <p className="note" style={{ marginTop: 10 }}>{weekTotal} appointment(s) in the next 7 days</p>
                  </section>

                  <section className="panel">
                    <h2>Recent activity</h2>
                    {activity.length ? (
                      <ul className="feed">
                        {activity.map((x) => (
                          <li key={x.id}>
                            <span className={`dot ${x.status}`} />
                            <div>
                              <p>{x.text}</p>
                              <small>{x.when}</small>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <Empty title="No activity yet" text="Your appointment history will appear here." />
                    )}
                  </section>

                  <section className="panel">
                    <h2>Appointments summary</h2>
                    {statusList.map((s) => (
                      <div className="brk" key={s}>
                        <div className="row"><span>{s}</span><b>{count(s)}</b></div>
                        <div className="track">
                          <div className={`fill ${s}`} style={{ width: `${mine.length ? (count(s) / mine.length) * 100 : 0}%` }} />
                        </div>
                      </div>
                    ))}
                  </section>
                </div>
              </div>
            </>
          )}

          {view === "appointments" && (
            <div className="applayout">
              <section className="panel appmain">
                <h2>Appointments</h2>
                <div className="tabs2">
                  {scopes.map(([k, label]) => (
                    <button key={k} className={`b ghost ${scope === k ? "on" : ""}`} onClick={() => { setScope(k); setPage(1); }}>{label}</button>
                  ))}
                </div>
                <div className="tabs2">
                  {["pending", "accepted", "completed", "rejected", "cancelled", "all"].map((t) => (
                    <button key={t} className={`b ghost ${tab === t ? "on" : ""}`} onClick={() => { setTab(t); setPage(1); }}>
                      {t[0].toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
                <FilterBar value={flt} onChange={(v) => { setFlt(v); setPage(1); }} rows={scoped}>
                  <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(1); }}>
                    <option value="new">Sort: Newly booked</option>
                    <option value="soon">Sort: Soonest first</option>
                  </select>
                </FilterBar>

                {paged.length ? (
                  <div className="tablewrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Patient</th><th>Phone</th>{scope !== "mine" && <th>Doctor</th>}
                          <th>Date</th><th>Time</th><th>Reason</th><th>Status</th><th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paged.map((a) => (
                          <tr key={a.id}>
                            <td><Who a={a} /></td><td>{a.patient?.phone || "-"}</td>
                            {scope !== "mine" && <td>Dr. {a.doctor?.full_name}<div className="note">{a.doctor?.department}</div></td>}
                            <td>{fmtDate(a.appointment_date)}</td><td>{fmtTime(a.appointment_time)}</td>
                            <td><div className="wrap">{a.reason || "-"}{a.doctor_note && <div className="note">Note: {a.doctor_note}</div>}</div></td>
                            <td><span className={`pill ${a.status}`}>{a.status}</span></td>
                            <td><Actions a={a} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <Empty title="No appointments here" text="No appointments match this category or filter." />
                )}
                <Pager page={pg} pages={pages} total={shown.length} per={per} onPage={setPage}
                  onPer={(n) => { setPer(n); setPage(1); }} />
              </section>

              <aside className="appside">
                <section className="panel">
                  <h2>Calendar</h2>
                  <MonthCalendar
                    rows={scoped}
                    selected={flt.date}
                    onPick={(d) => { setTab("all"); setPage(1); setFlt({ ...defaultFilter, slot: flt.slot, date: flt.date === d ? "" : d }); }}
                  />
                </section>
              </aside>
            </div>
          )}

          {view === "patients" && (
            <section className="panel">
              <h2>My patients</h2>
              <input placeholder="Search by name…" value={q} onChange={(e) => setQ(e.target.value)} style={{ maxWidth: 320, marginBottom: 12 }} />
              {patients.length ? (
                <table>
                  <thead><tr><th>Name</th><th>Age</th><th>Phone</th><th>Visits</th><th>Last visit</th></tr></thead>
                  <tbody>
                    {patients.map((x, i) => (
                      <tr key={i}>
                        <td>{x.full_name}{x.isGuest && <span className="pill" style={{ marginLeft: 6 }}>Guest</span>}</td>
                        <td>{x.age ?? "-"}</td><td>{x.phone || "-"}</td><td>{x.visits}</td><td>{fmtDate(x.last)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <Empty title="No patients found" text="Patients who book with you will appear here." />
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
                  <div><label>Email</label><input disabled value={me.email || ""} /></div>
                  <div><label>Department</label><input disabled value={me.department || ""} /></div>
                  <div><label>License no.</label><input disabled value={me.license_no || ""} /></div>
                </div>
                <button className="b" style={{ marginTop: 14 }}>Save changes</button>
              </form>
            </section>
          )}
        </>
      )}
    </DashShell>
  );
}