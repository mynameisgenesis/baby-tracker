import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import EventIcon from "@/app/components/events/EventIcon";
import { useEvents } from "../../data/eventsStore";
import {
  formatTime,
  labelForEvent,
  minutesAgo,
  startOfDay,
} from "../../data/helpers";
import type { BabyEvent, EventType } from "../../data/types";

export type TimelineSection = {
  title: string;
  data: BabyEvent[];
};

export type FilterKey = "all" | EventType;

export function TimelineScreen() {
  const { events, clearAll } = useEvents();
  const [filter, setFilter] = useState<FilterKey>("all");

  // ✅ Counts for chips
  const counts = useMemo(() => {
    const c = {
      all: events.length,
      feed: 0,
      diaper: 0,
      sleep: 0,
      tummy: 0,
    };

    for (const e of events) {
      if (e.type === "feed") c.feed++;
      else if (e.type === "diaper") c.diaper++;
      else if (e.type === "sleep") c.sleep++;
      else if (e.type === "tummy") c.tummy++;
    }

    return c;
  }, [events]);

  const filteredEvents = useMemo(() => {
    if (filter === "all") return events;
    return events.filter((e) => e.type === filter);
  }, [events, filter]);

  const sections = useMemo<TimelineSection[]>(() => {
    if (filteredEvents.length === 0) return [];

    const now = Date.now();
    const todayStart = startOfDay(now);
    const yesterdayStart = todayStart - 24 * 60 * 60_000;

    const today: BabyEvent[] = [];
    const yesterday: BabyEvent[] = [];
    const older: BabyEvent[] = [];

    for (const e of filteredEvents) {
      if (e.occurredAt >= todayStart) today.push(e);
      else if (e.occurredAt >= yesterdayStart) yesterday.push(e);
      else older.push(e);
    }

    const out: TimelineSection[] = [];
    if (today.length) out.push({ title: "Today", data: today });
    if (yesterday.length) out.push({ title: "Yesterday", data: yesterday });
    if (older.length) out.push({ title: "Older", data: older });

    return out;
  }, [filteredEvents]);

  const hasAnyEvents = events.length > 0;
  const hasFiltered = filteredEvents.length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Timeline</Text>
          <Text style={styles.subTitle}>Everything you’ve logged</Text>
        </View>

        <Pressable style={styles.ghostBtn} onPress={clearAll}>
          <Text style={styles.ghostBtnText}>Clear</Text>
        </Pressable>
      </View>

      {/* ✅ Filter chips with counts */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsRow}
      >
        <Chip
          label={`All (${counts.all})`}
          active={filter === "all"}
          onPress={() => setFilter("all")}
          disabled={counts.all === 0}
        />
        <Chip
          label={`Feed (${counts.feed})`}
          active={filter === "feed"}
          onPress={() => setFilter("feed")}
          disabled={counts.feed === 0}
        />
        <Chip
          label={`Diaper (${counts.diaper})`}
          active={filter === "diaper"}
          onPress={() => setFilter("diaper")}
          disabled={counts.diaper === 0}
        />
        <Chip
          label={`Sleep (${counts.sleep})`}
          active={filter === "sleep"}
          onPress={() => setFilter("sleep")}
          disabled={counts.sleep === 0}
        />
        <Chip
          label={`Tummy (${counts.tummy})`}
          active={filter === "tummy"}
          onPress={() => setFilter("tummy")}
          disabled={counts.tummy === 0}
        />
      </ScrollView>

      {!hasAnyEvents ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No events yet</Text>
          <Text style={styles.emptyText}>
            Go to Log and add your first diaper, feed, sleep, or tummy time.
          </Text>

          <Pressable
            style={styles.primaryBtn}
            onPress={() => router.push("/log")}
          >
            <Text style={styles.primaryBtnText}>Log something</Text>
          </Pressable>
        </View>
      ) : !hasFiltered ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Nothing matches that filter</Text>
          <Text style={styles.emptyText}>Try “All”, or log a new event.</Text>

          <Pressable
            style={styles.primaryBtn}
            onPress={() => router.push("/log")}
          >
            <Text style={styles.primaryBtnText}>Log now</Text>
          </Pressable>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          stickySectionHeadersEnabled
          contentContainerStyle={styles.listContent}
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <Pressable
              style={styles.row}
              onPress={() => router.push(`/event/${item.id}`)}
            >
              <EventIcon type={item.type} size={20} />

              <View style={styles.rowBody}>
                <Text style={styles.rowTitle}>{labelForEvent(item)}</Text>
                <Text style={styles.rowMeta}>
                  {formatTime(item.occurredAt)} • {minutesAgo(item.occurredAt)}
                </Text>
              </View>

              <Text style={styles.chev}>›</Text>
            </Pressable>
          )}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
        />
      )}
    </View>
  );
}

function Chip({
  label,
  active,
  onPress,
  disabled,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.chip,
        active && styles.chipActive,
        disabled && styles.chipDisabled,
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected: active, disabled }}
    >
      <Text
        style={[
          styles.chipText,
          active && styles.chipTextActive,
          disabled && styles.chipTextDisabled,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  title: { fontSize: 28, fontWeight: "800" },
  subTitle: { fontSize: 13, opacity: 0.6, marginTop: 2 },

  ghostBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  ghostBtnText: { fontWeight: "700", opacity: 0.8 },

  chipsRow: { paddingHorizontal: 16, paddingBottom: 10, gap: 10 },

  chip: {
    borderWidth: 1,
    borderColor: "#eee",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#fff",
  },
  chipActive: { borderColor: "#ddd" },
  chipDisabled: { opacity: 0.45 },

  chipText: { fontWeight: "800", opacity: 0.7 },
  chipTextActive: { opacity: 1 },
  chipTextDisabled: { opacity: 0.6 },

  listContent: { paddingHorizontal: 16, paddingBottom: 20 },

  sectionHeader: { paddingTop: 14, paddingBottom: 8, backgroundColor: "#fff" },
  sectionTitle: { fontSize: 14, fontWeight: "800", opacity: 0.65 },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#eee",
    gap: 10,
  },
  icon: { fontSize: 20, width: 28, textAlign: "center" },
  rowBody: { flex: 1, gap: 2 },
  rowTitle: { fontWeight: "800" },
  rowMeta: { fontSize: 12, opacity: 0.6 },
  chev: { fontSize: 22, opacity: 0.25, paddingLeft: 6 },

  sep: { height: 10 },

  empty: { flex: 1, padding: 16, justifyContent: "center", gap: 10 },
  emptyTitle: { fontSize: 20, fontWeight: "900" },
  emptyText: { opacity: 0.7, lineHeight: 20 },

  primaryBtn: {
    marginTop: 6,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  primaryBtnText: { fontWeight: "900" },
});
