'use client';

import Image from 'next/image';
import styles from '../../assets/styles/LogoMarquee.module.css';

export default function LogoMarquee() {
  const logos = [
    { id: 1, image: '/images/marchmedical.jpg' },
    { id: 2, image: '/images/mandmclaimscare.webp' },
    { id: 3, image: '/images/revantage.webp' },
    { id: 4, image: '/images/revnext.webp' },
    { id: 5, image: '/images/naturalwondershealthcare.png' },
    { id: 6, image: '/images/imedurgent.webp' },
    { id: 7, image: '/images/human-medical.svg' },
    { id: 8, image: '/images/partner1.png' },
  ];

  const duplicatedLogos = [...logos, ...logos];

  return (
    <section className={styles.marqueeSection}>
      <div className={styles.container}>

        <div className={styles.sectionHeader}>
          <h2>Our Partners</h2>
          <p>Trusted by leading insurance providers</p>
        </div>

        <div className={styles.marqueeWrapper}>
          <div className={styles.marqueeTrack}>
            {duplicatedLogos.map((logo, index) => (
              <div key={index} className={styles.logoCard}>
                <div className={styles.logoPlaceholder}>
                  <Image
                     src={logo.image}
                     alt="Partner logo"
                     width={180}
                     height={80}
                     className={styles.logoImage}
                     style={{ width: 'auto', height: 'auto' }}
                    />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}