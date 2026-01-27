// src/data/eventsStore.tsx
import React, { createContext, useContext, useMemo, useState } from "react";
import type {
  BabyEvent,
  BabySession,
  DiaperKind,
  FeedMethod,
  SessionType,
} from "./types";

type AddEventInput =
  | { type: "diaper"; occurredAt: number; diaperKind: DiaperKind; note?: string }
  | { type: "feed"; occurredAt: number; feedMethod: FeedMethod; note?: string }
  | { type: "sleep"; occurredAt: number; durationMin?: number; note?: string }
  | { type: "tummy"; occurredAt: number; durationMin?: number; note?: string };

type EventsContextValue = {
  events: BabyEvent[];
  sessions: BabySession[];

  addEvent: (input: AddEventInput) => BabyEvent;

  startSession: (type: SessionType, startAt?: number, note?: string) => BabySession;
  endSession: (
    type: SessionType,
    endAt?: number,
    note?: string
  ) => { session: BabySession; createdEvent: BabyEvent };

  getActiveSession: (type: SessionType) => BabySession | undefined;

  clearAll: () => void;
};

const Ctx = createContext<EventsContextValue | null>(null);

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function clampToMin(n: number) {
  return Math.max(0, Math.floor(n));
}

function minutesBetween(startAt: number, endAt: number) {
  return clampToMin((endAt - startAt) / 60000);
}

export function EventsProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<BabyEvent[]>([]);
  const [sessions, setSessions] = useState<BabySession[]>([]);

  const addEvent = (input: AddEventInput): BabyEvent => {
    const newEvent: BabyEvent = {
      id: makeId(),
      type: input.type,
      occurredAt: input.occurredAt,
      note: input.note,
      diaperKind: input.type === "diaper" ? input.diaperKind : undefined,
      feedMethod: input.type === "feed" ? input.feedMethod : undefined,
      durationMin: input.type === "sleep" || input.type === "tummy" ? input.durationMin : undefined,
    };

    setEvents((prev) => [newEvent, ...prev].sort((a, b) => b.occurredAt - a.occurredAt));
    return newEvent;
  };

  const getActiveSession = (type: SessionType): BabySession | undefined => {
    return sessions.find((s) => s.type === type && s.endAt == null);
  };

  const startSession = (type: SessionType, startAt: number = Date.now(), note?: string): BabySession => {
    // Prevent multiple active sessions of same type
    const active = getActiveSession(type);
    if (active) return active;

    const s: BabySession = { id: makeId(), type, startAt, note };
    setSessions((prev) => [s, ...prev]);
    return s;
  };

  const endSession = (
    type: SessionType,
    endAt: number = Date.now(),
    note?: string
  ): { session: BabySession; createdEvent: BabyEvent } => {
    const active = getActiveSession(type);
    if (!active) throw new Error(`No active ${type} session to end.`);

    // Guard: if clock weirdness makes endAt < startAt
    const safeEndAt = Math.max(endAt, active.startAt);

    const updated: BabySession = { ...active, endAt: safeEndAt, note: note ?? active.note };
    setSessions((prev) => prev.map((s) => (s.id === active.id ? updated : s)));

    const durationMin = minutesBetween(active.startAt, safeEndAt);

    // Create an event so Timeline/Home can keep using events without caring about sessions
    const createdEvent = addEvent({
      type: type === "sleep" ? "sleep" : "tummy",
      occurredAt: active.startAt,
      durationMin,
      note: updated.note,
    });

    return { session: updated, createdEvent };
  };

  const clearAll = () => {
    setEvents([]);
    setSessions([]);
  };

  const value = useMemo<EventsContextValue>(
    () => ({
      events,
      sessions,
      addEvent,
      startSession,
      endSession,
      getActiveSession,
      clearAll,
    }),
    [events, sessions]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useEvents() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useEvents must be used within <EventsProvider />");
  return ctx;
}
