'use client';
import Image from "next/image";
import { useState } from 'react';
import styles from '../../assets/styles/contact.module.css';
import Contactsection from './Contactsection';

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

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('Form submitted:', formData);
    setSubmitted(true);

    setTimeout(() => {
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  const contactInfo = [
    {
      icon: (
        <Svg>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </Svg>
      ),
      title: 'Call Us',
      details: '+92 300 9876543',
      subtext: 'Available 24/7 for emergencies',
    },
    {
      icon: (
        <Svg>
          <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </Svg>
      ),
      title: 'Email Us',
      details: 'info@medicore.com',
      subtext: 'We reply within 2 hours',
    },
    {
      icon: (
        <Svg>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </Svg>
      ),
      title: 'Visit Us',
      details: 'Sector F-8/4, Islamabad',
      subtext: 'Punjab, 44000, Pakistan',
    },
    {
      icon: (
        <Svg>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </Svg>
      ),
      title: 'Hours',
      details: '24/7 Open',
      subtext: 'All days including holidays',
    },
  ];

  return (
    <main className={styles.contactPage}>

      <Contactsection />

      <section className={styles.infoSection}>
        <div className={styles.container}>
          <div className={styles.infoGrid}>
            {contactInfo.map((info, index) => (
              <div key={index} className={styles.infoCard}>
                <div className={styles.infoIcon}>{info.icon}</div>
                <h3>{info.title}</h3>
                <p className={styles.detail}>{info.details}</p>
                <p className={styles.subtext}>{info.subtext}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.contactSection}>
        <div className={styles.container}>
          <div className={styles.contactGrid}>

            <div className={styles.formContainer}>
              <h2>Send Us a Message</h2>
              <p className={styles.formDescription}>
                Fill out the form below and we&apos;ll get back to you as soon as possible
              </p>

              {submitted ? (
                <div className={styles.successMessage}>
                  <div className={styles.successIcon}>✓</div>
                  <h3>Thank You!</h3>
                  <p>Your message has been sent successfully. We&apos;ll contact you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.contactForm}>

                  <div className={styles.formGroup}>
                    <label htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+92-300-1234567"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="subject">Subject *</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help?"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="message">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Write your message here..."
                      rows="5"
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className={styles.submitButton}>
                    Send Message
                  </button>
                </form>
              )}
            </div>

            <div className={styles.imageContainer}>
              <Image
                src="/images/contactimg.png"
                alt="MediCore Hospital"
                width={600}
                height={500}
                className={styles.contactImage}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}