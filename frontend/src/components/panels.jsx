import { useNavigate } from "react-router-dom";
import { Book, Calendar, FileText, GraduationCap, Users, Clock, UserPlus, User, FileCheck } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

export function Panels() {
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
    <div className="grid md:grid-cols-3 gap-8">
      {panels.map((panel, index) => (
        <Card key={index} className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-500">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                <panel.icon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{panel.title}</h3>
              <p className="text-gray-200 mb-4">{panel.subtitle}</p>
              <p className="text-gray-300">{panel.description}</p>
            </div>

            <div className="space-y-6">
              {panel.features.map((feature, i) => (
                <div key={i} className="flex flex-col items-center space-y-2">
                  <feature.icon className="w-8 h-8 text-blue-200" />
                  <p className="text-gray-200">{feature.text}</p>
                </div>
              ))}
            </div>

            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate(panel.path)}
              className="mt-6 px-6 py-3 bg-white text-purple-600 rounded-lg shadow-md hover:bg-opacity-90 transition-all duration-300 hover:shadow-lg
hover:transform hover:-translate-y-1"
            >
              Goto Panel
            </Button>
          </CardContent>

          <div className="absolute -top-16 -right-4 w-12 h-12 bg-white rounded-full shadow-xl opacity-30 transform -rotate-45" />
        </Card>
      ))}
    </div>
  );
}