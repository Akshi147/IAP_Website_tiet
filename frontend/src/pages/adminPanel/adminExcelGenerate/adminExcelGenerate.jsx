import { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/navbar/navbar';
import styles from './adminExcelGenerate.module.css';

const AdminGenerateExcel = () => {
  const [year, setYear] = useState('');
  const [branch, setBranch] = useState('');
  const [semester, setSemester] = useState('');
  const [showFacultyDropdown, setShowFacultyDropdown] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const facultyList = [
    { email: 'vinay.arora@thapar.edu', name: 'Dr. Vinay Arora' },
    { email: 'raman.singh@thapar.edu', name: 'Dr. Raman Singh' },
    { email: 'preet.kaur@thapar.edu', name: 'Dr. Preet Kaur' },
    { email: 'amit.kumar@thapar.edu', name: 'Dr. Amit Kumar' }
  ];

  const handleGenerateReport = async (reportNumber, facultyEmail = null) => {
    if (!year || !branch || !semester) {
      setError('Please select Year, Branch and Semester');
      return;
    }

    if (reportNumber === 8 && !facultyEmail) {
      setError('Please select a faculty');
      return;
    }

    try {
      const token = localStorage.getItem('admin-token');
      const payload = {
        year,
        branch,
        semester,
        ...(reportNumber === 4 && { semesterType: 'Alternate Semester' }),
        ...(reportNumber === 8 && { faculty: facultyEmail })
      };

      const response = await axios.post(
        `http://localhost:4000/admin/generateexcel/${reportNumber}`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          responseType: 'blob'
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Report_${reportNumber}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setShowFacultyDropdown(false);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate report');
      console.error('Error:', err);
    }
  };

  const ReportButton = ({ number, title, onClick, dropdownContent = null }) => (
    <div className={styles.relativeContainer}>
      <button 
        onClick={onClick}
        className={styles.reportButton}
      >
        <h3 className={styles.reportTitle}>{number}. {title}</h3>
      </button>
      {dropdownContent}
    </div>
  );

  ReportButton.propTypes = {
    number: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    dropdownContent: PropTypes.node
  };

  const FacultyDropdown = () => (
    showFacultyDropdown && (
      <div className={styles.facultyDropdown}>
        {facultyList.map((faculty) => (
          <button
            key={faculty.email}
            onClick={() => {
              handleGenerateReport(8, faculty.email);
              setShowFacultyDropdown(false);
            }}
            className={styles.facultyOption}
          >
            <div className={styles.facultyName}>{faculty.name}</div>
            <div className={styles.facultyEmail}>{faculty.email}</div>
          </button>
        ))}
      </div>
    )
  );

  return (
    <>
      <Navbar
        navItems={[
          {name:"Students Under Document Verification", path:"/underdocumentverification"},
          {name:"Students In Phase 2", path:"/phase2verification"},
          {name:"Verify Student", path: "/admin"},
          {name:"Delete Student", path:"/deletestudent"},
          {name:"Generate Excel Sheet", path:"/generateExcel"},
          {name:"Verify Faculty", path:"/verifyfaculty"},
          {name:"Verify Mentor", path:"/mentor"},
          {name:"Change Password", path:"/adminchangepassword"}
        ]}
        downloadButton={{
          text: "Log Out",
          onClick: () => navigate("/adminlogout"),
        }}
      />

      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.card}>
            <h2 className={styles.heading}>Generate Excel Reports</h2>

            {error && (
              <div className={styles.errorBox}>{error}</div>
            )}

            <div className={styles.gridContainer}>
              <div>
                <label className={styles.label}>Year</label>
                <select 
                  className={styles.select}
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                >
                  <option value="">Choose one...</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                </select>
              </div>

              <div>
                <label className={styles.label}>Branch</label>
                <select 
                  className={styles.select}
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                >
                  <option value="">Choose one...</option>
                  <option value="Computer Engineering">Computer Engineering (COE)</option>
                  <option value="Computer Science And Engineering">Computer Science & Engineering (COPC)</option>
                  <option value="Computer Science And Business System">Computer Science & Business Systems (COBS)</option>
                  <option value="ME Computer Science And Engineering">ME Computer Science & Engineering</option>
                  <option value="ALL">All Branches</option>
                </select>
              </div>

              <div>
                <label className={styles.label}>Semester</label>
                <select 
                  className={styles.select}
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                >
                  <option value="">Choose one...</option>
                  <option value="1">Semester 1</option>
                  <option value="2">Semester 2</option>
                  <option value="3">Semester 3</option>
                  <option value="4">Semester 4</option>
                  <option value="5">Semester 5</option>
                  <option value="6">Semester 6</option>
                  <option value="7">Semester 7</option>
                  <option value="8">Semester 8</option>
                  <option value="ALL">All Semesters</option>
                </select>
              </div>
            </div>

            <div className={styles.reportGrid}>
              <ReportButton number="1" title="Registration Form Data" onClick={() => handleGenerateReport(1)} />
              <ReportButton number="2" title="Students Verified" onClick={() => handleGenerateReport(2)} />
              <ReportButton number="3" title="Students not Verify yet" onClick={() => handleGenerateReport(3)} />
              <ReportButton number="4" title="Students with ALTERNATE semester" onClick={() => handleGenerateReport(4)} />
              <ReportButton number="7" title="Students Tagged with Faculty" onClick={() => setShowFacultyDropdown(!showFacultyDropdown)} dropdownContent={<FacultyDropdown />} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminGenerateExcel;