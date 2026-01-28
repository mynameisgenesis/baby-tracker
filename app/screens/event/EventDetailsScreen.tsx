import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { useEvents } from "../../data/eventsStore";
import { emojiForType, formatDurationMin, formatTime, labelForEvent, minutesAgo } from "../../data/helpers";

export function EventDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { events, deleteEvent } = useEvents();

  const event = useMemo(() => events.find((e) => e.id === id), [events, id]);

  if (!id || typeof id !== "string") {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Invalid event</Text>
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Event not found</Text>
        <Pressable style={styles.primaryBtn} onPress={() => router.back()}>
          <Text style={styles.primaryBtnText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const onDelete = () => {
    Alert.alert("Delete event?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteEvent(event.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <Text style={styles.bigIcon}>{emojiForType(event.type)}</Text>
        <Text style={styles.headerTitle}>{labelForEvent(event)}</Text>
        <Text style={styles.headerMeta}>
          {formatTime(event.occurredAt)} • {minutesAgo(event.occurredAt)}
          {event.durationMin != null ? ` • ${formatDurationMin(event.durationMin)}` : ""}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Details</Text>

        <Row label="Type" value={event.type} />
        <Row label="Time" value={new Date(event.occurredAt).toLocaleString()} />

        {event.type === "diaper" && <Row label="Diaper" value={event.diaperKind ?? "—"} />}
        {event.type === "feed" && <Row label="Feeding" value={event.feedMethod ?? "—"} />}

        {(event.type === "sleep" || event.type === "tummy") && (
          <Row label="Duration" value={event.durationMin != null ? formatDurationMin(event.durationMin) : "—"} />
        )}

        <Row label="Notes" value={event.note?.trim() ? event.note : "—"} />
      </View>

      <View style={styles.dangerCard}>
        <Text style={styles.dangerTitle}>Danger zone</Text>
        <Pressable style={styles.deleteBtn} onPress={onDelete}>
          <Text style={styles.deleteBtnText}>Delete event</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 16, gap: 12 },

  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16, gap: 12 },
  title: { fontSize: 18, fontWeight: "800" },

  headerCard: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#eee",
    padding: 18,
    alignItems: "center",
    gap: 6,
  },
  bigIcon: { fontSize: 44 },
  headerTitle: { fontSize: 18, fontWeight: "900", textAlign: "center" },
  headerMeta: { opacity: 0.65, textAlign: "center" },

  card: { borderRadius: 18, borderWidth: 1, borderColor: "#eee", padding: 16, gap: 12 },
  cardTitle: { fontSize: 16, fontWeight: "900" },

  row: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  rowLabel: { fontWeight: "800", opacity: 0.7 },
  rowValue: { fontWeight: "700", maxWidth: "60%", textAlign: "right" },

  dangerCard: { borderRadius: 18, borderWidth: 1, borderColor: "#f2d3d3", padding: 16, gap: 10 },
  dangerTitle: { fontSize: 14, fontWeight: "900", opacity: 0.7 },

  deleteBtn: {
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#f2d3d3",
    alignItems: "center",
  },
  deleteBtnText: { fontWeight: "900" },

  primaryBtn: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  primaryBtnText: { fontWeight: "900" },
});
