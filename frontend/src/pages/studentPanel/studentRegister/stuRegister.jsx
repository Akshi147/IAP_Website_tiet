import  { useState } from "react";
import axios from "axios";
import styles from "./stuRegister.module.css"; // Import module CSS
import { useNavigate } from "react-router-dom";
import Hero from "../../../components/hero/hero";

const StudentRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    rollNo: "",
    semesterType: "",
    classSubgroup: "",
    branch: "",
    trainingArrangedBy: "",
    companyName: "",
    companyCity: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post("http://localhost:4000/students/register", formData);
      alert("Registration successful! Please check your email for verification.");
      navigate("/login"); // Redirect to login page
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
        <Hero />
    <div className={styles.registerContainer}>
      <h2 className={styles.title}>Register as Student</h2>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className={styles.formGroup}>
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>

        <div className={styles.formGroup}>
          <label>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>

        <div className={styles.formGroup}>
          <label>Phone Number</label>
          <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
        </div>

        <div className={styles.formGroup}>
          <label>Roll No</label>
          <input type="text" name="rollNo" value={formData.rollNo} onChange={handleChange} required />
        </div>

        <div className={styles.formGroup}>
          <label>Semester Type</label>
          <select name="semesterType" value={formData.semesterType} onChange={handleChange} required>
            <option value="">Select Semester</option>
            <option value="Even">Even</option>
            <option value="Odd">Odd</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Class Subgroup</label>
          <input type="text" name="classSubgroup" value={formData.classSubgroup} onChange={handleChange} required />
        </div>

        <div className={styles.formGroup}>
          <label>Branch</label>
          <input type="text" name="branch" value={formData.branch} onChange={handleChange} required />
        </div>

        <div className={styles.formGroup}>
          <label>Training Arranged By</label>
          <select name="trainingArrangedBy" value={formData.trainingArrangedBy} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Self">Self</option>
            <option value="University">University</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Company Name</label>
          <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required />
        </div>

        <div className={styles.formGroup}>
          <label>Company City</label>
          <input type="text" name="companyCity" value={formData.companyCity} onChange={handleChange} required />
        </div>

        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
    </>
  );
};

export default StudentRegister;
