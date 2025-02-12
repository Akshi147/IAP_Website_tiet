import { useEffect, useState } from "react";
import Navbar from "../../components/navbar/navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
        if (!token) {
          navigate("/mentors/login"); // Redirect to login if no token
          return;
        }

        const response = await axios.get("http://localhost:4000/mentors/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMentorData(response.data.mentor);
      } catch (error) {
        console.error("Error fetching mentor status:", error);
        navigate("/mentors/login"); // Redirect to login on error
      } finally {
        setLoading(false);
      }
    };

    fetchMentorStatus();
  }, [navigate]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <p className={styles.loadingText}>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar
        navItems={[
          { name: "Dashboard", path: "/mentors/panel" },
          { name: "Profile", path: "/mentors/profile" },
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
};

export default MentorPanel;