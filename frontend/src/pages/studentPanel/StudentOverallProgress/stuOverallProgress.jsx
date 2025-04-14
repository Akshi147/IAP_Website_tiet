import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../../components/navbar/navbar";
import styles from "./stuOverallProgress.module.css";
import axios from "axios";

const StudentOverallProgress = () => {
  const navigate = useNavigate();
  const { studentId } = useParams();
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await axios.get(`/students/getOverallProgress/${studentId}`);
        if (res.data?.overallProgress) {
          setProgress(res.data.overallProgress);
        }
      } catch (err) {
        console.error("Error fetching progress data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [studentId]);

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
        <h1 className={styles.heading}>Overall Progress Status</h1>
        {loading ? (
          <p className={styles.loading}>Loading...</p>
        ) : (
          <div className={styles.progressGrid}>
            {Object.entries(progress).map(([key, value]) => (
              <div key={key} className={styles.progressCard}>
                <p className={styles.label}>{formatLabel(key)}</p>
                <span
                  className={`${styles.status} ${
                    value === "Completed" ? styles.completed : styles.pending
                  }`}
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

// Converts camelCase or long keys to readable labels
const formatLabel = (key) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/^\w/, (c) => c.toUpperCase())
    .replace(/By/g, " by")
    .replace(/For/g, " for");

export default StudentOverallProgress;
