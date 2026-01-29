import { EventType } from "@/app/data/types";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import EventIcon from "./EventIcon";

export default function ActionTile({
  title,
  subtitle,
  icon,
  onPress,
  emphasized,
}: {
  title: string;
  subtitle?: string;
  icon: EventType;
  onPress: () => void;
  emphasized?: boolean;
}) {
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[
        styles.tile,
        emphasized && styles.tileActive,
        pressed && styles.tilePressed,
      ]}
    >
      <Text style={styles.tileIcon}>
        <EventIcon type={icon} />
      </Text>
      <Text style={styles.tileText}>{title}</Text>
      {!!subtitle && <Text style={styles.tileSub}>{subtitle}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#eee",
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,

    backgroundColor: "#fff",

    // iOS shadow (raised)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 8,

    // Android shadow
    elevation: 6,
  },

  tileActive: {
    borderColor: "#ddd",

    // slightly stronger lift when emphasized
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 8,
  },

  tilePressed: {
    transform: [{ translateY: 3 }],

    // shadow collapses when pressed
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  tileIcon: {
    fontSize: 28,
  },

  tileText: {
    fontWeight: "800",
  },

  tileSub: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 2,
    textAlign: "center",
  },
});
