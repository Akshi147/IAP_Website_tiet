import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../../components/navbar/navbar";
import  { useState, useEffect } from 'react';
import styles from './stuFeedback.module.css';
import axios from 'axios';

const StudentFeedback = () => {
    const navigate = useNavigate();
    const { studentId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [collabContact, setCollabContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch questions from backend
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          `/students/getFeedbackForm/${studentId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`, // Send token
            },
            withCredentials: true, // Send cookies if using cookie-based auth
          }
        );
        // Initialize answers object with existing answers or empty
        const initialAnswers = {};
        response.data.questions.forEach(question => {
          if (typeof question.answer === 'object') {
            // This is the collaboration contact question
            setCollabContact({
              question: question._id,
              answer: question.answer || {
                name: '',
                designation: '',
                email: '',
                phone: ''
              }
            });
          } else {
            initialAnswers[question._id] = question.answer || '';
          }
        });
        
        setQuestions(response.data.questions);
        setAnswers(initialAnswers);
      } catch (err) {
        setError('Failed to load feedback form. Please try again later.');
        console.error('Error fetching questions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [studentId]);

  // Handle input change for regular questions
  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  // Handle input change for collaboration contact
  const handleCollabContactChange = (field, value) => {
    setCollabContact(prev => ({
      ...prev,
      answer: {
        ...prev.answer,
        [field]: value
      }
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const submissionData = {
        answers,
        collabContact
      };

      await axios.post(`/students/submitFeedbackForm/${studentId}`, submissionData);
      setSubmitted(true);
    } catch (err) {
      setError('Failed to submit feedback. Please try again.');
      console.error('Error submitting feedback:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading feedback form...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (submitted) {
    return (
        <>
            <Navbar
        navItems={[
          { name: "Dashboard", path: "/dashboard" },
          {name: "Phase 2", path: "/student"},
          {name: "Faculty Assigned", path: "faculty-assigned"},
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
      <div className={styles.successContainer}>
        <h2>Thank You!</h2>
        <p>Your feedback has been submitted successfully.</p>
        <p>We appreciate your time and valuable input.</p>
        </div>
        </>
        );
        }
      return (
        <>
        <Navbar
        navItems={[
          { name: "Dashboard", path: "/dashboard" },
          {name: "Phase 2", path: "/student"},
          {name: "Faculty Assigned", path: "faculty-assigned"},
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
      <h1 className={styles.title}>Student Feedback Form</h1>
      <p className={styles.description}>
        Please provide your honest feedback about your experience.
      </p>

      <form onSubmit={handleSubmit} className={styles.form}>
        {questions.map((question) => {
          // Skip the collaboration contact question as we'll render it separately
          if (typeof question.answer === 'object') return null;
          
          return (
            <div key={question._id} className={styles.questionContainer}>
              <label className={styles.questionLabel}>{question.text}</label>
              
              {/* Render different input types based on question content */}
              {question.text.includes('rate') || question.text.includes('Rate') ? (
                <select
                  value={answers[question._id] || ''}
                  onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                  className={styles.selectInput}
                  required
                >
                  <option value="">Select rating</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num.toString()}>{num}</option>
                  ))}
                </select>
              ) : question.text.startsWith('Would you') || question.text.startsWith('Do you') ? (
                <div className={styles.radioGroup}>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name={`question-${question._id}`}
                      value="Yes"
                      checked={answers[question._id] === "Yes"}
                      onChange={() => handleAnswerChange(question._id, "Yes")}
                      required
                    />
                    <span>Yes</span>
                  </label>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name={`question-${question._id}`}
                      value="No"
                      checked={answers[question._id] === "No"}
                      onChange={() => handleAnswerChange(question._id, "No")}
                    />
                    <span>No</span>
                  </label>
                </div>
              ) : (
                <input
                  type="text"
                  value={answers[question._id] || ''}
                  onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                  className={styles.textInput}
                  required
                />
              )}
            </div>
          );
        })}

        {/* Special section for collaboration contact */}
        {collabContact && (
          <div className={styles.collabContainer}>
            <h3 className={styles.collabTitle}>
              {questions.find(q => q._id === collabContact.question)?.text}
            </h3>
            <div className={styles.gridContainer}>
              <div className={styles.inputGroup}>
                <label>Name</label>
                <input
                  type="text"
                  value={collabContact.answer.name}
                  onChange={(e) => handleCollabContactChange('name', e.target.value)}
                  className={styles.textInput}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Designation</label>
                <input
                  type="text"
                  value={collabContact.answer.designation}
                  onChange={(e) => handleCollabContactChange('designation', e.target.value)}
                  className={styles.textInput}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Email</label>
                <input
                  type="email"
                  value={collabContact.answer.email}
                  onChange={(e) => handleCollabContactChange('email', e.target.value)}
                  className={styles.textInput}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Phone</label>
                <input
                  type="tel"
                  value={collabContact.answer.phone}
                  onChange={(e) => handleCollabContactChange('phone', e.target.value)}
                  className={styles.textInput}
                />
              </div>
            </div>
          </div>
        )}

        <div className={styles.submitContainer}>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>
      </form>
    </div>
        </>
  );
};

export default StudentFeedback;