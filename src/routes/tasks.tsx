import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ListTodo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { AiOutput, callAi } from "@/components/ai-output";

export const Route = createFileRoute("/tasks")({
  head: () => ({ meta: [{ title: "Task Planner — WorkAI" }] }),
  component: TasksPage,
});

function TasksPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  const run = async () => {
    if (!input.trim()) return toast.error("Enter your tasks or goals.");
    setLoading(true);
    setOutput("");
    try {
      const content = await callAi("tasks", input);
      setOutput(content);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader icon={ListTodo} title="AI Task Planner" description="Prioritize and schedule tasks using the Eisenhower matrix." />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5 space-y-4">
          <div>
            <Label className="mb-1.5 block text-xs">Your tasks & goals</Label>
            <Textarea
              rows={14}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={"One per line, e.g.\n- Prepare Q3 report (due Friday)\n- Email client about renewal\n- Review PR #482\n- Plan team offsite"}
            />
          </div>
          <Button onClick={run} disabled={loading} className="w-full">
            {loading ? "Planning..." : "Generate Plan"}
          </Button>
        </div>
        <AiOutput content={output} loading={loading} placeholder="Prioritized schedule will appear here." />
      </div>
    </div>
  );
}
