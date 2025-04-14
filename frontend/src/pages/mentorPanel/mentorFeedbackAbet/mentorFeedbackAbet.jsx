import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./mentorFeedbackAbet.module.css";
import Navbar from "../../../components/navbar/navbar";
import { useNavigate, useParams } from "react-router-dom";

const MentorFeedbackABET = () => {
  const navigate = useNavigate();
  const { id: mentorId } = useParams();
  const token = localStorage.getItem("mentor-token");

  const [questions, setQuestions] = useState([]);
  const [levels, setLevels] = useState({});
  const [suggestedCourse, setSuggestedCourse] = useState("");
  const [overallSatisfaction, setOverallSatisfaction] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbetForm = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/mentors/getAbetForm/${mentorId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const fetchedQuestions = res.data.questions || [];
        setQuestions(fetchedQuestions);

        const preFilledLevels = {};
        fetchedQuestions.forEach((q) => {
          if (q.selectedValue) preFilledLevels[q._id] = q.selectedValue;
        });

        setLevels(preFilledLevels);
        setSuggestedCourse(res.data.suggestedCourse || "");
        setOverallSatisfaction(res.data.overallSatisfaction || "");
        setLoading(false);
      } catch (err) {
        console.error("Error fetching ABET form:", err);
        setLoading(false);
      }
    };

    if (mentorId && token) fetchAbetForm();
  }, [mentorId, token]);

  const handleLevelChange = (questionId, value) => {
    setLevels((prev) => ({
      ...prev,
      [questionId]: parseInt(value),
    }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        levels,
        suggestedCourse,
        overallSatisfaction,
      };

      await axios.post(`http://localhost:4000/mentors/submitAbetForm/${mentorId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("ABET Feedback submitted successfully!");
    } catch (err) {
      console.error("Error submitting ABET feedback", err);
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
        <h2 className={styles.heading}>ABET Feedback Form</h2>

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
                  className={styles.select}
                  value={levels[q._id] || ""}
                  onChange={(e) => handleLevelChange(q._id, e.target.value)}
                >
                  <option value="">Select Level</option>
                  {[1, 2, 3, 4, 5].map((val) => (
                    <option key={val} value={val}>
                      {val}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            <div className={styles.extraField}>
              <label className={styles.label}>Suggested Course:</label>
              <input
                type="text"
                className={styles.input}
                value={suggestedCourse}
                onChange={(e) => setSuggestedCourse(e.target.value)}
              />
            </div>

            <div className={styles.extraField}>
              <label className={styles.label}>Overall Satisfaction:</label>
              <select
                className={styles.select}
                value={overallSatisfaction}
                onChange={(e) => setOverallSatisfaction(e.target.value)}
              >
                <option value="">Select</option>
                <option>Excellent</option>
                <option>Good</option>
                <option>Average</option>
                <option>Poor</option>
              </select>
            </div>

            <button type="button" className={styles.submitButton} onClick={handleSubmit}>
              Submit Feedback
            </button>
          </form>
        )}
      </div>
    </>
  );
};

export default MentorFeedbackABET;