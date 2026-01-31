import { EventType } from "@/app/data/types";
import * as Haptics from "expo-haptics";
import React, { useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import EventIcon from "../events/EventIcon";

export default function ActionButton({
  title,
  subtitle,
  icon,
  onPress,
  emphasized,
}: {
  title: string;
  subtitle?: string;
  icon: EventType;
  onPress: () => void;
  emphasized?: boolean;
}) {
  const [pressed, setPressed] = useState(false);

  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = async () => {
    setPressed(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 3,
        useNativeDriver: true,
        speed: 30,
        bounciness: 0,
      }),
      Animated.spring(scale, {
        toValue: 0.985,
        useNativeDriver: true,
        speed: 30,
        bounciness: 0,
      }),
    ]).start();
  };

  const pressOut = () => {
    setPressed(false);
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        speed: 22,
        bounciness: 6,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 22,
        bounciness: 6,
      }),
    ]).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      style={styles.buttonOuter}
    >
      <Animated.View
        style={
          [
            styles.buttonInner,
            emphasized && styles.buttonInnerEmphasized,
            { transform: [{ translateY }, { scale }] },
          ] as unknown as ViewStyle
        }
      >
        <Text style={styles.buttonIcon}>
          <EventIcon type={icon} size={72} />
        </Text>
        <Text style={styles.buttonText}>{title}</Text>
        {!!subtitle && <Text style={styles.buttonSub}>{subtitle}</Text>}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // Copied style vibe from QuickButton
  buttonOuter: {
    flex: 1,
    borderRadius: 26,
    backdropFilter: "blur(4px)",
    backgroundColor: "rgba(209,243,255, 0.6)",
  },

  // Copied style vibe from QuickButton
  buttonInner: {
    borderRadius: 26,
    backdropFilter: "blur(4px)",
    backgroundColor: "rgba(209,243,255, 0.6)",

    padding: 18,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  // Optional: slightly different tint when emphasized (still same “family”)
  buttonInnerEmphasized: {
    backgroundColor: "rgba(209,243,255, 0.75)",
  },

  buttonIcon: { fontSize: 28 },
  buttonText: { fontSize: 16, fontWeight: "800" },
  buttonSub: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 2,
    textAlign: "center",
  },
});
