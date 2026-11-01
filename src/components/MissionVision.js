'use client';

import Image from "next/image";
import styles from "../../assets/styles/MissionVision.module.css";


export default function MissionVision() {
  return (
    <section className={styles.container}>
      <div className={styles.about}>
        
        <div className={styles.aboutImage}>
          <span>
            <Image
              src="/images/aboutus.jpg"
              alt="About MediCore"
              width={900}
              height={447}
            />
          </span>
        </div>

        <div>
          <p className={styles.label}>About MediCore</p>

          <h2 className={styles.heading}>
            Caring for You, Every Step
          </h2>

          <p className={styles.text}>
            We provide trusted healthcare with compassion, expertise, and a patient-first approach.
          </p>
          <section className={styles.missionSection}>
        <div className={styles.container}>
          <div className={styles.missionGrid}>
               <div className={styles.missionCard}>
            
              <h3>Our Mission</h3>
              <p>
                To deliver safe, quality care that puts patients first.
              </p>
            </div>

              <div className={styles.missionCard}>
             
              <h3>Our Vision</h3>
              <p>
                To create a healthier community through trusted healthcare.
              </p>
            </div>
          </div>
        </div>
      </section>

          <a href="/services" className={styles.button}>
            Explore More
          </a>
        </div>

      </div>
    </section>
  );
}