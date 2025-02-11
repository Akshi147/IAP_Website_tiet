import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../../components/navbar/navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./MentorLogin.module.css"; // Import CSS module
import Hero from "../../../components/hero/hero";

const MentorLogin= () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Error message state

  const handleSubmit = async (e) => {
    e.preventDefault();
    const mentor = {
      email,
      password,
    };

    try {
      const response = await axios.post(
        "http://localhost:4000/mentors/login",
        mentor
      );
      if (response.status === 200) {
        const data = response.data;
        localStorage.setItem("token", data.token);
        navigate("/mentors/assignedStudents"); // Redirect mentor to dashboard
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <>
      <Navbar />
      <Hero />
      <div className={styles.pageContainer}>
        <div className={styles.formWrapper}>
          <div className={styles.headerSection}>
            <h1 className={styles.headerTitle}>Mentor Portal</h1>
            <p className={styles.headerSubtitle}>Sign in to continue</p>
          </div>

          <div className={styles.formContainer}>
            {/* Error Message Alert */}
            {errorMessage && (
              <div className={styles.errorAlert}>
                <p>{errorMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.formm}>
              <div className={styles.divvv}>
                <input
                  type="email"
                  placeholder="Mentor Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${styles.inputField}`}
                  required
                />
              </div>

              <div className={styles.divvv}>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${styles.inputField}`}
                  required
                />
              </div>

              <button
                type="submit"
                className={`${styles.submitButton} ${styles.submitButtonHover}`}
              >
                Sign In
              </button>
            </form>

            <div className={styles.linkContainer}>
              <Link
                to="/mentors/register"
                className={`${styles.linkText} ${styles.linkHover}`}
              >
                Register as Mentor
              </Link>
              <Link
                to="/mentors/forgotpassword"
                className={`${styles.linkText} ${styles.linkHover}`}
              >
                Forgot Password?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MentorLogin;
