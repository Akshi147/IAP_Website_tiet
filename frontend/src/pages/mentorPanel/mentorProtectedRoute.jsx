import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MentorProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      navigate("/mentors/login"); // Redirect to login if no token
      return;
    }

    const verifyMentor = async () => {
      try {
        const response = await axios.get("http://localhost:4000/mentor/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const mentor = response.data.mentor;

        if (!mentor) {
          throw new Error("Unauthorized: No mentor data found");
        }

        // Redirect to set password if mentor has not completed registration
        if (!mentor.passwordSet) {
          navigate("/mentors/setPassword");
          return;
        }
      } catch (error) {
        console.error("Error verifying mentor:", error);
        localStorage.removeItem("token");
        navigate("/mentors/login");
      } finally {
        setIsLoading(false);
      }
    };

    verifyMentor();
  }, [navigate]); // Prevent unnecessary re-renders

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Verifying mentor access...</p>
      </div>
    );
  }

  return <>{children}</>;
};

MentorProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MentorProtectedRoute;