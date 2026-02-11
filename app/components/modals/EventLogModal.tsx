import { DiaperKind, FeedMethod } from "@/app/data/types";
import { useEffect, useState } from "react";
import {
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
import DiaperFormFields from "../forms/DiaperFormFields";
import FeedFormFields from "../forms/FeedFormFields";

type ActiveForm = null | "feed" | "diaper";

export default function EventLogModal({
  active,
  onClose,
  onSaveDiaper,
  onSaveFeed,
}: {
  active: ActiveForm;
  onClose: () => void;
  onSaveDiaper: (data: {
    occurredAt: number;
    diaperKind: DiaperKind;
    note?: string;
  }) => void;
  onSaveFeed: (data: {
    occurredAt: number;
    feedMethod: FeedMethod;
    note?: string;
  }) => void;
}) {
  const visible = active !== null;

  // shared
  const [note, setNote] = useState("");
  const [occurredAt, setOccurredAt] = useState<number>(() => Date.now());

  // separated (each will grow independently)
  const [diaperKind, setDiaperKind] = useState<DiaperKind>("pee");
  const [feedMethod, setFeedMethod] = useState<FeedMethod>("bottle");

  // reset when opening or switching type
  useEffect(() => {
    if (!visible) return;
    setNote("");
    setOccurredAt(Date.now());
    setDiaperKind("pee");
    setFeedMethod("bottle");
  }, [visible, active]);

  function save() {
    const when = occurredAt || Date.now();
    const cleanNote = note.trim() || undefined;

    if (active === "diaper") {
      onSaveDiaper({ occurredAt: when, diaperKind, note: cleanNote });
    } else if (active === "feed") {
      onSaveFeed({ occurredAt: when, feedMethod, note: cleanNote });
    }
    onClose();
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalSheet}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {active ? `Log ${active}` : "Log"}
            </Text>
            <Pressable onPress={onClose}>
              <Text style={styles.modalClose}>Close</Text>
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={{ gap: 12, paddingBottom: 10 }}>
            {active === "diaper" && (
              <DiaperFormFields
                active
                value={diaperKind}
                onChange={setDiaperKind}
              />
            )}

            {active === "feed" && (
              <FeedFormFields
                active
                value={feedMethod}
                onChange={setFeedMethod}
              />
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
  );
}

const styles = StyleSheet.create({
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
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: "Quicksand_400Regular",
  },
  modalClose: { fontWeight: "800", opacity: 0.7 },
  label: { opacity: 0.75 },
  input: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 14,
    padding: 12,
    fontSize: 14,
  },
  primaryBtn: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 14,
    alignItems: "center",
    marginTop: 2,
  },
  primaryBtnText: { fontWeight: "900" },
});
