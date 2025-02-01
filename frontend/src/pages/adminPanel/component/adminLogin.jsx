import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './adminLogin.module.css';  // Import the CSS module
import Navbar from "../../../components/navbar/navbar";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      email,
      password
    };
    try {
      const response = await axios.post('http://localhost:4000/admin/login', user);
      if (response.status === 200) {
        const data = response.data;
        localStorage.setItem('admin-token', data.token);
        navigate('/admin');
      }
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  return (
    <>
    <Navbar />
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1 className={styles.heading}>Welcome to Project Semester</h1>
            <p className={styles.subheading}>Sign in to access your account</p>
          </div>

          <div className={styles.formContainer}>
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
                  placeholder="Admin Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
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
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminLogin;
