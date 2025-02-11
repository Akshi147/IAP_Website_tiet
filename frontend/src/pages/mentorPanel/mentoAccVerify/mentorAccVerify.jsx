import styles from "./mentorAccVerify.module.css";

const MentorAccVerify = () => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.card}>
          <div className={styles.cardContent}>
            <h2 className={styles.title}>Verify Your Email</h2>
            <div className={styles.textContent}>
              <p className={styles.text}>
                We&apos;ve sent a verification link to your email address.
              </p>
              <p className={styles.text}>
                Please check your inbox and click on the link to verify your account.
              </p>
              <p className={styles.subText}>
                If you don&apos;t see the email, please check your spam folder.
              </p>
            </div>
            <div className={styles.assistance}>
              <h3 className={styles.assistanceTitle}>Need Assistance?</h3>
              <p className={styles.assistanceText}>
                If you haven&apos;t received the email or need help, please contact support:
              </p>
              <div className={styles.contactDetails}>
                <p className={styles.contactTitle}>Support Contact Details:</p>
                <p className={styles.contactText}>Name: Admin Support</p>
                <p className={styles.contactText}>Email: support@thapar.edu</p>
                <p className={styles.contactText}>Phone: (123) 456-7890</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorAccVerify;
