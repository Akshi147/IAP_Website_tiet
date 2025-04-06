import styles from './stuDocVerifyPhase.module.css';

const StudentDocVerifyPhase = () => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.card}>
          <div className={styles.cardContent}>
            <h2 className={styles.title}>
              Documents Under Approval
            </h2>
            <div className={styles.infoSection}>
              <p className={styles.infoText}>
                Your documents are currently under review. We will notify you via email about the status of your
                verification.
              </p>
              <p className={styles.infoText}>Please check your email regularly for updates.</p>
            </div>
            <div className={styles.assistanceSection}>
              <h3 className={styles.assistanceTitle}>Need Assistance?</h3>
              <p className={styles.assistanceText}>
                If you have any questions or need help, please contact your mentor:
              </p>
              <div className={styles.assistanceCard}>
                <p className={styles.assistanceLabel}>Mentor Contact Details:</p>
                <p className={styles.assistanceDetail}>Name: Dr. Jane Smith</p>
                <p className={styles.assistanceDetail}>Email: jane.smith@university.edu</p>
                <p className={styles.assistanceDetail}>Phone: (123) 456-7890</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDocVerifyPhase;