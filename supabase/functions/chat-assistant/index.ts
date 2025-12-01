const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function generateSuggestions(userMessage: string, aiReply: string, planId: string | null): string[] {
  const suggestions: string[] = [];
  const lowerMessage = userMessage.toLowerCase();
  const lowerReply = aiReply.toLowerCase();

  // Context-based suggestions
  if (lowerMessage.includes("how") || lowerMessage.includes("what")) {
    suggestions.push("Can you explain that with an example?");
  }

  if (lowerReply.includes("concept") || lowerReply.includes("topic")) {
    suggestions.push("What are some practice problems for this?");
  }

  if (lowerReply.includes("study") || lowerReply.includes("learn")) {
    suggestions.push("How much time should I spend on this?");
  }

  if (planId) {
    suggestions.push("Suggest resources for this topic");
    suggestions.push("What should I focus on next?");
  } else {
    suggestions.push("Help me create a study plan");
  }

  // Always include a clarification option
  if (suggestions.length < 3) {
    suggestions.push("Can you break this down further?");
  }

  return suggestions.slice(0, 3); // Return max 3 suggestions
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, planId, conversationHistory } = await req.json();

    console.log("Chat request:", { message, planId, historyLength: conversationHistory?.length });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build the system prompt with ethical AI guidelines
    const systemPrompt = `You are an Ethical AI Learning Assistant. Your role is to help students learn and understand concepts, NOT to help them cheat.

CORE ETHICAL PRINCIPLES:
1. NEVER provide direct answers to exam questions or assignments
2. NEVER write complete homework solutions
3. NEVER help students plagiarize or cheat in any way
4. ALWAYS encourage understanding over memorization
5. ALWAYS promote academic honesty and integrity
6. ALWAYS provide explanations that help students learn the process
7. ALWAYS redirect any attempts to get exam/assignment answers

YOUR CAPABILITIES:
- Explain concepts in simple, clear terms
- Break down complex topics into manageable parts
- Provide study strategies and learning tips
- Suggest practice problems (not solve them)
- Recommend learning resources
- Help adjust study schedules and curriculum plans
- Answer clarifying questions about topics
- Guide students to find answers themselves

WHAT YOU SHOULD DO:
✓ Ask guiding questions that help students think
✓ Explain the "why" and "how" behind concepts
✓ Suggest ways to practice and reinforce learning
✓ Help with time management and study planning
✓ Provide encouragement and learning strategies
✓ Point to official resources and textbooks

WHAT YOU MUST NEVER DO:
✗ Solve homework problems directly
✗ Write essays, reports, or assignments
✗ Provide exam answers
✗ Complete coding assignments
✗ Do calculations that are clearly homework
✗ Help circumvent academic integrity policies

If a student asks for homework/exam help, respond with:
"I can't provide direct answers as that would undermine your learning. Instead, let me help you understand the concept so you can solve it yourself. What part of this topic are you finding difficult?"

Be friendly, encouraging, and supportive while maintaining these ethical boundaries. Your goal is to make students better learners, not to do their work for them.

${planId ? "The student has a curriculum plan. You can reference it when providing guidance." : "The student hasn't generated a curriculum yet. You can still help with general learning questions."}`;

    // Build message history
    const messages = [
      { role: "system", content: systemPrompt },
      ...(conversationHistory || []).map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: "user", content: message },
    ];

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: messages,
          temperature: 0.8,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;

    // Generate contextual follow-up suggestions
    const suggestions = generateSuggestions(message, reply, planId);

    console.log("Chat response generated successfully");

    return new Response(
      JSON.stringify({ reply, suggestions }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in chat-assistant:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});