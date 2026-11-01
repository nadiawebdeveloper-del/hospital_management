"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import "./authbutton.css";

export default function AuthButton() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState(undefined);
  const [profile, setProfile] = useState(null);
  const [open, setOpen] = useState(false);
  const box = useRef(null);

  useEffect(() => {
    let alive = true;
    async function load(u) {
      if (!alive) return;
      setUser(u ?? null);
      if (!u) return setProfile(null);
      const { data } = await supabase.from("profiles").select("full_name, role").eq("id", u.id).single();
      if (alive) setProfile(data);
    }
    supabase.auth.getUser().then(({ data }) => load(data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setTimeout(() => load(s?.user), 0);
    });
    return () => { alive = false; sub.subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    const close = (e) => { if (box.current && !box.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  async function logout() {
    setOpen(false);
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (user === undefined) return null;

  if (!user)
    return (
      <div className="ab-wrap">
        <Link href="/login" className="ab-btn ab-ghost">Login</Link>
        <Link href="/signup" className="ab-btn">Sign up</Link>
      </div>
    );

  const isDoctor = profile?.role === "doctor";
  const name = profile?.full_name || user.email?.split("@")[0] || "Account";
  const first = name.split(" ")[0];
  const label = isDoctor ? `Dr. ${first}` : first;
  const initials = name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("") || "U";
  const base = isDoctor ? "/doctor/dashboard" : "/patient/dashboard";

  return (
    <div className="ab-wrap" ref={box}>
      <button className="ab-profile" onClick={() => setOpen(!open)} aria-haspopup="menu" aria-expanded={open}>
        <span className="ab-avatar">{initials}</span>
        <span className="ab-name">{label}</span>
        <span className={`ab-caret ${open ? "up" : ""}`} aria-hidden="true" />
      </button>

      {open && (
        <div className="ab-menu" role="menu">
          <div className="ab-head">
            <b>{isDoctor ? `Dr. ${name}` : name}</b>
            <small>{isDoctor ? "Doctor" : "Patient"}</small>
          </div>
          <Link role="menuitem" href={`${base}?view=profile`} onClick={() => setOpen(false)}>My Profile</Link>
          <Link role="menuitem" href={`${base}?view=appointments`} onClick={() => setOpen(false)}>My Appointments</Link>
          <button role="menuitem" className="ab-out" onClick={logout}>Logout</button>
        </div>
      )}
    </div>
  );
}