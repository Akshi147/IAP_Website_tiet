import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./stuDashboardAfterVerify.module.css";

const StudentMentorDetailForm = () => {
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:4000/students/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const { trainingStartDate, trainingEndDate, mentorContact, phoneNumber, mentorEmail, mentorName, stipend, phase3verified } = response.data.student;
        const { companyCountry, companyCity, companyName, completeAddress, landmark } = response.data.student.companyDetails;

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

        setIsPhase3Locked(phase3verified);
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

  const validateTrainingDuration = () => {
    const { trainingStartDate, trainingEndDate } = formData;
    if (trainingStartDate && trainingEndDate) {
      const startDate = new Date(trainingStartDate);
      const endDate = new Date(trainingEndDate);
      const durationInDays = (endDate - startDate) / (1000 * 60 * 60 * 24);

      if (durationInDays < 135) {
        setErrorMessage("Training duration must be at least 4.5 months (135 days).");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateTrainingDuration()) return;

    if (!showConfirmation) {
      setShowConfirmation(true);
      return;
    }

    setIsSubmitting(true); // Prevent further submissions

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
      setShowConfirmation(false); // Remove confirmation after submission
    } catch (error) {
      console.error("Error submitting form:", error);
      if (error.response) {
        setErrorMessage(error.response.data.message || "Failed to update details. Please try again.");
      } else {
        setErrorMessage("Network error. Please check your internet connection.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className={styles.dashboardContainer}>
        <div className={styles.dashboardWrapper}>
          <div className={styles.dashboardCard}>
            <div className={styles.dashboardHeader}>
              <h2 className={styles.dashboardTitle}>
                Stipend Information, Mentor Detail, Company Address
              </h2>
              {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
              {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}

              <form onSubmit={handleSubmit} className={styles.formContainer}>
                <div className={styles.inputGrid}>
                  {[
                    { label: "Mentor's Name", name: "mentorName", type: "text" },
                    { label: "Mentor's Email", name: "mentorEmail", type: "email" },
                    { label: "Mentor's Contact", name: "mentorContact", type: "tel" },
                    { label: "Stipend (/Month)", name: "stipendPerMonth", type: "number" },
                    { label: "Training Start Date", name: "trainingStartDate", type: "date" },
                    { label: "Training End Date", name: "trainingEndDate", type: "date" },
                    { label: "Student's Updated Number", name: "studentUpdatedNumber", type: "tel" },
                    { label: "City", name: "city", type: "text" },
                    { label: "Company Name", name: "companyName", type: "text" },
                    { label: "Complete Address", name: "completeAddress", type: "textarea" },
                    { label: "Landmark", name: "landmark", type: "text" },
                  ].map((field, index) => (
                    <div className={styles.inputField} key={index}>
                      <label className={styles.inputLabel}>{field.label}</label>
                      <input type={field.type} name={field.name} value={formData[field.name]} onChange={handleInputChange} disabled={isPhase3Locked} className={styles.inputBox} required />
                    </div>
                  ))}
                </div>

                <div className={styles.buttonContainer}>
                  <button onClick={handleSubmit} className={styles.confirmButton} disabled={isSubmitting}>
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentMentorDetailForm;