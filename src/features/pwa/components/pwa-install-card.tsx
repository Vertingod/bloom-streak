"use client";

import { Download, Smartphone, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getPwaInstallCopy, isStandaloneMode, type PwaInstallState } from "@/features/pwa/pwa-install";
import { cn } from "@/lib/utils";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

function canRegisterServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return false;
  }

  return window.location.protocol === "https:" || ["localhost", "127.0.0.1"].includes(window.location.hostname);
}

export function PwaInstallCard() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installState, setInstallState] = useState<PwaInstallState>("listening");
  const copy = useMemo(() => getPwaInstallCopy(installState), [installState]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia?.("(display-mode: standalone)");
    if (isStandaloneMode({ matches: mediaQuery?.matches, standalone: (navigator as { standalone?: boolean }).standalone })) {
      const installedTimer = window.setTimeout(() => setInstallState("installed"), 0);
      return () => window.clearTimeout(installedTimer);
    }

    if (canRegisterServiceWorker()) {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }

    const supportTimer = window.setTimeout(() => {
      setInstallState((state) => (state === "listening" ? "unsupported" : state));
    }, 1800);

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
      setInstallState("ready");
    }

    function handleInstalled() {
      setInstallPrompt(null);
      setInstallState("installed");
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.clearTimeout(supportTimer);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  async function handleInstall() {
    if (!installPrompt) {
      return;
    }

    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    setInstallPrompt(null);
    setInstallState(choice.outcome === "accepted" ? "installed" : "unsupported");
  }

  const isActionDisabled = installState !== "ready" || !installPrompt;

  return (
    <Card
      data-pwa-install-card
      className="overflow-hidden border-white/70 bg-gradient-to-br from-card/95 via-secondary/40 to-primary/10 shadow-sm backdrop-blur"
    >
      <CardContent className="relative p-4">
        <div className="absolute -right-10 -top-10 size-28 rounded-full bg-accent/45 blur-2xl" />
        <div className="absolute -bottom-12 left-10 size-24 rounded-full bg-primary/20 blur-2xl" />

        <div className="relative flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-background/80 text-primary shadow-sm">
            <Smartphone className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">{copy.eyebrow}</p>
              <span className="inline-flex items-center gap-1 rounded-full bg-background/70 px-2 py-1 text-[0.68rem] font-medium text-muted-foreground">
                <Sparkles className="size-3" />
                PWA
              </span>
            </div>
            <h2 className="mt-1 text-lg font-semibold tracking-tight">{copy.title}</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{copy.description}</p>
          </div>
        </div>

        <div className="relative mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-muted-foreground">{copy.helperText}</p>
          <Button
            type="button"
            size="sm"
            className={cn("rounded-full", installState === "installed" && "bg-primary/75")}
            disabled={isActionDisabled}
            onClick={handleInstall}
          >
            <Download className="size-4" />
            {copy.buttonLabel}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
