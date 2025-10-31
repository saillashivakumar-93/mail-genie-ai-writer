import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { emailType, formData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build the prompt based on email type
    let systemPrompt = "You are a professional email writing assistant. Generate clear, well-structured emails that are appropriate for the given context and tone.";
    let userPrompt = "";

    switch (emailType) {
      case "new":
        userPrompt = `Write a professional email with the following details:
- Recipient: ${formData.recipient || "the recipient"}
- Subject: ${formData.subject}
- Context: ${formData.context}
- Tone: ${formData.tone}

Generate a complete, well-formatted email that is concise and professional. Include proper greetings and sign-offs.`;
        break;

      case "reply":
        userPrompt = `Write a ${formData.tone} reply to the following email:

${formData.existingEmail}

The reply should be professional, address the key points, and maintain a ${formData.tone} tone.`;
        break;

      case "summarize":
        userPrompt = `Summarize the following email in a concise, bullet-point format:

${formData.existingEmail}

Focus on:
- Key points and main messages
- Action items or requests
- Important dates or deadlines
- Decisions made

Keep the summary clear and organized.`;
        break;

      case "reformat":
        userPrompt = `Rewrite the following email to be more ${formData.tone}:

${formData.existingEmail}

Maintain the core message but adjust the language, structure, and tone to be ${formData.tone} while keeping it professional.`;
        break;

      default:
        throw new Error("Invalid email type");
    }

    console.log("Generating email with Lovable AI...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits depleted. Please add more credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const generatedEmail = data.choices[0].message.content;

    console.log("Email generated successfully");

    return new Response(
      JSON.stringify({ generatedEmail }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in generate-email function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
