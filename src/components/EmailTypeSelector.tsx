import { Card } from "@/components/ui/card";
import { Mail, Reply, FileText, Sparkles, Maximize2 } from "lucide-react";

interface EmailTypeSelectorProps {
  selectedType: string;
  onSelectType: (type: string) => void;
}

const emailTypes = [
  {
    id: "new",
    title: "Write New Email",
    description: "Create a professional email from scratch",
    icon: Mail,
  },
  {
    id: "reply",
    title: "Reply to Email",
    description: "Generate a thoughtful response",
    icon: Reply,
  },
  {
    id: "summarize",
    title: "Summarize Email",
    description: "Get the key points quickly",
    icon: FileText,
  },
  {
    id: "reformat",
    title: "Reformat Email",
    description: "Make it more polite or formal",
    icon: Sparkles,
  },
];

export const EmailTypeSelector = ({ selectedType, onSelectType }: EmailTypeSelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {emailTypes.map((type) => {
        const Icon = type.icon;
        const isSelected = selectedType === type.id;
        
        return (
          <Card
            key={type.id}
            onClick={() => onSelectType(type.id)}
            className={`p-6 cursor-pointer transition-all duration-300 hover:shadow-[var(--shadow-card-hover)] ${
              isSelected 
                ? "border-primary bg-accent shadow-[var(--shadow-card-hover)]" 
                : "border-border shadow-[var(--shadow-card)]"
            }`}
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div className={`p-3 rounded-full transition-colors ${
                isSelected ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
              }`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">{type.title}</h3>
                <p className="text-xs text-muted-foreground">{type.description}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
