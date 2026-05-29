import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { AiOutput, callAi } from "@/components/ai-output";

export const Route = createFileRoute("/email")({
  head: () => ({ meta: [{ title: "Email Generator — FlowMind AI" }] }),
  component: EmailPage,
});

function EmailPage() {
  const [audience, setAudience] = useState("Client");
  const [tone, setTone] = useState("Professional");
  const [subject, setSubject] = useState("");
  const [intent, setIntent] = useState("");
  const [cta, setCta] = useState(true);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  const generate = async () => {
    if (!intent.trim()) return toast.error("Describe what the email should say.");
    setLoading(true);
    setOutput("");
    try {
      const prompt = `Audience: ${audience}\nTone: ${tone}\nSubject hint: ${subject || "(none)"}\nInclude call-to-action: ${cta ? "yes" : "no"}\n\nGoal:\n${intent}`;
      const content = await callAi("email", prompt);
      setOutput(content);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to generate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader icon={Mail} title="Smart Email Generator" description="Generate a polished email tuned to tone and audience." />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="mb-1.5 block text-xs">Email Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Professional", "Friendly", "Assertive", "Empathetic", "Concise", "Formal"].map(o => (
                    <SelectItem key={o} value={o}>{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-1.5 block text-xs">Target Audience</Label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Client", "Manager", "Team", "Executive", "Vendor", "Job Applicant"].map(o => (
                    <SelectItem key={o} value={o}>{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="mb-1.5 block text-xs">Subject line hint (optional)</Label>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Q3 proposal follow-up" />
          </div>
          <div>
            <Label className="mb-1.5 block text-xs">What is this email about?</Label>
            <Textarea
              rows={7}
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              placeholder="e.g. Following up on the Q3 proposal we submitted last week..."
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-primary/20 px-4 py-3">
            <Label htmlFor="cta-switch" className="text-xs cursor-pointer">Include Call to Action</Label>
            <Switch id="cta-switch" checked={cta} onCheckedChange={setCta} />
          </div>
          <Button onClick={generate} disabled={loading} className="w-full btn-gradient h-11">
            <Sparkles className="h-4 w-4 mr-2" />
            {loading ? "Generating..." : "Generate Email"}
          </Button>
        </div>
        <AiOutput content={output} loading={loading} placeholder="Your generated email will appear here." />
      </div>
    </div>
  );
}
