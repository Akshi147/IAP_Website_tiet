import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Navbar from "../../../components/navbar/navbar";

const ReportButton = ({ number, title, onClick, dropdownContent = null }) => (
  <div className="relative h-[80px]">
    <button 
      onClick={onClick}
      className="absolute inset-0 p-4 bg-purple-500 hover:bg-purple-600 text-white rounded-lg shadow-sm transition-colors text-left"
    >
      <h3 className="text-lg truncate">{number}. {title}</h3>
    </button>
    {dropdownContent}
  </div>
);

ReportButton.propTypes = {
  number: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  dropdownContent: PropTypes.node,
};



const AdminGenerateExcel = () => {
  const [year, setYear] = useState('');
  const [branch, setBranch] = useState('');
  const [semester, setSemester] = useState('');
  const [showFacultyDropdown, setShowFacultyDropdown] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Dummy faculty data (will be fetched from backend later)
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

    // For report 7, validate faculty email
    if (reportNumber === 7 && !facultyEmail) {
      setError('Please select a faculty');
      return;
    }

    try {
      const token = localStorage.getItem('admin-token');
      
      // Only include faculty in payload for report 7
      const payload = {
        year,
        branch,
        semester,
        ...(reportNumber===4 && {semesterType:'Alternate Semester'}),
        ...(reportNumber === 7 && { faculty: facultyEmail })
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
      const contentDisposition = (response.headers['content-disposition']);
      const fileName = contentDisposition.split(" ")[1].split("=")[1];
      link.setAttribute('download', fileName);
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

  const FacultyDropdown = () => (
    showFacultyDropdown && (
      <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 max-h-[200px] overflow-y-auto">
        {facultyList.map((faculty) => (
          <button
            key={faculty.email}
            onClick={() => {
              handleGenerateReport(7, faculty.email);
              setShowFacultyDropdown(false);
            }}
            className="w-full p-3 text-left hover:bg-purple-50 border-b last:border-b-0 transition-colors"
          >
            <div className="font-medium text-gray-800">{faculty.name}</div>
            <div className="text-sm text-gray-500">{faculty.email}</div>
          </button>
        ))}
      </div>
    )
  );

  return (
    <>
    <Navbar
      navItems={[
        {name:"Students Under Document Verification",path:"/underdocumentverification"},
        {name:"Students In Phase 2",path:"/phase2verification"},
        { name: "Verify Student", path: "/admin" },
        {name:"Delete Student",path:"/deletestudent"},
        {name:"Generate Excel Sheet",path:"/generateExcel"},
        
        { name: "Verify Faculty", path: "/verifyfaculty" },
        { name: "Verify Mentor", path: "/mentor" },
        {name:"Change Password",path:"/adminchangepassword"}
      ]}
      downloadButton={{
        text: "Log Out",
        onClick: () => navigate("/adminlogout"),
      }}
    />

      <div className="min-h-screen bg-gray-100 py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Generate Excel Reports
            </h2>

            {error && (
              <div className="mb-4 p-3 text-red-700 bg-red-100 border border-red-400 rounded">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                >
                  <option value="">Choose one...</option>
                  {/*<option value="1">Semester 1</option>
                  <option value="2">Semester 2</option>
                  <option value="3">Semester 3</option>
                  <option value="4">Semester 4</option>
                  <option value="5">Semester 5</option>
                  <option value="6">Semester 6</option>*/}
                  <option value="7">Semester 7</option>
                  <option value="8">Semester 8</option>
                  <option value="ALL">All Semesters</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ReportButton 
                number="1" 
                title="Registration Form Data" 
                onClick={() => handleGenerateReport(1)} 
              />
              
              <ReportButton 
                number="2" 
                title="Students Verified" 
                onClick={() => handleGenerateReport(2)} 
              />
              
              <ReportButton 
                number="3" 
                title="Students not Verified yet" 
                onClick={() => handleGenerateReport(3)} 
              />
              
              <ReportButton 
                number="4" 
                title="Students with ALTERNATE semester at Thapar University" 
                onClick={() => handleGenerateReport(4)} 
              />
              
              <ReportButton 
                number="5" 
                title="Students with PROJECT semester at software company/research institute" 
                onClick={() => handleGenerateReport(5)} 
              />
              
              <ReportButton 
                number="6" 
                title="Students getting STIPEND (with amount)" 
                onClick={() => handleGenerateReport(6)} 
              />
              
              <ReportButton 
                number="7" 
                title="Students Tagged with a particular FACULTY" 
                onClick={() => setShowFacultyDropdown(!showFacultyDropdown)}
                dropdownContent={<FacultyDropdown />}
              />
              
              <ReportButton 
                number="8" 
                title="Students with registration Phase 2 COMPLETE" 
                onClick={() => handleGenerateReport(8)} 
              />
              
              <ReportButton 
                number="9" 
                title="Students with registration Phase 2 PENDING" 
                onClick={() => handleGenerateReport(9)} 
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminGenerateExcel;