const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { subjects, durationWeeks, hoursPerDay, goal, hardestSubject, learningStyle, includeBiasWarnings, focusOnFairness } =
      await req.json();

    console.log("Generating curriculum with params:", {
      subjects,
      durationWeeks,
      hoursPerDay,
      goal,
      hardestSubject,
      learningStyle,
      includeBiasWarnings,
      focusOnFairness,
    });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build the prompt for curriculum generation
    const prompt = `You are an expert curriculum designer. Create a detailed, personalized ${durationWeeks}-week study curriculum for a student with the following requirements:

Subjects: ${subjects.join(", ")}
Study Time: ${hoursPerDay} hours per day
Academic Goal: ${goal || "General mastery"}
Learning Style: ${learningStyle}
${hardestSubject ? `Hardest Subject (needs extra focus): ${hardestSubject}` : ""}
${includeBiasWarnings ? "IMPORTANT: Include a 'biasNote' field in each module with text 'Bias evaluation pending'" : ""}
${focusOnFairness ? "IMPORTANT: Add a final module titled 'Fair Learning Practices' covering ethical considerations" : ""}

CRITICAL INSTRUCTIONS:
1. Create exactly ${durationWeeks} weekly modules
2. Distribute subjects evenly across the weeks
3. Include progressive learning - start with fundamentals, build to advanced topics
4. Tailor activities to the ${learningStyle} learning style
5. For each week, provide:
   - Week number
   - Subject focus
   - Specific topic title
   - 3-5 clear learning outcomes
   - 3-5 practical activities (exercises, readings, practice problems)
   - 3-5 specific resources with ACTUAL WORKING URLs (mix of free and paid)
   ${includeBiasWarnings ? '- A biasNote field with the text "Bias evaluation pending"' : ""}

RESOURCE REQUIREMENTS:
- Each resource must be a JSON object with "title", "url", and "type" (free/paid)
- Include real, working URLs to actual educational resources
- Mix free resources (Khan Academy, MIT OpenCourseWare, YouTube, etc.) with paid options (Udemy, Coursera, textbooks)
- For textbooks, include Amazon or publisher links
- Ensure all URLs are valid and currently accessible

${hardestSubject ? `Give extra attention and more practice activities for ${hardestSubject}.` : ""}

Return ONLY a valid JSON object in this exact format (no markdown, no code blocks):
{
  "planId": "unique-id-string",
  "duration_weeks": ${durationWeeks},
  "modules": [
    {
      "week": 1,
      "subject": "Subject Name",
      "title": "Specific Topic Title",
      "learning_outcomes": ["outcome 1", "outcome 2", "outcome 3"],
      "activities": ["activity 1", "activity 2", "activity 3"],
      "resources": [
        {
          "title": "Resource Name",
          "url": "https://actual-url.com",
          "type": "free"
        },
        {
          "title": "Paid Course Name",
          "url": "https://actual-url.com",
          "type": "paid"
        }
      ]${includeBiasWarnings ? ',\n      "biasNote": "Bias evaluation pending"' : ""}
    }
  ]
}`;

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
          messages: [
            {
              role: "system",
              content:
                "You are a curriculum design expert. Always return valid JSON only, no markdown formatting.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI response received");

    let curriculumText = data.choices[0].message.content;

    // Clean up the response - remove markdown code blocks if present
    curriculumText = curriculumText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    // Parse the JSON
    let curriculum;
    try {
      curriculum = JSON.parse(curriculumText);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Attempted to parse:", curriculumText);
      throw new Error("Failed to parse curriculum JSON");
    }

    // Ensure planId exists
    if (!curriculum.planId) {
      curriculum.planId = `plan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    // Add Fair Learning Practices module if requested
    if (focusOnFairness && curriculum.modules) {
      curriculum.modules.push({
        week: curriculum.modules.length + 1,
        subject: "Ethics",
        title: "Fair Learning Practices",
        learning_outcomes: [
          "Understand the importance of ethical learning practices",
          "Recognize bias in educational materials and AI-generated content",
          "Apply fairness principles to personal learning journey"
        ],
        activities: [
          "Reflect on potential biases in learning materials",
          "Evaluate AI-generated content critically",
          "Develop strategies for inclusive and fair learning"
        ],
        resources: [
          { title: "Ethics in AI Education", url: "https://ethics.org.uk/education", type: "free" },
          { title: "Understanding Bias in Learning", url: "https://www.coursera.org/learn/ethics-technology-engineering", type: "paid" }
        ],
        ...(includeBiasWarnings && { biasNote: "Bias evaluation pending" })
      });
    }

    console.log("Successfully generated curriculum");

    return new Response(JSON.stringify(curriculum), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-curriculum:", error);
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