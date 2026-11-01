'use client';

import Image from "next/image";
import styles from "../../assets/styles/about.module.css";

export default function About() {
  return (
    <section className={styles.container}>
      <div className={styles.about}>

        <div>
          <p className={styles.label}>About MediCore</p>

          <h2 className={styles.heading}>
            Our Story
          </h2>

          <p className={styles.text}>
            Founded in 1998, MediCore Hospital has been at the forefront of healthcare innovation for over 25 years. We started with a simple mission: to provide world-class medical care accessible to everyone.
          </p>

          <p className={styles.text}>     

            Today, we are proud to be one of the most trusted healthcare providers in the region, serving thousands of patients annually with expertise, compassion, and cutting-edge technology.
          </p>

          <a href="/contact" className={styles.button}>
            Contact us!
          </a>
        </div>

          <div className={styles.aboutImage}>
          <span>
            <Image
              src="/images/aboutpic.png"
              alt="About MediCore"
              width={600}
              height={350}
            />
          </span>
        </div>

      </div>
    </section>
  );
}