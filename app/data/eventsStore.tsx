import React, { createContext, useContext, useMemo, useState } from "react";
import { makeId } from "./helpers";
import type { BabyEvent, EventsContextValue } from "./types";

const EventsContext = createContext<EventsContextValue | null>(null);

export function EventsProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<BabyEvent[]>([]);

  const value = useMemo<EventsContextValue>(() => {
    return {
      events,
      addEvent: (input) => {
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
      },
      getLastByType: (type) => events.find((e) => e.type === type),
      clearAll: () => setEvents([]),
    };
  }, [events]);

  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>;
}

export function useEvents() {
  const ctx = useContext(EventsContext);
  if (!ctx) throw new Error("useEvents must be used within <EventsProvider />");
  return ctx;
}
