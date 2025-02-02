import styles from './facultyPendingApproval.module.css';

const FacultyPendingApproval = () => {
    return (
        <div className={styles.container}>
            <div className={styles.contentWrapper}>
                <div className={styles.card}>
                    <div className={styles.cardContent}>
                        <h2 className={styles.heading}>
                            Account Created Successfully!
                        </h2>
                        <div className={styles.messageContainer}>
                            <p className={styles.message}>Your faculty account has been successfully created.</p>
                            <p className={styles.message}>It is currently under admin approval. You will be notified once it is approved.</p>
                            <p className={styles.note}>Please wait while the admin reviews your application. This process may take some time.</p>
                        </div>
                        <div className={styles.assistanceSection}>
                            <h3 className={styles.assistanceHeading}>Need Assistance?</h3>
                            <p className={styles.assistanceText}>If you have any concerns or need help, please contact the admin:</p>
                            <div className={styles.contactBox}>
                                <p className={styles.contactLabel}>Admin Contact Details:</p>
                                <p className={styles.contactDetail}>Name: Prof. Rajesh Kumar</p>
                                <p className={styles.contactDetail}>Email: admin@university.edu</p>
                                <p className={styles.contactDetail}>Phone: (987) 654-3210</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FacultyPendingApproval;