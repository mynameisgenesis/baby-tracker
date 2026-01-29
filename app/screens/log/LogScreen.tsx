import React, { useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useEvents } from "../../data/eventsStore";
import { formatDurationMin, minutesAgo } from "../../data/helpers";
import type { DiaperKind, EventType, FeedMethod } from "../../data/types";
import ActionTile from "../../components/events/ActionTile";

type ActiveForm = null | Extract<EventType, "feed" | "diaper">;

export function LogScreen() {
  const { addEvent, events, clearAll, startSession, endSession, getActiveSession } = useEvents();

  const activeSleep = getActiveSession("sleep");
  const activeTummy = getActiveSession("tummy_time");

  const [active, setActive] = useState<ActiveForm>(null);

  // shared form fields
  const [note, setNote] = useState("");
  const [occurredAt, setOccurredAt] = useState<number>(() => Date.now());

  // diaper form
  const [diaperKind, setDiaperKind] = useState<DiaperKind>("pee");

  // feed form
  const [feedMethod, setFeedMethod] = useState<FeedMethod>("bottle");

  const last = useMemo(() => events[0], [events]);

  function resetForm() {
    setNote("");
    setOccurredAt(Date.now());
    setDiaperKind("pee");
    setFeedMethod("bottle");
  }

  function openForm(type: ActiveForm extends null ? never : ActiveForm) {
    resetForm();
    setActive(type);
  }

  function closeForm() {
    setActive(null);
  }

  function save() {
    const when = occurredAt || Date.now();
    const cleanNote = note.trim() || undefined;

    if (active === "diaper") {
      addEvent({ type: "diaper", occurredAt: when, diaperKind, note: cleanNote });
    } else if (active === "feed") {
      addEvent({ type: "feed", occurredAt: when, feedMethod, note: cleanNote });
    }

    closeForm();
  }

  function toggleSleep() {
    try {
      if (activeSleep) {
        endSession("sleep");
      } else {
        startSession("sleep");
      }
    } catch (e: any) {
      Alert.alert("Timer error", e?.message ?? "Something went wrong.");
    }
  }

  function toggleTummy() {
    try {
      if (activeTummy) {
        endSession("tummy_time");
      } else {
        startSession("tummy_time");
      }
    } catch (e: any) {
      Alert.alert("Timer error", e?.message ?? "Something went wrong.");
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Log</Text>
          <Text style={styles.subTitle}>Quickly track what just happened</Text>
        </View>

        <Pressable style={styles.ghostBtn} onPress={clearAll}>
          <Text style={styles.ghostBtnText}>Clear</Text>
        </Pressable>
      </View>

      {/* Feed / Diaper still use the modal */}
      <View style={styles.gridRow}>
        <ActionTile title="Feed" icon="feed" onPress={() => openForm("feed")} />
        <ActionTile title="Diaper" icon="diaper" onPress={() => openForm("diaper")} />
      </View>

      {/* Sleep / Tummy are now timers */}
      <View style={styles.gridRow}>
        <ActionTile
          title={activeSleep ? "End Sleep" : "Start Sleep"}
          subtitle={activeSleep ? `Started ${minutesAgo(activeSleep.startAt)}` : undefined}
          icon="sleep"
          onPress={toggleSleep}
          emphasized={!!activeSleep}
        />
        <ActionTile
          title={activeTummy ? "End Tummy" : "Start Tummy"}
          subtitle={activeTummy ? `Started ${minutesAgo(activeTummy.startAt)}` : undefined}
          icon="tummy"
          onPress={toggleTummy}
          emphasized={!!activeTummy}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Most recent</Text>
        {last ? (
          <Text style={styles.cardText}>
            {last.type.toUpperCase()} •{" "}
            {new Date(last.occurredAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
            {last.durationMin != null ? ` • ${formatDurationMin(last.durationMin)}` : ""}
          </Text>
        ) : (
          <Text style={styles.cardText}>No events yet. Log one above.</Text>
        )}
      </View>

      {/* Modal only for feed/diaper now */}
      <Modal visible={active !== null} animationType="slide" transparent onRequestClose={closeForm}>
        <View style={styles.modalBackdrop}>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{active ? `Log ${active}` : "Log"}</Text>
              <Pressable onPress={closeForm}>
                <Text style={styles.modalClose}>Close</Text>
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={{ gap: 12, paddingBottom: 10 }}>
              {active === "diaper" && (
                <View style={{ gap: 10 }}>
                  <Text style={styles.label}>Type</Text>
                  <ToggleRow
                    options={[
                      { label: "Pee", value: "pee" },
                      { label: "Poop", value: "poop" },
                      { label: "Both", value: "both" },
                    ]}
                    value={diaperKind}
                    onChange={(v) => setDiaperKind(v as DiaperKind)}
                  />
                </View>
              )}

              {active === "feed" && (
                <View style={{ gap: 10 }}>
                  <Text style={styles.label}>Method</Text>
                  <ToggleRow
                    options={[
                      { label: "Breast", value: "breast" },
                      { label: "Bottle", value: "bottle" },
                      { label: "Solids", value: "solids" },
                    ]}
                    value={feedMethod}
                    onChange={(v) => setFeedMethod(v as FeedMethod)}
                  />
                </View>
              )}

              <View style={{ gap: 8 }}>
                <Text style={styles.label}>Notes (optional)</Text>
                <TextInput
                  value={note}
                  onChangeText={setNote}
                  placeholder="Anything worth remembering?"
                  style={[styles.input, { height: 90, textAlignVertical: "top" }]}
                  multiline
                />
              </View>

              <Pressable style={styles.primaryBtn} onPress={save}>
                <Text style={styles.primaryBtnText}>Save</Text>
              </Pressable>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </ScrollView>
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
          <Pressable key={o.value} style={[styles.toggleBtn, active && styles.toggleBtnActive]} onPress={() => onChange(o.value)}>
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

  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 28, fontWeight: "800" },
  subTitle: { fontSize: 13, opacity: 0.6, marginTop: 2 },

  ghostBtn: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: "#eee" },
  ghostBtnText: { fontWeight: "700", opacity: 0.8 },

  gridRow: { flexDirection: "row", gap: 12 },

  card: { borderRadius: 18, borderWidth: 1, borderColor: "#eee", padding: 16, gap: 8 },
  cardTitle: { fontSize: 16, fontWeight: "800" },
  cardText: { opacity: 0.75 },

  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 16,
    maxHeight: "85%",
  },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  modalTitle: { fontSize: 18, fontWeight: "900" },
  modalClose: { fontWeight: "800", opacity: 0.7 },

  label: { fontWeight: "800", opacity: 0.75 },

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

  primaryBtn: { borderRadius: 14, borderWidth: 1, borderColor: "#ddd", padding: 14, alignItems: "center", marginTop: 2 },
  primaryBtnText: { fontWeight: "900" },
});
