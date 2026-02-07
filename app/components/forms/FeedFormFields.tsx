import { FeedMethod } from "@/app/data/types";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import ToggleRow from "./ToggleRow";

export default function FeedFormFields({
  active,
  value,
  onChange,
}: {
  active: boolean;
  value: FeedMethod;
  onChange: (v: FeedMethod) => void;
}) {
  useEffect(() => {
    // hook for later (e.g., show bottle ounces inputs when "bottle")
  }, [active, value]);

  return (
    <View style={{ gap: 10 }}>
      <Text style={styles.label}>Method</Text>
      <ToggleRow
        options={[
          { label: "Breast", value: "breast" },
          { label: "Bottle", value: "bottle" },
          { label: "Solids", value: "solids" },
        ]}
        value={value}
        onChange={(v) => onChange(v as FeedMethod)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontWeight: "800", opacity: 0.75 },
});
