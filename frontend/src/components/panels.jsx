import { useNavigate } from "react-router-dom";
import { Book, Calendar, FileText, GraduationCap, Users, Clock, UserPlus, User, FileCheck } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

export function Panels() {
  const navigate = useNavigate();

  const panels = [
    {
      title: "Student Portal",
      subtitle: "Academic Management",
      description: "Access course materials, schedules, and assignment submissions",
      icon: GraduationCap,
      features: [
        { icon: Book, text: "Course Materials" },
        { icon: Calendar, text: "Schedule Management" },
        { icon: FileText, text: "Assignment Submission" },
      ],
      path: "/student",
    },
    {
      title: "Faculty Portal",
      subtitle: "Academic Oversight",
      description: "Evaluate submissions and monitor student progress",
      icon: Users,
      features: [
        { icon: FileCheck, text: "Grading System" },
        { icon: Clock, text: "Progress Tracking" },
        { icon: UserPlus, text: "Student Roster" },
      ],
      path: "/faculty",
    },
    {
      title: "Mentor Portal",
      subtitle: "Student Guidance",
      description: "Support student development and review progress",
      icon: User,
      features: [
        { icon: Users, text: "Mentorship Program" },
        { icon: Calendar, text: "Meeting Coordination" },
        { icon: FileText, text: "Progress Review" },
      ],
      path: "/mentor",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-3 gap-6">
        {panels.map((panel, index) => (
          <Card key={index} className="group relative hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-8">
              <div className="flex flex-col space-y-6">
                {/* Header Section */}
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <panel.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{panel.title}</h3>
                    <p className="text-sm text-gray-500">{panel.subtitle}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed">
                  {panel.description}
                </p>

                {/* Features List */}
                <div className="space-y-4 border-t pt-4">
                  {panel.features.map((feature, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <feature.icon className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-600">{feature.text}</span>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <Button
                  variant="outline"
                  className="mt-4 w-full border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                  onClick={() => navigate(panel.path)}
                >
                  Access Portal
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}