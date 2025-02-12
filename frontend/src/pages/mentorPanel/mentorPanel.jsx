import { useEffect, useState } from "react";
import Navbar from "../../components/navbar/navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MentorAssignedStudents from "./mentorAssignedStu/mentorAssignedStu";
import styles from "./mentorPanel.module.css"; // Import the CSS module

const MentorPanel = () => {
  const navigate = useNavigate();
  const [mentorData, setMentorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false); // ✅ Prevents repeated API calls

  useEffect(() => {
    let isMounted = true; // ✅ Ensures state updates only when component is mounted

    const fetchMentorData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.warn("❌ No token found. Redirecting to login.");
          navigate("/mentors/login");
          return;
        }

        console.log("🚀 Fetching mentor profile with token:", token);

        // ✅ Avoid multiple fetch calls
        if (!hasFetched) {
          const profileResponse = await axios.get("http://localhost:4000/mentors/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (isMounted) {
            setMentorData(profileResponse.data.mentor);
            setHasFetched(true); // ✅ Set flag to prevent refetching
          }
        }
      } catch (error) {
        console.error("❌ Error fetching mentor profile:", error);
        navigate("/mentors/login");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMentorData();

    return () => {
      isMounted = false;
    };
  }, [hasFetched, navigate]); // ✅ `hasFetched` ensures it runs **only once**

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
          { name: "Dashboard", path: "/mentors" },
          { name: "Profile", path: "/mentors/profile" },
          { name: "Log Out", path: "/mentors/logout" },
        ]}
        downloadButton={{
          text: "Log Out",
          onClick: () => {
            localStorage.removeItem("token"); // ✅ Clears token on logout
            navigate("/mentors/login");
          },
        }}
      />

      <div className={styles.panelContainer}>
        <h1 className={styles.panelHeading}>Mentor Dashboard</h1>

        <MentorAssignedStudents />
      </div>
    </>
  );
};

export default MentorPanel;
