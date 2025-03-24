import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "../../../components/header";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Footer } from "../../../components/footer";

export function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Error message state

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      email,
      password
    };
    try {
      const response = await axios.post('http://localhost:4000/admin/login', user);
      if (response.status === 200) {
        const data = response.data;
        localStorage.setItem('admin-token', data.token);
        navigate('/admin');
      }
    } catch (error) {
      // Set error message
      setErrorMessage(error.response.data.message);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-white px-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold mb-2">Welcome to Project Semester</h1>
            <p className="text-gray-600">Sign in to access your account</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Error Message Alert */}
            {errorMessage && (
              <div className="mb-4 p-4 bg-red-100 text-red-600 border border-red-300 rounded-lg">
                <p>{errorMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="email"
                  placeholder="Admin Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                Sign In
              </button>
            </form>
            <div className="mt-6 text-center space-y-2">
              <Link to="/forgotadminpassword" className="block text-purple-600 hover:text-purple-700">
                Forgot Password?
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}
