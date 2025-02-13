import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../../components/navbar/navbar";
import Hero from "../../../components/hero/hero";
import styles from "./mentorAssignedStu.module.css"; // Importing the CSS module

const MentorAssignedStudents = () => {
  const [students, setStudents] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");


  useEffect(() => {
    const fetchAssignedStudents = async () => {
      try {
        const token = localStorage.getItem("mentor-token");
        const response = await axios.get("http://localhost:4000/mentors/getAssignedStudents",{
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudents(response.data.students);
      } catch (error) {
        setErrorMessage(error || "Failed to load students.");
      }
    };

    fetchAssignedStudents();
  }, []);

  return (
    <>
      <Navbar
      
      />
      <Hero />
      <div className={styles.container}>
        <h1 className={styles.heading}>Assigned Students</h1>
        {errorMessage && <div className={styles.alert}>{errorMessage}</div>}

        <table className={styles.studentTable}>
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Name</th>
              <th>Faculty Information</th>
              <th>Form 1 Status</th>
              <th>Form 2 Status</th>
              <th>Process</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((student) => (
                <tr key={student.rollNo}>
                  <td>{student.rollNo}</td>
                  <td>{student.name}</td>
                  <td>{student.facultyInfo || "Not Available"}</td>
                  <td className={student.form1Status === "Pending" ? styles.pending : styles.completed}>
                    {student.form1Status}
                  </td>
                  <td className={student.form2Status === "Pending" ? styles.pending : styles.completed}>
                    {student.form2Status}
                  </td>
                  <td>
                    <button className={styles.viewButton}>View</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className={styles.noData}>
                  No students assigned yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default MentorAssignedStudents;