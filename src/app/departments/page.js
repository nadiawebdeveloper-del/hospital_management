import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import departmentsData from "./departmentsData";


const Svg = ({ children }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);
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
              <span className={styles.processIcon}>
                <Svg>
                  <path d="M11 2v2" />
                  <path d="M5 2v2" />
                  <path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1" />
                  <path d="M8 15a6 6 0 0 0 12 0v-3" />
                  <circle cx="20" cy="10" r="2" />
                </Svg>
              </span>
              <h4>Experienced Specialists</h4>
              <p>Every department is led by doctors with years of focused experience.</p>
            </div>
            <div className={styles.processCard}>
              <span className={styles.processIcon}>
                <Svg>
                  <path d="M12 6v4" />
                  <path d="M14 8h-4" />
                  <path d="M14 14h-4" />
                  <path d="M14 18h-4" />
                  <path d="M18 12h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h2" />
                  <path d="M18 22V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v18" />
                </Svg>
              </span>
              <h4>Modern Equipment</h4>
              <p>Accurate diagnosis backed by up-to-date medical technology.</p>
            </div>
            <div className={styles.processCard}>
              <span className={styles.processIcon}>
                <Svg>
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </Svg>
              </span>
              <h4>Coordinated Care</h4>
              <p>Departments work together so nothing falls through the cracks.</p>
            </div>
            <div className={styles.processCard}>
              <span className={styles.processIcon}>
                <Svg>
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </Svg>
              </span>
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