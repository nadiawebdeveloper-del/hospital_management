'use client';

import styles from '../../assets/styles/AboutPage.module.css';
import Aboutsection from './Aboutsection';
import MissionVision from './MissionVision';
import Stats from './Stats';
import Corevalues from './Corevalues';

export default function AboutPage() {
  return (
    <main className={styles.aboutPage}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <h1>About MediCore Hospital</h1>
          <p>
            Leading healthcare provider dedicated to your wellness and recovery
          </p>
        </div>
      </section>   

      <Aboutsection />   
      <MissionVision />
      <Stats />
      <Corevalues />


      <section className={styles.whySection}>
        <div className={styles.container}>
          <h2>Why Choose MediCore?</h2>
          <div className={styles.whyGrid}>
            <div className={styles.whyCard}>
              <div className={styles.whyNumber}>01</div>
              <h3>Expert Medical Team</h3>
              <p>Highly qualified doctors and specialists with years of experience</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyNumber}>02</div>
              <h3>Advanced Technology</h3>
              <p>State-of-the-art equipment and modern facilities for better care</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyNumber}>03</div>
              <h3>Patient-Centric Approach</h3>
              <p>Your comfort and recovery are our top priorities</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyNumber}>04</div>
              <h3>24/7 Availability</h3>
              <p>Round-the-clock services for emergency and routine care</p>
            </div>
          </div>
        </div>
      </section>

      
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2>Ready to Experience Quality Healthcare?</h2>
            <p>Book your appointment today and take the first step towards better health</p>
            <button className={styles.ctaMainButton}>Book Appointment</button>
          </div>
        </div>
      </section>
    </main>
  );
}
