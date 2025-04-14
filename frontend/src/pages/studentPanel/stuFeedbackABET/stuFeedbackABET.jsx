import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../../../components/navbar/navbar";
import styles from "./stuFeedbackAbet.module.css";

const StudentFeedbackABET = () => {
  const navigate = useNavigate();
  const { id: studentId } = useParams();
  const token = localStorage.getItem("student-token");

  const [questions, setQuestions] = useState([]);
  const [plan, setPlan] = useState("");
  const [planDetails, setPlanDetails] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/students/getFeedbackFormAbet/${studentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setQuestions(res.data.questions || []);
        setPlan(res.data.postGraduationPlan || "");
        setPlanDetails(res.data.postGraduationPlanDetails || "");
        setLoading(false);
      } catch (err) {
        console.error("Error fetching ABET feedback form:", err);
        setLoading(false);
      }
    };

    if (studentId && token) fetchForm();
  }, [studentId, token]);

  const handleChange = (id, value) => {
    setQuestions((prev) =>
      prev.map((q) => (q._id === id ? { ...q, selectedValue: value } : q))
    );
  };

  const handleSubmit = async () => {
    try {
      const levels = {};
      questions.forEach((q) => {
        levels[q._id] = q.selectedValue;
      });

      const payload = {
        levels,
        postGraduationPlan: plan,
        postGraduationPlanDetails: planDetails,
      };

      await axios.post(
        `http://localhost:4000/students/getFeedbackFormAbet/${studentId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Feedback submitted successfully!");
    } catch (err) {
      console.error("Error submitting feedback:", err);
      alert("Failed to submit feedback");
    }
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
        <h2 className={styles.heading}>ABET Feedback Form</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <form className={styles.form}>
            {questions.map((q, index) => (
              <div key={q._id} className={styles.questionBlock}>
                <label className={styles.questionText}>
                  {index + 1}. {q.text}
                </label>
                <select
                  className={styles.select}
                  value={q.selectedValue || ""}
                  onChange={(e) => handleChange(q._id, e.target.value)}
                >
                  <option value="">Select</option>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            <div className={styles.questionBlock}>
              <label className={styles.questionText}>
                What do you plan to do after graduation at TU?
              </label>
              <input
                className={styles.input}
                type="text"
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                placeholder="e.g. Higher Education"
              />
            </div>

            <div className={styles.questionBlock}>
              <label className={styles.questionText}>Details</label>
              <input
                className={styles.input}
                type="text"
                value={planDetails}
                onChange={(e) => setPlanDetails(e.target.value)}
                placeholder="e.g. MTech"
              />
            </div>

            <button
              type="button"
              className={styles.submitButton}
              onClick={handleSubmit}
            >
              Submit Feedback
            </button>
          </form>
        )}
      </div>
    </>
  );
};

export default StudentFeedbackABET;