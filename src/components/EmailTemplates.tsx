import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Briefcase, Heart, FileCheck, Clock } from "lucide-react";

interface EmailTemplatesProps {
  onSelectTemplate: (template: Template) => void;
}

interface Template {
  title: string;
  subject: string;
  context: string;
  tone: string;
  icon: any;
}

const templates: Template[] = [
  {
    title: "Leave Request",
    subject: "Leave Request",
    context: "I would like to request time off for personal reasons",
    tone: "formal",
    icon: Calendar,
  },
  {
    title: "Job Application",
    subject: "Application for [Position Name]",
    context: "Expressing interest in a job position and highlighting relevant experience",
    tone: "formal",
    icon: Briefcase,
  },
  {
    title: "Meeting Follow-up",
    subject: "Following up on our meeting",
    context: "Summarizing key points from our recent meeting and next steps",
    tone: "friendly",
    icon: Clock,
  },
  {
    title: "Client Proposal",
    subject: "Proposal for [Project Name]",
    context: "Presenting a business proposal with timeline and deliverables",
    tone: "persuasive",
    icon: FileCheck,
  },
  {
    title: "Thank You Note",
    subject: "Thank you",
    context: "Expressing gratitude for someone's help or support",
    tone: "grateful",
    icon: Heart,
  },
];

export const EmailTemplates = ({ onSelectTemplate }: EmailTemplatesProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Quick Templates</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {templates.map((template) => {
          const Icon = template.icon;
          return (
            <Card
              key={template.title}
              className="p-4 hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 cursor-pointer"
              onClick={() => onSelectTemplate(template)}
            >
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="p-2 rounded-full bg-accent">
                  <Icon className="h-5 w-5 text-accent-foreground" />
                </div>
                <h4 className="text-sm font-medium">{template.title}</h4>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
