export type EventType = "diaper" | "feed" | "sleep" | "tummy";
export type DiaperKind = "pee" | "poop" | "both";
export type FeedMethod = "breast" | "bottle" | "solids";

export type BabyEvent = {
  id: string;
  type: EventType;
  occurredAt: number; // epoch ms
  // a few optional details for display
  diaperKind?: DiaperKind;
  feedMethod?: FeedMethod;
  durationMin?: number;
};