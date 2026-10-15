
'use client';

import styles from "../../assets/styles/corevalues.module.css";

const values = [
  {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
      </svg>
    ),
    title: 'Patient Care',
    description: 'Your health is our priority. We provide compassionate care 24/7.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
    title: 'Innovation',
    description: 'Latest technology and advanced medical solutions for better outcomes.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3l2.7 5.47 6.03.88-4.36 4.25 1.03 6.01L12 16.77l-5.4 2.84 1.03-6.01-4.36-4.25 6.03-.88L12 3Z" />
      </svg>
    ),
    title: 'Excellence',
    description: 'Committed to highest standards in healthcare and service delivery.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 17l6-6 4 4 8-9" />
        <path d="M15 6h6v6" />
      </svg>
    ),
    title: 'Growth',
    description: 'Constantly improving and expanding our services for your wellness.',
  },
];

export default function Corevalues() {
  return (
    <section className={styles.valuesSection}>
      <div className={styles.container}>

        <h2>Core Values</h2>

        <p className={styles.valuesIntro}>
          These principles guide every decision we make and every patient we serve
        </p>

        <div className={styles.valuesGrid}>
          {values.map((value, index) => (
            <div key={index} className={styles.valueCard}>

              <div className={styles.valueIcon}>
                {value.icon}
              </div>

              <h3>{value.title}</h3>

              <p>{value.description}</p>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
