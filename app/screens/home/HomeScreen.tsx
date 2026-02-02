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

import ActionButton from "@/app/components/buttons/ActionButton";
import EventPill from "@/app/components/events/EventPill";
import RecentEvents from "@/app/components/sections/RecentEvents";
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

      {/* Event strip */}
      <View style={styles.contentRow}>
        <EventPill
          label="Feed"
          value={
            lastByType.get("feed")
              ? minutesAgo(lastByType.get("feed")!.occurredAt)
              : "—"
          }
        />
        <EventPill
          label="Diaper"
          value={
            lastByType.get("diaper")
              ? minutesAgo(lastByType.get("diaper")!.occurredAt)
              : "—"
          }
        />
        <EventPill
          label="Sleep"
          value={
            lastByType.get("sleep")
              ? minutesAgo(lastByType.get("sleep")!.occurredAt)
              : "—"
          }
        />
        <EventPill
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
      <View style={styles.contentRow}>
        <ActionButton
          title="Feed"
          icon="feed"
          onPress={() => quickLog("feed")}
        />

        <ActionButton
          title="Diaper"
          icon="diaper"
          onPress={() => quickLog("diaper")}
        />
      </View>
      <View style={styles.contentRow}>
        <ActionButton
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
        <ActionButton
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 16, gap: 20 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
    fontFamily: "Quicksand_400Regular",
  },
  title: {
    fontSize: 35,
    fontWeight: "700",
    fontFamily: "Quicksand_400Regular",
  },
  subTitle: { fontSize: 16, opacity: 0.6 },

  headerBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  headerBtnText: { fontWeight: "600" },

  contentRow: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
    justifyContent: "space-around",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 10,
    fontFamily: "Quicksand_400Regular",
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  link: { fontWeight: "600", opacity: 0.7 },

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
