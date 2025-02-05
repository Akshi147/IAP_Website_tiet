import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from '../../../components/navbar/navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './stuLogin.module.css'; // Import the CSS module
import Hero from '../../../components/hero/hero';

const StudentLoginForm = () => {
  const navigate = useNavigate();
  const [rollNo, setRollNo] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Error message state

  const handleSubmit = async (e) => {
    e.preventDefault();
    const student = {
      rollNo,
      password
    };
    try {
      const response = await axios.post('http://localhost:4000/students/login', student);
      if (response.status === 200) {
        const data = response.data;
        localStorage.setItem('token', data.token);
        navigate('/student');
      }
    } catch (error) {
      // Set error message
      setErrorMessage(error.response.data.message);
    }
  };

  return (
    <>
      <Navbar />
      <Hero />
      <div className={styles.pageContainer}>
        <div className={styles.formWrapper}>
          <div className={styles.headerSection}>
            <h1 className={styles.headerTitle}>Welcome to Project Semester</h1>
            <p className={styles.headerSubtitle}>Sign in to access your account</p>
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
                  type="text"
                  placeholder="Student Roll Number"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  className={`${styles.inputField} focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  required
                />
              </div>

              <div className={styles.divvv}>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${styles.inputField} focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
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
              <Link to="/register" className={`${styles.linkText} ${styles.linkHover}`}>
                Register with us
              </Link>
              <Link to="/forgot-password" className={`${styles.linkText} ${styles.linkHover}`}>
                Forgot Password?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default StudentLoginForm;
