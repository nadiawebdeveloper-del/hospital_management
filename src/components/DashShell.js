"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function DashShell({ title, name, subtitle, items, view, setView, children }) {
  const router = useRouter();

  async function logout() {
    await createClient().auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="shell">
      <aside className="side">
        <div className="brand">
          <Image
            src="/images/medicorewhite.png"
            alt="MediCore"
            width={150}
            height={50}
            style={{ width: 100 , height: 100 }}
            priority
          />
          
        </div>
        <nav>
          {items.map((i) => (
            <button key={i.key} className={view === i.key ? "on" : ""} onClick={() => setView(i.key)}>
              <span>{i.icon}</span> {i.label}
              {i.badge > 0 && <span className="badge">{i.badge}</span>}
            </button>
          ))}
        </nav>
        <div className="side-foot">
          <Link href="/">← Website</Link>
          <button onClick={logout}>Logout</button>
        </div>
      </aside>
      <section className="main">
        <header className="top">
          <h1>{name}</h1>
          <p>{subtitle}</p>
        </header>
        {children}
      </section>
    </div>
  );
}