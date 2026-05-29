import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, FileText, ListTodo, Search, MessageSquare, Sparkles, ArrowRight, CheckCircle2, Zap } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — FlowMind AI" },
      { name: "description", content: "Your AI workplace productivity dashboard." },
    ],
  }),
  component: Dashboard,
});

const stats = [
  { label: "Tasks Completed Today", value: "12", trend: "+3" },
  { label: "Emails Generated", value: "8", trend: "+2" },
  { label: "Meetings Summarized", value: "4", trend: "+1" },
  { label: "Research Queries", value: "6", trend: "+4" },
];

const features = [
  { url: "/email", icon: Mail, title: "Smart Email Generator", desc: "Draft polished emails tuned by tone and audience." },
  { url: "/meetings", icon: FileText, title: "Meeting Summarizer", desc: "Extract key points, action items, and deadlines." },
  { url: "/tasks", icon: ListTodo, title: "AI Task Planner", desc: "Prioritize and schedule your daily work." },
  { url: "/research", icon: Search, title: "Research Assistant", desc: "Structured insights and summaries on any topic." },
];

const activity = [
  { feature: "Email", color: "bg-pink-500/20 text-pink-300", title: "Q3 proposal follow-up draft", time: "2 min ago" },
  { feature: "Tasks", color: "bg-purple-500/20 text-purple-300", title: "Daily plan generated (6 tasks)", time: "18 min ago" },
  { feature: "Meeting", color: "bg-fuchsia-500/20 text-fuchsia-300", title: "Engineering sync — summary", time: "1 hr ago" },
  { feature: "Research", color: "bg-violet-500/20 text-violet-300", title: "Linear vs Jira comparison", time: "3 hr ago" },
];

function Dashboard() {
  return (
    <div>
      {/* Hero */}
      <div className="mb-8 glass p-8">
        <div className="flex items-center gap-2 text-xs font-medium text-accent">
          <Sparkles className="h-4 w-4" /> Welcome back
        </div>
        <h1 className="mt-3 text-4xl font-bold font-display text-gradient">Work smarter with FlowMind AI</h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Your intelligent workplace co-pilot — draft, plan, summarize, and research in one place.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="glass p-5 glow-hover">
            <div className="text-xs text-muted-foreground">{s.label}</div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold font-display text-gradient">{s.value}</span>
              <span className="text-xs text-green-400">{s.trend}</span>
            </div>
            <div className="mt-3 flex h-1 gap-0.5">
              {[40, 65, 30, 80, 55, 70, 90].map((h, i) => (
                <div key={i} className="flex-1 rounded-full bg-gradient-primary" style={{ opacity: h / 100 }} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <h2 className="text-lg font-semibold font-display mb-4">Quick actions</h2>
      <div className="grid gap-4 sm:grid-cols-2 mb-8">
        {features.map((f) => (
          <Link key={f.url} to={f.url} className="group glass p-5 glow-hover">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary text-white shrink-0">
                <f.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold font-display">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
                <div className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-accent opacity-0 transition group-hover:opacity-100">
                  Open <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent activity */}
      <h2 className="text-lg font-semibold font-display mb-4">Recent activity</h2>
      <div className="glass divide-y divide-primary/15 mb-8">
        {activity.map((a, i) => (
          <div key={i} className="flex items-center gap-4 p-4">
            <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${a.color}`}>{a.feature}</span>
            <span className="flex-1 text-sm">{a.title}</span>
            <span className="text-xs text-muted-foreground">{a.time}</span>
          </div>
        ))}
      </div>

      {/* Status */}
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 pulse-dot" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
        </span>
        FlowMind AI is online and ready
        <Zap className="h-3 w-3 text-accent ml-1" fill="currentColor" />
      </div>
    </div>
  );
}
