import styles from './student.module.css';
import Hero from '../../components/hero/hero';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Student = () => {
    const [rollNumber, setRollNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:4000/students/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollNumber, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      localStorage.setItem("token", data.token);
      navigate("/dashboard"); // Redirect to student dashboard
    } catch (err) {
      setError(err.message);
    }
  };
    return (
        <>
            <Hero />
            <div className={styles.loginContainer}>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <h2 className={styles.title}>IAP Student Login</h2>
        {error && <p className={styles.error}>{error}</p>}

        <label className={styles.label}>Roll Number</label>
        <input
          type="text"
          value={rollNumber}
          onChange={(e) => setRollNumber(e.target.value)}
          className={styles.input}
          required
        />

        <label className={styles.label}>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
          required
        />

        <button type="submit" className={styles.button}>Submit</button>

        <div className={styles.links}>
          <p onClick={() => navigate("/student/register")} className={styles.link}>Register With Us</p>
          <span>|</span>
          <p onClick={() => navigate("/student/forgot-password")} className={styles.link}>Forget Password</p>
        </div>
      </form>
    </div>
        </>
    );
} 

export default Student;
