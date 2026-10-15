"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthButton() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (user === undefined) return null;
  if (!user) return <Link href="/login" className="login-btn">Login</Link>;

  return (
    <>
      <Link href="/dashboard" className="login-btn">DASHBOARD</Link>
      <button className="logout-btn" onClick={async () => {
        await supabase.auth.signOut();
        router.push("/"); router.refresh();
      }}>Logout</button>
    </>
  );
}