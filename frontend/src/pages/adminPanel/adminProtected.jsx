import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./adminProtected.module.css";

const AdminProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("admin-token");

  useEffect(() => {
    if (!token) {
      navigate("/adminlogin");
      return;
    }

    const verifyAdmin = async () => {
      try {
        const response = await axios.get("http://localhost:4000/admin/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status !== 200) throw new Error("Unauthorized");
      } catch (error) {
        console.error("Error:", error);
        localStorage.removeItem("admin-token");
        navigate("/adminlogin");
      } finally {
        setIsLoading(false);
      }
    };

    verifyAdmin();
  }, [navigate]); // Removed `token` dependency to avoid unnecessary re-renders

  if (isLoading) {
    return (
      <div className={styles.loaderWrapper}>
        <p className={styles.loaderText}>Verifying Admin access...</p>
      </div>
    );
  }

  return <>{children}</>;
};
AdminProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminProtectedRoute;