import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MentorLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logoutMentor = async () => {
      try {
        await axios.post("http://localhost:4000/mentors/logout", {}, { withCredentials: true });
        localStorage.removeItem("mentor-token"); // Clear token on logout
        navigate("/mentors/login"); // Redirect to login after logout
      } catch (error) {
        console.error("Logout failed:", error.response?.data?.message || "Unknown error");
      }
    };

    logoutMentor();
  }, [navigate]);

  return null; // No UI needed
};

export default MentorLogout;
