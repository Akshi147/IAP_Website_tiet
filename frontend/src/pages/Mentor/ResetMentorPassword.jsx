import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ResetMentorPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Extract token from URL
  const token = new URLSearchParams(window.location.search).get("token");

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing token.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:4000/mentors/resetpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Password successfully reset! Redirecting...");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setError(data.message || "Something went wrong. Try again.");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-6">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-center">Reset Password</h1>
        <p className="text-gray-600 text-center mb-4">Enter your new password</p>

        {message && <div className="bg-green-100 text-green-600 p-3 rounded-md">{message}</div>}
        {error && <div className="bg-red-100 text-red-600 p-3 rounded-md">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-purple-500"
            required
          />

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-md font-semibold hover:bg-purple-700 flex justify-center items-center"
            disabled={isLoading}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetMentorPassword;
