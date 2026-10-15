// import Link from "next/link";

import styles from "./page.module.css";
import Search from "../components/Search";
import FindDoctors from "../components/FindDoctors";
import About from "../components/About.js";
import Facilities from "../components/Facilities";
import LogoMarquee from "../components/LogoMarquee.js";
import Faq from "../components/Faq";
import Appointmentform from "../components/Appointmentform.js";
import Testimonials from "../components/Testimonials.js";



export default function Home() {
  return (
    <>
      
      <section className={styles.hero}>
        <div className={styles.container}>
          <h1>Welcome to MediCore Hospital</h1>
          <h2>Your Beacon of Health and Healing Excellence</h2>
          <p>
            We bring caring doctors, modern equipment, and quick service together
            so you get the right treatment at the right time.
          </p>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <strong>25+</strong>
              <span>Years of experience</span>
            </div>
            <div className={styles.stat}>
              <strong>140+</strong>
              <span>Specialist Doctors</span>
            </div>
            <div className={styles.stat}>
              <strong>100K+</strong>
              <span>Patients Recover</span>
            </div>
          </div>
        </div>
      </section>      
      <Search />
    
      <About />
      <FindDoctors />
      <Facilities />
      <LogoMarquee />
      <Testimonials />
      <Faq />
      <Appointmentform />

      
    </>
  );
}