'use client';

import Image from "next/image";
import styles from "../../assets/styles/AboutPage.module.css";

export default function Contactsection() {
  return (
     <section className={styles.hero}>
        <div className={styles.container}>
          <h1>Contact Us</h1>
          <p>
            Your Care Starts With a Conversation
          </p>
        </div>
      </section>   
  );
}