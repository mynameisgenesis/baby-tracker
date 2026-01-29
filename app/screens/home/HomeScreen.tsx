import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import EventIcon from "@/app/components/events/EventIcon";
import QuickButton from "../../components/events/QuickButton";
import { useEvents } from "../../data/eventsStore";
import { formatDurationMin, formatTime, labelForEvent, minutesAgo } from "../../data/helpers";
import type { EventType } from "../../data/types";

function useNowTick(intervalMs: number = 15000) {
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
}

export function HomeScreen() {
  useNowTick(15000);

  const { events, getActiveSession, startSession, endSession } = useEvents();

  const activeSleep = getActiveSession("sleep");
  const activeTummy = getActiveSession("tummy_time");

  const lastByType = useMemo(() => {
    const map = new Map<EventType, (typeof events)[number]>();
    for (const e of events) {
      if (!map.has(e.type)) map.set(e.type, e);
    }
    return map;
  }, [events]);

  const quickLog = (type: EventType) => {
    // For now we just go to Log tab; later we can open a modal pre-selected by type.
    router.push("/log");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Today</Text>
          <Text style={styles.subTitle}>Baby Tracker</Text>
        </View>

        <Pressable style={styles.headerBtn} onPress={() => router.push("/timeline")}>
          <Text style={styles.headerBtnText}>Timeline</Text>
        </Pressable>
      </View>

      {/* Stats strip */}
      <View style={styles.statsRow}>
        <StatPill label="Feed" value={lastByType.get("feed") ? minutesAgo(lastByType.get("feed")!.occurredAt) : "—"} />
        <StatPill
          label="Diaper"
          value={lastByType.get("diaper") ? minutesAgo(lastByType.get("diaper")!.occurredAt) : "—"}
        />
        <StatPill
          label="Sleep"
          value={lastByType.get("sleep") ? minutesAgo(lastByType.get("sleep")!.occurredAt) : "—"}
        />
        <StatPill
          label="Tummy"
          value={lastByType.get("tummy") ? minutesAgo(lastByType.get("tummy")!.occurredAt) : "—"}
        />
      </View>

      {/* Quick log */}
      <Text style={styles.sectionTitle}>Quick Log</Text>
      <View style={styles.quickRow}>
        <QuickButton title="Feed" icon="feed" onPress={() => quickLog("feed")} />
        <QuickButton title="Diaper" icon="diaper" onPress={() => quickLog("diaper")} />
      </View>
      <View style={styles.quickRow}>
        <QuickButton
          title={activeSleep ? "End Sleep" : "Sleep"}
          icon="sleep"
          onPress={() => {
            try {
              activeSleep ? endSession("sleep") : startSession("sleep");
            } catch (e: any) {
              Alert.alert("Timer", e?.message ?? "Couldn't update sleep timer.");
            }
          }}
        />
        <QuickButton
          title={activeTummy ? "End Tummy Time" : "Tummy Time"}
          icon="tummy"
          onPress={() => {
            try {
              activeTummy ? endSession("tummy_time") : startSession("tummy_time");
            } catch (e: any) {
              Alert.alert("Timer", e?.message ?? "Couldn't update tummy timer.");
            }
          }}
        />
      </View>

      {/* Now card */}
      <Text style={styles.sectionTitle}>Right now</Text>
      <View style={styles.card}>
        {activeSleep || activeTummy ? (
          <>
            {activeSleep && (
              <View style={{ gap: 8 }}>
                <Text style={styles.cardTitle}>Sleeping</Text>
                <Text style={styles.cardText}>Started {minutesAgo(activeSleep.startAt)}</Text>

                <Pressable style={styles.primaryBtn} onPress={() => endSession("sleep")}>
                  <Text style={styles.primaryBtnText}>End Sleep</Text>
                </Pressable>
              </View>
            )}

            {activeTummy && (
              <View style={{ gap: 8, marginTop: activeSleep ? 12 : 0 }}>
                <Text style={styles.cardTitle}>Tummy time</Text>
                <Text style={styles.cardText}>Started {minutesAgo(activeTummy.startAt)}</Text>

                <Pressable style={styles.primaryBtn} onPress={() => endSession("tummy_time")}>
                  <Text style={styles.primaryBtnText}>End Tummy</Text>
                </Pressable>
              </View>
            )}
          </>
        ) : (
          <>
            <Text style={styles.cardTitle}>No active timers</Text>
            <Text style={styles.cardText}>Start sleep or tummy time when it begins.</Text>

            <View style={{ flexDirection: "row", gap: 10 }}>
              <Pressable style={styles.secondaryBtn} onPress={() => startSession("sleep")}>
                <Text style={styles.secondaryBtnText}>Start Sleep</Text>
              </Pressable>

              <Pressable style={styles.secondaryBtn} onPress={() => startSession("tummy_time")}>
                <Text style={styles.secondaryBtnText}>Start Tummy</Text>
              </Pressable>
            </View>
          </>
        )}
      </View>


      {/* Mini timeline */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Recent</Text>
        <Pressable onPress={() => router.push("/timeline")}>
          <Text style={styles.link}>See all</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        {events.length === 0 ? (
          <Text style={styles.cardText}>No events yet. Tap a Quick Log button above.</Text>
        ) : (
          events.slice(0, 6).map((e) => (
            <Pressable key={e.id} style={styles.eventRow} onPress={() => router.push(`/event/${e.id}`)}>
              <EventIcon type={e.type} size={22} />
              <View style={{ flex: 1 }}>
                <Text style={styles.eventTitle}>{labelForEvent(e)}</Text>
                <Text style={styles.eventMeta}>
                  {formatTime(e.occurredAt)} • {minutesAgo(e.occurredAt)}
                  {e.durationMin != null ? ` • ${formatDurationMin(e.durationMin)}` : ""}
                </Text>
              </View>
              <Text style={styles.chev}>›</Text>
            </Pressable>
          ))
        )}
      </View>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.pill}>
      <Text style={styles.pillLabel}>{label}</Text>
      <Text style={styles.pillValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 16, gap: 12 },

  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 6 },
  title: { fontSize: 28, fontWeight: "700" },
  subTitle: { fontSize: 13, opacity: 0.6 },

  headerBtn: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: "#ddd" },
  headerBtnText: { fontWeight: "600" },

  statsRow: { flexDirection: "row", gap: 10, flexWrap: "wrap" },

  pill: { padding: 12, borderRadius: 16, borderWidth: 1, borderColor: "#eee", minWidth: 150 },
  pillLabel: { fontSize: 12, opacity: 0.6, marginBottom: 4 },
  pillValue: { fontSize: 16, fontWeight: "700" },

  sectionTitle: { fontSize: 16, fontWeight: "700", marginTop: 6 },
  sectionHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  link: { fontWeight: "600", opacity: 0.7 },

  quickRow: { flexDirection: "row", gap: 12 },

  card: { borderRadius: 18, borderWidth: 1, borderColor: "#eee", padding: 16, gap: 10 },
  cardTitle: { fontSize: 16, fontWeight: "800" },
  cardText: { opacity: 0.75, lineHeight: 20 },

  primaryBtn: { padding: 14, borderRadius: 14, borderWidth: 1, borderColor: "#ddd", alignItems: "center" },
  primaryBtnText: { fontWeight: "800" },

  secondaryBtn: { padding: 12, borderRadius: 14, borderWidth: 1, borderColor: "#eee", alignItems: "center" },
  secondaryBtnText: { fontWeight: "700", opacity: 0.85 },

  eventRow: { flexDirection: "row", alignItems: "center", paddingVertical: 10, gap: 10 },
  eventIcon: { fontSize: 20, width: 28, textAlign: "center" },
  eventTitle: { fontWeight: "700" },
  eventMeta: { fontSize: 12, opacity: 0.6, marginTop: 2 },
  chev: { fontSize: 22, opacity: 0.25, paddingLeft: 6 },
});
