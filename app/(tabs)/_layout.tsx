import { Image } from "expo-image";
import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";

export default function TableLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#d3d3ff",
        headerStyle: { backgroundColor: "#967bb6" },
        headerShadowVisible: false,
        headerTitleStyle: { color: "#d3d3ff" },
        tabBarStyle: {
          backgroundColor: "#1e1e2e",
          height: 100,
        },
        tabBarLabelStyle: { paddingBottom: 10, fontSize: 16, marginTop: 6 },
        tabBarInactiveTintColor: "#8080aa",
        tabBarItemStyle: { marginTop: 15 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: () => (
            <Image
              source={require("../../assets/icons/home-icon.png")}
              style={{ width: 50, height: 50 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="log"
        options={{
          title: "Logs",
          tabBarIcon: () => (
            <Image
              source={require("../../assets/icons/logs-icon.png")}
              style={{ width: 50, height: 50 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="timeline"
        options={{
          title: "Timeline",
          tabBarIcon: () => (
            <Image
              source={require("../../assets/icons/timeline-icon.png")}
              style={{ width: 50, height: 50 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: "Insights",
          tabBarIcon: () => (
            <Image
              source={require("../../assets/icons/insights-icon.png")}
              style={{ width: 50, height: 50 }}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconImage: { width: 50, height: 50 },
});
