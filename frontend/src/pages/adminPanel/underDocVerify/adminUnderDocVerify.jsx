import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/navbar/navbar";
import styles from './adminUnderDocVerify.module.css';

const AdminStudentUnderDocumentVerification = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const response = await axios.get("http://localhost:4000/admin/underdocumentverification", {
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
              <div className={styles.errorMessage}>
                ❌ {errorMessage}
              </div>
            )}

            {loading ? (
              <div className={styles.loadingContainer}>
                <div className={styles.loader}></div>
              </div>
            ) : students.length === 0 ? (
              <div className={styles.noStudentsMessage}>
                No students are currently under document verification.
              </div>
            ) : (
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead className={styles.tableHeader}>
                    <tr>
                      <th className={styles.tableCell}>Student Name</th>
                      <th className={styles.tableCell}>Email</th>
                      <th className={styles.tableCell}>Branch</th>
                      <th className={styles.tableCell}>Roll No</th>
                      <th className={styles.tableCell}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.rollNo} className={styles.tableRow}>
                        <td className={styles.tableCell}>{student.name}</td>
                        <td className={styles.tableCell}>{student.email}</td>
                        <td className={styles.tableCell}>{student.branch}</td>
                        <td className={styles.tableCell}>{student.rollNo}</td>
                        <td className={styles.tableCell}>
                          <button
                            onClick={() => navigate(`/admin/verifyStudentDocument/${student.rollNo}`)}
                            className={styles.verifyButton}
                          >
                            Verify
                          </button>
                        </td>
                      </tr>
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

export default AdminStudentUnderDocumentVerification;