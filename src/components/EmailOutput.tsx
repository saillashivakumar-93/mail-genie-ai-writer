import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, RefreshCw, Edit2, Check } from "lucide-react";
import { toast } from "sonner";

interface EmailOutputProps {
  generatedEmail: string;
  onRegenerate: () => void;
  isRegenerating: boolean;
}

export const EmailOutput = ({ generatedEmail, onRegenerate, isRegenerating }: EmailOutputProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEmail, setEditedEmail] = useState(generatedEmail);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(isEditing ? editedEmail : generatedEmail);
      setCopied(true);
      toast.success("Email copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy email");
    }
  };

  const handleEdit = () => {
    if (!isEditing) {
      setEditedEmail(generatedEmail);
    }
    setIsEditing(!isEditing);
  };

  return (
    <Card className="p-6 shadow-[var(--shadow-card)]">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Generated Email</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
            >
              <Edit2 />
              {isEditing ? "Done Editing" : "Edit"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
            >
              {copied ? <Check /> : <Copy />}
              {copied ? "Copied!" : "Copy"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onRegenerate}
              disabled={isRegenerating}
            >
              <RefreshCw className={isRegenerating ? "animate-spin" : ""} />
              Regenerate
            </Button>
          </div>
        </div>

        {isEditing ? (
          <Textarea
            value={editedEmail}
            onChange={(e) => setEditedEmail(e.target.value)}
            rows={12}
            className="font-mono text-sm"
          />
        ) : (
          <div className="prose prose-sm max-w-none">
            <div className="p-4 bg-secondary rounded-lg whitespace-pre-wrap font-sans text-sm leading-relaxed">
              {generatedEmail}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
