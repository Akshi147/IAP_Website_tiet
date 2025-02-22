import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Footer } from "../../../components/footer";
import { Header } from "../../../components/header";

const UnderPhase2Verification = () => {
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
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="px-6 py-5">
          <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-6">
            Students Under Document Verification
          </h2>

          {errorMessage && (
            <div className="mb-4 text-red-700 bg-red-100 p-3 rounded-lg text-center">❌ {errorMessage}</div>
          )}

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-12 h-12 border-4 border-purple-500 border-dashed rounded-full animate-spin"></div>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center text-gray-600 py-10">No students under document verification.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-purple-600 text-white">
                  <tr>
                    <th className="p-3 border">Student Name</th>
                    <th className="p-3 border">Email</th>
                    <th className="p-3 border">Branch</th>
                    <th className="p-3 border">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <>
                      <tr key={student.rollNo} className="text-center border hover:bg-purple-50 transition">
                        <td className="p-3 border">{student.name}</td>
                        <td className="p-3 border">{student.email}</td>
                        <td className="p-3 border">{student.branch}</td>
                        <td className="p-3 border">
                          <button
                            onClick={() => setExpandedStudent(expandedStudent === student.rollNo ? null : student.rollNo)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                          >
                            {expandedStudent === student.rollNo ? "Hide Info" : "View More Info"}
                          </button>
                        </td>
                      </tr>
                      {expandedStudent === student.rollNo && (
                        <tr className="bg-gray-100">
                          <td colSpan="4" className="p-5 text-left">
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
                              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                            >
                              Verify Student
                            </button>
                            <button
                              onClick={() => handleVerifys(student.rollNo)}
                              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                            >
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
    <Footer/>
    </>
    
  );
};

export default UnderPhase2Verification;
