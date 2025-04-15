import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../../components/navbar/navbar";
import styles from "./stuFuturePlan.module.css";

const StudentFuturePlan = () => {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState(null);
  const token = localStorage.getItem("token");

  const [futurePlan, setFuturePlan] = useState("");
  const [details, setDetails] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch student ID
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

  // Fetch existing future plan
  useEffect(() => {
    const fetchFuturePlan = async () => {
      try {
        if (studentId && token) {
          const res = await axios.get(
            `http://localhost:4000/students/getFuturePlan/${studentId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setFuturePlan(res.data.futurePlan || "");
          setDetails(res.data.details || {});
        }
      } catch (err) {
        console.error("Error fetching future plan:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFuturePlan();
  }, [studentId, token]);

  const handleChange = (field, value) => {
    setDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post(
        `http://localhost:4000/students/submitFuturePlan/${studentId}`,
        {
          futurePlan,
          futurePlanDetails: details,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Future plan submitted successfully!");
    } catch (err) {
      console.error("Error submitting future plan:", err);
      alert("Failed to submit future plan");
    }
  };

  const renderFields = () => {
    const commonFields = (
      <>
        <input
          className={styles.input}
          placeholder="City"
          value={details.city || ""}
          onChange={(e) => handleChange("city", e.target.value)}
        />
        <input
          className={styles.input}
          placeholder="Country"
          value={details.country || ""}
          onChange={(e) => handleChange("country", e.target.value)}
        />
      </>
    );

    switch (futurePlan) {
      case "on-campus placement":
      case "off-campus placement":
        return (
          <>
            <input
              className={styles.input}
              placeholder="Company Name"
              value={details.companyName || ""}
              onChange={(e) => handleChange("companyName", e.target.value)}
            />
            <input
              className={styles.input}
              placeholder="Job"
              value={details.job || ""}
              onChange={(e) => handleChange("job", e.target.value)}
            />
            <input
              className={styles.input}
              placeholder="Profile"
              value={details.profile || ""}
              onChange={(e) => handleChange("profile", e.target.value)}
            />
            <input
              className={styles.input}
              placeholder="Position"
              value={details.position || ""}
              onChange={(e) => handleChange("position", e.target.value)}
            />
            <input
              className={styles.input}
              placeholder="CTC"
              value={details.ctc || ""}
              onChange={(e) => handleChange("ctc", e.target.value)}
            />
            {commonFields}
          </>
        );

      case "higher studies/research":
        return (
          <>
            <input
              className={styles.input}
              placeholder="Institution Name"
              value={details.org || ""}
              onChange={(e) => handleChange("org", e.target.value)}
            />
            {commonFields}
            <input
              className={styles.input}
              placeholder="Program Details"
              value={details.programDetails || ""}
              onChange={(e) => handleChange("programDetails", e.target.value)}
            />
          </>
        );

      case "start-up":
        return (
          <>
            <input
              className={styles.input}
              placeholder="Startup Name"
              value={details.startUpName || ""}
              onChange={(e) => handleChange("startUpName", e.target.value)}
            />
            <input
              className={styles.input}
              placeholder="Startup Type"
              value={details.startUpType || ""}
              onChange={(e) => handleChange("startUpType", e.target.value)}
            />
            <input
              className={styles.input}
              placeholder="Turnover"
              value={details.turnover || ""}
              onChange={(e) => handleChange("turnover", e.target.value)}
            />
            {commonFields}
          </>
        );

      case "join family business":
        return (
          <>
            <input
              className={styles.input}
              placeholder="Company Name"
              value={details.companyName || ""}
              onChange={(e) => handleChange("companyName", e.target.value)}
            />
            <input
              className={styles.input}
              placeholder="Position"
              value={details.position || ""}
              onChange={(e) => handleChange("position", e.target.value)}
            />
            {commonFields}
          </>
        );

      default:
        return null;
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
        <h2 className={styles.heading}>Student Future Plan</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <form className={styles.form}>
            <label className={styles.label}>Select Your Future Plan:</label>
            <select
              className={styles.select}
              value={futurePlan}
              onChange={(e) => {
                setFuturePlan(e.target.value);
                setDetails({});
              }}
            >
              <option value="">Select</option>
              <option value="on-campus placement">On-campus Placement</option>
              <option value="off-campus placement">Off-campus Placement</option>
              <option value="higher studies/research">Higher Studies/Research</option>
              <option value="start-up">Start-up</option>
              <option value="join family business">Join Family Business</option>
              <option value="unemployed">Unemployed</option>
            </select>

            {renderFields()}

            <button
              type="button"
              className={styles.submitButton}
              onClick={handleSubmit}
            >
              Submit Plan
            </button>
          </form>
        )}
      </div>
    </>
  );
};

export default StudentFuturePlan;