import styles from "../../assets/styles/testimonials.module.css";

export default function Testimonials() {
  return (
    <section className={styles.testimonials}>
      <div className={styles.container}>

        <div className={styles.heading}>
          <span className={styles.label}>Patient Testimonials</span>

          <h2>
            What Our Patients <span>Say About Us</span>
          </h2>

          <p>
            Hear from our patients about their experience with MediCore
            Hospital and our healthcare team.
          </p>
        </div>

        <div className={styles.carousel}>

          <div className={styles.slides}>

            <div className={styles.card}>
              <div className={styles.quote}>“</div>

              <div className={styles.stars}>★ ★ ★ ★ ★</div>

              <p>
                The staff at MediCore Hospital were extremely caring
                and professional. Everyone made me feel comfortable
                and well taken care of throughout my visit.
              </p>

              <div className={styles.patient}>
                <div className={styles.avatar}>SA</div>

                <div>
                  <h3>Sarah Ahmed</h3>
                  <span>Patient</span>
                </div>
              </div>
            </div>


            <div className={styles.card}>
              <div className={styles.quote}>“</div>

              <div className={styles.stars}>★ ★ ★ ★ ★</div>

              <p>
                I had a wonderful experience at MediCore. The doctors
                explained everything clearly and the entire appointment
                process was smooth and stress-free.
              </p>

              <div className={styles.patient}>
                <div className={styles.avatar}>MU</div>

                <div>
                  <h3>Muhammad Usman</h3>
                  <span>Patient</span>
                </div>
              </div>
            </div>


            <div className={styles.card}>
              <div className={styles.quote}>“</div>

              <div className={styles.stars}>★ ★ ★ ★ ★</div>

              <p>
                MediCore has an amazing team of doctors and nurses.
                Their attention to detail and genuine care for patients
                really stood out to me.
              </p>

              <div className={styles.patient}>
                <div className={styles.avatar}>AK</div>

                <div>
                  <h3>Ayesha Khan</h3>
                  <span>Patient</span>
                </div>
              </div>
            </div>


            <div className={styles.card}>
              <div className={styles.quote}>“</div>

              <div className={styles.stars}>★ ★ ★ ★ ★</div>

              <p>
                Excellent healthcare service and a very welcoming
                environment. I highly recommend MediCore Hospital
                for reliable and professional medical care.
              </p>

              <div className={styles.patient}>
                <div className={styles.avatar}>HR</div>

                <div>
                  <h3>Hassan Raza</h3>
                  <span>Patient</span>
                </div>
              </div>
            </div>


            <div className={styles.card}>
              <div className={styles.quote}>“</div>

              <div className={styles.stars}>★ ★ ★ ★ ★</div>

              <p>
                The doctors and nursing staff were very supportive.
                I received excellent care and would definitely
                recommend MediCore to my family.
              </p>

              <div className={styles.patient}>
                <div className={styles.avatar}>FM</div>

                <div>
                  <h3>Fatima Malik</h3>
                  <span>Patient</span>
                </div>
              </div>
            </div>


            <div className={styles.card}>
              <div className={styles.quote}>“</div>

              <div className={styles.stars}>★ ★ ★ ★ ★</div>

              <p>
                A clean environment, professional doctors and
                friendly staff. My overall experience at MediCore
                was excellent.
              </p>

              <div className={styles.patient}>
                <div className={styles.avatar}>AR</div>

                <div>
                  <h3>Ali Raza</h3>
                  <span>Patient</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        <div className={styles.dots}>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>

      </div>
    </section>
  );
}