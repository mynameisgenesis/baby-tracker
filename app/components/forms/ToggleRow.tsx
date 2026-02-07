import { Pressable, StyleSheet, Text, View } from "react-native";

export default function ToggleRow({
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
        const isActive = o.value === value;
        return (
          <Pressable
            key={o.value}
            style={[styles.toggleBtn, isActive && styles.toggleBtnActive]}
            onPress={() => onChange(o.value)}
          >
            <Text
              style={[styles.toggleText, isActive && styles.toggleTextActive]}
            >
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  toggleRow: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
  toggleBtn: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  toggleBtnActive: { borderColor: "#ddd" },
  toggleText: { fontWeight: "800", opacity: 0.75 },
  toggleTextActive: { opacity: 1 },
});
