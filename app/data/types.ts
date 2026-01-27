export type EventType = "diaper" | "feed" | "sleep" | "tummy";
export type DiaperKind = "pee" | "poop" | "both";
export type FeedMethod = "breast" | "bottle" | "solids";

export type BabyEvent = {
  id: string;
  type: EventType;
  occurredAt: number; // epoch ms
  diaperKind?: DiaperKind;
  feedMethod?: FeedMethod;
  durationMin?: number;
  note?: string;
};

export type TimelineSection = {
  title: string;
  data: BabyEvent[];
};

export type FilterKey = "all" | EventType;

// src/data/types.ts

export type SessionType = "sleep" | "tummy_time";

export type BabySession = {
  id: string;
  type: SessionType;
  startAt: number; // epoch ms
  endAt?: number;  // missing = active
  note?: string;
};

