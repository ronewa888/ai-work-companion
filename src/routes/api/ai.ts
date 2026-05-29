import { createFileRoute } from "@tanstack/react-router";

const SYSTEM_PROMPTS: Record<string, string> = {
  email: `You are an expert business communication specialist working inside FlowMind AI. Generate professional emails that are clear, purposeful, and appropriate for the specified audience and tone. Always structure with: greeting, context, main message, action items (if requested), and closing.

Format your output as:
Subject: <subject line>

<email body>`,
  meeting: `You are an expert meeting facilitator and executive assistant inside FlowMind AI. Extract and structure meeting information with precision. Be concise but comprehensive. Distinguish between decisions made vs topics discussed.

Use clean markdown with clear ## headers for each requested section. For action items, use a bullet list with □ checkboxes and include owners + deadlines when mentioned. Highlight deadlines in **bold**.`,
  tasks: `You are a productivity expert and time management coach inside FlowMind AI, trained in GTD, the Eisenhower Matrix, and time-blocking. Create a realistic, actionable daily plan based on the user's available hours and chosen prioritization style.

Output a structured schedule as markdown:
## Schedule
Use time blocks with priority indicators (🔴 High / 🟡 Medium / 🟢 Low) and time estimates if requested.

## Rationale
Briefly explain why tasks were prioritized this way.`,
  research: `You are a senior research analyst inside FlowMind AI with expertise across business, technology, science, and current affairs. Provide accurate, well-structured research at the requested depth and format.

Always include:
## Key Takeaways
Short bullet list.

## Findings
Structured per the requested format.

## Considerations / Trade-offs
Important caveats or opposing views.

## Follow-up Questions
3 worth exploring.

End with **Confidence: High/Medium/Low** based on topic complexity.`,
  chat: `You are FlowMind AI, a professional workplace productivity assistant. You help professionals with email writing, task planning, research, meeting summarization, and general work productivity. Be concise, practical, and professional. Format responses with markdown when helpful. Always offer to help further at the end of responses.`,
};

export const Route = createFileRoute("/api/ai")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { feature, messages, input } = await request.json();
          const systemPrompt = SYSTEM_PROMPTS[feature] ?? SYSTEM_PROMPTS.chat;
          const apiKey = process.env.LOVABLE_API_KEY;
          if (!apiKey) {
            return new Response(JSON.stringify({ error: "LOVABLE_API_KEY not configured" }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }

          const chatMessages = messages?.length
            ? messages
            : [{ role: "user", content: input ?? "" }];

          const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "google/gemini-2.5-flash",
              messages: [{ role: "system", content: systemPrompt }, ...chatMessages],
            }),
          });

          if (!resp.ok) {
            if (resp.status === 429) {
              return new Response(
                JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }),
                { status: 429, headers: { "Content-Type": "application/json" } },
              );
            }
            if (resp.status === 402) {
              return new Response(
                JSON.stringify({ error: "AI credits exhausted. Please top up your workspace." }),
                { status: 402, headers: { "Content-Type": "application/json" } },
              );
            }
            const t = await resp.text();
            console.error("AI gateway error", resp.status, t);
            return new Response(JSON.stringify({ error: "AI gateway error" }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }

          const data = await resp.json();
          const content = data.choices?.[0]?.message?.content ?? "";
          return new Response(JSON.stringify({ content }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (e) {
          console.error("ai route error", e);
          return new Response(
            JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
