import ActionButtonGroup from "@/app/components/buttons/ActionButtonGroup";
import { useEvents } from "@/app/data/eventsStore";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export function LogScreen() {
  const clearAll = useEvents();
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Log</Text>
          <Text style={styles.subTitle}>Quickly track what just happened</Text>
        </View>
      </View>
      <ActionButtonGroup />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 16, gap: 12 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
});
