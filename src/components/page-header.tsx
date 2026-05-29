import type { LucideIcon } from "lucide-react";

export function PageHeader({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  return (
    <div className="mb-8 flex items-start gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary text-white shadow-[0_0_20px_-4px_rgba(236,72,153,0.55)]">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h1 className="text-3xl font-bold font-display text-gradient">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
