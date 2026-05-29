import ReactMarkdown from "react-markdown";
import { Loader2, AlertTriangle } from "lucide-react";

export function AiOutput({ content, loading, placeholder }: { content: string; loading: boolean; placeholder?: string }) {
  return (
    <div className="glass p-5 min-h-[280px] flex flex-col">
      {loading ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin text-accent" />
            FlowMind AI is thinking<span className="inline-block animate-pulse">...</span>
          </div>
          <div className="space-y-2 mt-4">
            <div className="h-3 rounded bg-primary/15 shimmer" />
            <div className="h-3 rounded bg-primary/15 shimmer w-11/12" />
            <div className="h-3 rounded bg-primary/15 shimmer w-3/4" />
          </div>
        </div>
      ) : content ? (
        <div className="prose-chat text-sm text-card-foreground font-mono">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          {placeholder ?? "Output will appear here."}
        </div>
      )}
      {content && !loading && (
        <div className="mt-4 flex items-center gap-2 border-t border-primary/20 pt-3 text-xs italic text-muted-foreground">
          <AlertTriangle className="h-3.5 w-3.5 text-yellow-400" />
          AI-generated content may require human review before use in professional communications.
        </div>
      )}
    </div>
  );
}

export async function callAi(feature: string, input: string): Promise<string> {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ feature, input }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Request failed");
  return data.content as string;
}
