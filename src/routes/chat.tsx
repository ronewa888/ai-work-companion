import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Send, Loader2, AlertTriangle, Zap, Trash2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "AI Chat — FlowMind AI" }] }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string; ts?: number };

const WELCOME: Msg = {
  role: "assistant",
  content: "Hi! I'm **FlowMind AI** 👋 I'm here to help you work smarter. What can I help you accomplish today?",
};

const QUICK_PROMPTS = [
  "Help me write a professional email",
  "Summarize my meeting notes",
  "Plan my workday tasks",
  "Research a topic for me",
  "Give me productivity tips",
];

function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: trimmed, ts: Date.now() }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const apiMsgs = next.filter((m) => m !== WELCOME).map(({ role, content }) => ({ role, content }));
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feature: "chat", messages: apiMsgs }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setMessages([...next, { role: "assistant", content: data.content, ts: Date.now() }]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  const clear = () => setMessages([WELCOME]);

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("✅ Copied to clipboard!");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-9rem)]">
      {/* Chat header */}
      <div className="glass p-4 mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary text-white">
          <Zap className="h-5 w-5" fill="currentColor" />
        </div>
        <div className="flex-1">
          <h1 className="font-display font-bold text-gradient text-lg leading-tight">FlowMind AI Chat</h1>
          <p className="text-xs text-muted-foreground">Your productivity co-pilot</p>
        </div>
        <Button variant="ghost" size="sm" onClick={clear} className="text-muted-foreground hover:text-foreground">
          <Trash2 className="h-4 w-4 mr-1" /> Clear
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto glass p-5 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`group flex ${m.role === "user" ? "justify-end" : "justify-start"} gap-3`}>
            {m.role === "assistant" && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-primary text-white">
                <Zap className="h-4 w-4" fill="currentColor" />
              </div>
            )}
            <div className={`max-w-[80%] relative ${m.role === "user" ? "" : ""}`}>
              <div
                className={`rounded-2xl px-4 py-2.5 text-sm ${
                  m.role === "user"
                    ? "bg-gradient-primary text-white"
                    : "bg-card/70 border border-primary/20 text-card-foreground"
                }`}
              >
                {m.role === "assistant" ? (
                  <div className="prose-chat"><ReactMarkdown>{m.content}</ReactMarkdown></div>
                ) : (
                  <p className="whitespace-pre-wrap">{m.content}</p>
                )}
              </div>
              {m.role === "assistant" && (
                <button
                  onClick={() => copy(m.content)}
                  className="opacity-0 group-hover:opacity-100 transition mt-1 text-xs text-muted-foreground hover:text-accent inline-flex items-center gap-1"
                >
                  <Copy className="h-3 w-3" /> Copy
                </button>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-primary text-white">
              <Zap className="h-4 w-4" fill="currentColor" />
            </div>
            <div className="rounded-2xl bg-card/70 border border-primary/20 px-4 py-3 text-sm flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-accent pulse-dot" />
              <span className="h-2 w-2 rounded-full bg-accent pulse-dot" style={{ animationDelay: "0.2s" }} />
              <span className="h-2 w-2 rounded-full bg-accent pulse-dot" style={{ animationDelay: "0.4s" }} />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Quick prompts */}
      {messages.length <= 1 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {QUICK_PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => send(p)}
              className="text-xs px-3 py-1.5 rounded-full border border-primary/30 bg-card/50 hover:bg-primary/15 hover:border-accent/50 transition"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center gap-2 text-xs italic text-muted-foreground">
        <AlertTriangle className="h-3.5 w-3.5 text-yellow-400" /> AI-generated content may require human review.
      </div>

      <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="mt-2 flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask FlowMind anything..."
          disabled={loading}
          className="h-11"
        />
        <Button type="submit" disabled={loading || !input.trim()} className="btn-gradient h-11 px-5">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </div>
  );
}
