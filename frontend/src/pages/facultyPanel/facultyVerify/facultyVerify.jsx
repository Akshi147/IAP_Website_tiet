// import React from 'react';
import styles from './facultyVerify.module.css'; // Importing the CSS module

const FacultyVerify = () => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.card}>
          <div className={styles.content}>
            <h2 className={styles.heading}>Verify Your Email</h2>
            <div className={styles.messageContainer}>
              <p className={styles.message}>We've sent a verification link to your email address.</p>
              <p className={styles.message}>
                Please check your inbox and click on the link to verify your account.
              </p>
              <p className={styles.subMessage}>
                If you don't see the email, please check your spam folder.
              </p>
            </div>

            <div className={styles.assistanceSection}>
              <h3 className={styles.assistanceHeading}>Need Assistance?</h3>
              <p className={styles.assistanceText}>
                If you haven't received the email or need help, please contact your mentor:
              </p>
              <div className={styles.contactCard}>
                <p className={styles.contactLabel}>Mentor Contact Details:</p>
                <p className={styles.contactDetail}>Name: Dr. Jane Smith</p>
                <p className={styles.contactDetail}>Email: jane.smith@university.edu</p>
                <p className={styles.contactDetail}>Phone: (123) 456-7890</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyVerify;
