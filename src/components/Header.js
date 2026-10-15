"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "../../assets/styles/header.module.css";
import Image from "next/image";
import AuthButton from "./AuthButton";

const services = [
  { label: "OPD Services", href: "/services/opd-services" },
  { label: "Emergency Care", href: "/services/emergency-care" },
  { label: "Laboratory", href: "/services/laboratory" },
  { label: "Pharmacy", href: "/services/pharmacy" },
  { label: "Radiology", href: "/services/radiology" },
  { label: "Ambulance", href: "/services/ambulance" },
];

const departments = [
  { label: "Cardiology", href: "/departments/cardiology" },
  { label: "Neurology", href: "/departments/neurology" },
  { label: "Pediatrics", href: "/departments/pediatrics" },
  { label: "Orthopedics", href: "/departments/orthopedics" },
  { label: "Gynecology", href: "/departments/gynecology" },
  { label: "General Medicine", href: "/departments/general-medicine" },
];

export default function Header() {
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    setMenuOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  function toggleDropdown(name) {
    setOpenDropdown(openDropdown === name ? null : name);
  }

  function linkClass(href) {
    return pathname === href
      ? `${styles.navLink} ${styles.active}`
      : styles.navLink;
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>

        <Link href="/" className={styles.logo}>
          <Image
            src="/images/medicorewhite.png"
            alt="MediCore Hospital"
            width={80}
            height={80}
            priority
          />
        </Link>

        <nav className={menuOpen ? `${styles.nav} ${styles.navOpen}` : styles.nav}>
          <ul className={styles.navList}>

            <li className={styles.navItem}>
              <Link href="/" className={linkClass("/")}>Home</Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/about" className={linkClass("/about")}>About</Link>
            </li>

            <li
              className={
                openDropdown === "services"
                  ? `${styles.navItem} ${styles.hasDropdown} ${styles.open}`
                  : `${styles.navItem} ${styles.hasDropdown}`
              }
            >
              <div className={styles.navLink}>
                <Link href="/services" className={styles.navLinkText}>
                  Services
                </Link>
                <button
                  type="button"
                  className={styles.caretBtn}
                  aria-label="Toggle Services menu"
                  onClick={() => toggleDropdown("services")}
                >
                  <svg className={styles.caret} viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M1 3l4 4 4-4" />
                  </svg>
                </button>
              </div>
              <ul className={styles.dropdown}>
                {services.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </li>

            <li
              className={
                openDropdown === "departments"
                  ? `${styles.navItem} ${styles.hasDropdown} ${styles.open}`
                  : `${styles.navItem} ${styles.hasDropdown}`
              }
            >
              <div className={styles.navLink}>
                <Link href="/departments" className={styles.navLinkText}>
                  Departments
                </Link>
                <button
                  type="button"
                  className={styles.caretBtn}
                  aria-label="Toggle Departments menu"
                  onClick={() => toggleDropdown("departments")}
                >
                  <svg className={styles.caret} viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M1 3l4 4 4-4" />
                  </svg>
                </button>
              </div>
              <ul className={styles.dropdown}>
                {departments.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </li>

            <li className={styles.navItem}>
              <Link href="/doctors" className={linkClass("/doctors")}>Doctors</Link>
            </li>
            {/* <li className={styles.navItem}>
              <Link href="/appointments" className={linkClass("/appointments")}>Appointments</Link>
            </li> */}
            <li className={styles.navItem}>
              <Link href="/contact" className={linkClass("/contact")}>Contact</Link>
            </li>

            <li className={`${styles.navItem} ${styles.navLogin}`}>
              <Link href="/login" className={styles.btn}>Login</Link>
            </li>
          </ul>
        </nav>

        <div className={styles.actions}>
          <a href="tel:+92 300 9876543" className={styles.emergency}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />
            </svg>
            <span>Emergency Call</span>
          </a>

          <AuthButton />

          <button
            type="button"
            className={styles.burger}
            aria-label="Toggle menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span />
          </button>
        </div>

      </div>
    </header>
  );
}