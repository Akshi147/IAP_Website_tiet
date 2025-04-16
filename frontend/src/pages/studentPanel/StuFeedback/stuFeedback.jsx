// StudentFeedback.jsx
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/navbar/navbar";
import { useState, useEffect } from "react";
import styles from "./stuFeedback.module.css";
import axios from "axios";

const ratingOptions = Array.from({ length: 11 }, (_, i) => i.toString());

const StudentFeedback = () => {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState(null);

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
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) navigate("/student/login");

    const fetchFeedbackForm = async () => {
      try {
        const student = await axios.get("http://localhost:4000/students/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudentId(student.data.student._id);

        const res = await axios.get(
          `http://localhost:4000/students/getFeedbackForm/${student.data.student._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const fetchedQuestions = res.data?.questions || [];
        const initialAnswers = {};

        fetchedQuestions.forEach((q) => {
          const isCollab =
            q.text.toLowerCase().includes("collaboration") ||
            (typeof q.answer === "object" && q.answer !== null);

          if (isCollab) {
            setCollabContact(q.answer || { name: "", designation: "", email: "", phone: "" });
            setCollabQuestionId(q._id);
          } else {
            initialAnswers[q._id] = q.answer || "";
          }
        });

        setQuestions(fetchedQuestions);
        setAnswers(initialAnswers);
      } catch (err) {
        console.error("Error fetching feedback:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbackForm();
  }, []);

  const handleAnswerChange = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleCollabChange = (field, value) => {
    setCollabContact((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { answers };

      if (collabQuestionId) {
        payload.collabContact = {
          question: collabQuestionId,
          answer: collabContact,
        };
      }

      await axios.post(
        `http://localhost:4000/students/submitFeedbackForm/${studentId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Feedback submitted successfully!");
    } catch (err) {
      console.error("Error submitting feedback:", err);
      alert("Submission failed.");
    }
  };

  const renderOptions = (q) => {
    const text = q.text.toLowerCase();
    if (text.includes("recommend for having full alternate semester")) {
      return ["Yes", "No", "Both are equivalent and good options"];
    }
    if (text.includes("benefits given")) {
      return [
        "Only Accommodation was provided/funded by the organization",
        "Only Meals are arranged/provided by the organization",
        "Both accommodation and meals were arranged by the organization",
        "None was arranged by the organization",
      ];
    }
    if (text.includes("cost that incurred")) {
      return ["Below 2000", "2000-5000", "5000-7000", "Above 7000"];
    }
    if (text.includes("commuting facility")) {
      return [
        "Company has arranged and paid for this",
        "Company has arranged this for me but paid by me",
        "No such arrangement",
      ];
    }
    if (text.includes("recommend your juniors")) {
      return ["Yes", "No"];
    }
    if (text.includes("significance of the faculty visits")) {
      return [
        "Only one visit is sufficient",
        "Two times visit must be there",
        "Faculty visits may be replaced by online interaction",
        "There is no benefit from any faculty visit/interaction",
      ];
    }
    if (text.includes("handling of all project semester activities")) {
      return ["Excellent", "Very good", "Good", "Satisfactory", "Poor"];
    }
    if (text.includes("rate the iap cell and their activities")) {
      return ["Excellent", "Very good", "Good", "Satisfactory", "Poor"];
    }
    if (text.includes("do you think that csed")) {
      return ["Yes", "No"];
    }

    return [];
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
        downloadButton={{ text: "Log Out", onClick: () => navigate("/student/logout") }}
      />

      <div className={styles.container}>
        <h1 className={styles.heading}>Student Feedback Form</h1>

        {loading ? (
          <p>Loading...</p>
        ) : questions.length === 0 ? (
          <p>No questions found or feedback already submitted.</p>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            {questions.map((q, index) => {
              const isCollab =
                q.text.toLowerCase().includes("collaboration") ||
                (typeof q.answer === "object" && q.answer !== null);

              return (
                <div key={q._id} className={styles.card}>
                  <label className={styles.label}>
                    {index + 1}. {q.text}
                  </label>

                  {isCollab ? (
                    <>
                      <input
                        type="text"
                        placeholder="Name"
                        value={collabContact.name}
                        onChange={(e) => handleCollabChange("name", e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Designation"
                        value={collabContact.designation}
                        onChange={(e) => handleCollabChange("designation", e.target.value)}
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={collabContact.email}
                        onChange={(e) => handleCollabChange("email", e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Phone"
                        value={collabContact.phone}
                        onChange={(e) => handleCollabChange("phone", e.target.value)}
                      />
                    </>
                  ) : renderOptions(q).length > 0 ? (
                    renderOptions(q).map((option, idx) => (
                      <div key={idx} className={styles.radioGroup}>
                        <input
                          type="radio"
                          id={`${q._id}_${idx}`}
                          className={styles.inputdot}
                          name={q._id}
                          value={option}
                          checked={answers[q._id] === option}
                          onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                        />
                        <label htmlFor={`${q._id}_${idx}`}>{option}</label>
                      </div>
                    ))
                  ) : q.text.includes("list any subject") || q.text.includes("further thoughts") ? (
                    <textarea
                      value={answers[q._id]}
                      onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                      maxLength={500}
                      placeholder="(Max 500 characters)"
                    />
                  ) : (
                    <select
                      value={answers[q._id]}
                      onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                    >
                      <option value="">Select</option>
                      {ratingOptions.map((val) => (
                        <option key={val} value={val}>
                          {val}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              );
            })}
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
