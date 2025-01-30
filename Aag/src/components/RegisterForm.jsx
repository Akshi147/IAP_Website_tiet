
import { useState } from "react"
import { Link } from "react-router-dom";
import { Header } from "./header";

export  function RegisterForm() {
  const [formData, setFormData] = useState({
    rollNumber: "",
    branch: "",
    semesterType: "",
    classSubgroup: "",
    trainingArrangedBy: "",
    studentName: "",
    phoneNumber: "",
    email: "",
    companyName: "",
    companyCity: "",
    password: "",
    confirmPassword: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle registration logic here
  }

  return (
    <>
    <Header />
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-white px-6 py-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold mb-2">Create New Account</h1>
          <p className="text-gray-600">Please fill in your details to register</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <input
                  type="text"
                  name="rollNumber"
                  placeholder="Student's Roll Number"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <select
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Branch</option>
                  <option value="cse">Computer Science</option>
                  <option value="it">Information Technology</option>
                  <option value="ece">Electronics</option>
                </select>
              </div>

              <div>
                <select
                  name="semesterType"
                  value={formData.semesterType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Semester Type</option>
                  <option value="regular">Regular</option>
                  <option value="summer">Summer</option>
                </select>
              </div>

              <div>
                <input
                  type="text"
                  name="classSubgroup"
                  placeholder="Class Subgroup"
                  value={formData.classSubgroup}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <select
                  name="trainingArrangedBy"
                  value={formData.trainingArrangedBy}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="">Training Arranged By</option>
                  <option value="college">College</option>
                  <option value="self">Self</option>
                </select>
              </div>

              <div>
                <input
                  type="text"
                  name="studentName"
                  placeholder="Student Name"
                  value={formData.studentName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <input
                  type="text"
                  name="companyName"
                  placeholder="Company Name"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <input
                  type="text"
                  name="companyCity"
                  placeholder="Company City (Mention the place/city where you are doing project semester)"
                  value={formData.companyCity}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="flex justify-center">
              <div className="g-recaptcha" data-sitekey="your_site_key"></div>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Submit
            </button>

            <div className="text-center space-x-4">
              <Link to="/login" className="text-purple-600 hover:text-purple-700">
                Login
              </Link>
              <span className="text-gray-400">|</span>
              <Link to="/forgot-password" className="text-purple-600 hover:text-purple-700">
                Forget Password
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
    
  )
}

