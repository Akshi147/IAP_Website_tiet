import React from 'react';
import { Route, Routes } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage'
import StudentPanel from './pages/StudentPanel'
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import StudentProtectedRoute from './pages/StudentProtectedRoute';
import FacultyProtectedRoute from './pages/FacultyProtectedRoute';
import AdminProtectedRoute from './pages/AdminProtected';
import StudentLogout from './components/StudentLogout';
import { LoginFormFaculty } from './components/LoginFaculty';
import FacultyLogout from './components/FacultyLogout';
import { FacultyRegister } from './components/RegisterFaculty';
import FacultyPanel from './pages/FacultyPanel';
import StudentVerification from './components/VerifyDocument';
import { AdminLogin } from './components/AdminLogin';
import AdminPanel from './pages/AdminPanel';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/student" element={
          <StudentProtectedRoute>
            <StudentPanel />
          </StudentProtectedRoute>
        } />
        <Route path="/student/logout" element={
          <StudentProtectedRoute>
            <StudentLogout />
          </StudentProtectedRoute>
        } />
        <Route path="/faculty/logout" element={
          <FacultyProtectedRoute>
            <FacultyLogout />
          </FacultyProtectedRoute>
        } />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/facultylogin" element={<LoginFormFaculty />} />
        <Route path="/facultyregister" element={<FacultyRegister />} />
        <Route path="/faculty" element={

          <FacultyProtectedRoute>
            <FacultyPanel />
          </FacultyProtectedRoute>
        } />
        <Route path="/admin/verifyStudentDocument/:rollNumber" element={
          <AdminProtectedRoute>
            <StudentVerification />
          </AdminProtectedRoute>


        } />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/admin" element={
          <AdminProtectedRoute>
            <AdminPanel />
          </AdminProtectedRoute>
        } />




      </Routes>
    </div>
  );
};

export default App;
