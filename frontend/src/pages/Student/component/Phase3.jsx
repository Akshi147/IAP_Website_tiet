import { useState, useEffect } from "react";
import axios from "axios";

const Phase3 = () => {
  const [formData, setFormData] = useState({
    mentorName: "",
    mentorEmail: "",
    trainingStartDate: "",
    stipendPerMonth: "",
    mentorContact: "",
    studentUpdatedNumber: "",
    trainingEndDate: "",
    country: "India",
    city: "",
    companyName: "",
    completeAddress: "",
    landmark: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPhase3Locked, setIsPhase3Locked] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:4000/students/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const { trainingStartDate, trainingEndDate, mentorContact, phoneNumber, mentorEmail, mentorName, stipend, phase3verified } = response.data.student;
        const { companyCountry, companyCity, companyName, completeAddress, landmark } = response.data.student.companyDetails;

        setFormData({
          mentorName,
          mentorEmail,
          trainingStartDate: trainingStartDate ? trainingStartDate.split("T")[0] : "",
          stipendPerMonth: stipend || "",
          mentorContact: mentorContact || "",
          studentUpdatedNumber: phoneNumber || "",
          trainingEndDate: trainingEndDate ? trainingEndDate.split("T")[0] : "",
          country: companyCountry || "India",
          city: companyCity || "",
          companyName: companyName || "",
          completeAddress: completeAddress || "",
          landmark: landmark || "",
        });
        
        setIsPhase3Locked(phase3verified);
        setErrorMessage("");
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setErrorMessage("Failed to load profile data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setSuccessMessage("");
    setErrorMessage("");

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!showConfirmation) {
      setShowConfirmation(true);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/students/phase3",
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      console.log("Data submitted successfully:", response.data);
      setSuccessMessage("Your details have been updated successfully! 🎉");
      setErrorMessage("");
    } catch (error) {
      console.error("Error submitting form:", error);
      if (error.response) {
        setErrorMessage(error.response.data.message || "Failed to update details. Please try again.");
      } else {
        setErrorMessage("Network error. Please check your internet connection.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-8">
              Stipend Information, Mentor Detail, Company Address
            </h2>

            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
              </div>
            ) : (
              <>
                {successMessage && (
                  <div className="mb-4 text-green-700 bg-green-100 p-3 rounded-lg">{successMessage}</div>
                )}
                {errorMessage && (
                  <div className="mb-4 text-red-700 bg-red-100 p-3 rounded-lg">{errorMessage}</div>
                )}

                {showConfirmation && (
                  <div className="mb-4 text-yellow-700 bg-yellow-100 p-3 rounded-lg">
                    ⚠️ Please recheck your details! This is the final time you can edit.
                    <div className="flex justify-between mt-2">
                      <button
                        onClick={() => setShowConfirmation(false)}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-purple-600 text-white rounded-md"
                      >
                        Confirm & Submit
                      </button>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-purple-600">Mentor's Name</label>
                      <input
                        type="text"
                        name="mentorName"
                        value={formData.mentorName}
                        onChange={handleInputChange}
                        disabled={isPhase3Locked}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-purple-600">Mentor's Email</label>
                      <input
                        type="email"
                        name="mentorEmail"
                        value={formData.mentorEmail}
                        onChange={handleInputChange}
                        disabled={isPhase3Locked}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-purple-600">Training Start Date</label>
                      <input
                        type="date"
                        name="trainingStartDate"
                        value={formData.trainingStartDate}
                        onChange={handleInputChange}
                        disabled={isPhase3Locked}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-purple-600">Stipend(/Month)</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">₹</span>
                        <input
                          type="number"
                          name="stipendPerMonth"
                          value={formData.stipendPerMonth}
                          onChange={handleInputChange}
                          disabled={isPhase3Locked}
                          className="w-full pl-7 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-purple-600">Mentor's Contact Number</label>
                      <input
                        type="tel"
                        name="mentorContact"
                        value={formData.mentorContact}
                        onChange={handleInputChange}
                        disabled={isPhase3Locked}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-purple-600">Student's Updated Number</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">+91</span>
                        <input
                          type="tel"
                          name="studentUpdatedNumber"
                          value={formData.studentUpdatedNumber}
                          onChange={handleInputChange}
                          disabled={isPhase3Locked}
                          className="w-full pl-12 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-purple-600">Training End Date</label>
                      <input
                        type="date"
                        name="trainingEndDate"
                        value={formData.trainingEndDate}
                        onChange={handleInputChange}
                        disabled={isPhase3Locked}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Company/Organization Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-purple-600">Country</label>
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          disabled={isPhase3Locked}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                        >
                          <option value="India">India</option>
                          <option value="Others">Others</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-purple-600">City</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          disabled={isPhase3Locked}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                          required
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-purple-600">Company Name</label>
                        <input
                          type="text"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          disabled={isPhase3Locked}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                          required
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-purple-600">Complete Address</label>
                        <textarea
                          name="completeAddress"
                          value={formData.completeAddress}
                          onChange={handleInputChange}
                          disabled={isPhase3Locked}
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                          required
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-purple-600">LandMark</label>
                        <input
                          type="text"
                          name="landmark"
                          value={formData.landmark}
                          onChange={handleInputChange}
                          disabled={isPhase3Locked}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center pt-6">
                    <button
                      type="submit"
                      disabled={isPhase3Locked}
                      className={`px-6 py-3 border border-transparent text-base font-medium rounded-md text-white ${isPhase3Locked ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"}`}
                    >
                      Update
                    </button>
                  </div>

                  {isPhase3Locked && (
                    <div className="mt-4 text-red-700 bg-red-100 p-3 rounded-lg text-center">
                      🚫 You can no longer edit this form because it is locked.
                    </div>
                  )}
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Phase3;
