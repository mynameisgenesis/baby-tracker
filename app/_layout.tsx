import { Stack } from "expo-router";
import { EventsProvider } from "./data/eventsStore";

export default function RootLayout() {
  return (
    <EventsProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="event/[id]" options={{ title: "Event Details" }} />
      </Stack>
    </EventsProvider>
  );
}
