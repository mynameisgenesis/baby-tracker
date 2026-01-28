import { Stack } from "expo-router";
import { EventDetailsScreen } from "../screens/event/EventDetailsScreen";

export default function EventRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Event",
          headerBackTitle: "Back",
        }}
      />
      <EventDetailsScreen />
    </>
  );
}
