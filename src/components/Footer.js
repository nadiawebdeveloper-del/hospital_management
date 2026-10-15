import Link from "next/link";
import styles from "../../assets/styles/footer.module.css";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.about}>
          <Link href="/" className={styles.logo}>
  <Image
    src="/images/medicore.png"
    alt="MediCore Hospital"
    width={70}
    height={70}
    priority
  />
</Link>

          <p className={styles.text}>
            MediCore Hospital provides caring, patient-centered healthcare
            with experienced doctors and modern facilities.
          </p>
          <div className={styles.social}>
            <a href="#" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 8V6.5c0-.7.3-1 1-1h2V2h-3c-3 0-4.500 1.800-4.500 4.500V8H7v3.500h2.500V22H14V11.500h2.800L17.300 8H14z" />
              </svg>
            </a>
            <a href="#" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.500" cy="6.500" r="1" fill="currentColor" />
              </svg>
            </a>
            <a href="#" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 9h3.500v11H4V9zm1.800-5.500a2 2 0 110 4 2 2 0 010-4zM10 9h3.300v1.500c.5-.9 1.700-1.800 3.400-1.800 3.500 0 4.300 2.300 4.300 5.300V20h-3.500v-5.200c0-1.200 0-2.800-1.700-2.800s-2 1.300-2 2.700V20H10V9z" />
              </svg>
            </a>
          </div>
        </div>
        <div className={styles.column}>
          <h4 className={styles.title}>Address</h4>
          <p className={styles.text}>
            Sector F-8/4, Islamabad,<br />Punjab,
            44000, Pakistan
          </p>

          <h4 className={`${styles.title} ${styles.titleSpace}`}>Contact</h4>
          <p className={styles.text}>
            +92 300 9876543<br />
            info@medicore.com
          </p>
        </div>

        <div className={styles.column}>
          <h4 className={styles.title}>Explore</h4>
          <ul className={styles.list}>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/doctors">Doctors</Link></li>
            <li><Link href="/appointments">Appointments</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>

        
        <div className={styles.column}>
          <h4 className={styles.title}>Services</h4>
          <ul className={styles.list}>
            <li><Link href="/services/opd-services">OPD Services</Link></li>
            <li><Link href="/services/emergency-care">Emergency Care</Link></li>
            <li><Link href="/services/laboratory">Laboratory</Link></li>
            <li><Link href="/services/pharmacy">Pharmacy</Link></li>
            <li><Link href="/services/ambulance">Ambulance</Link></li>
          </ul>
        </div>
        <div className={styles.column}>
          <h4 className={styles.title}>Departments</h4>
          <ul className={styles.list}>
            <li><Link href="/departments/cardiology">Cardiology</Link></li>
            <li><Link href="/departments/neurology">Neurology</Link></li>
            <li><Link href="/departments/pediatrics">Pediatrics</Link></li>
            <li><Link href="/departments/orthopedics">Orthopedics</Link></li>
            <li><Link href="/departments/gynecology">Gynecology</Link></li>
          </ul>
        </div>

      </div>

      <div className={styles.bottom}>
        <p>© 2026 MediCore Hospital. All rights reserved.</p>
        <div className={styles.bottomLinks}>
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms">Terms</Link>
        </div>
      </div>
    </footer>
  );
}