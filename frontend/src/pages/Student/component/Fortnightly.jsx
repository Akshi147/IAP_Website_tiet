import { useEffect, useState } from "react";
import axios from "axios";
import { LockClosedIcon, CheckIcon } from "@heroicons/react/24/outline";

const FortnightlyReports = () => {
  const [reports, setReports] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/freezeform/fortnightly",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setReports(response.data.reports);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reports:", error);
        setLoading(false);
      }
    };

    fetchReports();
  }, [token]);

  const handleSubmit = async (period) => {
    setSubmitting(true);
    try {
      await axios.put(
        `http://localhost:4000/freezeform/fortnightly/${period}`,
        { report: reports[period].report },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Report updated successfully!");
    } catch (error) {
      console.error("Error updating report:", error);
    } finally {
      setSubmitting(false);
      setShowConfirmation(null);
    }
  };

  const handleChange = (period, value) => {
    setReports((prev) => ({
      ...prev,
      [period]: { ...prev[period], report: value },
    }));
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-800 rounded-2xl p-8 shadow-2xl mb-8 text-white">
        <h1 className="text-4xl font-bold text-white text-center mb-4">
          Fortnightly Reflection Reports
        </h1>
        <p className="text-blue-100 text-center text-lg opacity-90">
          Submit and manage your bi-weekly progress reports with confidence
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(reports).map(([period, data]) => (
          <div
            key={period}
            className={`relative bg-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl ${
              !data.isUnlocked ? "opacity-75" : ""
            }`}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {period}
                </h3>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    data.isUnlocked
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {data.isUnlocked ? (
                    <>
                      <CheckIcon className="w-4 h-4 mr-1" />
                      Editable
                    </>
                  ) : (
                    <>
                      <LockClosedIcon className="w-4 h-4 mr-1" />
                      Locked
                    </>
                  )}
                </span>
              </div>

              <textarea
                className={`w-full px-4 py-3 border ${
                  data.isUnlocked
                    ? "border-blue-200 focus:ring-2 focus:ring-blue-500"
                    : "border-gray-200 bg-gray-50"
                } rounded-lg transition-all duration-200 resize-none`}
                rows="4"
                value={data.report}
                onChange={(e) => handleChange(period, e.target.value)}
                disabled={!data.isUnlocked}
                placeholder={
                  data.isUnlocked
                    ? "Write your report here..."
                    : "This period is no longer editable"
                }
              />

              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setSelectedPeriod(period);
                    setShowConfirmation(true);
                  }}
                  disabled={!data.isUnlocked || submitting}
                  className={`inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white transition-colors duration-200 ${
                    data.isUnlocked
                      ? "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  {submitting && selectedPeriod === period ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    "Submit Report"
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Confirm Submission
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to submit this report? Once submitted, you
              won't be able to make further changes.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubmit(selectedPeriod)}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Confirm Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FortnightlyReports;