import styles from "./adminFreezeforms.module.css";
import { useState } from 'react';
import axios from 'axios';
import Navbar from '../../../components/navbar/navbar';
import { useNavigate } from 'react-router-dom';

const AdminFreezeForm = () => {
  const [email, setEmail] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [reports, setReports] = useState(null);
  const [bulkAction, setBulkAction] = useState('');
  const navigate = useNavigate();

  const fetchStudentReports = async () => {
    try {
      const token = localStorage.getItem('admin-token');
      const response = await axios.post('http://localhost:4000/freezeform/fortnightly/student', {
        email,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setReports(response.data);
      setShowModal(true);
    } catch (error) {
      alert('Error fetching student data');
      console.error(error);
    }
  };

  const updateReportStatus = async (reportId, isUnlocked) => {
    try {
      const token = localStorage.getItem('admin-token');
      const response = await axios.patch(`http://localhost:4000/freezeform/fortnightly/${reportId}`, {
        isUnlocked,
        email,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        setReports((prev) => {
          const updatedReports = { ...prev.reports };
          for (const period in updatedReports) {
            if (updatedReports[period]._id === reportId) {
              updatedReports[period] = {
                ...updatedReports[period],
                isUnlocked: isUnlocked,
              };
              break;
            }
          }
          return {
            ...prev,
            reports: updatedReports,
          };
        });
      }
    } catch (error) {
      alert('Error updating report status');
      console.error(error);
    }
  };

  const handleBulkAction = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/freezeform/fortnightly/bulk', {
        action: bulkAction,
      });
      alert('Bulk action completed successfully');
      setBulkAction('');
    } catch (error) {
      alert('Error performing bulk action');
      console.error(error);
    }
  };

  return (
    <>
      <Navbar
        navItems={[
          { name: "Students Under Document Verification", path: "/underdocumentverification" },
          { name: "Students In Phase 2", path: "/phase2verification" },
          { name: "Verify Student", path: "/admin" },
          { name: "Delete Student", path: "/deletestudent" },
          { name: "Generate Excel Sheet", path: "/generateExcel" },
          { name: "Freeze/Unfreeze Forms", path: "/freezeforms" },
          { name: "Verify Faculty", path: "/verifyfaculty" },
          { name: "Verify Mentor", path: "/mentor" },
          { name: "Change Password", path: "/adminchangepassword" }
        ]}
        downloadButton={{
          text: "Log Out",
          onClick: () => navigate("/adminlogout"),
        }}
      />
      <div className={styles.wrapper}>
        <div className={styles.searchBox}>
          <h2 className={styles.heading}>Student Access Control</h2>
          <div className={styles.inputGroup}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter student email"
              className={styles.input}
            />
            <button
              onClick={fetchStudentReports}
              className={styles.searchBtn}
            >
              Search
            </button>
          </div>
        </div>

        {showModal && reports && reports.reports && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <div className={styles.modalHeader}>
                <h3 className={styles.modalTitle}>Fortnightly Reports for {email}</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className={styles.modalClose}
                >
                  ×
                </button>
              </div>

              <div className={styles.reportGrid}>
                {Object.entries(reports.reports).map(([period, report]) => (
                  report && report.isUnlocked !== undefined ? (
                    <div key={report._id} className={styles.reportRow}>
                      <span>{period}</span>
                      <label className={styles.toggleWrapper}>
                        <input
                          type="checkbox"
                          checked={report.isUnlocked}
                          onChange={(e) => updateReportStatus(report._id, e.target.checked)}
                          className={styles.checkbox}
                        />
                        Unlocked
                      </label>
                    </div>
                  ) : null
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminFreezeForm;
