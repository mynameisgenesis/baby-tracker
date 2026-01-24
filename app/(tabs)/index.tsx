import { View } from "react-native";
import Button from "../components/Button";

export default function Index() {
  return (
    <View style={{ flex: 1, padding: 20 }}
    >
      <Button label="Custom Button" />
    </View>
  );
}