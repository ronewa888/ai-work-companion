import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { AiOutput, callAi } from "@/components/ai-output";

export const Route = createFileRoute("/research")({
  head: () => ({ meta: [{ title: "Research Assistant — FlowMind AI" }] }),
  component: ResearchPage,
});

function ResearchPage() {
  const [topic, setTopic] = useState("");
  const [depth, setDepth] = useState("Detailed Analysis");
  const [format, setFormat] = useState("Structured Report");
  const [angle, setAngle] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  const run = async () => {
    if (!topic.trim()) return toast.error("Enter a topic or question.");
    setLoading(true);
    setOutput("");
    try {
      const prompt = `Depth: ${depth}\nFormat: ${format}\nSpecific angle: ${angle || "(none)"}\n\nTopic:\n${topic}`;
      const content = await callAi("research", prompt);
      setOutput(content);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader icon={Search} title="AI Research Assistant" description="Structured insights, trade-offs, and next steps on any topic." />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass p-6 space-y-4">
          <div>
            <Label className="mb-1.5 block text-xs">Topic or question</Label>
            <Textarea
              rows={6}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Pros and cons of switching our team from Jira to Linear"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="mb-1.5 block text-xs">Research depth</Label>
              <Select value={depth} onValueChange={setDepth}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Quick Overview", "Detailed Analysis", "Expert Deep-dive"].map((o) => (
                    <SelectItem key={o} value={o}>{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-1.5 block text-xs">Output format</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Executive Summary", "Bullet Points", "Structured Report", "Q&A Format"].map((o) => (
                    <SelectItem key={o} value={o}>{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="mb-1.5 block text-xs">Specific angle (optional)</Label>
            <Input value={angle} onChange={(e) => setAngle(e.target.value)} placeholder="e.g. focus on risks, or compare X vs Y" />
          </div>
          <Button onClick={run} disabled={loading} className="w-full btn-gradient h-11">
            <Sparkles className="h-4 w-4 mr-2" />
            {loading ? "Researching..." : "Research Now"}
          </Button>
        </div>
        <AiOutput content={output} loading={loading} placeholder="Research brief will appear here." />
      </div>
    </div>
  );
}
