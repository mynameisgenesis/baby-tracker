import { EventType } from "@/app/data/types";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
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
            pressed && styles.buttonInnerPressed,
            { transform: [{ translateY }, { scale }] },
          ] as unknown as ViewStyle
        }
      >
        <LinearGradient
          colors={
            pressed
              ? ["#F4F5F7", "#FFFFFF"]
              : emphasized
                ? ["#FFFFFF", "#F2F3FF"]
                : ["#FFFFFF", "#F6F7FA"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.buttonGradient}
        >
          <Text style={styles.buttonIcon}>
            <EventIcon type={icon} />
          </Text>
          <Text style={styles.buttonText}>{title}</Text>
          {!!subtitle && <Text style={styles.buttonSub}>{subtitle}</Text>}
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonOuter: {
    flex: 1,
    borderRadius: 18,
  },

  buttonInner: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#eee",
    overflow: "hidden",

    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 10,

    // Android
    elevation: 8,
  },

  buttonInnerEmphasized: {
    borderColor: "#ddd",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 10,
  },

  buttonInnerPressed: {
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },

  buttonGradient: {
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  buttonIcon: { fontSize: 28 },
  buttonText: { fontWeight: "800" },
  buttonSub: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 2,
    textAlign: "center",
  },
});
