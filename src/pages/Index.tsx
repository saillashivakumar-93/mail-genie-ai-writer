import { useState } from "react";
import { Mail } from "lucide-react";
import { EmailTypeSelector } from "@/components/EmailTypeSelector";
import { EmailInputForm } from "@/components/EmailInputForm";
import { EmailOutput } from "@/components/EmailOutput";
import { EmailTemplates } from "@/components/EmailTemplates";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/hero-email.jpg";

const Index = () => {
  const [selectedType, setSelectedType] = useState("new");
  const [formData, setFormData] = useState({
    recipient: "",
    subject: "",
    context: "",
    tone: "formal",
    existingEmail: "",
  });
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    // Validate inputs
    if (selectedType === "new" && (!formData.subject || !formData.context)) {
      toast.error("Please fill in the subject and context fields");
      return;
    }

    if ((selectedType === "reply" || selectedType === "summarize" || selectedType === "reformat") && !formData.existingEmail) {
      toast.error("Please paste the email content");
      return;
    }

    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-email', {
        body: { emailType: selectedType, formData }
      });

      if (error) {
        console.error("Error generating email:", error);
        throw new Error(error.message || "Failed to generate email");
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      setGeneratedEmail(data.generatedEmail);
      toast.success("Email generated successfully!");
    } catch (error) {
      console.error("Generation error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate email. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTemplateSelect = (template: any) => {
    setSelectedType("new");
    setFormData({
      ...formData,
      subject: template.subject,
      context: template.context,
      tone: template.tone,
    });
    toast.success(`Template "${template.title}" loaded!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/20">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-30 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative container mx-auto px-4 py-16 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Mail className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            MailGenie ✉️
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your AI-Powered Email Writing Assistant
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Create professional emails in seconds with intelligent AI assistance
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-16 space-y-8">
        {/* Email Type Selector */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">What would you like to do?</h2>
          <EmailTypeSelector selectedType={selectedType} onSelectType={setSelectedType} />
        </section>

        {/* Templates */}
        <section>
          <EmailTemplates onSelectTemplate={handleTemplateSelect} />
        </section>

        {/* Input Form and Output */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section>
            <h2 className="text-2xl font-semibold mb-6">Email Details</h2>
            <EmailInputForm
              emailType={selectedType}
              formData={formData}
              onFormDataChange={setFormData}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
            />
          </section>

          {generatedEmail && (
            <section>
              <h2 className="text-2xl font-semibold mb-6">Your Email</h2>
              <EmailOutput
                generatedEmail={generatedEmail}
                onRegenerate={handleGenerate}
                isRegenerating={isGenerating}
              />
            </section>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 backdrop-blur-sm py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>MailGenie - Making email writing effortless with AI</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
