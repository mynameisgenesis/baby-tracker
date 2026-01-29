import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { EventIcon } from "@/app/components/events/EventIcon";
import { useEvents } from "../../data/eventsStore";
import { formatDurationMin, formatTime, labelForEvent, minutesAgo } from "../../data/helpers";
import type { BabyEvent, DiaperKind, FeedMethod } from "../../data/types";

export function EventDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { events, updateEvent, deleteEvent } = useEvents();

  const event = useMemo(() => events.find((e) => e.id === id), [events, id]);

  const [isEditing, setIsEditing] = useState(false);

  // Editable fields (local draft state)
  const [noteDraft, setNoteDraft] = useState("");
  const [diaperKindDraft, setDiaperKindDraft] = useState<DiaperKind>("pee");
  const [feedMethodDraft, setFeedMethodDraft] = useState<FeedMethod>("bottle");
  const [durationDraft, setDurationDraft] = useState<string>(""); // minutes

  // When user enters edit mode, load current values into draft
  const beginEdit = () => {
    if (!event) return;

    setNoteDraft(event.note ?? "");
    setDiaperKindDraft(event.diaperKind ?? "pee");
    setFeedMethodDraft(event.feedMethod ?? "bottle");
    setDurationDraft(event.durationMin != null ? String(event.durationMin) : "");
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
  };

  const saveEdit = () => {
    if (!event) return;

    const patch: Partial<BabyEvent> = {
      note: noteDraft.trim() || undefined,
    };

    if (event.type === "diaper") {
      patch.diaperKind = diaperKindDraft;
    }

    if (event.type === "feed") {
      patch.feedMethod = feedMethodDraft;
    }

    if (event.type === "sleep" || event.type === "tummy") {
      const n = durationDraft.trim() === "" ? undefined : Number(durationDraft);
      patch.durationMin = Number.isFinite(n as number) ? (n as number) : undefined;
    }

    updateEvent(event.id, patch);
    setIsEditing(false);
  };

  const onDelete = () => {
    if (!event) return;

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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.headerCard}>
        <EventIcon type={event.type} size={56} />
        <Text style={styles.headerTitle}>{labelForEvent(event)}</Text>
        <Text style={styles.headerMeta}>
          {formatTime(event.occurredAt)} • {minutesAgo(event.occurredAt)}
          {event.durationMin != null ? ` • ${formatDurationMin(event.durationMin)}` : ""}
        </Text>

        {!isEditing ? (
          <Pressable style={styles.primaryBtn} onPress={beginEdit}>
            <Text style={styles.primaryBtnText}>Edit</Text>
          </Pressable>
        ) : (
          <View style={{ flexDirection: "row", gap: 10, marginTop: 6 }}>
            <Pressable style={styles.secondaryBtn} onPress={cancelEdit}>
              <Text style={styles.secondaryBtnText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.primaryBtn} onPress={saveEdit}>
              <Text style={styles.primaryBtnText}>Save</Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* Details / Edit Form */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{isEditing ? "Edit details" : "Details"}</Text>

        {/* <Row label="Type" value={event.type} /> */}

        {event.type === "diaper" && (
          <>
            <Text style={styles.label}>Diaper</Text>
            {isEditing ? (
              <ToggleRow
                options={[
                  { label: "Pee", value: "pee" },
                  { label: "Poop", value: "poop" },
                  { label: "Both", value: "both" },
                ]}
                value={diaperKindDraft}
                onChange={(v) => setDiaperKindDraft(v as DiaperKind)}
              />
            ) : (
              <Text style={styles.readValue}>{event.diaperKind ?? "—"}</Text>
            )}
          </>
        )}

        {event.type === "feed" && (
          <>
            <Text style={styles.label}>Feeding</Text>
            {isEditing ? (
              <ToggleRow
                options={[
                  { label: "Breast", value: "breast" },
                  { label: "Bottle", value: "bottle" },
                  { label: "Solids", value: "solids" },
                ]}
                value={feedMethodDraft}
                onChange={(v) => setFeedMethodDraft(v as FeedMethod)}
              />
            ) : (
              <Text style={styles.readValue}>{event.feedMethod ?? "—"}</Text>
            )}
          </>
        )}

        {(event.type === "sleep" || event.type === "tummy") && (
          <>
            {/* Start / End */}
            <Text style={styles.label}>Start</Text>
            <Text style={styles.readValue}>
              {new Date(event.startAt ?? event.occurredAt).toLocaleString()}
            </Text>

            <Text style={styles.label}>End</Text>
            <Text style={styles.readValue}>
              {event.endAt != null ? new Date(event.endAt).toLocaleString() : "—"}
            </Text>

            {/* Duration */}
            <Text style={styles.label}>Duration</Text>
            {isEditing ? (
              <TextInput
                value={durationDraft}
                onChangeText={setDurationDraft}
                placeholder="e.g. 45"
                keyboardType="number-pad"
                style={styles.input}
              />
            ) : (
              <Text style={styles.readValue}>
                {event.durationMin != null ? formatDurationMin(event.durationMin) : "—"}
              </Text>
            )}
          </>
        )}

        <Text style={styles.label}>Notes</Text>
        {isEditing ? (
          <TextInput
            value={noteDraft}
            onChangeText={setNoteDraft}
            placeholder="Add a note…"
            style={[styles.input, { height: 90, textAlignVertical: "top" }]}
            multiline
          />
        ) : (
          <Text style={styles.readValue}>{event.note?.trim() ? event.note : "—"}</Text>
        )}
      </View>

      {/* Danger zone */}
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

function ToggleRow({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <View style={styles.toggleRow}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <Pressable
            key={o.value}
            style={[styles.toggleBtn, active && styles.toggleBtnActive]}
            onPress={() => onChange(o.value)}
          >
            <Text style={[styles.toggleText, active && styles.toggleTextActive]}>{o.label}</Text>
          </Pressable>
        );
      })}
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
    gap: 8,
  },
  bigIcon: { fontSize: 44 },
  headerTitle: { fontSize: 18, fontWeight: "900", textAlign: "center" },
  headerMeta: { opacity: 0.65, textAlign: "center" },

  card: { borderRadius: 18, borderWidth: 1, borderColor: "#eee", padding: 16, gap: 10 },
  cardTitle: { fontSize: 16, fontWeight: "900" },

  row: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  rowLabel: { fontWeight: "800", opacity: 0.7 },
  rowValue: { fontWeight: "700", maxWidth: "60%", textAlign: "right" },

  label: { fontWeight: "800", opacity: 0.7, marginTop: 6 },
  readValue: { fontWeight: "700", opacity: 0.9 },

  input: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 14,
    padding: 12,
    fontSize: 14,
  },

  toggleRow: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
  toggleBtn: { borderWidth: 1, borderColor: "#eee", borderRadius: 999, paddingHorizontal: 14, paddingVertical: 10 },
  toggleBtnActive: { borderColor: "#ddd" },
  toggleText: { fontWeight: "800", opacity: 0.75 },
  toggleTextActive: { opacity: 1 },

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
    alignItems: "center",
  },
  primaryBtnText: { fontWeight: "900" },

  secondaryBtn: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
  },
  secondaryBtnText: { fontWeight: "900", opacity: 0.7 },
});
