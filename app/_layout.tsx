import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Font from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";

import { EventsProvider } from "@/app/data/eventsStore"; // <-- adjust path if needed

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        // preload icon fonts (only include the packs you actually use)
        await Font.loadAsync({
          ...Ionicons.font,
          ...MaterialCommunityIcons.font,
        });
      } finally {
        setReady(true);
        SplashScreen.hideAsync().catch(() => {});
      }
    })();
  }, []);

  if (!ready) return null;

  return (
    <EventsProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </EventsProvider>
  );
}
