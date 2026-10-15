import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import servicesData from "../servicesData";
import styles from "./page.module.css";

export default async function ServiceDetail({ params }) {
  const { slug } = await params;

  const service = servicesData.find((item) => item.slug === slug);

  if (!service) {
    notFound();
  }

  return (
    <div>
  
      <section className={styles.banner}>
        <div className={styles.bannerImage}>
          <Image
            src={service.banner}
            alt={service.title}
            fill
            style={{ objectFit: "cover", objectPosition: "right center" }}
            priority
          />
        </div>

        <div className={styles.bannerOverlay}>
          <div className={styles.bannerContent}>
            <Link href="/services" className={styles.back}>
              ← Back to All Services
            </Link>

            <h1>{service.title}</h1>
            <p className={styles.shortText}>{service.shortText}</p>

            <Link href="/appointments" className={styles.bookBtn}>
              Book Appointment
            </Link>
          </div>
        </div>
      </section>

      <div className={styles.container}>
        <div className={styles.detailsGrid}>

          <div className={styles.mainColumn}>
            <h3>About This Service</h3>
            <p className={styles.about}>{service.about}</p>

            <h3>What's Included</h3>
            <ul className={styles.featureList}>
              {service.features.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className={styles.sidebar}>
            <h4>Service Info</h4>

            <div className={styles.sidebarRow}>
              <span>Timing</span>
              <strong>{service.timing}</strong>
            </div>
            <div className={styles.sidebarRow}>
              <span>Fee</span>
              <strong>{service.fee}</strong>
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