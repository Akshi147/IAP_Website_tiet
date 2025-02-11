import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./mentorLogout.module.css"; // Import the CSS Module

const MentorLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/mentors/login");
      return;
    }

    const logout = async () => {
      try {
        const response = await axios.get("http://localhost:4000/mentors/logout", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          localStorage.removeItem("token");
          navigate("/mentors/login");
        }
      } catch (error) {
        console.error("Logout Error:", error);
      }
    };

    logout();
  }, [navigate]);

  return (
    <div className={styles.container}>
      <p className={styles.text}>Logging out...</p>
    </div>
  );
};

export default MentorLogout;
