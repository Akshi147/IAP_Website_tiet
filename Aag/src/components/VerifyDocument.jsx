import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Header } from "./header";
import { Footer } from "./footer";
import axios from "axios";

const StudentVerification = () => {
  const { rollNumber } = useParams();
  const [isVerifying, setIsVerifying] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    email: "",
    phoneNumber: "",
    companyCity: "",
    companyName: "",
    semesterType: "",
    classSubgroup: "",
    trainingArrangedBy: "",
    trainingLetter: "",
    feeReceipt: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      setLoading(true);
      try {
        const facultyToken = localStorage.getItem("faculty-token");
        if (!facultyToken) throw new Error("No authentication token found!");

        const response = await axios.get(
          `http://localhost:4000/students/verifyStudentDocument/${rollNumber}`,
          {
            headers: {
              Authorization: `Bearer ${facultyToken}`,
            },
          }
        );

        if (response.data?.student) {
          setFormData({
            name: response.data.student.name,
            rollNo: response.data.student.rollNo,
            email: response.data.student.email,
            phoneNumber: response.data.student.phoneNumber,
            companyCity: response.data.student.companyDetails?.companyCity || "",
            companyName: response.data.student.companyDetails?.companyName || "",
            semesterType: response.data.student.semesterType,
            classSubgroup: response.data.student.classSubgroup,
            trainingArrangedBy: response.data.student.trainingArrangedBy,
            trainingLetter: response.data.student.trainingLetter,
            feeReceipt: response.data.student.feeReceipt,
          });
        }
      } catch (err) {
        console.log(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [rollNumber]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDownload = (file) => {
    if (file) {
      window.open(`http://localhost:4000/uploads/${file}`, "_blank");
    } else {
      alert("No document available");
    }
  };

  const handleRemoveAndEmail = (fileType) => {
    console.log(`Removing and emailing ${fileType}`);
  };

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      alert("Student verified successfully!");
    }, 1500);
  };

  return (
    <>
     <Header />
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-8">Verify Student Details</h2>
            {loading ? (
              <p className="text-center text-gray-600">Loading...</p>
            ) : (
              <form className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  {Object.keys(formData).map((key) => (
                    key !== "trainingLetter" && key !== "feeReceipt" && (
                      <div key={key} className="space-y-2">
                        <label className="text-sm font-medium text-purple-600">{key.replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase())}</label>
                        <input
                          type="text"
                          name={key}
                          value={formData[key] || ""}
                          onChange={
                            key === "name" || key === "rollNo" || key === "email" || key === "phoneNumber"
                              ? () => {} // Disable editing
                              : handleInputChange
                          }
                          disabled={key === "name" || key === "rollNo" || key === "email" || key === "phoneNumber"}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm ${key === "name" || key === "rollNo" || key === "email" || key === "phoneNumber" ? "bg-gray-100" : ""}`}
                        />
                      </div>
                    )
                  ))}
                </div>
                <div className="space-y-4 border-t pt-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-purple-600">Training Letter</label>
                    <div className="space-x-2">
                      <button type="button" onClick={() => handleDownload(formData.trainingLetter)} className="text-purple-700 bg-purple-100 hover:bg-purple-200 px-3 py-1 rounded-md">Download</button>
                      <button type="button" onClick={() => handleRemoveAndEmail("trainingLetter")} className="text-white bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded-md">Remove & Email</button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-purple-600">Fee Receipt</label>
                    <div className="space-x-2">
                      <button type="button" onClick={() => handleDownload(formData.feeReceipt)} className="text-purple-700 bg-purple-100 hover:bg-purple-200 px-3 py-1 rounded-md">Download</button>
                      <button type="button" onClick={() => handleRemoveAndEmail("feeReceipt")} className="text-white bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded-md">Remove & Email</button>
                    </div>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <button type="button" onClick={handleVerify} disabled={isVerifying} className="w-full sm:w-auto px-6 py-3 text-white bg-purple-600 hover:bg-purple-700 rounded-md">
                    {isVerifying ? "Verifying..." : "Verify"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
   
  );
};

export default StudentVerification;
