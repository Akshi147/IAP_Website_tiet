import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Header } from "../../../components/header";
import { Footer } from "../../../components/footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StudentVerification = () => {
  const navigate = useNavigate();
  const { rollNumber } = useParams();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingFileType, setProcessingFileType] = useState(null);
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
  const [rejectionModal, setRejectionModal] = useState({
    show: false,
    fileType: null,
    reason: "",
    customMessage: "",
    contactPerson: ""
  });

  const trainingReasons = [
    "Stipend less than 10000, take approval from Dr. Anupam Garg",
    "Duration less than 4.5 months",
    "Training not allowed. Non-tech profile, take approval from head CSED",
    "Training duration not mentioned in training letter",
    "Job profile not clear in training letter",
    "Other"
  ];

  const feeReasons = [
    "Bank receipt uploaded. Upload fee receipt from web kiosk",
    "Full fee not paid. Upload approvals",
    "Other"
  ];

  const contactPersons = [
    "Finance Department",
    "CSED Head",
    "Training Coordinator"
  ];

  useEffect(() => {
    const fetchStudentData = async () => {
      setLoading(true);
      try {
        const AdminToken = localStorage.getItem("admin-token");
        if (!AdminToken) throw new Error("No authentication token found!");

        const response = await axios.get(
          `http://localhost:4000/students/verifyStudentDocument/${rollNumber}`,
          { headers: { Authorization: `Bearer ${AdminToken}` } }
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDownload = async (file) => {
    if (!file) {
        alert("No document available");
        return;
    }

    try {
        const response = await fetch(`http://localhost:4000/students/downloadfile/${file}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${localStorage.getItem("admin-token")}` },
        });

        if (!response.ok) {
            throw new Error("Failed to download file");
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        window.open(url, "_blank");
    } catch (error) {
        console.error("Download error:", error);
    }
  };

  const handleRejectionSubmit = async () => {
    setIsProcessing(true);
    setProcessingFileType(rejectionModal.fileType);
    
    try {
      const response = await axios.post(
        `http://localhost:4000/students/sendEmail/${formData.rollNo}`,
        {
          fileType: rejectionModal.fileType,
          reason: rejectionModal.reason,
          customMessage: rejectionModal.customMessage,
          contactPerson: rejectionModal.contactPerson
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("admin-token")}` } }
      );

      alert(`✅ Email sent to ${response.data.student.email}`);
      setRejectionModal({ show: false, fileType: null, reason: "", customMessage: "", contactPerson: "" });
    } catch (error) {
      console.error("Error sending email:", error);
      alert("❌ Failed to send email");
    } finally {
      setIsProcessing(false);
      setProcessingFileType(null);
    }
  };

  const handleVerify = async (rollNo) => {
    setIsVerifying(true);

    try {
        const AdminToken = localStorage.getItem("admin-token");
        if (!AdminToken) throw new Error("No authentication token found!");

        const response = await axios.post(
            `http://localhost:4000/students/completeverify/${rollNo}`,
            formData, // ✅ Send formData in request body
            {
                headers: {
                    Authorization: `Bearer ${AdminToken}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (response.data.success) {
            alert("✅ Student verified successfully!");
            navigate("/admin"); // Redirect to admin panel
        } else {
            throw new Error(response.data.message || "Verification failed");
        }
    } catch (error) {
        console.error("❌ Verification error:", error);
        alert(error.response?.data?.message || "❌ Verification failed. Please try again.");
    } finally {
        setIsVerifying(false);
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
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-8">
                Verify Student Details
              </h2>
              
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
                              ? () => {} 
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
                    {/* Training Letter Section */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-purple-600">Training Letter</label>
                        <div className="space-x-2">
                          <button
                            type="button"
                            onClick={() => handleDownload(formData.trainingLetter)}
                            className="text-purple-700 bg-purple-100 hover:bg-purple-200 px-3 py-1 rounded-md"
                          >
                            Download
                          </button>
                          <button
                            type="button"
                            onClick={() => setRejectionModal({ show: true, fileType: "trainingLetter", reason: "", customMessage: "", contactPerson: "" })}
                            className="text-white bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded-md disabled:opacity-50"
                            disabled={isProcessing}
                          >
                            Remove & Email
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Fee Receipt Section */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-purple-600">Fee Receipt</label>
                        <div className="space-x-2">
                          <button
                            type="button"
                            onClick={() => handleDownload(formData.feeReceipt)}
                            className="text-purple-700 bg-purple-100 hover:bg-purple-200 px-3 py-1 rounded-md"
                          >
                            Download
                          </button>
                          <button
                            type="button"
                            onClick={() => setRejectionModal({ show: true, fileType: "feeReceipt", reason: "", customMessage: "", contactPerson: "" })}
                            className="text-white bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded-md disabled:opacity-50"
                            disabled={isProcessing}
                          >
                            Remove & Email
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 text-center">
                  <button type="button" onClick={()=>handleVerify(formData.rollNo)} disabled={isVerifying} className="w-full sm:w-auto px-6 py-3 text-white bg-purple-600 hover:bg-purple-700 rounded-md">
                    {isVerifying ? "Verifying..." : "Verify"}
                  </button>
                </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Rejection Reason Modal */}
      {rejectionModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Select Rejection Details</h3>
            
            <div className="space-y-4">
              <select
                value={rejectionModal.reason}
                onChange={(e) => setRejectionModal(prev => ({ ...prev, reason: e.target.value }))}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Reason</option>
                {(rejectionModal.fileType === "trainingLetter" ? trainingReasons : feeReasons).map((reason) => (
                  <option key={reason} value={reason}>{reason}</option>
                ))}
              </select>

              {rejectionModal.reason === "Other" && (
                <textarea
                  value={rejectionModal.customMessage}
                  onChange={(e) => setRejectionModal(prev => ({ ...prev, customMessage: e.target.value }))}
                  placeholder="Enter custom message"
                  className="w-full p-2 border rounded"
                  rows="3"
                />
              )}

              <select
                value={rejectionModal.contactPerson}
                onChange={(e) => setRejectionModal(prev => ({ ...prev, contactPerson: e.target.value }))}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Contact Person (optional)</option>
                {contactPersons.map((person) => (
                  <option key={person} value={person}>{person}</option>
                ))}
              </select>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setRejectionModal(prev => ({ ...prev, show: false }))}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectionSubmit}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
                >
                  {isProcessing ? "Sending..." : "Send Email"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default StudentVerification;