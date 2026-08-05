const DATE_KEY_FORMATTER_CACHE = new Map<string, Intl.DateTimeFormat>();

export const DEFAULT_TIMEZONE = "Asia/Shanghai";

function getFormatter(timezone = DEFAULT_TIMEZONE) {
  const cached = DATE_KEY_FORMATTER_CACHE.get(timezone);

  if (cached) {
    return cached;
  }

  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  DATE_KEY_FORMATTER_CACHE.set(timezone, formatter);
  return formatter;
}

export function getUserTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || DEFAULT_TIMEZONE;
}

export function toDateKey(date: Date, timezone = DEFAULT_TIMEZONE) {
  return getFormatter(timezone).format(date);
}

export function getTodayDateKey(timezone = getUserTimezone()) {
  return toDateKey(new Date(), timezone);
}

export function parseDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);

  if (!year || !month || !day) {
    throw new Error(`Invalid date key: ${dateKey}`);
  }

  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
}

export function addDays(dateKey: string, offset: number) {
  const date = parseDateKey(dateKey);
  date.setUTCDate(date.getUTCDate() + offset);
  return toDateKey(date, "UTC");
}

export function getRecentDateKeys(days: number, endDateKey: string) {
  return Array.from({ length: days }, (_, index) =>
    addDays(endDateKey, index - days + 1),
  );
}

export function isDateKeyOnOrBefore(dateKey: string, compareTo: string) {
  return dateKey <= compareTo;
}
