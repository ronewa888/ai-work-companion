import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { AiOutput, callAi } from "@/components/ai-output";

export const Route = createFileRoute("/research")({
  head: () => ({ meta: [{ title: "Research Assistant — WorkAI" }] }),
  component: ResearchPage,
});

function ResearchPage() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  const run = async () => {
    if (!topic.trim()) return toast.error("Enter a topic or question.");
    setLoading(true);
    setOutput("");
    try {
      const content = await callAi("research", topic);
      setOutput(content);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader icon={Search} title="AI Research Assistant" description="Get structured insights, trade-offs, and next steps on any topic." />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5 space-y-4">
          <div>
            <Label className="mb-1.5 block text-xs">Topic or question</Label>
            <Textarea
              rows={10}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Pros and cons of switching our team from Jira to Linear"
            />
          </div>
          <Button onClick={run} disabled={loading} className="w-full">
            {loading ? "Researching..." : "Run Research"}
          </Button>
        </div>
        <AiOutput content={output} loading={loading} placeholder="Research brief will appear here." />
      </div>
    </div>
  );
}
