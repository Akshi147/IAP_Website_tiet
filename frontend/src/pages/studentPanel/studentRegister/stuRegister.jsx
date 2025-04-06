import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Navbar from "../../../components/navbar/navbar";
import styles from "./stuRegister.module.css";

const StudentRegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    rollNumber: "",
    branch: "",
    semesterType: "",
    classSubgroup: "",
    trainingArrangedBy: "",
    studentName: "",
    phoneNumber: "",
    email: "",
    companyName: "",
    companyCity: "",
    password: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getBranchFromRollNumber = (rollNumber) => {
    if (rollNumber.length === 9) {
      const branchCode = rollNumber.slice(4, 6);
      const branchMap = {
        "Computer Engineering": ["03", "53", "83"],
        "Computer Science And Engineering": ["16", "17", "66", "67", "96", "97"],
        "Computer Science And Business System": ["18"],
      };

      for (const [branch, codes] of Object.entries(branchMap)) {
        if (codes.includes(branchCode)) return branch;
      }
      return "ME Computer Science And Engineering";
    }
    return "";
  };

  const generateSubgroupOptions = () => {
    const branch = formData.branch;
    const subgroups = {
      "Computer Engineering": Array.from({ length: 35 }, (_, i) => `CO${i + 1}`),
      "Computer Science And Engineering": Array.from({ length: 15 }, (_, i) => `CS${i + 1}`),
      "Computer Science And Business System": Array.from({ length: 15 }, (_, i) => `BS${i + 1}`),
    };
    return subgroups[branch] || [];
  };

  const validateForm = () => {
    if (!/^\d{10}$/.test(formData.phoneNumber)) {
      return "Invalid phone number format (10 digits required)";
    }
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      return "Invalid email address format";
    }
    if (!/^\d{9}$/.test(formData.rollNumber)) {
      return "Invalid roll number format (9 digits required)";
    }
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "rollNumber") {
        updated.branch = getBranchFromRollNumber(value);
      }

      if (name === "semesterType") {
        updated.companyCity = value === "Alternate Semester" ? "Patiala" : "";
        updated.companyName = value === "Alternate Semester" ? "Alternate Semester" : "";
      }

      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage(successMessage);
    setIsLoading(true);

    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:4000/students/register", {
        email: formData.email,
        name: formData.studentName,
        phoneNumber: formData.phoneNumber,
        rollNo: formData.rollNumber,
        semesterType: formData.semesterType,
        classSubgroup: formData.classSubgroup,
        password: formData.password,
        branch: formData.branch,
        trainingArrangedBy: formData.trainingArrangedBy,
        companyName: formData.companyName,
        companyCity: formData.companyCity,
      });

      if (response.status === 201) {
        localStorage.setItem("token", response.data.token);
        navigate("/student");
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.error || error.message || "Registration failed. Please try again later.";
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.pageWrapper}>
        <div className={styles.formContainer}>
          <div className={styles.heading}>
            <h1>Create New Account</h1>
            <p>Please fill in your details to register</p>
          </div>

          <div className={styles.formCard}>
            {errorMessage && <div className={styles.errorBox}>{errorMessage}</div>}

            <form onSubmit={handleSubmit} className={styles.formGrid}>
              {/* Input Fields */}
              <input name="rollNumber" placeholder="Student's Roll Number" value={formData.rollNumber} onChange={handleChange} className={styles.input} required />
              <input name="branch" value={formData.branch} className={`${styles.input} ${styles.readOnly}`} readOnly placeholder="Branch" required />

              <select name="semesterType" value={formData.semesterType} onChange={handleChange} className={styles.input} required>
                <option value="">Select Semester Type</option>
                <option value="Project Semester-Research">Project Semester-Research</option>
                <option value="Project Semester-Company">Project Semester-Company</option>
                <option value="Start-Up Semester">Start-Up Semester</option>
                <option value="Alternate Semester">Alternate Semester</option>
              </select>

              {formData.branch === "ME Computer Science And Engineering" ? (
                <input name="classSubgroup" placeholder="Class Subgroup" value={formData.classSubgroup} onChange={handleChange} className={styles.input} required />
              ) : (
                <select name="classSubgroup" value={formData.classSubgroup} onChange={handleChange} className={styles.input} required>
                  <option value="">Select Class Subgroup</option>
                  {generateSubgroupOptions().map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              )}

              <select name="trainingArrangedBy" value={formData.trainingArrangedBy} onChange={handleChange} className={styles.input} required>
                <option value="">Training Arranged By</option>
                <option value="college">College</option>
                <option value="self">Self</option>
              </select>

              <input name="studentName" placeholder="Student Name" value={formData.studentName} onChange={handleChange} className={styles.input} required />
              <input name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} className={styles.input} required />
              <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} className={styles.input} required />
              <input name="companyName" placeholder="Company Name" value={formData.companyName} onChange={handleChange} className={styles.input} required />
              <input name="companyCity" placeholder="Company City" value={formData.companyCity} onChange={handleChange} className={styles.input} required />

              {/* Password Field */}
              <div className={styles.passwordWrapper}>
                <input type={passwordVisible ? "text" : "password"} name="password" placeholder="Password" value={formData.password} onChange={handleChange} className={styles.input} required />
                <button type="button" className={styles.eyeIcon} onClick={() => setPasswordVisible(!passwordVisible)}>
                  {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <div className={styles.passwordWrapper}>
                <input type={confirmPasswordVisible ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} className={styles.input} required />
                <button type="button" className={styles.eyeIcon} onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
                  {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </form>

            <button type="submit" disabled={isLoading} onClick={handleSubmit} className={`${styles.submitBtn} ${isLoading ? styles.disabled : ""}`}>
              {isLoading ? (
                <div className={styles.spinnerWrapper}>
                  <div className={styles.spinner}></div>
                  Processing...
                </div>
              ) : (
                "Register"
              )}
            </button>

            <div className={styles.loginLink}>
              <Link to="/login">Login</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentRegisterForm;
