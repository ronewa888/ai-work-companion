import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ListTodo, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { AiOutput, callAi } from "@/components/ai-output";

export const Route = createFileRoute("/tasks")({
  head: () => ({ meta: [{ title: "Task Planner — FlowMind AI" }] }),
  component: TasksPage,
});

function TasksPage() {
  const [input, setInput] = useState("");
  const [hours, setHours] = useState("8h");
  const [priority, setPriority] = useState("Balanced");
  const [estimates, setEstimates] = useState(true);
  const [buffer, setBuffer] = useState(true);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  const run = async () => {
    if (!input.trim()) return toast.error("Enter your tasks or goals.");
    setLoading(true);
    setOutput("");
    try {
      const prompt = `Working hours available: ${hours}\nPriority style: ${priority}\nInclude time estimates: ${estimates ? "yes" : "no"}\nAdd buffer time between deep work: ${buffer ? "yes" : "no"}\n\nTasks:\n${input}`;
      const content = await callAi("tasks", prompt);
      setOutput(content);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader icon={ListTodo} title="AI Task Planner" description="Prioritize and schedule tasks using proven productivity frameworks." />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass p-6 space-y-4">
          <div>
            <Label className="mb-1.5 block text-xs">Your tasks for today</Label>
            <Textarea
              rows={10}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={"One per line, e.g.\n- Prepare Q3 report (due Friday)\n- Email client about renewal\n- Review PR #482\n- Plan team offsite"}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="mb-1.5 block text-xs">Hours available</Label>
              <Select value={hours} onValueChange={setHours}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["2h", "4h", "6h", "8h"].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-1.5 block text-xs">Priority style</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Urgency-first", "Impact-first", "Quick-wins-first", "Balanced"].map((o) => (
                    <SelectItem key={o} value={o}>{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-primary/20 px-4 py-3">
            <Label className="text-xs cursor-pointer">Include time estimates</Label>
            <Switch checked={estimates} onCheckedChange={setEstimates} />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-primary/20 px-4 py-3">
            <Label className="text-xs cursor-pointer">Add buffer time between tasks</Label>
            <Switch checked={buffer} onCheckedChange={setBuffer} />
          </div>
          <Button onClick={run} disabled={loading} className="w-full btn-gradient h-11">
            <Sparkles className="h-4 w-4 mr-2" />
            {loading ? "Planning..." : "Generate Plan"}
          </Button>
        </div>
        <AiOutput content={output} loading={loading} placeholder="Prioritized schedule will appear here." />
      </div>
    </div>
  );
}
