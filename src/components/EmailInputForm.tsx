import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface EmailInputFormProps {
  emailType: string;
  formData: {
    recipient: string;
    subject: string;
    context: string;
    tone: string;
    existingEmail?: string;
  };
  onFormDataChange: (data: any) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const toneOptions = [
  { value: "formal", label: "Formal & Professional" },
  { value: "friendly", label: "Friendly & Casual" },
  { value: "apologetic", label: "Apologetic" },
  { value: "persuasive", label: "Persuasive" },
  { value: "grateful", label: "Grateful" },
];

export const EmailInputForm = ({
  emailType,
  formData,
  onFormDataChange,
  onGenerate,
  isGenerating,
}: EmailInputFormProps) => {
  const showExistingEmailField = emailType === "reply" || emailType === "summarize" || emailType === "reformat";

  return (
    <Card className="p-6 shadow-[var(--shadow-card)]">
      <div className="space-y-6">
        {!showExistingEmailField && (
          <>
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient (To)</Label>
              <Input
                id="recipient"
                placeholder="e.g., John Doe, jane@company.com"
                value={formData.recipient}
                onChange={(e) => onFormDataChange({ ...formData, recipient: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject / Topic</Label>
              <Input
                id="subject"
                placeholder="What is this email about?"
                value={formData.subject}
                onChange={(e) => onFormDataChange({ ...formData, subject: e.target.value })}
              />
            </div>
          </>
        )}

        {showExistingEmailField && (
          <div className="space-y-2">
            <Label htmlFor="existingEmail">
              {emailType === "reply" ? "Email to Reply To" : "Email to Process"}
            </Label>
            <Textarea
              id="existingEmail"
              placeholder="Paste the email content here..."
              rows={6}
              value={formData.existingEmail || ""}
              onChange={(e) => onFormDataChange({ ...formData, existingEmail: e.target.value })}
            />
          </div>
        )}

        {!showExistingEmailField && (
          <div className="space-y-2">
            <Label htmlFor="context">Email Context / Key Points</Label>
            <Textarea
              id="context"
              placeholder="What do you want to communicate? Add key details..."
              rows={4}
              value={formData.context}
              onChange={(e) => onFormDataChange({ ...formData, context: e.target.value })}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="tone">Tone</Label>
          <Select
            value={formData.tone}
            onValueChange={(value) => onFormDataChange({ ...formData, tone: value })}
          >
            <SelectTrigger id="tone">
              <SelectValue placeholder="Select a tone" />
            </SelectTrigger>
            <SelectContent>
              {toneOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={onGenerate}
          disabled={isGenerating}
          className="w-full"
          variant="gradient"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Sparkles className="animate-pulse" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles />
              Generate Email
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};
