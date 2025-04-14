import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../../components/navbar/navbar";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./mentorFeedback.module.css";

const MentorFeedback = () => {
  const navigate = useNavigate();
  const { id: mentorId } = useParams();
  const token = localStorage.getItem("mentor-token");
  const [questions, setQuestions] = useState([]);
  const [levels, setLevels] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/mentors/getFeedbackForm/${mentorId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const q = res.data.questions || [];
        setQuestions(q);
        const preFilled = {};
        q.forEach((q) => {
          if (q.selectedValue) preFilled[q._id] = q.selectedValue;
        });
        setLevels(preFilled);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch feedback form", err);
        setLoading(false);
      }
    };

    if (mentorId && token) fetchForm();
  }, [mentorId, token]);

  const handleChange = (questionId, value) => {
    setLevels((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post(
        `http://localhost:4000/mentors/submitFeedbackForm/${mentorId}`,
        { levels },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Feedback submitted successfully!");
    } catch (err) {
      console.error("Error submitting feedback", err);
      alert("Something went wrong.");
    }
  };

  return (
    <>
      <Navbar
        navItems={[
          { name: "Students Doing Project Under You", path: "/mentors/getAssignedStudents" },
          { name: "Feedback", path: "/mentors/feedback" },
          { name: "Feedback (for ABET)", path: "/mentors/feedback-abet" },
          { name: "Change Password", path: "/reset-mentorpassword" },
        ]}
        downloadButton={{
          text: "Log Out",
          onClick: () => navigate("/mentors/logout"),
        }}
      />
      <div className={styles.container}>
        <h2 className={styles.heading}>Mentor Feedback Form</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <form className={styles.form}>
            {questions.map((q, index) => (
              <div key={q._id} className={styles.questionBlock}>
                <label className={styles.label}>
                  {index + 1}. {q.text}
                </label>
                <select
                  value={levels[q._id] || ""}
                  onChange={(e) => handleChange(q._id, e.target.value)}
                  className={styles.select}
                >
                  <option value="">Select Level</option>
                  <option value="1">Low</option>
                  <option value="2">Moderate</option>
                  <option value="3">High</option>
                </select>
              </div>
            ))}
            <button type="button" onClick={handleSubmit} className={styles.submitButton}>
              Submit Feedback
            </button>
          </form>
        )}
      </div>
    </>
  );
};

export default MentorFeedback;