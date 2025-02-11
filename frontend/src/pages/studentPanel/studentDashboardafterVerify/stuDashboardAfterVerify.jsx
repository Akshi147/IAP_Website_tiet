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
  const [isPhase3Locked, setIsPhase3Locked] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:4000/students/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const { trainingStartDate, trainingEndDate, mentorContact, phoneNumber, mentorEmail, mentorName, stipend, phase3 } = response.data.student;
        const { companyCountry, companyCity, companyName, completeAddress, landmark } = response.data.student.companyDetails;

        setFormData({
          mentorName,
          mentorEmail,
          trainingStartDate: trainingStartDate.split("T")[0],
          stipendPerMonth: stipend,
          mentorContact,
          studentUpdatedNumber: phoneNumber,
          trainingEndDate: trainingEndDate.split("T")[0],
          country: companyCountry || "India",
          city: companyCity,
          companyName,
          completeAddress,
          landmark,
        });

        setIsPhase3Locked(phase3);
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

    if (!showConfirmation) {
      setShowConfirmation(true);
      return; // ✅ Show confirmation warning first
    }
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
      if (error.response) {
        setErrorMessage(error.response.data.message || "Failed to update details. Please try again.");
      } else {
        setErrorMessage("Network error. Please check your internet connection.");
      }
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
            {errorMessage && (
              <div className={styles.errorMessage}>{errorMessage}</div>
            )}

            {showConfirmation && (
              <div className={styles.warningMessage}>
                ⚠️ Please recheck your details! This is the final time you can edit.
                <div className={styles.divv}>
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className={styles.cancelButton}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className={styles.confirmButton}
                  >
                    Confirm & Submit
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.formContainer}>
              <div className={styles.inputGrid}>
                <div className={styles.inputField}>
                  <label className={styles.inputLabel}>Mentor&apos;s Name</label>
                  <input type="text" name="mentorName" value={formData.mentorName} onChange={handleInputChange} disabled={isPhase3Locked} className={styles.inputBox} required />
                </div>

                <div className={styles.inputField}>
                  <label className={styles.inputLabel}>Mentor&apos;s Email</label>
                  <input type="email" name="mentorEmail" value={formData.mentorEmail} onChange={handleInputChange} disabled={isPhase3Locked} className={styles.inputBox} required />
                </div>

                <div className={styles.inputField}>
                  <label className={styles.inputLabel}>Mentor&apos;s Contact Number</label>
                  <input type="tel" name="mentorContact" value={formData.mentorContact} onChange={handleInputChange} disabled={isPhase3Locked} className={styles.inputBox} required />
                </div>

                <div className={styles.inputField}>
                  <label className={styles.inputLabel}>Stipend (/Month)</label>
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>₹</span>
                    <input type="number" name="stipendPerMonth" value={formData.stipendPerMonth} onChange={handleInputChange} disabled={isPhase3Locked} className={styles.inputBoxWithSymbol} required />
                  </div>
                </div>

                <div className={styles.inputField}>
                  <label className={styles.inputLabel}>Training Start Date</label>
                  <input type="date" name="trainingStartDate" value={formData.trainingStartDate} onChange={handleInputChange} disabled={isPhase3Locked} className={styles.inputBox} required />
                </div>

                <div className={styles.inputField}>
                  <label className={styles.inputLabel}>Training End Date(Tentative)</label>
                  <input type="date" name="trainingEndDate" value={formData.trainingEndDate} onChange={handleInputChange} disabled={isPhase3Locked} className={styles.inputBox} required />
                </div>

                <div className={styles.inputField}>
                  <label className={styles.inputLabel}>Student&apos;s Updated Number</label>
                  <div className={styles.inputWrapper}>
                    <span className={styles.countryCode}>+91</span>
                    <input type="tel" name="studentUpdatedNumber" value={formData.studentUpdatedNumber} onChange={handleInputChange} disabled={isPhase3Locked} className={styles.inputBoxWithSymbol} required />
                  </div>
                </div>
              </div>

              <div className={styles.sectionDivider}>
                <h3 className={styles.sectionTitle}>Company/Organization Address</h3>
                <div className={styles.inputGrid}>
                  <div className={styles.inputField}>
                    <label className={styles.inputLabel}>Country</label>
                    <select name="country" value={formData.country} onChange={handleInputChange} disabled={isPhase3Locked} className={styles.inputBox}>
                      <option value="India">India</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>

                  <div className={styles.inputField}>
                    <label className={styles.inputLabel}>City</label>
                    <input type="text" name="city" value={formData.city} onChange={handleInputChange} disabled={isPhase3Locked} className={styles.inputBox} required />
                  </div>
                  <div className={styles.inputField}>
                    <label className={styles.inputLabel}>Company Name</label>
                    <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} disabled={isPhase3Locked} className={styles.inputBox} required />
                  </div>
                  <div className={styles.inputField}>
                    <label className={styles.inputLabel}>Complete Address</label>
                    <textarea name="completeAddress" value={formData.completeAddress} onChange={handleInputChange} disabled={isPhase3Locked} rows="3" className={styles.inputBox} required />
                  </div>
                  <div className={styles.inputField}>
                    <label className={styles.inputLabel}>Landmark</label>
                    <input type="text" name="landmark" value={formData.landmark} onChange={handleInputChange} disabled={isPhase3Locked} className={styles.inputBox} required />
                  </div>
                </div>
              </div>

              <div className={styles.buttonContainer}>
                <button type="submit" disabled={isPhase3Locked} className={`${styles.button} ${isPhase3Locked ? styles.disabled : styles.active}`}>
                  Update
                </button>
              </div>

              {isPhase3Locked && (
                <div className={styles.lockedMessage}>
                  🚫 You can no longer edit this form because it is locked.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;