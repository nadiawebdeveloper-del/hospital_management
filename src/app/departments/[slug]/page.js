import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import departmentsData from "../departmentsData";
import styles from "./page.module.css";

export default async function DepartmentDetail({ params }) {
  const { slug } = await params;

  const department = departmentsData.find((item) => item.slug === slug);

  if (!department) {
    notFound();
  }

  return (
    <div>
      <section className={styles.banner}>
        <div className={styles.bannerImage}>
          <Image
            src={department.banner}
            alt={department.title}
            fill
            style={{ objectFit: "cover", objectPosition: "right center" }}
            priority
          />
        </div>

        <div className={styles.bannerOverlay}>
          <div className={styles.bannerContent}>
            <Link href="/departments" className={styles.back}>
              ← Back to All Departments
            </Link>

            <h1>{department.title}</h1>
            <p className={styles.shortText}>{department.shortText}</p>

            <Link href="/appointments" className={styles.bookBtn}>
              Book Appointment
            </Link>
          </div>
        </div>
      </section>

      <div className={styles.container}>
        <div className={styles.detailsGrid}>

          <div className={styles.mainColumn}>
            <h3>About {department.title}</h3>
            <p className={styles.about}>{department.about}</p>

            <h3>Conditions We Treat</h3>
            <ul className={styles.conditionList}>
              {department.conditions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className={styles.sidebar}>
            <h4>Department Info</h4>

            <div className={styles.sidebarRow}>
              <span>Specialists</span>
              <strong>{department.doctorsCount}</strong>
            </div>
            <div className={styles.sidebarRow}>
              <span>Timing</span>
              <strong>{department.timing}</strong>
            </div>

            <Link href="/doctors" className={styles.sidebarBtn}>
              View Our Doctors
            </Link>
            <Link href="/appointments" className={styles.sidebarBtnOutline}>
              Book Appointment
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}