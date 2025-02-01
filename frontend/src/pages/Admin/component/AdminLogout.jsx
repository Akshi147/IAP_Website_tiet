import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg font-semibold">Logging out...</p>
    </div>
  );
};

export default AdminLogout;
