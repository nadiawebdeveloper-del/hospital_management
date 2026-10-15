'use client';

import styles from '../../assets/styles/appointmentform.module.css';

export default function Appointmentform() {
  return (
    <div className={styles.formColumnWide}>
      <h3 className={styles.formTitle}>Book Appointment</h3>

      <div className={styles.formGrid}>
        <div>
          <label>Patient Name</label>
          <input type="text" placeholder="Enter Patient name" />
        </div>

        <div>
          <label>Phone Number*</label>
          <input type="tel" placeholder="Enter a phone number" />
        </div>

        <div>
          <label>Email Address*</label>
          <input type="email" placeholder="Enter a valid email address" />
        </div>

        <div>
          <label>Select Date</label>
          <input type="date" />
        </div>

        <div>
          <label>Department*</label>
          <select>
            <option>Choose a Department</option>
            <option>Cardiology</option>
            <option>Neurology</option>
            <option>Pediatrics</option>
            <option>Orthopedics</option>
            <option>Gynecology</option>
            <option>General Medicine</option>
          </select>
        </div>

        <div className={styles.submitCell}>
          <button type="button" className={styles.button}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}