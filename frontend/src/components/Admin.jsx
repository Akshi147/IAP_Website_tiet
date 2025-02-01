import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Admin = () => {
  const [rollNumber, setRollNumber] = useState("");
  const [error, setError] = useState("");  // State to hold error message
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    const token = localStorage.getItem("admin-token");
    if (!token) {
      navigate("/adminlogin");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:4000/students/verifyStudentDocument/${rollNumber}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        navigate(`/admin/verifyStudentDocument/${rollNumber}`);
      }
    } catch (error) {
      if (error.response) {
        // If API returns an error response (e.g., 400, 404)
        setError(error.response.data.message || "An error occurred. Please try again.");
      } else if (error.request) {
        // If request was made but no response received
        setError("No response from server. Please check your connection.");
      } else {
        // Other errors
        setError("Something went wrong. Please try again.");
      }
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-8">
              Verify Student Details
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
                  placeholder="Enter roll number"
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
    </div>
  );
};

export default Admin;
