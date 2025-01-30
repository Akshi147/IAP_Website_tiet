import { Book, Calendar, FileText, GraduationCap, Users, Clock, UserPlus, User, FileCheck } from "lucide-react"
import { Card, CardContent } from "../components/ui/card"
import { Button } from "../components/ui/button"

export function Panels() {
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
    },
  ]

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {panels.map((panel, index) => (
        <Card key={index} className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <panel.icon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-sm text-muted-foreground mb-1">{panel.subtitle}</div>
              <h3 className="text-xl font-semibold mb-2">{panel.title}</h3>
              <p className="text-sm text-muted-foreground">{panel.description}</p>
            </div>
            <div className="space-y-4 mb-6">
              {panel.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <feature.icon className="w-5 h-5 text-purple-600" />
                  <span className="text-sm">{feature.text}</span>
                </div>
              ))}
            </div>
            <Button className="w-full bg-purple-600 hover:bg-purple-700">Access Panel</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

