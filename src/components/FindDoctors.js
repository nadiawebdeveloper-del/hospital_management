'use client';

import Image from 'next/image';
import styles from "../../assets/styles/FindDoctors.module.css";

export default function FindDoctors() {
  const doctors = [
    {
      id: 1,
      name: 'Dr. Ahmed Hassan',
      specialty: 'Cardiology',
      rating: 4.8,
      image: '/images/Ahmed.png',
    },
    {
      id: 2,
      name: 'Dr. Fatima Khan',
      specialty: 'Pediatrics',
      rating: 4.9,
      image: '/images/Fatima.png',
    },
    {
      id: 3,
      name: 'Dr. Muhammad Ali',
      specialty: 'Orthopedics',
      rating: 4.7,
      image: '/images/MAli.png',
    },
    {
      id: 4,
      name: 'Dr. Ayesha Malik',
      specialty: 'Neurology',
      rating: 4.9,
      image: '/images/Ayesha.png',
    },
    {
      id: 5,
      name: 'Dr. Hassan Raza',
      specialty: 'General Surgery',
      rating: 4.6,
      image: '/images/Hassan.png',
    },
    {
      id: 6,
      name: 'Dr. Zainab Ahmed',
      specialty: 'Dermatology',
      rating: 4.8,
      image: '/images/Zainab.png',
    },
    {
      id: 7,
      name: 'Dr. Samir Khan',
      specialty: 'ENT',
      rating: 4.7,
      image: '/images/samir.png',
    },
    {
      id: 8,
      name: 'Dr. Hira Riaz',
      specialty: 'Gynecology',
      rating: 4.9,
      image: '/images/Hira.png',
    },
  ];

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);

    return (
      <div className={styles.stars}>
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={
              i < fullStars
                ? styles.filledStar
                : styles.emptyStar
            }
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <section className={styles.findDoctors}>
      <div className={styles.container}>

        <div className={styles.sectionHeader}>
          <h2>Our Doctors</h2>
          <p>Expert medical professionals ready to serve you</p>
        </div>

        <div className={styles.doctorsGrid}>
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className={styles.doctorCard}
            >

              <div className={styles.accentLine}></div>

              <div className={styles.avatarContainer}>
                <div className={styles.avatar}>
                  <Image
                    src={doctor.image}
                    alt={doctor.name}
                    width={120}
                    height={120}
                  />
                </div>
              </div>

              <div className={styles.doctorInfo}>
                <h3 className={styles.doctorName}>
                  {doctor.name}
                </h3>

                <p className={styles.specialty}>
                  {doctor.specialty}
                </p>

                <div className={styles.ratingContainer}>
                  {renderStars(doctor.rating)}
                  <span className={styles.ratingValue}>
                    {doctor.rating}
                  </span>
                </div>
              </div>

              <button className={styles.bookButton}>
                Book appointment
              </button>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}