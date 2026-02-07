import { DiaperKind } from "@/app/data/types";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import ToggleRow from "./ToggleRow";

export default function DiaperFormFields({
  active,
  value,
  onChange,
}: {
  active: boolean;
  value: DiaperKind;
  onChange: (v: DiaperKind) => void;
}) {
  // If you want diaper form to own its own state later, you can.
  // For now we keep it controlled via props so the modal can save cleanly.
  useEffect(() => {
    // hook for later if you need reset side-effects
    // (active toggles true when modal opens on diaper)
  }, [active]);

  return (
    <View style={{ gap: 10 }}>
      <Text style={styles.label}>Type</Text>
      <ToggleRow
        options={[
          { label: "Pee", value: "pee" },
          { label: "Poop", value: "poop" },
          { label: "Both", value: "both" },
        ]}
        value={value}
        onChange={(v) => onChange(v as DiaperKind)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontWeight: "800", opacity: 0.75 },
});
