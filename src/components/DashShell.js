"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { IconHome, IconLogout } from "./NavIcons";

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
            width={50}
            height={80}
            style={{ width: 100, height: 100 }}
            priority
          />
          <small>{title}</small>
        </div>

        <nav>
          {items.map((i) => (
            <button key={i.key} className={view === i.key ? "on" : ""} onClick={() => setView(i.key)}>
              {typeof i.icon === "string" ? null : i.icon}
              <span className="lbl">{i.label}</span>
              {i.badge > 0 && <span className="badge">{i.badge}</span>}
            </button>
          ))}
        </nav>

        <div className="side-foot">
          <Link href="/">
            {IconHome}
            <span>Website</span>
          </Link>
          <button onClick={logout}>
            {IconLogout}
            <span>Logout</span>
          </button>
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