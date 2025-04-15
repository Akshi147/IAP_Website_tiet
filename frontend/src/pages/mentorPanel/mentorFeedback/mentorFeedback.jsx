import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../../components/navbar/navbar";
import { useNavigate } from "react-router-dom";
import styles from "./mentorFeedback.module.css";

const MentorFeedbackForm = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [levels, setLevels] = useState({});
  const token = localStorage.getItem("mentor-token");

  // Decode the JWT token to get the mentorId (stored as _id in the token)
  const mentorId = token ? JSON.parse(atob(token.split('.')[1]))._id : null;

  // Fetch the feedback form questions when the component mounts
  useEffect(() => {
    const fetchFeedbackForm = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/mentors/getFeedbackForm/${mentorId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data && response.data.questions) {
          setQuestions(response.data.questions);
        }
      } catch (error) {
        console.error("Error fetching feedback form:", error);
      }
    };

    if (mentorId) {
      fetchFeedbackForm();
    } else {
      console.error("No mentor ID found in token.");
    }
  }, [mentorId, token]);

  // Handle change in feedback responses
  const handleResponseChange = (questionId, value) => {
    setLevels((prevLevels) => ({
      ...prevLevels,
      [questionId]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        `http://localhost:4000/mentors/submitFeedbackForm/${mentorId}`,
        {
          levels,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        alert("Feedback submitted successfully!");
        navigate("/mentors/feedback"); // Navigate to the feedback page after submission
      } else {
        alert("Error submitting feedback.");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Error submitting feedback.");
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
        <form onSubmit={handleSubmit} className={styles.form}>
          {questions.length > 0 ? (
            questions.map((question) => (
              <div key={question._id} className={styles.inputGroup}>
                <label>{question.text}</label>
                <select
                  value={levels[question._id] || ""}
                  onChange={(e) => handleResponseChange(question._id, e.target.value)}
                  className={styles.input}
                >
                  <option value="">Choose a level...</option>
                  {[1, 2, 3, 4, 5].map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
            ))
          ) : (
            <div>Loading feedback questions...</div>
          )}

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.button}>
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default MentorFeedbackForm;