import { Fragment } from 'react';
import { Route, Routes } from 'react-router-dom';
import Footer from './components/footer/footer';

import Home from './pages/home/home';

import StudentPanel from './pages/studentPanel/studentPanel'
import StudentLoginForm from './pages/studentPanel/studentLogin/stuLogin';
import StudentRegisterForm from './pages/studentPanel/studentRegister/stuRegister';
import StudentProtectedRoute from './pages/studentPanel/studentProtetedRoute';
import StudentLogout from './pages/studentPanel/studentLogout/studentLogout';
import ForgotStudentPassword from './pages/studentPanel/studentForgotPassword/stuForgot';
import StudentResetPassword from './pages/studentPanel/studentResetPassword/stuResetPassword';

import FacultyProtectedRoute from './pages/facultyPanel/facultyProtectedRoute';
import FacultyLogin from './pages/facultyPanel/facultyLogin/facultyLogin';
import FacultyLogout from './pages/facultyPanel/facultyLogout/facultyLogout';
import FacultyRegister from './pages/facultyPanel/facultyRegister/facultyRegister';
import FacultyPanel from './pages/facultyPanel/facultyPanel';

import AdminProtectedRoute from './pages/adminPanel/adminProtected';
import AdminLogout from './pages/adminPanel/adminLogout/adminLogout';
import AdminStudentVerification from './pages/adminPanel/adminVerifyDoc/adminVerifyDoc';
import  AdminLogin  from './pages/adminPanel/adminLogin/adminLogin';
import ChangeAdminPassword from './pages/adminPanel/adminChangePassword/adminChangePassword';
import ForgotAdminPassword from './pages/adminPanel/adminForgotPasswrod/adminForgotPassword';
import AdminPanel from './pages/adminPanel/adminPanel';
import AdminStudentUnderDocumentVerification from './pages/adminPanel/underDocVerify/adminUnderDocVerify';
import AdminStudentUnderPhase2Verification from './pages/adminPanel/underPhase2Verify/adminUnderPhase2Verify';

const App = () => {
  return (
    <Fragment>
      <Routes>
        <Route path="/" element={<Home />} />

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
        <Route path="/login" element={<StudentLoginForm />} />
        <Route path="/register" element={<StudentRegisterForm />} />
        <Route path="/forgotstudentpassword" element={<ForgotStudentPassword />} />
        <Route path="/reset-password" element={<StudentResetPassword />} />

        <Route path="/faculty/logout" element={
          <FacultyProtectedRoute>
            <FacultyLogout />
          </FacultyProtectedRoute>
        } />
        <Route path="/facultylogin" element={<FacultyLogin />} />
        <Route path="/facultyregister" element={<FacultyRegister />} />
        <Route path="/faculty" element={
          <FacultyProtectedRoute>
            <FacultyPanel />
          </FacultyProtectedRoute>
        } />

        <Route path="/admin/verifyStudentDocument/:rollNumber" element={
          <AdminProtectedRoute>
            <AdminStudentVerification />
          </AdminProtectedRoute>
        } />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/admin" element={
          <AdminProtectedRoute>
            <AdminPanel />
          </AdminProtectedRoute>
        } />
        <Route path="/adminlogout" element={
          <AdminProtectedRoute>
            <AdminLogout />
          </AdminProtectedRoute>
        } />
          <Route path="/forgotadminpassword" element={<ForgotAdminPassword/>} />
        <Route path="/adminchangepassword" element={
          <AdminProtectedRoute>
            <ChangeAdminPassword />
          </AdminProtectedRoute>
        } />
        <Route path="/underdocumentverification" element={
          <AdminProtectedRoute>
            <AdminStudentUnderDocumentVerification />
          </AdminProtectedRoute>
        } />
        <Route path="/phase2verification" element={
          <AdminProtectedRoute>
            <AdminStudentUnderPhase2Verification />
          </AdminProtectedRoute>
        } />
      </Routes>
      <Footer />
    </Fragment>
  );
};

export default App;