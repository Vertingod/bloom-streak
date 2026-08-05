import type { AchievementIllustration as AchievementIllustrationName } from "@/features/achievements/achievement-rules";
import { cn } from "@/lib/utils";

type AchievementIllustrationProps = {
  illustration: AchievementIllustrationName;
  title: string;
  className?: string;
};

const palette: Record<AchievementIllustrationName, { bg: string; primary: string; secondary: string }> = {
  sprout: { bg: "#ecfdf5", primary: "#10b981", secondary: "#a7f3d0" },
  rhythm: { bg: "#fefce8", primary: "#ca8a04", secondary: "#fde68a" },
  bloom: { bg: "#fff1f2", primary: "#e11d48", secondary: "#fecdd3" },
  tree: { bg: "#f0fdf4", primary: "#15803d", secondary: "#bbf7d0" },
  grove: { bg: "#f7fee7", primary: "#65a30d", secondary: "#d9f99d" },
  "watering-can": { bg: "#eff6ff", primary: "#2563eb", secondary: "#bfdbfe" },
  trophy: { bg: "#fffbeb", primary: "#d97706", secondary: "#fde68a" },
  sun: { bg: "#fff7ed", primary: "#ea580c", secondary: "#fed7aa" },
};

export function AchievementIllustration({ illustration, title, className }: AchievementIllustrationProps) {
  const colors = palette[illustration];

  return (
    <svg
      role="img"
      aria-label={title}
      data-achievement-illustration={illustration}
      viewBox="0 0 96 96"
      className={cn("size-20 shrink-0", className)}
    >
      <title>{title}</title>
      <circle cx="48" cy="48" r="44" fill={colors.bg} />
      {renderIllustration(illustration, colors)}
    </svg>
  );
}

function renderIllustration(
  illustration: AchievementIllustrationName,
  colors: { primary: string; secondary: string },
) {
  switch (illustration) {
    case "sprout":
      return (
        <>
          <path d="M48 70V44" stroke={colors.primary} strokeWidth="6" strokeLinecap="round" />
          <path d="M47 47C31 45 28 32 31 24c13 1 20 10 16 23Z" fill={colors.secondary} stroke={colors.primary} strokeWidth="4" />
          <path d="M50 51c16-1 22-12 19-22-14 1-22 10-19 22Z" fill={colors.secondary} stroke={colors.primary} strokeWidth="4" />
          <path d="M30 72h36" stroke={colors.primary} strokeWidth="5" strokeLinecap="round" />
        </>
      );
    case "rhythm":
      return (
        <>
          <path d="M24 58c8-20 18 20 26 0s18 20 26 0" fill="none" stroke={colors.primary} strokeWidth="6" strokeLinecap="round" />
          <circle cx="30" cy="34" r="7" fill={colors.secondary} stroke={colors.primary} strokeWidth="4" />
          <circle cx="48" cy="30" r="7" fill={colors.secondary} stroke={colors.primary} strokeWidth="4" />
          <circle cx="66" cy="34" r="7" fill={colors.secondary} stroke={colors.primary} strokeWidth="4" />
        </>
      );
    case "bloom":
      return (
        <>
          <circle cx="48" cy="48" r="8" fill={colors.primary} />
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <ellipse key={angle} cx="48" cy="31" rx="8" ry="15" fill={colors.secondary} stroke={colors.primary} strokeWidth="3" transform={`rotate(${angle} 48 48)`} />
          ))}
        </>
      );
    case "tree":
      return (
        <>
          <path d="M47 69V45" stroke="#8b5a2b" strokeWidth="8" strokeLinecap="round" />
          <circle cx="39" cy="40" r="15" fill={colors.secondary} stroke={colors.primary} strokeWidth="4" />
          <circle cx="57" cy="38" r="17" fill={colors.secondary} stroke={colors.primary} strokeWidth="4" />
          <circle cx="49" cy="25" r="14" fill={colors.secondary} stroke={colors.primary} strokeWidth="4" />
          <path d="M28 72h40" stroke={colors.primary} strokeWidth="5" strokeLinecap="round" />
        </>
      );
    case "grove":
      return (
        <>
          <path d="M30 69V49M48 72V42M66 69V50" stroke="#8b5a2b" strokeWidth="5" strokeLinecap="round" />
          <circle cx="30" cy="42" r="12" fill={colors.secondary} stroke={colors.primary} strokeWidth="4" />
          <circle cx="48" cy="33" r="16" fill={colors.secondary} stroke={colors.primary} strokeWidth="4" />
          <circle cx="66" cy="43" r="12" fill={colors.secondary} stroke={colors.primary} strokeWidth="4" />
          <path d="M24 73h48" stroke={colors.primary} strokeWidth="5" strokeLinecap="round" />
        </>
      );
    case "watering-can":
      return (
        <>
          <path d="M26 45h34l-4 24H30Z" fill={colors.secondary} stroke={colors.primary} strokeWidth="5" strokeLinejoin="round" />
          <path d="M58 49c13-8 19-6 22 3" fill="none" stroke={colors.primary} strokeWidth="5" strokeLinecap="round" />
          <path d="M33 45v-8h18v8" fill="none" stroke={colors.primary} strokeWidth="5" strokeLinecap="round" />
          <circle cx="72" cy="63" r="3" fill={colors.primary} />
          <circle cx="80" cy="70" r="3" fill={colors.primary} />
        </>
      );
    case "trophy":
      return (
        <>
          <path d="M34 28h28v12c0 13-7 22-14 22S34 53 34 40Z" fill={colors.secondary} stroke={colors.primary} strokeWidth="5" strokeLinejoin="round" />
          <path d="M34 34H23c1 13 7 19 15 20M62 34h11c-1 13-7 19-15 20" fill="none" stroke={colors.primary} strokeWidth="5" strokeLinecap="round" />
          <path d="M48 62v9M36 73h24" stroke={colors.primary} strokeWidth="5" strokeLinecap="round" />
        </>
      );
    case "sun":
      return (
        <>
          <circle cx="48" cy="48" r="15" fill={colors.secondary} stroke={colors.primary} strokeWidth="5" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <path key={angle} d="M48 18v8" stroke={colors.primary} strokeWidth="5" strokeLinecap="round" transform={`rotate(${angle} 48 48)`} />
          ))}
        </>
      );
  }
}
