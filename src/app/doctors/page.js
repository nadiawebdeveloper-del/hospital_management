"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import doctorsData from "./doctorsData";

const tabs = [
  "All",
  "Cardiology",
  "Neurology",
  "Pediatrics",
  "Orthopedics",
  "Gynecology",
  "General Medicine",
];

export default function DoctorsData() {
  const [activeTab, setActiveTab] = useState("All");

  const filteredDoctors =
    activeTab === "All"
      ? doctorsData
      : doctorsData.filter((doc) => doc.specialty === activeTab);

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.container}>
          <p className={styles.label}>Our Team</p>
          <h1>Meet Our Expert Doctors</h1>
          <p className={styles.heroText}>
            Qualified, experienced, and caring specialists ready to help you.
          </p>
        </div>
      </section>

      <div className={styles.container}>

        <div className={styles.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={
                activeTab === tab ? `${styles.tab} ${styles.activeTab}` : styles.tab
              }
            >
              {tab}
            </button>
          ))}
        </div>

        <div className={styles.grid}>
          {filteredDoctors.map((doc) => (
            <div key={doc.id} className={styles.card}>
              {/* Photo par click karne se bhi detail page khulega */}
              <Link href={`/doctors/${doc.id}`} className={styles.photo}>
                <Image
                  src={doc.img}
                  alt={doc.name}
                  width={300}
                  height={220}
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                />
              </Link>

              <div className={styles.info}>
                <span className={styles.specialtyTag}>{doc.specialty}</span>
                <h3>
                  <Link href={`/doctors/${doc.id}`}>{doc.name}</Link>
                </h3>
                <p>{doc.exp}</p>

                <div className={styles.cardFooter}>
                  <Link href={`/doctors/${doc.id}`} className={styles.bookBtn}>
                    View Profile
                  </Link>
                  <div className={styles.social}>
                    <a href="#" aria-label="Facebook">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14 8V6.5c0-.7.3-1 1-1h2V2h-3c-3 0-4.5 1.8-4.5 4.5V8H7v3.5h2.5V22H14V11.5h2.8L17.3 8H14z" />
                      </svg>
                    </a>
                    <a href="#" aria-label="LinkedIn">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M4 9h3.5v11H4V9zm1.8-5.5a2 2 0 110 4 2 2 0 010-4zM10 9h3.3v1.5c.5-.9 1.7-1.8 3.4-1.8 3.5 0 4.3 2.3 4.3 5.3V20h-3.5v-5.2c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V20H10V9z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <p className={styles.empty}>No doctors found in this department.</p>
        )}
      </div>
    </>
  );
}