import { Flame } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export function StreakBadge({ streak }: { streak: number }) {
  return (
    <Badge className="gap-1 rounded-full bg-accent px-3 py-1 text-accent-foreground">
      <Flame className="size-3.5" />
      {streak > 0 ? `${streak} \u5929 streak` : "\u4eca\u5929\u8d77\u6b65"}
    </Badge>
  );
}
