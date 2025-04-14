import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../../components/navbar/navbar";
import { useState, useEffect } from "react";
import styles from "./stuFeedback.module.css";
import axios from "axios";

const StudentFeedback = () => {
  const navigate = useNavigate();
  const { studentId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [collabContact, setCollabContact] = useState({
    name: "",
    designation: "",
    email: "",
    phone: "",
  });
  const [collabQuestionId, setCollabQuestionId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbackForm = async () => {
      try {
        const res = await axios.get(`/students/getFeedbackForm/${studentId}`);
        const fetchedQuestions = res.data?.questions;

        if (!Array.isArray(fetchedQuestions)) {
          console.error("Invalid questions format");
          setQuestions([]);
          setLoading(false);
          return;
        }

        setQuestions(fetchedQuestions);
        const initialAnswers = {};

        fetchedQuestions.forEach((q) => {
          if (typeof q.answer === "object" && q.answer !== null) {
            setCollabContact(q.answer);
            setCollabQuestionId(q._id);
          } else {
            initialAnswers[q._id] = q.answer || "";
          }
        });

        setAnswers(initialAnswers);
      } catch (error) {
        console.error("Failed to fetch feedback form", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbackForm();
  }, [studentId]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleCollabChange = (field, value) => {
    setCollabContact((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        answers,
      };

      if (collabQuestionId) {
        payload.collabContact = {
          question: collabQuestionId,
          answer: collabContact,
        };
      }

      await axios.post(`/students/submitFeedbackForm/${studentId}`, payload);
      alert("Feedback submitted successfully!");
    } catch (error) {
      console.error("Submission failed", error);
      alert("Failed to submit feedback.");
    }
  };

  return (
    <>
      <Navbar
        navItems={[
          { name: "Dashboard", path: "/dashboard" },
          { name: "Phase 2", path: "/student" },
          { name: "Faculty Assigned", path: "faculty-assigned" },
          { name: "Upload Report and PPT", path: "/getFileUploadInfo" },
          { name: "Stu Input Form", path: "/student-input" },
          { name: "Evaluation Schedule", path: "/evaluation-schedule" },
          { name: "Feedback", path: "/feedback" },
          { name: "Fortinightly Reflection", path: "/fortnightly" },
          { name: "Feedback(ABET)", path: "/abet-feedback" },
          { name: "Future Plans", path: "/future-plans" },
          { name: "Overall progress", path: "/overall-progress" },
          { name: "Change Password", path: "/reset-password" },
        ]}
        downloadButton={{
          text: "Log Out",
          onClick: () => navigate("/student/logout"),
        }}
      />

      <div className={styles.container}>
        <h1 className={styles.heading}>Student Feedback Form</h1>

        {loading ? (
          <p>Loading feedback form...</p>
        ) : questions.length === 0 ? (
          <p>No questions found or feedback already submitted.</p>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            {questions.map((q, index) =>
              typeof q.answer === "object" ? (
                <div className={styles.collabSection} key={q._id}>
                  <h3>{q.text}</h3>
                  <input
                    type="text"
                    placeholder="Name"
                    value={collabContact.name}
                    onChange={(e) =>
                      handleCollabChange("name", e.target.value)
                    }
                    className={styles.input}
                  />
                  <input
                    type="text"
                    placeholder="Designation"
                    value={collabContact.designation}
                    onChange={(e) =>
                      handleCollabChange("designation", e.target.value)
                    }
                    className={styles.input}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={collabContact.email}
                    onChange={(e) =>
                      handleCollabChange("email", e.target.value)
                    }
                    className={styles.input}
                  />
                  <input
                    type="text"
                    placeholder="Phone"
                    value={collabContact.phone}
                    onChange={(e) =>
                      handleCollabChange("phone", e.target.value)
                    }
                    className={styles.input}
                  />
                </div>
              ) : (
                <div key={q._id} className={styles.questionBlock}>
                  <label>
                    {index + 1}. {q.text}
                  </label>
                  <input
                    type="text"
                    value={answers[q._id] || ""}
                    onChange={(e) =>
                      handleAnswerChange(q._id, e.target.value)
                    }
                    className={styles.input}
                  />
                </div>
              )
            )}
            <button type="submit" className={styles.submitBtn}>
              Submit
            </button>
          </form>
        )}
      </div>
    </>
  );
};

export default StudentFeedback;