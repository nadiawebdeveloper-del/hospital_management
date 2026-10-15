'use client';

import { useEffect, useState } from "react";
import styles from "../../assets/styles/facilities.module.css";

export default function Facilities() {
  const facilitiesData = [
    {
      id: 1,
      title: "Emergency Care",
      icon: "/images/ambulance.svg",
      text: "Available 24/7 for emergency medical assistance",
    },
    {
      id: 2,
      title: "ICU & CCU",
      icon: "/images/icu.svg",
      text: "Advanced critical care units with modern equipment",
    },
    {
      id: 3,
      title: "Surgery Theaters",
      icon: "/images/surgery.svg",
      text: "State-of-the-art surgical facilities",
    },
    {
      id: 4,
      title: "Diagnostic Lab",
      icon: "/images/lab.svg",
      text: "Complete laboratory testing services",
    },
    {
      id: 5,
      title: "Imaging Center",
      icon: "/images/scanner.svg",
      text: "X-Ray, CT Scan, MRI services",
    },
    {
      id: 6,
      title: "Pharmacy",
      icon: "/images/pharmacy.svg",
      text: "Complete medication dispensary",
    },
  ];

  // Duplicate cards for infinite loop
  const sliderData = [
    ...facilitiesData,
    ...facilitiesData,
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);

  // Automatic sliding
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => prev + 1);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  // Reset position after reaching duplicated cards
  useEffect(() => {
    if (currentSlide === facilitiesData.length) {
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentSlide(0);
      }, 900);

      return () => clearTimeout(timeout);
    }
  }, [currentSlide, facilitiesData.length]);

  // Turn transition back on after instant reset
  useEffect(() => {
    if (!isTransitioning) {
      const timeout = setTimeout(() => {
        setIsTransitioning(true);
      }, 50);

      return () => clearTimeout(timeout);
    }
  }, [isTransitioning]);

  const nextSlide = () => {
    setIsTransitioning(true);
    setCurrentSlide((prev) => prev + 1);
  };

  const previousSlide = () => {
    if (currentSlide === 0) {
      setIsTransitioning(false);
      setCurrentSlide(facilitiesData.length);

      setTimeout(() => {
        setIsTransitioning(true);
        setCurrentSlide(facilitiesData.length - 1);
      }, 50);
    } else {
      setIsTransitioning(true);
      setCurrentSlide((prev) => prev - 1);
    }
  };

  return (
    <section className={styles.container}>
      <p className={styles.label}>Facilities</p>

      <h2 className={styles.heading}>
        Our All Facilities
      </h2>

      <div className={styles.sliderWrapper}>

        <button
          className={styles.sliderButton}
          onClick={previousSlide}
          aria-label="Previous facility"
        >
          ‹
        </button>

        <div className={styles.sliderViewport}>
          <div
            className={styles.sliderTrack}
            style={{
              transform: `translateX(-${currentSlide * (100 / 3)}%)`,
              transition: isTransitioning
                ? "transform 0.9s ease-in-out"
                : "none",
            }}
          >
            {sliderData.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className={styles.FacilityCard}
              >
                <div className={styles.FacilityIcon}>
                  <img
                    src={item.icon}
                    alt={item.title}
                  />
                </div>

                <h3>{item.title}</h3>

                <p>{item.text}</p>

                <a href="/services">
                  Learn More <span>→</span>
                </a>
              </div>
            ))}
          </div>
        </div>

        <button
          className={styles.sliderButton}
          onClick={nextSlide}
          aria-label="Next facility"
        >
          ›
        </button>

      </div>

      <div className={styles.sliderDots}>
        {facilitiesData.map((item, index) => (
          <button
            key={item.id}
            className={`${styles.dot} ${
              currentSlide % facilitiesData.length === index
                ? styles.activeDot
                : ""
            }`}
            onClick={() => {
              setIsTransitioning(true);
              setCurrentSlide(index);
            }}
            aria-label={`Show ${item.title}`}
          />
        ))}
      </div>
    </section>
  );
}