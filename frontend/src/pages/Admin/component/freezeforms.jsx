import React, { useState } from 'react';
import axios from 'axios';
import { Header } from '../../../components/header';

const FreezeAndUnfreeze = () => {
  const [email, setEmail] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [reports, setReports] = useState(null);
  const [bulkAction, setBulkAction] = useState('');

  // Fetch student reports
  const fetchStudentReports = async () => {
    try {
        const token = localStorage.getItem('admin-token');
      const response = await axios.post('http://localhost:4000/freezeform/fortnightly/student', {
        email,
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`
      }}
    );
      setReports(response.data);
      setShowModal(true);
    } catch (error) {
      alert('Error fetching student data');
      console.error(error);
    }
  };

  // Update individual report status
  const updateReportStatus = async (reportId, isUnlocked) => {
    try {
        const token = localStorage.getItem('admin-token');
      const response = await axios.patch(`http://localhost:4000/freezeform/fortnightly/${reportId}`, {
        isUnlocked,
        email,
      },
    {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

      if (response.status === 200) {
        // Update the report's status in the state immediately after success
        setReports((prev) => {
          // Check if 'prev.reports' is defined before updating
          const updatedReports = { ...prev.reports };

          // Update the specific report
          for (const period in updatedReports) {
            if (updatedReports[period]._id === reportId) {
              updatedReports[period] = {
                ...updatedReports[period],
                isUnlocked: isUnlocked, // Update isUnlocked flag
              };
              break;
            }
          }

          return {
            ...prev,
            reports: updatedReports, // Return the updated reports
          };
        });
      }
    } catch (error) {
      alert('Error updating report status');
      console.error(error);
    }
  };

  // Handle bulk action
  const handleBulkAction = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/freezeform/fortnightly/bulk', {
        action: bulkAction,
      });
      alert('Bulk action completed successfully');
      setBulkAction('');
    } catch (error) {
      alert('Error performing bulk action');
      console.error(error);
    }
  };

  return (
    <>
    <Header
      navItems={[
        {name:"Students Under Document Verification",path:"/underdocumentverification"},
        {name:"Students In Phase 2",path:"/phase2verification"},
        { name: "Verify Student", path: "/admin" },
        {name:"Delete Student",path:"/deletestudent"},
        {name:"Generate Excel Sheet",path:"/generateExcel"},
        {name:"Freeze/Unfreeze Forms",path:"/freezeforms"},
        
        { name: "Verify Faculty", path: "/verifyfaculty" },
        { name: "Verify Mentor", path: "/mentor" },
        {name:"Change Password",path:"/adminchangepassword"}
      ]}
      downloadButton={{
        text: "Log Out",
        onClick: () => navigate("/adminlogout"),
      }}
    />
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Student Search Section */}
      <div className="max-w-2xl mx-auto bg-white rounded-lg p-6 shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">Student Access Control</h2>
        <div className="flex gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter student email"
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={fetchStudentReports}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Search
          </button>
        </div>
      </div>

      {/* Reports Modal */}
      {showModal && reports && reports.reports && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between mb-4">
              <h3 className="text-xl font-semibold">Fortnightly Reports for {email}</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {Object.entries(reports.reports).map(([period, report]) => (
                report && report.isUnlocked !== undefined ? (
                  <div key={report._id} className="flex items-center justify-between p-3 border rounded">
                    <span>{period}</span>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={report.isUnlocked}
                        onChange={(e) => updateReportStatus(report._id, e.target.checked)}
                        className="w-5 h-5"
                      />
                      Unlocked
                    </label>
                  </div>
                ) : null
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
    </>
    
  );
};

export default FreezeAndUnfreeze;
