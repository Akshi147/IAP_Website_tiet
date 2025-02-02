import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";

const FacultyProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("faculty-token");

  useEffect(() => {
    if (!token) {
      navigate("/facultylogin");
      return;
    }

    const verifyFaculty = async () => {
      try {
        const response = await axios.get("http://localhost:4000/faculty/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status !== 200) throw new Error("Unauthorized");
      } catch (error) {
        console.error("Error:", error);
        localStorage.removeItem("faculty-token");
        navigate("/facultylogin");
      } finally {
        setIsLoading(false);
      }
    };

    verifyFaculty();
  }, [navigate]); // Removed `token` dependency to avoid unnecessary re-renders

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Verifying Faculty access...</p>
      </div>
    );
  }

  return <>{children}</>;
};
FacultyProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
export default FacultyProtectedRoute;