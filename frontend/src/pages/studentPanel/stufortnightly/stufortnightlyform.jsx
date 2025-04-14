import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LockClosedIcon, CheckIcon } from "@heroicons/react/24/outline";
import styles from "./stuFortnightlyform.module.css";
import Navbar from "../../../components/navbar/navbar";

const StudentFortnightlyReports = () => {
  const [reports, setReports] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/freezeform/fortnightly",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setReports(response.data.reports);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reports:", error);
        setLoading(false);
      }
    };

    fetchReports();
  }, [token]);

  const handleSubmit = async (period) => {
    setSubmitting(true);
    try {
      await axios.put(
        `http://localhost:4000/freezeform/fortnightly/${period}`,
        { report: reports[period].report },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Report updated successfully!");
    } catch (error) {
      console.error("Error updating report:", error);
    } finally {
      setSubmitting(false);
      setShowConfirmation(null);
    }
  };

  const handleChange = (period, value) => {
    setReports((prev) => ({
      ...prev,
      [period]: { ...prev[period], report: value },
    }));
  };

  if (loading)
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner}></div>
      </div>
    );

  return (
    <>
    <Navbar
        navItems={[
          { name: "Dashboard", path: "/dashboard" },
          {name: "Phase 2", path: "/student"},
          {name: "Faculty Assigned", path: "faculty-assigned"},
          { name: "Upload Report and PPT", path: "/getFileUploadInfo" },
          { name: "Stu Input Form", path: "/student-input" },
          { name: "Evaluation Schedule", path: "/evaluation-schedule" },
          { name: "Feedback", path: "/feedback" },
          { name: "Fortinightly Reflection", path: "/fortnightly" },
          { name: "Feedback(ABET)", path: "/abet-feedback" },
          { name: "Future Plans", path: "/future-plans" },
          { name: "Overall progress", path: "/overall-progress" },
          { name: "Change Password", path: "/reset-password" },
          ]}
          downloadButton={{
            text: "Log Out",
            onClick: () => navigate("/student/logout"),
          }}
      />
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Fortnightly Reflection Reports</h1>
        <p className={styles.subtitle}>
          Submit and manage your bi-weekly progress reports with confidence
        </p>
      </div>

      <div className={styles.reportsGrid}>
        {Object.entries(reports).map(([period, data]) => (
          <div
            key={period}
            className={`${styles.reportCard} ${
              !data.isUnlocked ? styles.lockedCard : ""
            }`}
          >
            <div className={styles.cardContent}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>{period}</h3>
                <span
                  className={`${styles.statusBadge} ${
                    data.isUnlocked
                      ? styles.editable
                      : styles.locked
                  }`}
                >
                  {data.isUnlocked ? (
                    <>
                      <CheckIcon className={styles.icon} />
                      Editable
                    </>
                  ) : (
                    <>
                      <LockClosedIcon className={styles.icon} />
                      Locked
                    </>
                  )}
                </span>
              </div>

              <textarea
                className={`${styles.textarea} ${
                  data.isUnlocked ? styles.textareaEditable : styles.textareaLocked
                }`}
                rows="4"
                value={data.report}
                onChange={(e) => handleChange(period, e.target.value)}
                disabled={!data.isUnlocked}
                placeholder={
                  data.isUnlocked
                    ? "Write your report here..."
                    : "This period is no longer editable"
                }
              />

              <div className={styles.buttonContainer}>
                <button
                  onClick={() => {
                    setSelectedPeriod(period);
                    setShowConfirmation(true);
                  }}
                  disabled={!data.isUnlocked || submitting}
                  className={`${styles.submitButton} ${
                    !data.isUnlocked ? styles.disabledButton : ""
                  }`}
                >
                  {submitting && selectedPeriod === period ? (
                    <>
                      <svg
                        className={styles.spinnerIcon}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className={styles.circle1}
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className={styles.circle2}
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    "Submit Report"
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showConfirmation && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>Confirm Submission</h3>
            <p className={styles.modalMessage}>
              Are you sure you want to submit this report? Once submitted, you
              won&apos;t be able to make further changes.
            </p>
            <div className={styles.modalActions}>
              <button
                onClick={() => setShowConfirmation(false)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubmit(selectedPeriod)}
                className={styles.confirmButton}
              >
                Confirm Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default StudentFortnightlyReports;
