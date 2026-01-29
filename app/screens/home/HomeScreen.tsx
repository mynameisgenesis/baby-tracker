import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import RecentEvents from "@/app/components/sections/RecentEvents";
import QuickButton from "../../components/buttons/QuickButton";
import { useEvents } from "../../data/eventsStore";
import { minutesAgo } from "../../data/helpers";
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

        <Pressable
          style={styles.headerBtn}
          onPress={() => router.push("/timeline")}
        >
          <Text style={styles.headerBtnText}>Timeline</Text>
        </Pressable>
      </View>

      {/* Stats strip */}
      <View style={styles.statsRow}>
        <StatPill
          label="Feed"
          value={
            lastByType.get("feed")
              ? minutesAgo(lastByType.get("feed")!.occurredAt)
              : "—"
          }
        />
        <StatPill
          label="Diaper"
          value={
            lastByType.get("diaper")
              ? minutesAgo(lastByType.get("diaper")!.occurredAt)
              : "—"
          }
        />
        <StatPill
          label="Sleep"
          value={
            lastByType.get("sleep")
              ? minutesAgo(lastByType.get("sleep")!.occurredAt)
              : "—"
          }
        />
        <StatPill
          label="Tummy"
          value={
            lastByType.get("tummy")
              ? minutesAgo(lastByType.get("tummy")!.occurredAt)
              : "—"
          }
        />
      </View>

      {/* Quick log */}
      <Text style={styles.sectionTitle}>Quick Log</Text>
      <View style={styles.quickRow}>
        <QuickButton
          title="Feed"
          icon="feed"
          onPress={() => quickLog("feed")}
        />

        <QuickButton
          title="Diaper"
          icon="diaper"
          onPress={() => quickLog("diaper")}
        />
        {/* <ActionButton title="Feed" icon="feed" onPress={() => openForm("feed")} />
          <ActionButton title="Diaper" icon="diaper" onPress={() => openForm("diaper")} /> */}
      </View>
      <View style={styles.quickRow}>
        <QuickButton
          title={activeSleep ? "End Sleep" : "Sleep"}
          icon="sleep"
          onPress={() => {
            try {
              activeSleep ? endSession("sleep") : startSession("sleep");
            } catch (e: any) {
              Alert.alert(
                "Timer",
                e?.message ?? "Couldn't update sleep timer.",
              );
            }
          }}
        />
        <QuickButton
          title={activeTummy ? "End Tummy Time" : "Tummy Time"}
          icon="tummy"
          onPress={() => {
            try {
              activeTummy
                ? endSession("tummy_time")
                : startSession("tummy_time");
            } catch (e: any) {
              Alert.alert(
                "Timer",
                e?.message ?? "Couldn't update tummy timer.",
              );
            }
          }}
        />
      </View>

      {/* Mini timeline */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Recent</Text>
        <Pressable onPress={() => router.push("/timeline")}>
          <Text style={styles.link}>See all</Text>
        </Pressable>
      </View>
      {/* Now card */}
      <RecentEvents />

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

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  title: { fontSize: 28, fontWeight: "700" },
  subTitle: { fontSize: 13, opacity: 0.6 },

  headerBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  headerBtnText: { fontWeight: "600" },

  statsRow: { flexDirection: "row", gap: 10, flexWrap: "wrap" },

  pill: {
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#eee",
    minWidth: 150,
  },
  pillLabel: { fontSize: 12, opacity: 0.6, marginBottom: 4 },
  pillValue: { fontSize: 16, fontWeight: "700" },

  sectionTitle: { fontSize: 16, fontWeight: "700", marginTop: 6 },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  link: { fontWeight: "600", opacity: 0.7 },

  quickRow: { flexDirection: "row", gap: 12 },

  primaryBtn: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  primaryBtnText: { fontWeight: "800" },

  secondaryBtn: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
  },
  secondaryBtnText: { fontWeight: "700", opacity: 0.85 },
});
