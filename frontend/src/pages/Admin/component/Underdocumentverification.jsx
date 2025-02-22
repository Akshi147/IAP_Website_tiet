import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Footer } from "../../../components/footer";
import { Header } from "../../../components/header";

const UnderDocumentVerification = () => {
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
            <div className="mb-4 text-red-700 bg-red-100 p-3 rounded-lg text-center">
              ❌ {errorMessage}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-12 h-12 border-4 border-purple-500 border-dashed rounded-full animate-spin"></div>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center text-gray-600 py-10">
              No students are currently under document verification.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-purple-600 text-white">
                  <tr>
                    <th className="p-3 border border-gray-300">Student Name</th>
                    <th className="p-3 border border-gray-300">Email</th>
                    <th className="p-3 border border-gray-300">Branch</th>
                    <th className="p-3 border border-gray-300">RollNo</th>
                    <th className="p-3 border border-gray-300">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.rollNo} className="text-center border border-gray-300 hover:bg-purple-50 transition">
                      <td className="p-3 border border-gray-300">{student.name}</td>
                      <td className="p-3 border border-gray-300">{student.email}</td>
                      <td className="p-3 border border-gray-300">{student.rollNo}</td>
                      <td className="p-3 border border-gray-300">{student.branch}</td>
                      <td className="p-3 border border-gray-300">
                        <button
                          onClick={() => navigate(`/admin/verifyStudentDocument/${student.rollNo}`)}
                          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
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
    <Footer/>
    </>
   
  );
};

export default UnderDocumentVerification;
