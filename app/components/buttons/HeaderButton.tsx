import { RelativePathString, router } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";

export default function HeaderButton({
  text,
  pageUrl,
}: {
  text: string;
  pageUrl: string;
}) {
  return (
    <Pressable
      style={styles.headerBtn}
      onPress={() => router.push(pageUrl as RelativePathString)}
    >
      <Text style={styles.headerBtnText}>{text}</Text>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  headerBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  headerBtnText: { fontWeight: "600" },
});
