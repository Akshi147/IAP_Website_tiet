import { useState } from "react";
import styles from "./adminChangePassword.module.css";
import Navbar from "../../../components/navbar/navbar";

const ChangeAdminPassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPasswords(!showPasswords);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("admin-token");
      const response = await fetch("http://localhost:4000/admin/changepassword", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Password changed successfully.");
      } else {
        setError(data.error || "Something went wrong. Please try again.");
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
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h1 className={styles.title}>Change Admin Password</h1>
          <p className={styles.subtitle}>Enter your current and new password</p>
        </div>

        <div className={styles.formContainer}>
          {message && (
            <div className={`${styles.alert} ${styles.success}`}>
              <p>{message}</p>
            </div>
          )}
          {error && (
            <div className={`${styles.alert} ${styles.error}`}>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputWrapper}>
              <input
                type={showPasswords ? "text" : "password"}
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.inputWrapper}>
              <input
                type={showPasswords ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.inputWrapper}>
              <input
                type={showPasswords ? "text" : "password"}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={styles.input}
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className={styles.toggleButton}
              >
                {showPasswords ? "👁️" : "🙈"}
              </button>
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className={styles.loader}></div>
              ) : (
                "Change Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
    </>
  );
};

export default ChangeAdminPassword;