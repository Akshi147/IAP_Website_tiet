import { useState } from "react"
import styles from "./stuForgot.module.css";
import Navbar from "../../../components/navbar/navbar";

const StudentForgotPassword = () => {
  const [rollNo, setRollNo] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle login logic here
  }

  return (
    <>
      <Navbar />
    <div className={`${styles.container} min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-white px-6`}>
      <div className={`${styles.formContainer} w-full max-w-md`}>
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold mb-2">Welcome to Project Semester</h1>
          <p className="text-gray-600">Sign in to access your account</p>
        </div>

        <div className={`${styles.formBox} bg-white rounded-2xl shadow-xl p-8`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Student Roll Number"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                className={`${styles.inputField} w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                required
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${styles.inputField} w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                required
              />
            </div>

            <button
              type="submit"
              className={`${styles.submitButton} w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors`}
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
    </>
  )
}

export default StudentForgotPassword;
