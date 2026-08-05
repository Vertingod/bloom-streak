"use client";

import { Cloud, LogOut, Mail, RefreshCw } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { DashboardCloudState } from "@/features/dashboard/use-dashboard-data";
import { cn } from "@/lib/utils";

export function AuthPanel({ cloud }: { cloud: DashboardCloudState }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleMagicLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      await cloud.sendMagicLink(trimmedEmail);
      setMessage("\u767b\u5f55\u94fe\u63a5\u5df2\u53d1\u9001\uff0c\u8bf7\u53bb\u90ae\u7bb1\u70b9\u51fb Magic Link\u3002");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "\u53d1\u9001\u5931\u8d25\uff0c\u8bf7\u68c0\u67e5 Supabase \u914d\u7f6e\u3002");
    } finally {
      setSubmitting(false);
    }
  }

  if (!cloud.configured) {
    return (
      <Card className="border-dashed bg-card/62 shadow-sm">
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="flex items-center gap-2 font-medium">
              <Cloud className="size-4 text-muted-foreground" />
              {"\u672c\u5730\u6a21\u5f0f"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {"\u914d\u7f6e NEXT_PUBLIC_SUPABASE_URL \u548c NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY \u540e\uff0c\u5373\u53ef\u5f00\u542f Email Magic Link \u4e91\u540c\u6b65\u3002"}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (cloud.authenticated) {
    return (
      <Card className="border-primary/15 bg-primary/7 shadow-sm">
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="flex items-center gap-2 font-medium text-primary">
              <Cloud className="size-4" />
              {"\u4e91\u540c\u6b65\u5df2\u5f00\u542f"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {cloud.email ?? "\u5df2\u767b\u5f55\u7528\u6237"} {"\u00b7"} {cloud.syncMessage ?? "\u672c\u5730\u82b1\u56ed\u4f1a\u540c\u6b65\u5230 Supabase\u3002"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" className="rounded-full" disabled={cloud.syncing} onClick={() => void cloud.syncNow()}>
              <RefreshCw className={cn("size-4", cloud.syncing && "animate-spin")} />
              {cloud.syncing ? "\u540c\u6b65\u4e2d" : "\u624b\u52a8\u540c\u6b65"}
            </Button>
            <Button type="button" variant="ghost" className="rounded-full" onClick={() => void cloud.signOut()}>
              <LogOut className="size-4" />
              {"\u9000\u51fa"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-white/70 bg-card/75 shadow-sm backdrop-blur">
      <CardContent className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="flex items-center gap-2 font-medium">
            <Mail className="size-4 text-primary" />
            {"\u7528 Email Magic Link \u767b\u5f55"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {"\u767b\u5f55\u540e\u4f1a\u5148\u628a\u5f53\u524d LocalStorage \u4e60\u60ef\u540c\u6b65\u5230\u4f60\u7684 Supabase \u8d26\u53f7\u3002"}
          </p>
          {message && <p className="mt-2 text-sm text-primary">{message}</p>}
        </div>
        <form className="flex w-full flex-col gap-2 sm:flex-row lg:max-w-lg" onSubmit={handleMagicLink}>
          <Input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={"\u4f60\u7684\u90ae\u7bb1"}
            className="h-11 rounded-full bg-background/85"
          />
          <Button type="submit" className="h-11 rounded-full" disabled={!email.trim() || submitting}>
            {submitting ? "\u53d1\u9001\u4e2d..." : "\u53d1\u9001\u767b\u5f55\u94fe\u63a5"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
