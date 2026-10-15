import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import servicesData from "./servicesData";

export default function ServicesPage() {
  return (
    <>
     
      <section className={styles.hero}>
        <div className={styles.container}>
          <p className={styles.label}>What We Offer</p>
          <h1>Complete Healthcare, All in One Place</h1>
          <p className={styles.heroText}>
            From routine checkups to emergency care, MediCore Hospital brings
            together every service you need for a healthy life.
          </p>
        </div>
      </section>

    
      <section className={styles.container}>
        <div className={styles.intro}>
          <div>
            <p className={styles.label}>Why MediCore</p>
            <h2 className={styles.heading}>Care That Puts You First</h2>
            <p className={styles.text}>
              Our departments work together as one team, backed by modern
              equipment and experienced staff, so every patient gets fast,
              accurate, and compassionate treatment.
            </p>
          </div>

          <div className={styles.statsRow}>
            <div className={styles.statBox}>
              <strong>6</strong>
              <span>Core Services</span>
            </div>
            <div className={styles.statBox}>
              <strong>24/7</strong>
              <span>Emergency Support</span>
            </div>
            <div className={styles.statBox}>
              <strong>140+</strong>
              <span>Specialist Doctors</span>
            </div>
          </div>
        </div>
      </section>

      
      <section className={styles.container}>
        <p className={styles.label}>Our Services</p>
        <h2 className={styles.heading}>What We Provide</h2>

        <div className={styles.grid}>
          {servicesData.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className={styles.card}
            >
              
<div className={styles.img}>
  <Image
    src={service.image}
    alt={service.title}
    width={40}
    height={40}
    className={styles.serviceImage}
  />
</div>

              <h3>{service.title}</h3>
              <p>{service.shortText}</p>
              <span className={styles.learnMore}>Learn More →</span>
            </Link>
          ))}
        </div>
      </section>

    
      <section className={styles.processSection}>
        <div className={styles.container}>
          <p className={styles.label}>Getting Started</p>
          <h2 className={styles.heading}>How It Works</h2>

          <div className={styles.processGrid}>
            <div className={styles.processCard}>
              <span className={styles.processNumber}>1</span>
              <h4>Choose a Service</h4>
              <p>Pick the department or service that matches your needs.</p>
            </div>
            <div className={styles.processCard}>
              <span className={styles.processNumber}>2</span>
              <h4>Book an Appointment</h4>
              <p>Select a doctor, date, and time that works for you.</p>
            </div>
            <div className={styles.processCard}>
              <span className={styles.processNumber}>3</span>
              <h4>Visit the Hospital</h4>
              <p>Arrive at your scheduled time for a quick, smooth check-in.</p>
            </div>
            <div className={styles.processCard}>
              <span className={styles.processNumber}>4</span>
              <h4>Get Treated</h4>
              <p>Receive care from our specialists and follow-up as needed.</p>
            </div>
          </div>
        </div>
      </section>

    
      <section className={styles.container}>
        <div className={styles.cta}>
          <div>
            <h2>Need Help Choosing a Service?</h2>
            <p>Our team can guide you to the right department and doctor.</p>
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