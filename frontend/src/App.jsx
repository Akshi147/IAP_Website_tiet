import { Fragment } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/home/home';
import Student from './pages/studentPanel/student';
import Faculty from './pages/facultyPanel/faculty';
import Mentor from './pages/mentorPanel/mentor';
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
        <Route path="/admin" element={<Admin />} />
        <Route path="/faculty" element={<Faculty />} />
        <Route path="/mentor" element={<Mentor />} />
      </Routes>
      <Footer />
    </Fragment>
  );
}

export default App;
