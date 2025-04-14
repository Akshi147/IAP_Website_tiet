import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./stuResetPassword.module.css";
import Navbar from "../../../components/navbar/navbar";

const StudentResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const token = new URLSearchParams(window.location.search).get("token");

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing token.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:4000/students/resetpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Password successfully reset! Redirecting...");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setError(data.message || "Something went wrong. Try again.");
      }
    } catch (err) {
      setError(err.message || "Server error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <Navbar
            navItems={[
              { name: "Dashboard", path: "/dashboard" },
              {name: "Phase 2", path: "/student"},
              {name: "Faculty Assigned", path: "faculty-assigned"},
              { name: "Upload Report and PPT", path: "/getFileUploadInfo" },
              { name: "Stu Input Form", path: "/student-input" },
              { name: "Evaluation Schedule", path: "/evaluation-schedule" },
              { name: "Feedback", path: "/feedback" },
              { name: "Fortinightly Reflection", path: "/fortnightly" },
              { name: "Feedback(ABET)", path: "/abet-feedback" },
              { name: "Future Plans", path: "/future-plans" },
              { name: "Overall progress", path: "/overall-progress" },
              { name: "Change Password", path: "/reset-password" },
              ]}
              downloadButton={{
                text: "Log Out",
                onClick: () => navigate("/student/logout"),
              }}
          />
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Reset Password</h1>
        <p className={styles.subtitle}>Enter your new password</p>

        {message && <div className={styles.successMessage}>{message}</div>}
        {error && <div className={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={styles.input}
            required
          />

          <button
            type="submit"
            className={styles.button}
            disabled={isLoading}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
    </>
  );
};

export default StudentResetPassword;