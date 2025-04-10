import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "../../../components/header";
import { Footer } from "../../../components/footer";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Book, GraduationCap, FileText } from "lucide-react";

export function LoginForm() {
  const navigate = useNavigate();
  const [rollNo, setRollNo] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const student = {
      rollNo,
      password
    };
    try {
      const response = await axios.post('http://localhost:4000/students/login', student);
      if (response.status === 200) {
        const data = response.data;
        localStorage.setItem('token', data.token);
        navigate('/student');
      }
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply blur-xl" />
          <div className="absolute top-1/3 right-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply blur-xl" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-indigo-100 rounded-full mix-blend-multiply blur-xl" />
        </div>

        {/* Academic Icons Pattern */}
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-5">
          <div className="grid grid-cols-3 gap-24 rotate-12">
            <Book className="w-24 h-24 text-purple-200" />
            <GraduationCap className="w-24 h-24 text-blue-200" />
            <FileText className="w-24 h-24 text-indigo-200" />
          </div>
        </div>

        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold mb-2 text-gray-800">Welcome to Project Semester</h1>
            <p className="text-gray-600">Sign in to access your account</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm">
            {errorMessage && (
              <div className="mb-4 p-4 bg-red-100 text-red-600 border border-red-300 rounded-lg">
                <p>{errorMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  placeholder="Student Roll Number"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
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
              <Link to="/register" className="block text-purple-600 hover:text-purple-700">
                Register with us
              </Link>
              <Link to="/forgotstudentpassword" className="block text-purple-600 hover:text-purple-700">
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