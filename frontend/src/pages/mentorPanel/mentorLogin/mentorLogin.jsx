import { useState } from "react";
import { Link} from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Navbar from "../../../components/navbar/navbar";
import styles from "./mentorLogin.module.css";

const MentorLogin = () => {
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
  
    try {
      const response = await axios.post("http://localhost:4000/mentors/login", formData, {
        withCredentials: true,
      });
  
      if (response.status === 200) {
        console.log("✅ Login successful. Storing token...");
        
        // ✅ Store token properly
        localStorage.setItem("token", response.data.token);
  
        // ✅ Navigate **after** storing token
        window.location.href = "/mentors";
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Login failed. Please check your credentials.");
    }
  };
  
  


  return (
    <>
    <Navbar />
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1>Mentor Login</h1>
        <p>Sign in to access your dashboard</p>

        {errorMessage && <div className={`${styles.alert} ${styles.error}`}>{errorMessage}</div>}

        <form onSubmit={handleSubmit} className={styles.formGrid}>
          <input 
            type="email" 
            name="email" 
            placeholder="Email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
          />

          <div className={styles.passwordWrapper}>
            <input
              type={passwordVisible ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span className={styles.eyeIcon} onClick={() => setPasswordVisible(!passwordVisible)}>
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button type="submit" className={styles.submitButton}>Login</button>
        </form>

        <div className={styles.links}>
          <Link to="/mentors/forgot-password">Forgot Password?</Link>
          <br />
          <Link to="/mentors/register">New Mentor? Register</Link>
        </div>
      </div>
    </div>
    </>
  );
};

export default MentorLogin;