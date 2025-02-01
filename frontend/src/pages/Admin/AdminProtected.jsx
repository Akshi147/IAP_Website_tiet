import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Verifying Admin access...</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
