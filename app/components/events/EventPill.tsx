import { StyleSheet, Text, View } from "react-native";

export default function EventPill({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.pill}>
      <Text style={styles.pillLabel}>{label}</Text>
      <Text style={styles.pillValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    padding: 16,
    backgroundColor: "rgba(252,239,145, 0.6)",
    minWidth: "45%",
    borderRadius: 26,
    backdropFilter: "blur(4px)",
  },
  pillLabel: { fontSize: 16, opacity: 0.6, marginBottom: 4 },
  pillValue: { fontSize: 16, fontWeight: "700" },
});
