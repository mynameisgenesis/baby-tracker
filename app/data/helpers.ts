import { BabyEvent, EventType } from "./types";

export function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function minutesAgo(ts: number) {
  const diffMs = Date.now() - ts;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ago`;
}

export function labelForEvent(e: BabyEvent) {
  switch (e.type) {
    case "diaper":
      return `Diaper • ${e.diaperKind ?? "—"}`;
    case "feed":
      return `Feed • ${e.feedMethod ?? "—"}`;
    case "sleep":
      return e.durationMin ? `Sleep • ${e.durationMin} min` : "Sleep";
    case "tummy":
      return e.durationMin ? `Tummy time • ${e.durationMin} min` : "Tummy time";
    default:
      return "Event";
  }
}

export function emojiForType(t: EventType) {
  switch (t) {
    case "diaper":
      return "🧷";
    case "feed":
      return "🍼";
    case "sleep":
      return "💤";
    case "tummy":
      return "🤸";
  }
}

export function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}


export function startOfDay(ts: number) {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function formatDurationMin(min?: number) {
  if (min == null) return "";
  const total = Math.max(0, Math.floor(min));
  const h = Math.floor(total / 60);
  const m = total % 60;

  if (h <= 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

// optional (nice for live timers later)
export function formatDurationMs(ms: number) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;

  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}
