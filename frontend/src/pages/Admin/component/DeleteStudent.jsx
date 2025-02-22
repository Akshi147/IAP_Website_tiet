import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../../components/header";
import axios from "axios";

const DeleteStudent = () => {
  const [rollNumber, setRollNumber] = useState("");
  const [error, setError] = useState("");
  const [student, setStudent] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const navigate = useNavigate();

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
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full m-4">
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4">Student Details</h3>
          {student && (
            <div className="space-y-3">
              <p><span className="font-semibold">Roll Number:</span> {student.rollNo}</p>

              <p><span className="font-semibold">Name:</span> {student.name}</p>
              <p><span className="font-semibold">Email:</span> {student.email}</p>
              <p><span className="font-semibold">Phone Number:</span> {student.phoneNumber}</p>
              {/* Add more student details as needed */}
            </div>
          )}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => setShowDetailsModal(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={() => setShowConfirmModal(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete Student
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Modal for delete confirmation
  const ConfirmDeleteModal = () => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full m-4">
        <div className="p-6">
          <h3 className="text-xl font-bold text-red-600 mb-4">Warning!</h3>
          <p className="mb-4">
            Are you sure you want to delete this student? This action is irreversible and all submitted documents will also be deleted.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
    <Header
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
    
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-8">
              Delete Student Portal
            </h2>

            {/* Error Message Display */}
            {error && (
              <div className="mb-4 p-3 text-red-700 bg-red-100 border border-red-400 rounded-md">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="rollNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Student Roll Number
                </label>
                <input
                  type="text"
                  id="rollNumber"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter roll number to delete"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Search Student
              </button>
            </form>
          </div>
        </div>
      </div>

      {showDetailsModal && <StudentDetailsModal />}
      {showConfirmModal && <ConfirmDeleteModal />}
    </div>
    </>
    
  );
};

export default DeleteStudent;
