import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/navbar/navbar";
import styles from './adminUnderPhase2Verify.module.css';

const AdminStudentUnderPhase2Verification = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [expandedStudent, setExpandedStudent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const response = await axios.get("http://localhost:4000/admin/underphase2verification", {
          headers: { Authorization: `Bearer ${localStorage.getItem("admin-token")}` },
        });

        if (response.data.success) {
          setStudents(response.data.students);
        } else {
          setErrorMessage("Failed to fetch student data.");
        }
      } catch (error) {
        setErrorMessage(error.response?.data?.error || "An error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleVerify = async (rollNo) => {
    try {
      const response = await axios.post(
        `http://localhost:4000/admin/verifyphase2/${rollNo}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("admin-token")}` } }
      );

      if (response.data.success) {
        setStudents((prevStudents) => prevStudents.filter((student) => student.rollNo !== rollNo));
      } else {
        setErrorMessage("Failed to verify student document.");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "An error occurred. Please try again.");
    }
  };
  const handleVerifys = async (rollNo) => {
    try {
      const response = await axios.post(
        `http://localhost:4000/admin/unlockphase2/${rollNo}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("admin-token")}` } }
      );

      if (response.data.success) {
        setStudents((prevStudents) => prevStudents.filter((student) => student.rollNo !== rollNo));
      } else {
        setErrorMessage("Failed to verify student document.");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "An error occurred. Please try again.");
    }
  };

  return (
    <>
    <Navbar
      navLinks={[
      {name:"Students Under Document Verification",path:"/underdocumentverification"},
        {name:"Students In Phase 2",path:"/phase2verification"},
        { name: "Verify Student", path: "/admin" },
        {name:"Delete Student",path:"/deletestudent"},
        {name: "Generate Excel", path: "/generateexcel" },
        { name: "Verify Faculty", path: "/verifyfaculty" },
        { name: "Verify Mentor", path: "/mentor" },
        {name:"Change Password",path:"/adminchangepassword"}
      ]}
      downloadButton={{
        text: "Log Out",
        onClick: () => navigate("/adminlogout"),
      }}
    />
    <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.cardContent}>
            <h2 className={styles.heading}>
            Students Under Document Verification
          </h2>

          {errorMessage && (
            <div className={styles.errorMessage}>❌ {errorMessage}</div>
          )}

          {loading ? (
            <div className={styles.loadingContainer}>
                <div className={styles.loader}></div>
              </div>
          ) : students.length === 0 ? (
            <div className={styles.noStudentsMessage}>No students under document verification.</div>
          ) : (
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead className={styles.tableHeader}>
                    <tr>
                      <th className={styles.tableCell}>Student Name</th>
                      <th className={styles.tableCell}>Email</th>
                      <th className={styles.tableCell}>Branch</th>
                      <th className={styles.tableCell}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <>
                      <tr key={student.rollNo} className={styles.tableRow}>
                          <td className={styles.tableCell}>{student.name}</td>
                          <td className={styles.tableCell}>{student.email}</td>
                          <td className={styles.tableCell}>{student.branch}</td>
                          <td className={styles.tableCell}>
                          <button
                            onClick={() => setExpandedStudent(expandedStudent === student.rollNo ? null : student.rollNo)}
                            className={styles.viewMoreButton}
                          >
                            {expandedStudent === student.rollNo ? "Hide Info" : "View More Info"}
                          </button>
                        </td>
                      </tr>
                      {expandedStudent === student.rollNo && (
                        <tr className={styles.expandedRow}>
                            <td colSpan="4" className={styles.expandedContent}>
                            <p><strong>Roll No:</strong> {student.rollNo}</p>
                            <p><strong>Phone:</strong> {student.phoneNumber}</p>
                            <p><strong>Semester:</strong> {student.semesterType}</p>
                            <p><strong>Class Subgroup:</strong> {student.classSubgroup}</p>
                            <p><strong>Training Arranged By:</strong> {student.trainingArrangedBy}</p>
                            <p><strong>Mentor Name:</strong> {student.mentorName}</p>
                            <p><strong>Mentor Email:</strong> {student.mentorEmail}</p>
                            <p><strong>Mentor Contact:</strong> {student.mentorContact}</p>
                            <p><strong>Company Name:</strong> {student.companyDetails.companyName}</p>
                            <p><strong>Company Address:</strong> {student.companyDetails.completeAddress}, {student.companyDetails.companyCity}, {student.companyDetails.companyCountry}</p>
                            <p><strong>Landmark:</strong> {student.companyDetails.landmark}</p>
                            <p><strong>Training Start:</strong> {new Date(student.trainingStartDate).toLocaleDateString()}</p>
                            <p><strong>Training End:</strong> {new Date(student.trainingEndDate).toLocaleDateString()}</p>
                            <p><strong>Stipend:</strong> {student.stipend}</p>
                            <p><strong>Training Letter:</strong> {student.trainingLetter}</p>
                            <p><strong>Fee Receipt:</strong> {student.feeReceipt}</p>
                            <button
                              onClick={() => handleVerify(student.rollNo)}
                              className={styles.verifyButton}>
                              Verify Student
                            </button>
                            <button
                              onClick={() => handleVerifys(student.rollNo)}
                              className={styles.rejectButton}>
                              Dont Verify And Reunlock Phase 2 Form
                            </button>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
    
  );
};

export default AdminStudentUnderPhase2Verification;