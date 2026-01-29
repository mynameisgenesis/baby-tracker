import { EventType } from "@/app/data/types";
import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import EventIcon from "./EventIcon";

export default function QuickButton({ title, icon, onPress }: { title: string; icon: EventType; onPress: () => void }) {
  return (
    <Pressable style={styles.quickBtn} onPress={onPress}>
      <Text style={styles.quickIcon}><EventIcon type={icon}></EventIcon></Text>
      <Text style={styles.quickText}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  quickBtn: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#eee",
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  quickIcon: { fontSize: 26 },
  quickText: { fontSize: 14, fontWeight: "700" },
});