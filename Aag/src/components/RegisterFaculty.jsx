import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "./header";
import axios from "axios";
import { Footer } from "./footer";

export function FacultyRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    initial: "Mr",
    name: "",
    designation: "Professor",
    department: "",
    contactNo: "",
    email: "",
    password: ""
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/faculty/register", formData);
      console.log(response);
      if (response.status === 201) {
        const data = response.data;
        localStorage.setItem('faculty-token', data.token);
        navigate("/faculty");
      }
    } catch (error) {
        console.log(error);
      setErrorMessage(error);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-white px-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold mb-2">Faculty Registration</h1>
            <p className="text-gray-600">Join us by registering your details</p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {errorMessage && (
              <div className="mb-4 p-4 bg-red-100 text-red-600 border border-red-300 rounded-lg">
                <p>{errorMessage}</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <select name="initial" value={formData.initial} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300">
                <option value="Mr">Mr</option>
                <option value="Mrs">Mrs</option>
                <option value="Ms">Ms</option>
                <option value="Dr">Dr</option>
              </select>

              <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300" required />
              
              <select name="designation" value={formData.designation} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300">
                <option value="Professor">Professor</option>
                <option value="Associate Professor">Associate Professor</option>
                <option value="Assistant Professor">Assistant Professor</option>
                <option value="Lecturer">Lecturer</option>
              </select>
              
              <select name="department" value={formData.department} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300">
                <option value="">Choose one...</option>
                <option value="Computer Engineering">Computer Engineering</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Electronics & Communication Engineering">Electronics & Communication Engineering</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Biotechnology Engineering">Biotechnology Engineering</option>
                <option value="Electronic Instrumentation & Control Engineering">Electronic Instrumentation & Control Engineering</option>
                <option value="Mechatronics Engineering">Mechatronics Engineering</option>
                <option value="Mechanical Engineering (Production)">Mechanical Engineering (Production)</option>
                <option value="Master of Computer Applications">Master of Computer Applications</option>
                <option value="Software Engineering">Software Engineering</option>
              </select>
              
              <input type="text" name="contactNo" placeholder="Contact Number" value={formData.contactNo} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300" required />
              
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300" required />
              
              <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300" required />
              
              <button type="submit" className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                Register
              </button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <Link to="/facultylogin" className="block text-purple-600 hover:text-purple-700">
                Already registered? Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}
