import React, { useEffect, useState } from "react";
import { Header } from "../../components/header";
import { Footer } from "../../components/footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DocumentUpload from "./component/DocumentUpload";
import Phase3 from "./component/Phase3";
import Verify from "./component/Verify";
import VerifyDocumentemail from "./component/VerifyEmailDocument";

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

  // Check if the student is not verified - show only Verify component with logout button
  if (studentData && !studentData.verified) {
    return (
      <>
        <Header
          navItems={[]}
          downloadButton={{
            text: "Log Out",
            onClick: () => navigate("/student/logout"),
          }}
        />
        <Verify />
        <Footer />
      </>
    );
  }

  // If the student is verified, but some documents are missing
  if (studentData && studentData.verified && (!uploadedDocs.trainingLetter || !uploadedDocs.feeReceipt)) {
    return (
      <>
        <Header
          navItems={[
            { name: "Profile", path: "/dashboard" },
          ]}
          downloadButton={{
            text: "Log Out",
            onClick: () => navigate("/student/logout"),
          }}
        />
        <DocumentUpload uploadedDocs={uploadedDocs} />
        <Footer />
      </>
    );
  }

  // If both documents are uploaded but mentor is not yet verified
  if (studentData && studentData.verified && uploadedDocs.trainingLetter && uploadedDocs.feeReceipt && !studentData.mentorverified) {
    return (
      <>
        <Header
          navItems={[
            { name: "Profile", path: "/dashboard" },
          ]}
          downloadButton={{
            text: "Log Out",
            onClick: () => navigate("/student/logout"),
          }}
        />
        <VerifyDocumentemail />
        <Footer />
      </>
    );
  }

  // If both documents are uploaded and mentor is verified - show Phase3 with full navbar
  if (studentData && studentData.verified && uploadedDocs.trainingLetter && uploadedDocs.feeReceipt && studentData.mentorverified) {
    return (
      <>
        <Header
          navItems={[
            { name: "Profile", path: "/dashboard" },
            { name: "Faculty Assigned", path: "/faculty-assigned" },
            { name: "Upload Report and PPT", path: "/upload-report" },
            { name: "STU INPUT FORM", path: "/student-input" },
            { name: "EVALUATION SCHEDULE", path: "/evaluation-schedule" },
            { name: "FEEDBACK", path: "/feedback" },
            { name: "FORTNIGHTLY REFLECTION", path: "/fortnightly" },
            { name: "FEEDBACK(ABET)", path: "/abet-feedback" },
            { name: "FUTURE PLANS", path: "/future-plans" },
            { name: "OVERALL PROGRESS", path: "/overall-progress" },
            { name: "CHANGE PASSWORD", path: "/change-password" },
          ]}
          downloadButton={{
            text: "Log Out",
            onClick: () => navigate("/student/logout"),
          }}
        />
        <Phase3 />
        <Footer />
      </>
    );
  }

  return null;
};

export default StudentPanel;