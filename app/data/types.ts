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

export type AddEventInput =
  | { type: "diaper"; occurredAt: number; diaperKind: DiaperKind; note?: string }
  | { type: "feed"; occurredAt: number; feedMethod: FeedMethod; note?: string }
  | { type: "sleep"; occurredAt: number; durationMin?: number; note?: string }
  | { type: "tummy"; occurredAt: number; durationMin?: number; note?: string };

export type EventsContextValue = {
  events: BabyEvent[];
  addEvent: (input: AddEventInput) => BabyEvent;
  getLastByType: (type: EventType) => BabyEvent | undefined;
  clearAll: () => void;
};