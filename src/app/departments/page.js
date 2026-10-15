import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import departmentsData from "./departmentsData";

export default function DepartmentsPage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.container}>
          <p className={styles.label}>Our Specialties</p>
          <h1>Departments Built Around You</h1>
          <p className={styles.heroText}>
            Every department at MediCore Hospital is staffed by experienced
            specialists using modern equipment to give you the right care.
          </p>
        </div>
      </section>


      <section className={styles.container}>
        <div className={styles.intro}>
          <div>
            <p className={styles.label}>Why Choose Us</p>
            <h2 className={styles.heading}>Specialists You Can Trust</h2>
            <p className={styles.text}>
              Each department works closely together, so your care is
              coordinated from your first visit through follow-up treatment,
              with no gaps in communication.
            </p>
          </div>

          <div className={styles.statsRow}>
            <div className={styles.statBox}>
              <strong>6</strong>
              <span>Departments</span>
            </div>
            <div className={styles.statBox}>
              <strong>48+</strong>
              <span>Specialist Doctors</span>
            </div>
            <div className={styles.statBox}>
              <strong>25+</strong>
              <span>Years of Experience</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.container}>
        <p className={styles.label}>Browse Departments</p>
        <h2 className={styles.heading}>Our Specialties</h2>

        <div className={styles.grid}>
          {departmentsData.map((dept) => (
            <Link
              key={dept.slug}
              href={`/departments/${dept.slug}`}
              className={styles.card}
            >
              
<div className={styles.img}>
  <Image
    src={dept.image}
    alt={dept.title}
    width={40}
    height={40}
    className={styles.deptImage}
  />
</div>

              <h3>{dept.title}</h3>
              <p>{dept.shortText}</p>
              <span className={styles.learnMore}>Learn More →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.processSection}>
        <div className={styles.container}>
          <p className={styles.label}>Our Approach</p>
          <h2 className={styles.heading}>What Makes Our Care Different</h2>

          <div className={styles.processGrid}>
            <div className={styles.processCard}>
              <span className={styles.processIcon}>👨‍⚕️</span>
              <h4>Experienced Specialists</h4>
              <p>Every department is led by doctors with years of focused experience.</p>
            </div>
            <div className={styles.processCard}>
              <span className={styles.processIcon}>🏥</span>
              <h4>Modern Equipment</h4>
              <p>Accurate diagnosis backed by up-to-date medical technology.</p>
            </div>
            <div className={styles.processCard}>
              <span className={styles.processIcon}>🤝</span>
              <h4>Coordinated Care</h4>
              <p>Departments work together so nothing falls through the cracks.</p>
            </div>
            <div className={styles.processCard}>
              <span className={styles.processIcon}>⏱️</span>
              <h4>Quick Access</h4>
              <p>Fast appointment scheduling across every department.</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.container}>
        <div className={styles.cta}>
          <div>
            <h2>Not Sure Which Department You Need?</h2>
            <p>Our team can point you to the right specialist.</p>
          </div>
          <div className={styles.ctaButtons}>
            <Link href="/appointments" className={styles.ctaPrimary}>
              Book Appointment
            </Link>
            <Link href="/contact" className={styles.ctaSecondary}>
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}