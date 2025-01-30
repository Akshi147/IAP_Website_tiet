import { Fragment } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/home/home';

import Student from './pages/studentPanel/student';
import StudentRegister from './pages/studentPanel/studentRegister/stuRegister';
import StudentForgotPassword from './pages/studentPanel/studentForgotPassword/stuForgot';

import Faculty from './pages/facultyPanel/faculty';
import FacultyRegister from './pages/facultyPanel/facultyRegister/facultyRegister';
import FacultyForgotPassword from './pages/facultyPanel/facultyForgotPassword/facultyForgot';

import Mentor from './pages/mentorPanel/mentor';
import MentorRegister from './pages/mentorPanel/mentorRegister/mentorRegister';
import MentorForgotPassword from './pages/mentorPanel/mentorForgotPassword/mentorForgot';

import Admin from './pages/adminPanel/admin';

import Navbar from './components/navbar/navbar';
import Footer from './components/footer/footer';


function App() {
  return (
    <Fragment>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/student" element={<Student />} />
        <Route path="/student/register" element={<StudentRegister />} />
        <Route path="/student/forgot-password" element={<StudentForgotPassword />} />

        <Route path="/admin" element={<Admin />} />

        <Route path="/faculty" element={<Faculty />} />
        <Route path="/faculty/register" element={<FacultyRegister />} />
        <Route path="/faculty/forgot-password" element={<FacultyForgotPassword />} />

        <Route path="/mentor" element={<Mentor />} />
        <Route path="/mentor/register" element={<MentorRegister />} />
        <Route path="/mentor/forgot-password" element={<MentorForgotPassword />} />
      </Routes>
      <Footer />
    </Fragment>
  );
}

export default App;
