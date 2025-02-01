import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StudentLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const logout = async () => {
      try {
        const response = await axios.get("http://localhost:4000/students/logout", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          localStorage.removeItem("token");
          navigate("/login");
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

export default StudentLogout;
