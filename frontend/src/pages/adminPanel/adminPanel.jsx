import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbar/navbar';
import Admin from './adminSearchStudent/admin';

const AdminPanel = () => {
  const navigate = useNavigate()
  return (
   <>
    <Navbar
      navItems={[
        {name:"Students Under Document Verification",path:"/underdocumentverification"},
        {name:"Students In Phase 2",path:"/phase2verification"},
        { name: "Verify Student", path: "/admin" },
        {name:"Delete Student",path:"/deletestudent"},
        {name:"Generate Excel Sheet",path:"/generateExcel"},
        {name:"Freeze/Unfreeze Forms",path:"/freezeforms"},
        { name: "Verify Faculty", path: "/verifyfaculty" },
        { name: "Verify Mentor", path: "/mentor" },
        {name:"Change Password",path:"/adminchangepassword"}
      ]}
      downloadButton={{
        text: "Log Out",
        onClick: () => navigate("/adminlogout"),
      }}
    />
    <Admin />
   
   </>
  )
}

export default AdminPanel;