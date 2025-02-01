import { useNavigate } from "react-router-dom";
import { Book, Calendar, FileText, GraduationCap, Users, Clock, UserPlus, User, FileCheck } from "lucide-react";
import { Card, CardContent } from "../components/panelCard";
import { Button } from "../../../components/button/button";
import styles from "./panel.module.css";

const Panels = () => {
  const navigate = useNavigate();

  const panels = [
    {
      title: "Student Panel",
      subtitle: "Student Access",
      description: "Access your project workspace and submissions",
      icon: GraduationCap,
      features: [
        { icon: Book, text: "View Course Materials" },
        { icon: Calendar, text: "Schedule Management" },
        { icon: FileText, text: "Submit Assignments" },
      ],
      path: "/student",
    },
    {
      title: "Faculty Panel",
      subtitle: "Faculty Access",
      description: "Review and evaluate student projects",
      icon: Users,
      features: [
        { icon: FileCheck, text: "Grade Submissions" },
        { icon: Clock, text: "Track Progress" },
        { icon: UserPlus, text: "Manage Students" },
      ],
      path: "/faculty",
    },
    {
      title: "Mentor Panel",
      subtitle: "Mentor Access",
      description: "Guide and support assigned students",
      icon: User,
      features: [
        { icon: Users, text: "Student Mentoring" },
        { icon: Calendar, text: "Schedule Meetings" },
        { icon: FileText, text: "Review Progress" },
      ],
      path: "/mentor",
    },
  ];

  return (
    <div className={styles.gridContainer}>
      {panels.map((panel, index) => (
        <Card key={index} className={styles.card}>
          <CardContent className={styles.cardContent}>
            <div className={styles.panelHeader}>
              <div className={styles.iconContainer}>
                <panel.icon className={styles.panelIcon} />
              </div>
              <h3 className={styles.panelTitle}>{panel.title}</h3>
              <p className={styles.panelSubtitle}>{panel.subtitle}</p>
              <p className={styles.panelDescription}>{panel.description}</p>
            </div>

            <div className={styles.featuresContainer}>
              {panel.features.map((feature, i) => (
                <div key={i} className={styles.featureItem}>
                  <feature.icon className={styles.featureIcon} />
                  <p className={styles.featureText}>{feature.text}</p>
                </div>
              ))}
            </div>

            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate(panel.path)}
              className={styles.panelButton}
            >
              Goto Panel
            </Button>
          </CardContent>

          <div className={styles.backgroundAccent} />
        </Card>
      ))}
    </div>
  );
}

export default Panels;