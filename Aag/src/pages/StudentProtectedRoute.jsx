import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const StudentProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const verifyStudent = async () => {
      try {
        const response = await axios.get("http://localhost:4000/students/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status !== 200) throw new Error("Unauthorized");
      } catch (error) {
        console.error("Error:", error);
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    verifyStudent();
  }, [navigate]); // Removed `token` dependency to avoid unnecessary re-renders

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Verifying student access...</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default StudentProtectedRoute;
