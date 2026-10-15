
'use client';

import styles from "../../assets/styles/faq.module.css";

export default function Faq() {
  const faqs = [
    {
      q: "How do I make an appointment at MediCore?",
      a: "Use the Book Appointment form on this page, or visit the Appointments page and choose a doctor and time.",
    },
    {
      q: "Do you have a pediatrician?",
      a: "Yes. Our pediatrics department has experienced child specialists available every day.",
    },
    {
      q: "Does your place provide health insurance?",
      a: "We work with major insurance providers. Our team can help you check your coverage before your visit.",
    },
    {
      q: "What payment methods do you provide?",
      a: "You can pay by cash, debit or credit card, and bank transfer at the hospital counter.",
    },
  ];

  return (
    <section className={styles.container}>
      <p className={styles.label}>FAQ</p>

      <h2 className={styles.heading}>
        Frequently Asked Questions
      </h2>

      <div className={styles.faqBox}>
        {faqs.map((item) => (
          <details key={item.q} className={styles.faqItem}>
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
