'use client';

import styles from '../../assets/styles/stats.module.css';


export default function Stats() {
      const stats = [
    { number: '25+', label: 'Years of Excellence' },
    { number: '50K+', label: 'Patients Served' },
    { number: '200+', label: 'Expert Doctors' },
    { number: '98%', label: 'Satisfaction Rate' },
  ];

      return (
           <section className={styles.statsSection}>
        <div className={styles.container}>
          <h2>By The Numbers</h2>
          <div className={styles.statsGrid}>
            {stats.map((stat, index) => (
              <div key={index} className={styles.statCard}>
                <div className={styles.statNumber}>{stat.number}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )
}