import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../../components/navbar/navbar";

const ForgotStudentPassword = () => {
  const [rollNo, setRollNo] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:4000/students/forgotpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollNo }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Password reset link sent to your registered email.Pls Check Spam Folder too.");
      } else {
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setError(err || "Server error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <Navbar/>
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold mb-2">Student Password Reset</h1>
          <p className="text-gray-600">Enter your roll number to receive a reset link</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {message && (
            <div className="mb-4 p-4 bg-green-100 text-green-600 border border-green-300 rounded-lg">
              <p>{message}</p>
            </div>
          )}
          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-600 border border-red-300 rounded-lg">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Student Roll Number"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex justify-center items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-blue-600 hover:text-blue-700">
              Back to Student Login
            </Link>
          </div>
        </div>
      </div>
    </div>
    </>
    
  );
};

export default ForgotStudentPassword;