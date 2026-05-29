import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { AiOutput, callAi } from "@/components/ai-output";

export const Route = createFileRoute("/meetings")({
  head: () => ({ meta: [{ title: "Meeting Summarizer — FlowMind AI" }] }),
  component: MeetingsPage,
});

const SECTIONS = [
  { key: "discussion", label: "Key Discussion Points", default: true },
  { key: "actions", label: "Action Items (with owners)", default: true },
  { key: "decisions", label: "Decisions Made", default: true },
  { key: "deadlines", label: "Deadlines & Follow-ups", default: true },
  { key: "sentiment", label: "Sentiment Summary", default: false },
];

function MeetingsPage() {
  const [notes, setNotes] = useState("");
  const [meetingName, setMeetingName] = useState("");
  const [sections, setSections] = useState<Record<string, boolean>>(
    Object.fromEntries(SECTIONS.map((s) => [s.key, s.default]))
  );
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  const run = async () => {
    if (!notes.trim()) return toast.error("Paste meeting notes or a transcript.");
    setLoading(true);
    setOutput("");
    try {
      const selected = SECTIONS.filter((s) => sections[s.key]).map((s) => s.label).join(", ");
      const prompt = `Meeting: ${meetingName || "(untitled)"}\nInclude sections: ${selected}\n\nNotes:\n${notes}`;
      const content = await callAi("meeting", prompt);
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
        <div className="glass p-6 space-y-4">
          <div>
            <Label className="mb-1.5 block text-xs">Meeting name / date (optional)</Label>
            <Input value={meetingName} onChange={(e) => setMeetingName(e.target.value)} placeholder="e.g. Eng sync — Mar 14" />
          </div>
          <div>
            <Label className="mb-1.5 block text-xs">Raw notes or transcript</Label>
            <Textarea
              rows={10}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Paste raw notes or a transcript here..."
            />
          </div>
          <div>
            <Label className="mb-2 block text-xs">Output sections</Label>
            <div className="space-y-2">
              {SECTIONS.map((s) => (
                <label key={s.key} className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox
                    checked={sections[s.key]}
                    onCheckedChange={(v) => setSections((p) => ({ ...p, [s.key]: !!v }))}
                  />
                  {s.label}
                </label>
              ))}
            </div>
          </div>
          <Button onClick={run} disabled={loading} className="w-full btn-gradient h-11">
            <Sparkles className="h-4 w-4 mr-2" />
            {loading ? "Summarizing..." : "Summarize Meeting"}
          </Button>
        </div>
        <AiOutput content={output} loading={loading} placeholder="Structured summary will appear here." />
      </div>
    </div>
  );
}
