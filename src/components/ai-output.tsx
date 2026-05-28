import ReactMarkdown from "react-markdown";
import { Loader2, Info } from "lucide-react";

export function AiOutput({ content, loading, placeholder }: { content: string; loading: boolean; placeholder?: string }) {
  return (
    <div className="rounded-xl border bg-card p-5 min-h-[280px] flex flex-col">
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Generating with AI...
        </div>
      ) : content ? (
        <div className="prose-chat text-sm text-card-foreground">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          {placeholder ?? "Output will appear here."}
        </div>
      )}
      {content && !loading && (
        <div className="mt-4 flex items-center gap-2 border-t pt-3 text-xs text-muted-foreground">
          <Info className="h-3.5 w-3.5" />
          AI-generated content may require human review.
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
