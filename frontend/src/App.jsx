import { Fragment } from 'react';
import { Route, Routes } from 'react-router-dom';
import Footer from './components/footer/footer';

import Home from './pages/home/home';

import StudentPanel from './pages/studentPanel/studentPanel'
import StudentLoginForm from './pages/studentPanel/studentLogin/stuLogin';
import StudentRegisterForm from './pages/studentPanel/studentRegister/stuRegister';
import StudentProtectedRoute from './pages/studentPanel/studentProtetedRoute';
import StudentLogout from './pages/studentPanel/studentLogout/studentLogout';
import StudentForgotPassword from './pages/studentPanel/studentForgotPassword/stuForgot';

// import FacultyProtectedRoute from './pages/Faculty/FacultyProtectedRoute';
// import { LoginFormFaculty } from './pages/Faculty/component/LoginFaculty';
// import FacultyLogout from './pages/Faculty/component/FacultyLogout';
// import { FacultyRegister } from './pages/Faculty/component/RegisterFaculty';
// import FacultyPanel from './pages/Faculty/FacultyPanel';

import AdminProtectedRoute from './pages/adminPanel/adminProtected';
import AdminLogout from './pages/adminPanel/component/adminLogout';
import AdminStudentVerification from './pages/adminPanel/component/adminVerifyDoc';
import  AdminLogin  from './pages/adminPanel/component/adminLogin';
import AdminPanel from './pages/adminPanel/adminPanel';

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
        <Route path="/forgot-password" element={<StudentForgotPassword />} />
        <Route path="/login" element={<StudentLoginForm />} />
        <Route path="/register" element={<StudentRegisterForm />} />

        {/* <Route path="/faculty/logout" element={
          <FacultyProtectedRoute>
            <FacultyLogout />
          </FacultyProtectedRoute>
        } />
        <Route path="/facultylogin" element={<LoginFormFaculty />} />
        <Route path="/facultyregister" element={<FacultyRegister />} />
        <Route path="/faculty" element={
          <FacultyProtectedRoute>
            <FacultyPanel />
          </FacultyProtectedRoute>
        } /> */}

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
      </Routes>
      <Footer />
    </Fragment>
  );
};

export default App;