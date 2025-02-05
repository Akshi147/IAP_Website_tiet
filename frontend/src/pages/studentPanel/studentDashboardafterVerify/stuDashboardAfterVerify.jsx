import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./stuDashboardAfterVerify.module.css";

const StudentDashboard = () => {
  const [formData, setFormData] = useState({
    mentorName: "",
    mentorEmail: "",
    trainingStartDate: "",
    stipendPerMonth: "",
    mentorContact: "",
    studentUpdatedNumber: "",
    trainingEndDate: "",
    country: "India",
    city: "",
    companyName: "",
    completeAddress: "",
    landmark: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:4000/students/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
  
        const { trainingStartDate, trainingEndDate, mentorContact, phoneNumber, mentorEmail, mentorName, stipend } = response.data.student;
        const { companyCountry, companyCity, companyName, completeAddress, landmark } = response.data.student.companyDetails || {};
  
        setFormData({
          mentorName: mentorName || "",
          mentorEmail: mentorEmail || "",
          trainingStartDate: trainingStartDate ? trainingStartDate.split("T")[0] : "",
          stipendPerMonth: stipend || "",
          mentorContact: mentorContact || "",
          studentUpdatedNumber: phoneNumber || "",
          trainingEndDate: trainingEndDate ? trainingEndDate.split("T")[0] : "",
          country: companyCountry || "India",
          city: companyCity || "",
          companyName: companyName || "",
          completeAddress: completeAddress || "",
          landmark: landmark || "",
        });
  
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setErrorMessage("Failed to load profile data. Please try again.");
      }
    };
  
    fetchProfile();
  }, []);  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSuccessMessage("");
    setErrorMessage("");
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(
        "http://localhost:4000/students/phase3",
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      console.log("Data submitted successfully:", response.data);
      setSuccessMessage("Your details have been updated successfully! 🎉");
      setErrorMessage("");
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorMessage(error.response?.data?.message || "Failed to update details. Please try again.");
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardWrapper}>
        <div className={styles.dashboardCard}>
          <div className={styles.dashboardHeader}>
            <h2 className={styles.dashboardTitle}>
              Stipend Information, Mentor Detail, Company Address
            </h2>
            {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
            {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
            <form onSubmit={handleSubmit}>
              <div className={styles.inputGrid}>
                <div className={styles.inputField}>
                  <label className={styles.inputLabel}>Mentor&apos;s Name</label>
                  <input type="text" name="mentorName" value={formData.mentorName} onChange={handleInputChange} className={styles.inputBox} required />
                </div>

                <div className={styles.inputField}>
                  <label className={styles.inputLabel}>Mentor&apos;s Email</label>
                  <input type="email" name="mentorEmail" value={formData.mentorEmail} onChange={handleInputChange} className={styles.inputBox} required />
                </div>

                <div className={styles.inputField}>
                  <label className={styles.inputLabel}>Mentor&apos;s Contact Number</label>
                  <input type="tel" name="mentorContact" value={formData.mentorContact} onChange={handleInputChange} className={styles.inputBox} required />
                </div>

                <div className={styles.inputField}>
                  <label className={styles.inputLabel}>Stipend (/Month)</label>
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>₹</span>
                    <input type="number" name="stipendPerMonth" value={formData.stipendPerMonth} onChange={handleInputChange} className={styles.inputBoxWithSymbol} required />
                  </div>
                </div>

                <div className={styles.inputField}>
                  <label className={styles.inputLabel}>Training Start Date</label>
                  <input type="date" name="trainingStartDate" value={formData.trainingStartDate} onChange={handleInputChange} className={styles.inputBox} required />
                </div>

                <div className={styles.inputField}>
                  <label className={styles.inputLabel}>Training End Date(Tentative)</label>
                  <input type="date" name="trainingEndDate" value={formData.trainingEndDate} onChange={handleInputChange} className={styles.inputBox} required />
                </div>

                <div className={styles.inputField}>
                  <label className={styles.inputLabel}>Student&apos;s Updated Number</label>
                  <div className={styles.inputWrapper}>
                    <span className={styles.countryCode}>+91</span>
                    <input type="tel" name="studentUpdatedNumber" value={formData.studentUpdatedNumber} onChange={handleInputChange} className={styles.inputBoxWithSymbol} required />
                  </div>
                </div>
              </div>

              <div className={styles.sectionDivider}>
                <h3 className={styles.sectionTitle}>Company/Organization Address</h3>
                <div className={styles.inputGrid}>
                  <div className={styles.inputField}>
                    <label className={styles.inputLabel}>Country</label>
                    <select name="country" value={formData.country} onChange={handleInputChange} className={styles.inputBox}>
                      <option value="India">India</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>

                  <div className={styles.inputField}>
                    <label className={styles.inputLabel}>City</label>
                    <input type="text" name="city" value={formData.city} onChange={handleInputChange} className={styles.inputBox} required />
                  </div>
                </div>
              </div>

              <button type="submit" className={styles.submitButton}>Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
