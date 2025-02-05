import { useEffect, useState } from "react";
import Navbar from "../../components/navbar/navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import StudentDocUpload from "./studentDocUpload/studentDocUpload";
import StudentDashboard from "./studentDashboardafterVerify/stuDashboardAfterVerify";
import Verify from "./studentAccVerify/studentAccVerify";
import StudentDocVerifyPhase from "./studentDocVerifyPhase/stuDocVerifyPhase";
import styles from "./studentPanel.module.css"; // Import the CSS module

const StudentPanel = () => {
  const navigate = useNavigate();
  const [uploadedDocs, setUploadedDocs] = useState({
    trainingLetter: false,
    feeReceipt: false,
  });
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    const fetchStudentStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:4000/students/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudentData(response.data.student);
        setUploadedDocs({
          trainingLetter: response.data.student.trainingLetter,
          feeReceipt: response.data.student.feeReceipt,
        });
      } catch (error) {
        console.error("Error fetching student status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentStatus();
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <p className={styles.loadingText}>Loading...</p>
      </div>
    );
  }

  // Check if the student is not verified
  if (studentData && !studentData.verified) {
    return (
      <>
        <Navbar
          navItems={[
            { name: "Dashboard", path: "/dashboard" },
            { name: "Courses", path: "/courses" },
            { name: "Profile", path: "/profile" },
          ]}
          downloadButton={{
            text: "Log Out",
            onClick: () => navigate("/student/logout"),
          }}
        />
        <Verify />
      </>
    );
  }

  // If the student is verified, but some documents are missing
  if (studentData && studentData.verified) {
    if (!uploadedDocs.trainingLetter || !uploadedDocs.feeReceipt) {
      return (
        <>
          <Navbar
            navItems={[
              { name: "Dashboard", path: "/dashboard" },
              { name: "Courses", path: "/courses" },
              { name: "Profile", path: "/profile" },
              {name : "Log Out", path: "/student/logout"}
            ]}
            downloadButton={{
              text: "Log Out",
              onClick: () => navigate("/student/logout"),
            }}
          />
          <StudentDocUpload uploadedDocs={uploadedDocs} />
        </>
      );
    }

    // If both documents are uploaded and mentor is verified
    if (studentData.mentorverified) {
      return (
        <>
          <Navbar
            navItems={[
              { name: "Dashboard", path: "/dashboard" },
              { name: "Courses", path: "/courses" },
              { name: "Profile", path: "/profile" },
              {name : "Log Out", path: "/student/logout"},
            ]}
            downloadButton={{
              text: "Log Out",
              onClick: () => navigate("/student/logout"),
            }}
          />
          <StudentDashboard />
        </>
      );
    }

    // Default: All documents uploaded but waiting for mentor verification
    return (
      <>
        <Navbar
          navItems={[
            { name: "Dashboard", path: "/dashboard" },
            { name: "Courses", path: "/courses" },
            { name: "Profile", path: "/profile" },
          ]}
          downloadButton={{
            text: "Log Out",
            onClick: () => navigate("/student/logout"),
          }}
        />
        <StudentDocVerifyPhase />
      </>
    );
  }

  return null;
};

export default StudentPanel;
