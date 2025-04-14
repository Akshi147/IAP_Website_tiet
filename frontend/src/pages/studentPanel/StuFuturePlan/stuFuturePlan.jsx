import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../../../components/navbar/navbar";
import styles from "./stuFuturePlan.module.css";

const StudentFuturePlan = () => {
  const navigate = useNavigate();
  const { id: studentId } = useParams();
  const token = localStorage.getItem("student-token");

  const [futurePlan, setFuturePlan] = useState("");
  const [details, setDetails] = useState({
    companyName: "",
    job: "",
    profile: "",
    position: "",
    ctc: "",
    city: "",
    country: ""
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFuturePlan = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/students/getFuturePlan/${studentId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.data.success) {
          setFuturePlan(res.data.futurePlan || "");
          setDetails(res.data.details || {});
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching future plan:", err);
        setLoading(false);
      }
    };

    if (studentId && token) fetchFuturePlan();
  }, [studentId, token]);

  const handleDetailChange = (field, value) => {
    setDetails((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        futurePlan,
        futurePlanDetails: details
      };

      await axios.post(`http://localhost:4000/students/submitFuturePlan/${studentId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert("Future plan submitted successfully!");
    } catch (err) {
      console.error("Error submitting future plan:", err);
      alert("Something went wrong!");
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
          { name: "Change Password", path: "/reset-password" }
        ]}
        downloadButton={{
          text: "Log Out",
          onClick: () => navigate("/student/logout")
        }}
      />

      <div className={styles.container}>
        <h2 className={styles.heading}>Your Future Plan</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <form className={styles.form}>
            <div className={styles.field}>
              <label>Future Plan:</label>
              <select
                className={styles.select}
                value={futurePlan}
                onChange={(e) => setFuturePlan(e.target.value)}
              >
                <option value="">Select Plan</option>
                <option>On-campus placement</option>
                <option>Off-campus placement</option>
                <option>Higher studies</option>
                <option>Entrepreneurship</option>
                <option>Other</option>
              </select>
            </div>

            {futurePlan && (
              <>
                {Object.entries(details).map(([key, value]) => (
                  <div key={key} className={styles.field}>
                    <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={value}
                      onChange={(e) => handleDetailChange(key, e.target.value)}
                      placeholder={`Enter ${key}`}
                    />
                  </div>
                ))}

                <button
                  type="button"
                  className={styles.submitButton}
                  onClick={handleSubmit}
                >
                  Submit Future Plan
                </button>
              </>
            )}
          </form>
        )}
      </div>
    </>
  );
};

export default StudentFuturePlan;