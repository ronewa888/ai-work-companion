import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { AiOutput, callAi } from "@/components/ai-output";

export const Route = createFileRoute("/email")({
  head: () => ({ meta: [{ title: "Email Generator — WorkAI" }] }),
  component: EmailPage,
});

function EmailPage() {
  const [audience, setAudience] = useState("Colleague");
  const [tone, setTone] = useState("Professional");
  const [subject, setSubject] = useState("");
  const [intent, setIntent] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  const generate = async () => {
    if (!intent.trim()) return toast.error("Describe what the email should say.");
    setLoading(true);
    setOutput("");
    try {
      const prompt = `Audience: ${audience}\nTone: ${tone}\nDesired subject hint: ${subject || "(none)"}\n\nGoal of the email:\n${intent}`;
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
        <div className="rounded-xl border bg-card p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="mb-1.5 block text-xs">Audience</Label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Colleague", "Manager", "Client", "Executive", "Vendor", "Team"].map(o => (
                    <SelectItem key={o} value={o}>{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-1.5 block text-xs">Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Professional", "Friendly", "Formal", "Concise", "Persuasive", "Apologetic"].map(o => (
                    <SelectItem key={o} value={o}>{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="mb-1.5 block text-xs">Subject hint (optional)</Label>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Project update" />
          </div>
          <div>
            <Label className="mb-1.5 block text-xs">What should this email say?</Label>
            <Textarea
              rows={7}
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              placeholder="e.g. Update the team that the launch is delayed by one week and ask for blockers."
            />
          </div>
          <Button onClick={generate} disabled={loading} className="w-full">
            {loading ? "Generating..." : "Generate Email"}
          </Button>
        </div>
        <AiOutput content={output} loading={loading} placeholder="Your generated email will appear here." />
      </div>
    </div>
  );
}
