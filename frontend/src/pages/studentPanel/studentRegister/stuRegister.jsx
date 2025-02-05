import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../../components/navbar/navbar";
import Hero from "../../../components/hero/hero";
import styles from "./stuRegister.module.css"; // Importing the CSS module

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

  // Function to determine branch from roll number
  const getBranchFromRollNumber = (rollNumber) => {
    if (rollNumber.length == 9) {
      const branchCode = rollNumber.slice(4, 6); // Extract 5th and 6th digits

      const branchMap = {
        "Computer Engineering": ["03", "53", "83"],  
        "Computer Science And Engineering": ["16", "17", "66", "67", "96", "97"],  
        "Computer Science And Business System": ["18"],  
      };

      for (const [branch, codes] of Object.entries(branchMap)) {
        if (codes.includes(branchCode)) return branch;
      }

      return "ME Computer Science And Engineering"; // Default to ME CS if no match
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setFormData((prev) => {
      let updatedData = { ...prev, [name]: value };
  
      if (name === "rollNumber") {
        const branch = getBranchFromRollNumber(value);
        updatedData.branch = branch;
      }
  
      if (name === "semesterType" && value === "Alternate Semester") {
        updatedData.companyCity = "Patiala";
        updatedData.companyName = "Alternate Semester";
      } else if (name === "semesterType") {
        updatedData.companyCity = "";
        updatedData.companyName = "";
      }
  
      return updatedData;
    });
  };

  const generateSubgroupOptions = () => {
    if (formData.branch === "Computer Engineering") {
      return Array.from({ length: 35 }, (_, i) => `CO${i + 1}`);
    } else if (formData.branch === "Computer Science And Engineering") {
      return Array.from({ length: 15 }, (_, i) => `CS${i + 1}`);
    } else if (formData.branch === "Computer Science And Business System") {
      return Array.from({ length: 15 }, (_, i) => `BS${i + 1}`);
    }
    return [];
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
      console.error(error);
      setErrorMessage(error.response?.data?.error || "Registration failed.");
    }
  };

  return (
    <>
      <Navbar />
      <Hero />
      <div className={styles.container}>
        <div className={styles.formWrapper}>
          <div className={styles.heading}>
            <h1>Create New Account</h1>
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
                name="rollNumber"
                placeholder="Student's Roll Number"
                value={formData.rollNumber}
                onChange={handleChange}
                className={styles.input}
                required
              />

              <input
                type="text"
                name="branch"
                value={formData.branch}
                className={styles.input}
                readOnly
                placeholder="Branch"
                required
              />

              <select
                name="semesterType"
                value={formData.semesterType}
                onChange={handleChange}
                className={styles.input1}
                required
              >
                <option value="">Select Semester Type</option>
                <option value="Project Semester-Research">Project Semester-Research</option>
                <option value="Project Semester-Company">Project Semester-Company</option>
                <option value="Start-Up Semester">Start-Up Semester</option>
                <option value="Alternate Semester">Alternate Semester</option>
              </select>

              {formData.branch === "ME Computer Science And Engineering" ? (
                <input
                  type="text"
                  name="classSubgroup"
                  placeholder="Class Subgroup"
                  value={formData.classSubgroup}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
              ) : (
                <select
                  name="classSubgroup"
                  value={formData.classSubgroup}
                  onChange={handleChange}
                  className={styles.input1}
                  required
                >
                  <option value="">Select Class Subgroup</option>
                  {generateSubgroupOptions().map((subgroup) => (
                    <option key={subgroup} value={subgroup}>
                      {subgroup}
                    </option>
                  ))}
                </select>
              )}

              <select
                name="trainingArrangedBy"
                value={formData.trainingArrangedBy}
                onChange={handleChange}
                className={styles.input1}
                required
              >
                <option value="">Training Arranged By</option>
                <option value="tiet">TIET(on-campus)</option>
                <option value="offcampus">Off-Campus</option>
              </select>

              <input
                type="text"
                name="studentName"
                placeholder="Student Name"
                value={formData.studentName}
                onChange={handleChange}
                className={styles.input}
                required
              />

              <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={styles.input}
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className={styles.input}
                required
              />

              <input
                type="text"
                name="companyName"
                placeholder="Company Name"
                value={formData.companyName}
                onChange={handleChange}
                className={styles.input}
                readOnly={formData.semesterType === "Alternate Semester"}
                required
              />

              <input
                type="text"
                name="companyCity"
                placeholder="Company City"
                value={formData.companyCity}
                onChange={handleChange}
                className={styles.input}
                readOnly={formData.semesterType === "Alternate Semester"}
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={styles.input}
                required
              />

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={styles.input}
                required
              />

              <button type="submit" className={styles.submitButton}>
                Register
              </button>
            </form>

            <div className={styles.links}>
              <Link to="/login">Login</Link>
              <span className={styles.separator}> | </span>
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentRegisterForm;