import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../../components/navbar/navbar"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './facultyLogin.module.css';

const FacultyLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Error message state

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      email,
      password
    };
    try {
      const response = await axios.post('http://localhost:4000/faculty/login', user);
      if (response.status === 200) {
        const data = response.data;
        localStorage.setItem('faculty-token', data.token);
        navigate('/faculty');
      }
    } catch (error) {
      // Set error message
      setErrorMessage(error.response.data.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.formWrapper}>
          <div className={styles.header}>
            <h1 className={styles.title}>Welcome to Project Semester</h1>
            <p className={styles.subtitle}>Sign in to access your account</p>
          </div>

          <div className={styles.formCard}>
            {/* Error Message Alert */}
            {errorMessage && (
              <div className={styles.errorMessage}>
                <p>{errorMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div>
                <input
                  type="text"
                  placeholder="Faculty Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.inputField}
                  required
                />
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.inputField}
                  required
                />
              </div>

              <button
                type="submit"
                className={styles.submitButton}
              >
                Sign In
              </button>
            </form>

            <div className={styles.linksContainer}>
              <Link to="/facultyregister" className={styles.link}>
                Register with us
              </Link>
              <Link to="/forgot-password" className={styles.link}>
                Forgot Password?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FacultyLogin;
