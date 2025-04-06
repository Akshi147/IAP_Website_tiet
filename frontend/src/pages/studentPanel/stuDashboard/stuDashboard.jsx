import { useEffect, useState } from 'react';
import {
  CheckCircleIcon,
  DocumentTextIcon,
  UserCircleIcon,
  ClockIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import Navbar from '../../../components/navbar/navbar';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './stuDashboard.module.css';

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('http://localhost:4000/students/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch data');

        const data = await response.json();
        setStudentData(data.student);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  if (loading) {
    return (
      <div className={styles.loader}>
        <div className={styles.loaderSpinner}></div>
      </div>
    );
  }

  if (!studentData) {
    return <div className={styles.errorText}>Error loading student data</div>;
  }

  const checkpoints = [
    {
      title: 'Email Verification',
      completed: studentData.verified,
      icon: <CheckCircleIcon className="w-6 h-6" />,
      description: 'Verify your email address to continue',
    },
    {
      title: 'Document Submission',
      completed: studentData.trainingLetter && studentData.feeReceipt,
      icon: <DocumentTextIcon className="w-6 h-6" />,
      description: 'Submit Training Letter and Fee Receipt',
    },
    {
      title: 'Document Verification',
      completed: studentData.mentorverified,
      icon: <UserCircleIcon className="w-6 h-6" />,
      description: 'Waiting for Admin approval',
    },
    {
      title: 'Phase 2 Verification',
      completed: studentData.phase3verified,
      icon: <ShieldCheckIcon className="w-6 h-6" />,
      description: 'Final phase verification',
    },
  ];

  const allVerified =
    studentData.verified &&
    studentData.mentorverified &&
    studentData.phase3verified &&
    studentData.trainingLetter &&
    studentData.feeReceipt;

  return (
    <>
      <Navbar
        navItems={[{ name: 'Continue on Process', path: '/student' }]}
        downloadButton={{
          text: 'Log Out',
          onClick: () => navigate('/student/logout'),
        }}
      />
      <div className={styles.container}>
        <div className={styles.wrapper}>
          {/* Profile Header */}
          <div className={styles.card}>
            <div className={styles.profileHeader}>
              <div className={styles.profileIcon}>
                <UserCircleIcon className={styles.userIcon} />
              </div>
              <div>
                <h1 className={styles.profileName}>{studentData.name}</h1>
                <p className={styles.profileInfo}>{studentData.branch}</p>
                <p className={styles.profileInfo}>{studentData.email}</p>
              </div>
            </div>
          </div>

          {/* Grid Layout */}
          <div className={styles.grid}>
            {/* Academic Details */}
            <div className={styles.card}>
              <h2 className={styles.sectionTitle}>Academic Information</h2>
              <div>
                <DetailItem label="Roll No" value={studentData.rollNo} />
                <DetailItem label="Semester" value={studentData.semesterType} />
                <DetailItem label="Subgroup" value={studentData.classSubgroup} />
                <DetailItem label="Mentor" value={studentData.mentorName} />
              </div>
            </div>

            {/* Company Details */}
            <div className={styles.card}>
              <h2 className={styles.sectionTitle}>Company Details</h2>
              <div>
                <DetailItem label="Company Name" value={studentData.companyDetails?.companyName} />
                <DetailItem
                  label="Location"
                  value={`${studentData.companyDetails?.companyCity}, ${studentData.companyDetails?.companyCountry}`}
                />
                <DetailItem
                  label="Address"
                  value={studentData.companyDetails?.completeAddress}
                />
                <DetailItem label="Stipend" value={`₹${studentData.stipend}/month`} />
              </div>
            </div>
          </div>

          {/* Verification Progress */}
          <div className={`${styles.card} ${styles.verificationSection}`}>
            <h2 className={styles.sectionTitle}>Verification Status</h2>
            <div className={styles.statusGrid}>
              {checkpoints.map((checkpoint, index) => (
                <div
                  key={index}
                  className={`${styles.statusCard} ${
                    checkpoint.completed ? styles.statusComplete : styles.statusIncomplete
                  }`}
                >
                  <div className={styles.statusHeader}>
                    <div
                      className={
                        checkpoint.completed
                          ? styles.statusIconComplete
                          : styles.statusIconIncomplete
                      }
                    >
                      {checkpoint.icon}
                    </div>
                    <h3 className={styles.statusTitle}>{checkpoint.title}</h3>
                  </div>
                  <p
                    className={
                      checkpoint.completed
                        ? styles.statusTextComplete
                        : styles.statusTextIncomplete
                    }
                  >
                    {checkpoint.completed ? 'Completed' : checkpoint.description}
                  </p>
                </div>
              ))}
            </div>

            {allVerified && (
              <div className={styles.fortnightCard}>
                <ClockIcon className={styles.clockIcon} />
                <div>
                  <h3 className={styles.fortnightTitle}>Fortnightly Reports</h3>
                  <p className={styles.fortnightDesc}>
                    Submit your fortnightly training reports
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const DetailItem = ({ label, value }) => (
  <div className={styles.detailItem}>
    <span className={styles.label}>{label}</span>
    <span className={styles.value}>{value || 'N/A'}</span>
  </div>
);

DetailItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default StudentDashboard;