import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../../../components/navbar/navbar";
import Hero from "../../../components/hero/hero";
import styles from "./mentorRegister.module.css"; 

const MentorRegister = () => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await axios.post("http://localhost:4000/mentors/register", { email });

      if (response.status === 201) {
        setSuccessMessage("A verification email has been sent. Please check your inbox.");
      }
    } catch (error) {
      if (error.response?.status === 400) {
        setErrorMessage(error.response.data.message);
      } else if (error.response?.status === 404) {
        setErrorMessage("Mentor email not found in student records. Make sure a student has assigned your email.");
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
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
            <p>Enter your email to receive a verification link</p>
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
                type="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                required
              />

              <button type="submit" className={styles.submitButton}>
                Send Verification Email
              </button>
            </form>

            <div className={styles.links}>
              <Link to="/mentors/login">Already registered? Login here</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MentorRegister;