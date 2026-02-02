import {
  Quicksand_400Regular,
  Quicksand_700Bold,
  useFonts,
} from "@expo-google-fonts/quicksand";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Font from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useCallback, useEffect, useState } from "react";

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

  const [fontsLoaded, fontError] = useFonts({
    Quicksand_400Regular,
    Quicksand_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null; // Return null (or a loading component) while fonts load
  }

  if (!ready) return null;

  return (
    <EventsProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="event/[id]"
          options={{
            headerShown: true,
            title: "Event",
            headerBackTitle: "Back",
          }}
        />
      </Stack>
    </EventsProvider>
  );
}
