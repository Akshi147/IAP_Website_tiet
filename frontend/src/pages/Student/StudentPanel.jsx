  import React, { useEffect, useState } from "react";
  import { Header } from "../../components/header";
  import { Footer } from "../../components/footer";
  import { useNavigate } from "react-router-dom";
  import axios from "axios";
  import DocumentUpload from "./component/DocumentUpload";
  import Phase3 from "./component/Phase3"; // Assuming Phase3 is the final phase component
  import Verify from "./component/Verify"; // Assuming this is the Verify component
  import Phase2 from "./component/Phase2";

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
          <Header
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
          <Footer />
        </>
      );
    }

    // If the student is verified, but some documents are missing
    if (studentData && studentData.verified) {
      if (!uploadedDocs.trainingLetter || !uploadedDocs.feeReceipt) {
        return (
          <>
            <Header
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
            <DocumentUpload uploadedDocs={uploadedDocs} />
            <Footer />
          </>
        );
      }

      // If both documents are uploaded and mentor is verified
      if (studentData.mentorverified) {
        return (
          <>
            <Header
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
            <Phase3 />
            <Footer />
          </>
        );
      }

      // Default: All documents uploaded but waiting for mentor verification
      return (
        <>
          <Header
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
          <Phase2/>
          <Footer />
        </>
      );
    }

    return null;
  };

  export default StudentPanel;
