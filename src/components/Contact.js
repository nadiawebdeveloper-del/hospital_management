'use client';
import Image from "next/image";
import { useState } from 'react';
import styles from '../../assets/styles/contact.module.css';
import Contactsection from './Contactsection';

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
      icon: '📞',
      title: 'Call Us',
      details: '+92 300 9876543',
      subtext: 'Available 24/7 for emergencies',
    },
    {
      icon: '✉️',
      title: 'Email Us',
      details: 'info@medicore.com',
      subtext: 'We reply within 2 hours',
    },
    {
      icon: '📍',
      title: 'Visit Us',
      details: 'Sector F-8/4, Islamabad',
      subtext: 'Punjab, 44000, Pakistan',
    },
    {
      icon: '🕐',
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
                Fill out the form below and we'll get back to you as soon as possible
              </p>

              {submitted ? (
                <div className={styles.successMessage}>
                  <div className={styles.successIcon}>✓</div>
                  <h3>Thank You!</h3>
                  <p>Your message has been sent successfully. We 'll contact you soon.</p>
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
