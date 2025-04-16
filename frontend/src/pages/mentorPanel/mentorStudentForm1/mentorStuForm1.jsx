import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./mentorStuForm1.module.css";
import Navbar from "../../../components/navbar/navbar";

const MentorBriefProgressReport = () => {
  const navigate = useNavigate();
  const { id: studentId } = useParams();
  const [data, setData] = useState(null);
  const token = localStorage.getItem("mentor-token");

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/mentors/breifProgressReport/${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching student data:", err);
    }
  };

  useEffect(() => {
    if (studentId && token) {
      fetchData();
    }
  }, [studentId, token]);

  useEffect(() => {
    // Auto-save progress report on data change
    if (data && data.progressReport && studentId && token) {
      const payload = data.progressReport;
      axios
        .post(
          `http://localhost:4000/mentors/submitBriefProgressReport/${studentId}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .catch((err) =>
          console.error("Error submitting progress report:", err)
        );
    }
  }, [data, studentId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      progressReport: {
        ...prev.progressReport,
        [name]: value,
      },
    }));
  };

  if (!data) return <div>Loading...</div>;

  const handleSubmit = async () => {
    try {
      const payload = data.progressReport;
      await axios.post(
        `http://localhost:4000/mentors/submitBriefProgressReport/${studentId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Saved successfully!");
    } catch (err) {
      alert("Save failed!");
      console.error("Save error:", err);
    }
  };
  

  const {
    rollNumber,
    studentName,
    companyName,
    companyAddress,
    dateOfVisit,
    progressReport,
  } = data;

  return (
    <>
      <Navbar
        navItems={[
          { name: "Students Doing Project Under You", path: "/mentors/getAssignedStudents" },
          { name: "Feedback", path: "/mentors/feedback" },
          { name: "Feedback (for ABET)", path: "/mentors/feedback-abet" },
          { name: "Change Password", path: "/reset-mentorpassword" },
        ]}
        downloadButton={{
          text: "Log Out",
          onClick: () => navigate("/mentors/logout"),
        }}
      />
    <div className={styles.container}>
      <h2 className={styles.heading}>PROJECT SEMESTER INFORMATION</h2>

      <div className={styles.form}>
        {/* Student Details - LOCKED */}
        <div className={styles.inputGroup}>
          <label>Roll Number:</label>
          <input value={rollNumber || ""} readOnly className={styles.input} />
        </div>

        <div className={styles.inputGroup}>
          <label>Date of Visit:</label>
          <input
            type="date"
            value={dateOfVisit?.split("T")[0] || ""}
            readOnly
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Student Name:</label>
          <input
            value={studentName || ""}
            readOnly
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Company/Organization Name:</label>
          <input
            value={companyName || ""}
            readOnly
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroupFull}>
          <label>Company/Organization Address:</label>
          <textarea
            value={companyAddress || ""}
            readOnly
            className={styles.input}
          />
        </div>
      </div>

      <h3 className={styles.heading}>
        Brief Progress Report{" "}
        <span className={styles.heading}>(To be filled by Industrial Mentor)</span>
      </h3>

      <div className={styles.form2}>
        <div className={styles.inputGroupFull}>
          <label>Topic/Title of the Project:</label>
          <input
            name="topicOfProject"
            value={progressReport?.topicOfProject || ""}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div>
          <label>Type of Project:</label>
          <select
            name="typeOfProject"
            value={progressReport?.typeOfProject || ""}
            onChange={handleChange}
            className={styles.inputselect}
          >
            <option value="">Choose One...</option>
            <option value="Software Development">Software Development</option>
            <option value="Research">Research</option>
            <option value="Field Work">Field Work</option>
          </select>
        </div>

        {[1, 2, 3].map((num) => (
          <div className={styles.inputGroupFull} key={num}>
            <label>Assignment {num} Details:</label>
            <textarea
              name={`assignment${num}Details`}
              value={progressReport?.[`assignment${num}Details`] || ""}
              onChange={handleChange}
              className={styles.input}
            />
            <label>Status:</label>
            <select
              name={`assignment${num}Status`}
              value={progressReport?.[`assignment${num}Status`] || ""}
              onChange={handleChange}
              className={styles.input}
            >
              <option value="">Choose One...</option>
              <option value="On Going">On Going</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        ))}

        <div className={styles.inputGroup}>
          <label>HR Name:</label>
          <input
            name="hrName"
            value={progressReport?.hrName || ""}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <label>HR Contact No.:</label>
          <input
            name="hrContactNumber"
            value={progressReport?.hrContactNumber || ""}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroupFull}>
          <label>HR Email Id:</label>
          <input
            name="hrEmailId"
            value={progressReport?.hrEmailId || ""}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroupFull}>
          <label>Remarks of Industry Coordinator:</label>
          <textarea
            name="remarksByIndustryCoordinator"
            value={progressReport?.remarksByIndustryCoordinator || ""}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
        <div className={styles.buttonGroup}>
  <button className={styles.button} onClick={handleSubmit}>
    Save
  </button>
  <button className={styles.button} onClick={() => navigate(-1)}>
    Back
  </button>
</div>

      </div>
    </div>
  </>
  );
};

export default MentorBriefProgressReport;