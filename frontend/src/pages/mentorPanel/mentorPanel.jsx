import { useEffect, useState } from "react";
import Navbar from "../../components/navbar/navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MentorAccVerify from "./mentoAccVerify/mentorAccVerify";
import MentorAssignedStudents from "./mentorAssignedStu/mentorAssignedStu";
import styles from "./mentorPanel.module.css"; // Import the CSS module

const MentorPanel = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [mentorData, setMentorData] = useState(null);

  useEffect(() => {
    const fetchMentorStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:4000/mentor/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMentorData(response.data.mentor);
      } catch (error) {
        console.error("Error fetching mentor status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMentorStatus();
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <p className={styles.loadingText}>Loading...</p>
      </div>
    );
  }

  // Check if the mentor is not verified
  if (mentorData && !mentorData.verified) {
    return (
      <>
        <Navbar
          navItems={[
            { name: "Dashboard", path: "/dashboard" },
            { name: "Profile", path: "/profile" },
          ]}
          downloadButton={{
            text: "Log Out",
            onClick: () => navigate("/mentors/logout"),
          }}
        />
        <MentorAccVerify />
      </>
    );
  }

  // If the mentor is verified, show assigned students
  if (mentorData && mentorData.verified) {
    return (
      <>
        <Navbar
          navItems={[
            { name: "Dashboard", path: "/dashboard" },
            { name: "Profile", path: "/profile" },
            { name: "Log Out", path: "/mentors/logout" },
          ]}
          downloadButton={{
            text: "Log Out",
            onClick: () => navigate("/mentors/logout"),
          }}
        />
        <MentorAssignedStudents />
      </>
    );
  }

  return null;
};

export default MentorPanel;