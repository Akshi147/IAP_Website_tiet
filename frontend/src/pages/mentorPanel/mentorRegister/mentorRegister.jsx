import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Navbar from "../../../components/navbar/navbar";
import Hero from "../../../components/hero/hero";
import styles from "./mentorRegister.module.css"; // Importing the CSS module

const MentorRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

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
    setSuccessMessage("");

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:4000/mentors/register", {
        email: formData.email,
        name: formData.name,
        password: formData.password,
      });

      if (response.status === 201) {
        setSuccessMessage("Registration successful! Check your email to verify.");
        navigate("/mentors/login");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(error.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <>
      <Navbar />
      <Hero />
      <div className={styles.container}>
        <div className={styles.formWrapper}>
          <div className={styles.heading}>
            <h1>Mentor Registration</h1>
            <p>Please fill in your details to register</p>
          </div>

          <div className={styles.formContainer}>
            {errorMessage && (
              <div className={`${styles.alert} ${styles.error}`}>
                <p>{errorMessage}</p>
              </div>
            )}
            {successMessage && (
              <div className={`${styles.alert} ${styles.success}`}>
                <p>{successMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.formGrid}>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className={styles.input}
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email (must be @thapar.edu)"
                value={formData.email}
                onChange={handleChange}
                className={styles.input}
                required
              />

              <div className={styles.passwordWrapper}>
                <input
                  type={passwordVisible ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
                <span className={styles.eyeIcon} onClick={() => setPasswordVisible(!passwordVisible)}>
                  {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <div className={styles.passwordWrapper}>
                <input
                  type={confirmPasswordVisible ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
                <span className={styles.eyeIcon} onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
                  {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <button type="submit" className={styles.submitButton}>
                Register
              </button>
            </form>

            <div className={styles.links}>
              <Link to="/mentors/login">Already have an account? Login</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MentorRegister;