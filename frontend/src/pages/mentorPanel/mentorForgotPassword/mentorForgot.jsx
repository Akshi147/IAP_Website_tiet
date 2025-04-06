import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./MmntorForgot.module.css";

const MentorForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:4000/mentors/forgotpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Password reset link sent to your email.");
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
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.heading}>
          <h1 className={styles.title}>Mentor Password Reset</h1>
          <p className={styles.subtitle}>Enter your email to receive a reset link</p>
        </div>

        <div className={styles.formCard}>
          {message && (
            <div className={styles.successMessage}>
              <p>{message}</p>
            </div>
          )}
          {error && (
            <div className={styles.errorMessage}>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div>
              <input
                type="email"
                placeholder="Mentor Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                required
              />
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className={styles.spinner}></div>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>

          <div className={styles.backLink}>
            <Link to="/mentor">Back to Mentor Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorForgotPassword;