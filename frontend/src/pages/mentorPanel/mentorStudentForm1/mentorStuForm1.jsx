import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "../../../components/navbar/navbar";
import { useNavigate } from "react-router-dom";
import styles from "./mentorStuForm1.module.css";

const MentorBriefProgressReport = () => {
  const navigate = useNavigate();
  const { id: studentId } = useParams();
  const [data, setData] = useState(null);
  const [editable, setEditable] = useState(true);
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
      if (res.data.success) setData(res.data.data);
    } catch (err) {
      console.error("Error fetching progress report:", err);
    }
  };

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

  useEffect(() => {
    if (studentId && token) fetchData();
  }, [studentId, token]);

  useEffect(() => {
    if (data && studentId && token) {
      const payload = data.progressReport;
      axios.post(
        `http://localhost:4000/mentors/submitBriefProgressReport/${studentId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }
  }, [data, studentId, token]);

  if (!data) return <div>Loading...</div>;

  const { rollNumber, studentName, companyName, companyAddress, dateOfVisit, progressReport } = data;

  return (
    <>
      <Navbar
        navItems={[
          { name: "Students Doing Project Under You", path: "/mentors/getAssignedStudents" },
          { name: "Feedback", path: "faculty-assigned" },
          { name: "Feedback (for ABET)", path: "/getFileUploadInfo" },
          { name: "Change Password", path: "/reset-mentorpassword" },
        ]}
        downloadButton={{
          text: "Log Out",
          onClick: () => navigate("/mentors/logout"),
        }}
      />
      <div className={styles.container}>
        <h2 className={styles.heading}>
          PROJECT SEMESTER INFORMATION
        </h2>

        <div className={styles.grid}>
          <div>Roll Number: <input value={rollNumber || ""} disabled className={styles.input} /></div>
          <div>Date of visit: <input type="date" value={dateOfVisit?.split("T")[0] || ""} disabled className={styles.input} /></div>
          <div>Student Name: <input value={studentName || ""} disabled className={styles.input} /></div>
          <div>Company/Organization Name: <input value={companyName || ""} disabled className={styles.input} /></div>
          <div className={styles.colSpan2}>Company/Organization Address:
            <textarea value={companyAddress || ""} disabled className={`${styles.input} ${styles.fullWidth}`} />
          </div>
        </div>

        <h3 className={styles.subheading}>
          Brief Progress Report <span className={styles.normalFont}>(To be filled by Industrial Mentor)</span>
        </h3>

        <div className={styles.grid}>
          <div>Topic/Title of the Project:
            <input
              className={styles.input}
              name="topicOfProject"
              value={progressReport.topicOfProject || ""}
              onChange={handleChange}
              disabled={!editable}
            />
          </div>
          <div>Type of Project:
            <select
              className={styles.input}
              name="typeOfProject"
              value={progressReport.typeOfProject || ""}
              onChange={handleChange}
              disabled={!editable}
            >
              <option value="">Choose One...</option>
              <option value="Software Development">Software Development</option>
              <option value="Research">Research</option>
              <option value="Field Work">Field Work</option>
            </select>
          </div>

          {[1, 2, 3].map((num) => (
            <div key={num} className={styles.colSpan2}>
              <label className={styles.label}>Assignment {num}</label>
              <textarea
                className={`${styles.input} ${styles.fullWidth}`}
                name={`assignment${num}Details`}
                value={progressReport[`assignment${num}Details`] || ""}
                onChange={handleChange}
                disabled={!editable}
              />
              <select
                className={`${styles.input} ${styles.marginTop}`}
                name={`assignment${num}Status`}
                value={progressReport[`assignment${num}Status`] || ""}
                onChange={handleChange}
                disabled={!editable}
              >
                <option>Choose One...</option>
                <option>On Going</option>
                <option>Completed</option>
                <option>Pending</option>
              </select>
            </div>
          ))}

          <div>HR Name:
            <input
              className={styles.input}
              name="hrName"
              value={progressReport.hrName || ""}
              onChange={handleChange}
              disabled={!editable}
            />
          </div>
          <div>HR Contact No.:
            <input
              className={styles.input}
              name="hrContactNumber"
              value={progressReport.hrContactNumber || ""}
              onChange={handleChange}
              disabled={!editable}
            />
          </div>
          <div className={styles.colSpan2}>HR Email Id:
            <input
              className={`${styles.input} ${styles.fullWidth}`}
              name="hrEmailId"
              value={progressReport.hrEmailId || ""}
              onChange={handleChange}
              disabled={!editable}
            />
          </div>

          <div className={styles.colSpan2}>Remarks of Industry Coordinator:
            <textarea
              className={`${styles.input} ${styles.fullWidth}`}
              name="remarksByIndustryCoordinator"
              value={progressReport.remarksByIndustryCoordinator || ""}
              onChange={handleChange}
              disabled={!editable}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default MentorBriefProgressReport;
