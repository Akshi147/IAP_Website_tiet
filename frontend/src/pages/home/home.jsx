import Hero from '../../components/hero/hero';
import { GraduationCap, Users, UserPlus, BookOpen, Calendar, Award, Clock, FileCheck, UserCog } from "lucide-react";
import PanelCard from './components/panelCard';
import styles from "./home.module.css";

const Home = () => {
  const panels = [
    {
      title: "Student Panel",
      description: "Access your project workspace and submissions",
      icon: GraduationCap,
      href: "/student",
      features: [
        { icon: BookOpen, text: "View Course Materials" },
        { icon: Calendar, text: "Schedule Management" },
        { icon: FileCheck, text: "Submit Assignments" },
      ],
      badge: "Student Access",
    },
    {
      title: "Faculty Panel",
      description: "Review and evaluate student projects",
      icon: Users,
      href: "/faculty",
      features: [
        { icon: Award, text: "Grade Submissions" },
        { icon: Clock, text: "Track Progress" },
        { icon: UserCog, text: "Manage Students" },
      ],
      badge: "Faculty Access",
    },
    {
      title: "Mentor Panel",
      description: "Guide and support assigned students",
      icon: UserPlus,
      href: "/mentor",
      features: [
        { icon: Users, text: "Student Mentoring" },
        { icon: Calendar, text: "Schedule Meetings" },
        { icon: FileCheck, text: "Review Progress" },
      ],
      badge: "Mentor Access",
    },
  ];

  return (
    <>
      <Hero />
      <div className={styles.container}>
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">6 MONTH PROJECT SEMESTER</h2>
          <p className="text-lg text-gray-600">Welcome to online module for evaluation</p>
        </div>
        <div className={styles.cards}>
          {panels.map((panel) => (
            <PanelCard key={panel.title} {...panel} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
