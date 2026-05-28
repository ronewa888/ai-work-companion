import { createFileRoute } from "@tanstack/react-router";

const SYSTEM_PROMPTS: Record<string, string> = {
  email: `You are a professional email writer. Generate a clear, well-structured email based on the user's input.
Format your output as:
Subject: <subject line>

<email body>

Sign off appropriately. Match the requested tone and audience. Keep it concise and professional.`,
  meeting: `You are a meeting notes summarizer. Given raw meeting notes or a transcript, produce a structured summary using this exact markdown format:

## Summary
A 2-3 sentence overview.

## Key Points
- Bullet list of the most important discussion points.

## Action Items
- [Owner] Action — Deadline (if mentioned)

## Decisions
- List any decisions made.

## Open Questions
- List unresolved questions.`,
  tasks: `You are an AI task planner. Given a list of tasks or goals from the user, return a prioritized, scheduled plan in markdown:

## Today
- [High] Task — estimated time

## This Week
- [Medium] Task — suggested day

## Later
- [Low] Task

Apply the Eisenhower matrix (urgent/important) for prioritization. Be realistic about time estimates and explain your prioritization briefly at the end under **Rationale**.`,
  research: `You are an AI research assistant. Given a topic or question, produce a structured research brief in markdown:

## Overview
2-3 sentence summary of the topic.

## Key Insights
- 4-6 substantive bullet points.

## Considerations / Trade-offs
- Important caveats, opposing views, or risks.

## Suggested Next Steps
- 3-4 concrete follow-up actions or further reading directions.

Be factual and clearly note when something is opinion or speculation.`,
  chat: `You are a helpful AI workplace productivity assistant. Help users with email drafts, meeting summaries, task planning, research, and general work questions. Use markdown formatting. Be concise, professional, and actionable.`,
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
