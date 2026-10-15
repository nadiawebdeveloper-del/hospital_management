import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import doctorsData from "../doctorsData";
import styles from "./page.module.css";

export default async function DoctorProfile({ params }) {
  const { id } = await params;

  const doctor = doctorsData.find((doc) => doc.id === Number(id));

  if (!doctor) {
    notFound();
  }

  return (
    <div>
      <section className={styles.banner}>
        <div className={styles.bannerImage}>
          <Image
            src={doctor.img}
            alt={doctor.name}
            fill
            style={{ objectFit: "cover", objectPosition: "right center" }}
            priority
          />
        </div>

        <div className={styles.bannerOverlay}>
          <div className={styles.bannerContent}>
            <Link href="/doctors" className={styles.back}>
              ← Back to All Doctors
            </Link>

            <span className={styles.specialtyTag}>{doctor.specialty}</span>
            <h1>{doctor.name}</h1>
            <p className={styles.qualification}>{doctor.qualification}</p>
            <p className={styles.exp}>{doctor.exp}</p>

            <Link href="/appointments" className={styles.bookBtn}>
              Book Appointment
            </Link>
          </div>
        </div>
      </section>

      <div className={styles.container}>
        <div className={styles.detailsGrid}>
          <div className={styles.mainColumn}>
            <h3>About {doctor.name}</h3>
            <p className={styles.about}>{doctor.about}</p>

            <h3>Education</h3>
            <ul className={styles.educationList}>
              {doctor.education.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className={styles.sidebar}>
            <h4>Consultation Info</h4>

            <div className={styles.sidebarRow}>
              <span>Available Days</span>
              <strong>{doctor.days}</strong>
            </div>
            <div className={styles.sidebarRow}>
              <span>Timing</span>
              <strong>{doctor.timing}</strong>
            </div>
            <div className={styles.sidebarRow}>
              <span>Consultation Fee</span>
              <strong>{doctor.fee}</strong>
            </div>

            <Link href="/appointments" className={styles.sidebarBtn}>
              Book Appointment
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}