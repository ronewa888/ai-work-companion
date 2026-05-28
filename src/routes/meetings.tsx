import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { AiOutput, callAi } from "@/components/ai-output";

export const Route = createFileRoute("/meetings")({
  head: () => ({ meta: [{ title: "Meeting Summarizer — WorkAI" }] }),
  component: MeetingsPage,
});

function MeetingsPage() {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  const run = async () => {
    if (!notes.trim()) return toast.error("Paste meeting notes or a transcript.");
    setLoading(true);
    setOutput("");
    try {
      const content = await callAi("meeting", notes);
      setOutput(content);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader icon={FileText} title="Meeting Notes Summarizer" description="Extract key points, action items, decisions, and deadlines." />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5 space-y-4">
          <div>
            <Label className="mb-1.5 block text-xs">Meeting notes or transcript</Label>
            <Textarea
              rows={14}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Paste raw notes or a transcript here..."
            />
          </div>
          <Button onClick={run} disabled={loading} className="w-full">
            {loading ? "Summarizing..." : "Summarize Meeting"}
          </Button>
        </div>
        <AiOutput content={output} loading={loading} placeholder="Structured summary will appear here." />
      </div>
    </div>
  );
}
