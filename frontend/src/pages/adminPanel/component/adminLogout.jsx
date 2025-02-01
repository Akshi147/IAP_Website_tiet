import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./adminLogout.module.css";

const AdminLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("admin-token");

    if (!token) {
      navigate("/adminlogin");
      return;
    }

    const logout = async () => {
      try {
        const response = await axios.get("http://localhost:4000/admin/logout", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          localStorage.removeItem("admin-token");
          navigate("/adminlogin");
        }
      } catch (error) {
        console.error("Logout Error:", error);
      }
    };

    logout();
  }, [navigate]);

  return (
    <div className={styles.flexCenter}>
      <p className={styles.text}>Logging out...</p>
    </div>
  );
};

export default AdminLogout;