import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from './admin.module.css';  // Import the CSS module
import Navbar from "../../../components/navbar/navbar";

const Admin = () => {
  const [rollNumber, setRollNumber] = useState("");
  const [error, setError] = useState("");  // State to hold error message
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    const token = localStorage.getItem("admin-token");
    if (!token) {
      navigate("/adminlogin");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:4000/students/verifyStudentDocument/${rollNumber}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        navigate(`/admin/verifyStudentDocument/${rollNumber}`);
      }
    } catch (error) {
      if (error.response) {
        // If API returns an error response (e.g., 400, 404)
        setError(error.response.data.message || "An error occurred. Please try again.");
      } else if (error.request) {
        // If request was made but no response received
        setError("No response from server. Please check your connection.");
      } else {
        // Other errors
        setError("Something went wrong. Please try again.");
      }
      console.error("Error:", error);
    }
  };

  return (
    <>
    <Navbar
      navLinks={[
      {name:"Students Under Document Verification",path:"/underdocumentverification"},
        {name:"Students In Phase 2",path:"/phase2verification"},
        { name: "Verify Student", path: "/admin" },
        {name:"Delete Student",path:"/deletestudent"},
        {name: "Generate Excel", path: "/generateexcel" },
        { name: "Verify Faculty", path: "/verifyfaculty" },
        { name: "Verify Mentor", path: "/mentor" },
        {name:"Change Password",path:"/adminchangepassword"}
      ]}
      downloadButton={{
        text: "Log Out",
        onClick: () => navigate("/adminlogout"),
      }}
    />
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <div className={styles.card}>
          <div className={styles.formContainer}>
            <h2 className={styles.header}>
              Verify Student Details
            </h2>

            {/* Error Message Display */}
            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="rollNumber" className={styles.label}>
                  Enter Student Roll Number
                </label>
                <input
                  type="text"
                  id="rollNumber"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  className={styles.input}
                  placeholder="Enter roll number"
                  required
                />
              </div>
              <button
                type="submit"
                className={styles.submitButton}
              >
                Search Student
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Admin;
