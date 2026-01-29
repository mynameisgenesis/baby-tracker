import { EventType } from "@/app/data/types";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import EventIcon from "../events/EventIcon";

export default function QuickButton({
  title,
  icon,
  onPress,
}: {
  title: string;
  icon: EventType;
  onPress: () => void;
}) {
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[
        styles.quickBtn,
        pressed && styles.quickBtnPressed,
      ]}
    >
      <Text style={styles.quickIcon}>
        <EventIcon type={icon} />
      </Text>
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

    backgroundColor: "#fff",

    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 8,

    // Android shadow
    elevation: 6,
  },

  quickBtnPressed: {
    transform: [{ translateY: 3 }],

    // reduce shadow when pressed
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  quickIcon: {
    fontSize: 26,
  },

  quickText: {
    fontSize: 14,
    fontWeight: "700",
  },
});
