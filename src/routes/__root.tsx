import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-gradient font-display">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md btn-gradient px-4 py-2 text-sm font-medium"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md btn-gradient px-4 py-2 text-sm font-medium"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent/20"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "FlowMind AI — Your Intelligent Workplace Co-pilot" },
      { name: "description", content: "FlowMind AI helps professionals automate emails, meeting notes, task planning, and research." },
      { name: "author", content: "FlowMind AI" },
      { property: "og:title", content: "FlowMind AI — Your Intelligent Workplace Co-pilot" },
      { property: "og:description", content: "FlowMind AI helps professionals automate emails, meeting notes, task planning, and research." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "FlowMind AI — Your Intelligent Workplace Co-pilot" },
      { name: "twitter:description", content: "FlowMind AI helps professionals automate emails, meeting notes, task planning, and research." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/3a6b2399-12cd-47e7-90be-dc2625cc5f76/id-preview-dbaf5f28--126f3c72-1604-4e90-b5e0-0eadbcda12f3.lovable.app-1780040817996.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/3a6b2399-12cd-47e7-90be-dc2625cc5f76/id-preview-dbaf5f28--126f3c72-1604-4e90-b5e0-0eadbcda12f3.lovable.app-1780040817996.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/sonner";
import { Bell, Zap } from "lucide-react";

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <header className="sticky top-0 z-10 h-14 flex items-center gap-3 border-b border-primary/20 bg-background/70 backdrop-blur-xl px-4">
              <SidebarTrigger />
              <span className="hidden sm:inline text-xs text-muted-foreground">AI-powered workspace</span>
              <div className="ml-auto flex items-center gap-3">
                <button className="rounded-full p-2 text-muted-foreground hover:text-foreground hover:bg-primary/10 transition">
                  <Bell className="h-4 w-4" />
                </button>
                <button className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-gradient-primary px-3 py-1.5 text-xs font-semibold text-white shadow-[0_0_16px_-4px_rgba(236,72,153,0.6)] hover:opacity-90 transition">
                  <Zap className="h-3 w-3" fill="currentColor" /> Upgrade
                </button>
                <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center text-xs font-semibold text-white">
                  YO
                </div>
              </div>
            </header>
            <main className="flex-1 px-6 py-8 max-w-6xl w-full mx-auto">
              <Outlet />
            </main>
          </div>
        </div>
        <Toaster />
      </SidebarProvider>
    </QueryClientProvider>
  );
}
