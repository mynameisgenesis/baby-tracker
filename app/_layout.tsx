import { Stack } from 'expo-router';

export default function TableLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen name="event/[id]" options={{ title: "Event Details" }} />
    </Stack>
  );
}