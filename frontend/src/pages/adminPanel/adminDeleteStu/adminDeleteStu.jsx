import { useState } from "react";
import axios from "axios";
import styles from './adminDeleteStu.module.css';

const AdminDeleteStudent = () => {
  const [rollNumber, setRollNumber] = useState("");
  const [error, setError] = useState("");
  const [student, setStudent] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      const token = localStorage.getItem('admin-token');
      const response = await axios.get(`http://localhost:4000/admin/getdeletestudent/${rollNumber}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setStudent(response.data.student);
      setShowDetailsModal(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch student details");
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('admin-token');
      await axios.post(
        `http://localhost:4000/admin/getdeletestudent/${rollNumber}`,
        {}, // Empty body since you're not sending any data
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
    
      setShowConfirmModal(false);
      setShowDetailsModal(false);
      setStudent(null);
      setRollNumber("");
      // Show success message or redirect
      alert("Student deleted successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete student");
    }
  };

  // Modal for student details
  const StudentDetailsModal = () => (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalContent}>
          <h3 className={styles.modalTitle}>Student Details</h3>
          {student && (
            <div className={styles.studentDetails}>
              <p>
                <span className={styles.bold}>Roll Number:</span> {student.rollNo}
              </p>
              <p>
                <span className={styles.bold}>Name:</span> {student.name}
              </p>
              <p>
                <span className={styles.bold}>Email:</span> {student.email}
              </p>
              <p>
                <span className={styles.bold}>Phone Number:</span> {student.phoneNumber}
              </p>
            </div>
          )}
          <div className={styles.buttonContainer}>
            <button onClick={() => setShowDetailsModal(false)} className={styles.cancelButton}>
              Cancel
            </button>
            <button onClick={() => setShowConfirmModal(true)} className={styles.deleteButton}>
              Delete Student
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const ConfirmDeleteModal = () => (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalContent}>
          <h3 className={styles.warningTitle}>Warning!</h3>
          <p className={styles.warningText}>
            Are you sure you want to delete this student? This action is irreversible and all submitted documents will also be deleted.
          </p>
          <div className={styles.buttonContainer}>
            <button onClick={() => setShowConfirmModal(false)} className={styles.cancelButton}>
              Cancel
            </button>
            <button onClick={handleDelete} className={styles.deleteButton}>
              Confirm Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formContainer}>
        <div className={styles.formBox}>
          <div className={styles.formContent}>
            <h2 className={styles.formTitle}>Delete Student Portal</h2>

            {error && <div className={styles.errorMessage}>{error}</div>}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div>
                <label htmlFor="rollNumber" className={styles.label}>
                  Enter Student Roll Number
                </label>
                <input
                  type="text"
                  id="rollNumber"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  className={styles.input}
                  placeholder="Enter roll number to delete"
                  required
                />
              </div>
              <button type="submit" className={styles.submitButton}>
                Search Student
              </button>
            </form>
          </div>
        </div>
      </div>

      {showDetailsModal && <StudentDetailsModal />}
      {showConfirmModal && <ConfirmDeleteModal />}
    </div>
  );
};

export default AdminDeleteStudent;