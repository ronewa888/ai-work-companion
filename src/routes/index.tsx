import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, FileText, ListTodo, Search, MessageSquare, Sparkles, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — WorkAI" },
      { name: "description", content: "Your AI workplace productivity dashboard." },
    ],
  }),
  component: Dashboard,
});

const features = [
  { url: "/email", icon: Mail, title: "Smart Email Generator", desc: "Draft polished emails by tone and audience." },
  { url: "/meetings", icon: FileText, title: "Meeting Notes Summarizer", desc: "Extract key points, action items, and deadlines." },
  { url: "/tasks", icon: ListTodo, title: "AI Task Planner", desc: "Prioritize and schedule your daily work." },
  { url: "/research", icon: Search, title: "Research Assistant", desc: "Get structured insights and summaries on any topic." },
  { url: "/chat", icon: MessageSquare, title: "AI Chatbot", desc: "Ask anything, get focused, actionable answers." },
];

function Dashboard() {
  return (
    <div>
      <div className="mb-8 rounded-2xl border bg-gradient-to-br from-primary/10 via-card to-accent/40 p-8">
        <div className="flex items-center gap-2 text-xs font-medium text-primary">
          <Sparkles className="h-4 w-4" /> Welcome back
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Automate your daily work with AI</h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Five focused assistants for writing, planning, summarizing, and researching — all in one workspace.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <Link
            key={f.url}
            to={f.url}
            className="group rounded-xl border bg-card p-5 transition hover:border-primary/40 hover:shadow-sm"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-medium">{f.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            <div className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition group-hover:opacity-100">
              Open <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Link>
        ))}
      </div>

      <p className="mt-8 text-xs text-muted-foreground">
        AI-generated content may require human review.
      </p>
    </div>
  );
}
