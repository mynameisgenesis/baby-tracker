import { EventType } from "@/app/data/types";
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
  return (
    <Pressable style={[styles.tile, emphasized && styles.tileActive]} onPress={onPress}>
      <Text style={styles.tileIcon}><EventIcon type={icon}></EventIcon></Text>
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
  },
  tileActive: {
    borderColor: "#ddd",
  },
  tileIcon: { fontSize: 28 },
  tileText: { fontWeight: "800" },
  tileSub: { fontSize: 12, opacity: 0.6, marginTop: 2, textAlign: "center" },
});
