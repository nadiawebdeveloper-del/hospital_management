import BookingForm from "./BookingForm";
import styles from "./booking.module.css";

export const metadata = { title: "Book an Appointment - MediCore Hospital" };

export default function AppointmentsPage() {
  return (
    <>
      <section className={styles.hero}>
        <span>Appointments</span>
        <h1>Book Your Appointment</h1>
        <p>Choose a department, pick your doctor and a time that suits you. No account needed.</p>
      </section>
      <main className={styles.wrap}>
        <BookingForm />
      </main>
    </>
  );
}