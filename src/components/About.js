'use client';

import Image from "next/image";
import styles from "../../assets/styles/about.module.css";

export default function About() {
  return (
    <section className={styles.container}>
      <div className={styles.about}>
        
        <div className={styles.aboutImage}>
          <span>
            <Image
              src="/images/aboutus.jpg"
              alt="About MediCore"
              width={700}
              height={447}
            />
          </span>
        </div>

        <div>
          <p className={styles.label}>About MediCore</p>

          <h2 className={styles.heading}>
            We Collaborate for Better Healthcare
          </h2>

          <p className={styles.text}>
            Our doctors, nurses, and staff work as one team to give every
            patient safe, respectful, and effective care.
          </p>

          <h4 className={styles.point}>◎ Our Vision</h4>

          <p className={styles.text}>
            To be the premier healthcare institution committed to delivering
            exceptional, patient-centered services.
          </p>

          <h4 className={styles.point}>◎ Our Mission</h4>

          <p className={styles.text}>
            To provide compassionate healthcare to our community, placing the
            well-being of patients at the forefront.
          </p>

          <a href="http://localhost:3000/about" className={styles.button}>
            Learn More
          </a>
        </div>

      </div>
    </section>
  );
}