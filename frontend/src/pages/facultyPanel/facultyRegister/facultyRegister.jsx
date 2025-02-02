import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../../components/navbar/navbar";
import axios from "axios";
import styles from "./facultyRegister.module.css"; // Importing the CSS module

const FacultyRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    initial: "Mr",
    name: "",
    designation: "Professor",
    department: "",
    contactNo: "",
    email: "",
    password: ""
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/faculty/register", formData);
      if (response.status === 201) {
        const data = response.data;
        localStorage.setItem("faculty-token", data.token);
        navigate("/faculty");
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.formWrapper}>
          <div className={styles.textCenter}>
            <h1 className={styles.heading}>Faculty Registration</h1>
            <p className={styles.subText}>Join us by registering your details</p>
          </div>
          <div className={styles.formCard}>
            {errorMessage && (
              <div className={styles.errorMessage}>
                <p>{errorMessage}</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className={styles.form}>
              <select name="initial" value={formData.initial} onChange={handleChange} className={styles.inputField}>
                <option value="Mr">Mr</option>
                <option value="Mrs">Mrs</option>
                <option value="Ms">Ms</option>
                <option value="Dr">Dr</option>
              </select>

              <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className={styles.inputField} required />

              <select name="designation" value={formData.designation} onChange={handleChange} className={styles.inputField}>
                <option value="Professor">Professor</option>
                <option value="Associate Professor">Associate Professor</option>
                <option value="Assistant Professor">Assistant Professor</option>
                <option value="Lecturer">Lecturer</option>
              </select>

              <select name="department" value={formData.department} onChange={handleChange} className={styles.inputField}>
                <option value="">Choose one...</option>
                <option value="Computer Engineering">Computer Engineering</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Electronics & Communication Engineering">Electronics & Communication Engineering</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Biotechnology Engineering">Biotechnology Engineering</option>
                <option value="Electronic Instrumentation & Control Engineering">Electronic Instrumentation & Control Engineering</option>
                <option value="Mechatronics Engineering">Mechatronics Engineering</option>
                <option value="Mechanical Engineering (Production)">Mechanical Engineering (Production)</option>
                <option value="Master of Computer Applications">Master of Computer Applications</option>
                <option value="Software Engineering">Software Engineering</option>
              </select>

              <input type="text" name="contactNo" placeholder="Contact Number" value={formData.contactNo} onChange={handleChange} className={styles.inputField} required />

              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className={styles.inputField} required />

              <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className={styles.inputField} required />

              <button type="submit" className={styles.submitButton}>
                Register
              </button>
            </form>

            <div className={styles.footerText}>
              <Link to="/facultylogin" className={styles.linkText}>
                Already registered? Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FacultyRegister;
