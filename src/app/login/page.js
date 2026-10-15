"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import "../auth.css";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const [role, setRole] = useState("patient");
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true); setError("");
    const { data, error: err } = await supabase.auth.signInWithPassword(form);
    if (err) { setBusy(false); return setError("Email or password is incorrect."); }
    const { data: p } = await supabase.from("profiles").select("role").eq("id", data.user.id).single();
    if (p?.role !== role) {
      await supabase.auth.signOut();
      setBusy(false);
      return setError(`This is a ${p?.role} account. Switch the role above.`);
    }
    router.push("/dashboard"); router.refresh();
  }

  const google = () =>
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={onSubmit}>
        <Link href="/" style={{ fontSize: 14, color: "#00787d" }}>← Back to website</Link>
        <h1>Login</h1>
        <p className="sub">Sign in to your MediCore account</p>
        <div className="auth-tabs">
          {["patient", "doctor"].map((r) => (
            <button type="button" key={r} className={role === r ? "on" : ""} onClick={() => setRole(r)}>
              {r === "patient" ? "Patient" : "Doctor"}
            </button>
          ))}
        </div>
        <label>Email</label>
        <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <label>Password</label>
        <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <div className="auth-error" role="alert">{error}</div>}
        <button className="auth-submit" disabled={busy}>{busy ? "Signing in…" : "Login"}</button>
        <button type="button" className="auth-google" onClick={google}>Continue with Google</button>
        <p className="auth-foot">New here? <Link href="/signup">Create account</Link></p>
      </form>
    </main>
  );
}