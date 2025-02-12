import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import styles from "./mentorDetailForm.module.css";
import Navbar from "../../../components/navbar/navbar";

const MentorDetailForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!token) {
      setIsExpired(true);
      return;
    }

    const checkTokenValidity = async () => {
      try {
        await axios.get(`http://localhost:4000/mentors/checkToken/${token}`);
      } catch (error) {
        setIsExpired(true);
        setErrorMessage(error || "Failed to verify token.");
      }
    };

    checkTokenValidity();
  }, [token]);

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
      await axios.post(`http://localhost:4000/mentors/setPassword/${token}`, {
        name: formData.name,
        designation: formData.designation,
        phone: formData.phone,
        password: formData.password,
      });

      setSuccessMessage("Registration successful!");
      setTimeout(() => navigate("/mentors/getAssignedStudents"), 2000);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Failed to set password.");
    }
  };

  if (isExpired) {
    return (
      <>
      <Navbar
      navItems={[
        {name:"Grade Students",path:"/mentors/gradeStudents"},
        {name:"Change Password",path:"/mentors/changepassword"}
      ]}
      downloadButton={{
        text: "Log Out",
        onClick: () => navigate("/mentors/logout"),
      }}
      />
      <div className={styles.expiredContainer}>
        <h2>Link Expired</h2>
        <p>Your registration link has expired. Please request a new one.</p>
      </div>
      </>
    );
  }

  return (
    <>
    <Navbar />
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1>Complete Your Registration</h1>
        <p>Fill in the details to set up your account</p>

        {errorMessage && <div className={`${styles.alert} ${styles.error}`}>{errorMessage}</div>}
        {successMessage && <div className={`${styles.alert} ${styles.success}`}>{successMessage}</div>}

        <form onSubmit={handleSubmit} className={styles.formGrid}>
          <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
          <input type="text" name="designation" placeholder="Designation" value={formData.designation} onChange={handleChange} required />
          <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />

          <div className={styles.passwordWrapper}>
            <input type={passwordVisible ? "text" : "password"} name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
            <span className={styles.eyeIcon} onClick={() => setPasswordVisible(!passwordVisible)}>
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className={styles.passwordWrapper}>
            <input type={confirmPasswordVisible ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
            <span className={styles.eyeIcon} onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
              {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button type="submit" className={styles.submitButton}>Register</button>
        </form>
      </div>
    </div>
    </>
  );
};

export default MentorDetailForm;