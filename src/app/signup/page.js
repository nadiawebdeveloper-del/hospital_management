"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import "../auth.css";

const DEPTS = ["Cardiology", "Neurology", "Pediatrics", "Orthopedics", "Dermatology", "General Medicine"];

export default function SignupPage() {
  const supabase = createClient();
  const router = useRouter();
  const [role, setRole] = useState("patient");
  const [f, setF] = useState({ name: "", email: "", phone: "", password: "", confirm: "", department: DEPTS[0], license: "", age: "" });
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function onSubmit(e) {
    e.preventDefault();
    if (f.password !== f.confirm) return setError("Passwords do not match.");
    setBusy(true); setError("");
    const { data, error: err } = await supabase.auth.signUp({
      email: f.email,
      password: f.password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
        data: {
          full_name: f.name, phone: f.phone, role,
          department: role === "doctor" ? f.department : null,
          license_no: role === "doctor" ? f.license : null,
          age: role === "patient" ? f.age : null,
        },
      },
    });
    setBusy(false);
    if (err) return setError(err.message);
    if (data.session) { router.push("/dashboard"); router.refresh(); }
    else setInfo("Account created. Check your email to confirm, then login.");
  }
  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={onSubmit}>
        <Link href="/" style={{ fontSize: 14, color: "#00787d" }}>← Back to website</Link>
        <h1>Create account</h1>
        <p className="sub">Join MediCore as a patient or doctor</p>
        <div className="auth-tabs">
          {["patient", "doctor"].map((r) => (
            <button type="button" key={r} className={role === r ? "on" : ""} onClick={() => setRole(r)}>
              {r === "patient" ? "Patient" : "Doctor"}
            </button>
          ))}
        </div>
        <label>Full name</label><input required value={f.name} onChange={set("name")} />
        <label>Email</label><input type="email" required value={f.email} onChange={set("email")} />
        <label>Phone</label><input required value={f.phone} onChange={set("phone")} />
        {role === "doctor" ? (
          <>
            <label>Department</label>
            <select value={f.department} onChange={set("department")}>{DEPTS.map((d) => <option key={d}>{d}</option>)}</select>
            <label>Medical license number</label><input required value={f.license} onChange={set("license")} />
          </>
        ) : (
          <><label>Age</label><input type="number" min="0" value={f.age} onChange={set("age")} /></>
        )}
        <div className="row">
          <div><label>Password</label><input type="password" required minLength={6} value={f.password} onChange={set("password")} /></div>
          <div><label>Confirm</label><input type="password" required value={f.confirm} onChange={set("confirm")} /></div>
        </div>
        {error && <div className="auth-error" role="alert">{error}</div>}
        {info && <div className="auth-error" style={{ background: "#dcfce7", color: "#166534" }}>{info}</div>}
        <button className="auth-submit" disabled={busy}>{busy ? "Creating…" : "Sign up"}</button>
        <p className="auth-foot">Already registered? <Link href="/login">Login</Link></p>
      </form>
    </main>
  );
}