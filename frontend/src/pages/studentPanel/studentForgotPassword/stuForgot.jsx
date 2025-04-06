import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../../components/navbar/navbar";
import styles from "./stuForgot.module.css";

const ForgotStudentPassword = () => {
  const [rollNo, setRollNo] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:4000/students/forgotpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollNo }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Password reset link sent to your registered email. Please check Spam Folder too.");
      } else {
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setError(err || "Server error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Student Password Reset</h1>
            <p className={styles.subtitle}>Enter your roll number to receive a reset link</p>
          </div>

          <div className={styles.card}>
            {message && (
              <div className={styles.success}>
                <p>{message}</p>
              </div>
            )}
            {error && (
              <div className={styles.error}>
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div>
                <input
                  type="text"
                  placeholder="Student Roll Number"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>

              <button
                type="submit"
                className={styles.button}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className={styles.spinner}></div>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>

            <div className={styles.linkContainer}>
              <Link to="/login" className={styles.link}>
                Back to Student Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotStudentPassword;