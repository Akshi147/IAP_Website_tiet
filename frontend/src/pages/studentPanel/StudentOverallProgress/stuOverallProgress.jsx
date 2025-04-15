import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../../components/navbar/navbar";
import styles from "./stuOverallProgress.module.css";

const StudentOverallProgress = () => {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState(null);
  const [overallProgress, setOverallProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // First: Fetch student profile to get ID
  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        if (token) {
          const res = await axios.get("http://localhost:4000/students/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setStudentId(res.data.student._id);
        }
      } catch (err) {
        console.error("Error fetching student profile:", err);
      }
    };

    fetchStudentProfile();
  }, [token]);

  // Second: Fetch overall progress after getting studentId
  useEffect(() => {
    const fetchOverallProgress = async () => {
      try {
        if (studentId && token) {
          const res = await axios.get(
            `http://localhost:4000/students/getOverallProgress/${studentId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setOverallProgress(res.data.overallProgress || {});
        }
      } catch (err) {
        console.error("Error fetching overall progress:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOverallProgress();
  }, [studentId, token]);

  const formatKey = (key) => {
    // Converts camelCase to readable format
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  return (
    <>
      <Navbar
        navItems={[
          { name: "Dashboard", path: "/dashboard" },
          { name: "Phase 2", path: "/student" },
          { name: "Faculty Assigned", path: "faculty-assigned" },
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
        <h2 className={styles.heading}>Overall Progress</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className={styles.progressList}>
            {Object.entries(overallProgress).map(([key, value]) => (
              <div key={key} className={styles.progressItem}>
                <span className={styles.label}>{formatKey(key)}</span>
                <span
                  className={
                    value === "Done"
                      ? styles.statusDone
                      : styles.statusPending
                  }
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default StudentOverallProgress;