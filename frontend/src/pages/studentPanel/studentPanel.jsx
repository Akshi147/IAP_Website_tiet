import { useEffect, useState } from "react";
import Navbar from "./../../components/navbar/navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import StudentDocUpload from "./studentDocUpload/studentDocUpload";
import StudentMentorDetailForm from "./studentDashboardafterVerify/stuDashboardAfterVerify";
import Verify from "./studentAccVerify/studentAccVerify";
import StudentDocVerifyPhase from "./studentDocVerifyPhase/stuDocVerifyPhase";

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
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Loading...</p>
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

  // If the student mail is verified, but some documents are missing
  if (studentData && studentData.verified && (!uploadedDocs.trainingLetter || !uploadedDocs.feeReceipt)) {
      return (
        <>
          <Navbar
            navItems={[
              { name: "Dashboard", path: "/dashboard" },
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

    // If both documents are uploaded and admin is verified
    if (studentData && studentData.verified && uploadedDocs.trainingLetter && uploadedDocs.feeReceipt && studentData.mentorverified) {
      return (
        <>
          <Navbar
            navItems={[
              { name: "Dashboard", path: "/dashboard" },
              {name: "Faculty Assigned", path: "faculty-assigned"},
              { name: "Upload Report and PPT", path: "/getFileUploadInfo" },
              { name: "Stu Input Form", path: "/student-input" },
              { name: "Evaluation Schedule", path: "/evaluation-schedule" },
              { name: "Feedback", path: "/feedback" },
              { name: "Fortinightly Reflection", path: "/fortnightly" },
              { name: "Feedback(ABET)", path: "/abet-feedback" },
              { name: "Future Plans", path: "/future-plans" },
              { name: "Overall progress", path: "/overall-progress" },
              { name: "Change Password", path: "/change-password" },
            ]}
            downloadButton={{
              text: "Log Out",
              onClick: () => navigate("/student/logout"),
            }}
          />
          <StudentMentorDetailForm />

        </>
      );
    }

    // Default: All documents uploaded but waiting for admin verification
    if (studentData && studentData.verified && uploadedDocs.trainingLetter && uploadedDocs.feeReceipt && !studentData.mentorverified){
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
};

export default StudentPanel;