import { EventType } from "@/app/data/types";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import EventIcon from "../events/EventIcon";

export default function QuickButton({
  title,
  icon,
  onPress,
}: {
  title: string;
  icon: EventType;
  onPress: () => void;
}) {
  const [pressed, setPressed] = useState(false);

  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = async () => {
    setPressed(true);
    // tiny “click” feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
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
      style={({ pressed: p }) => [
        styles.quickBtnOuter,
        (pressed || p) && styles.quickBtnOuterPressed,
      ]}
    >
      <Animated.View
        style={
          [
            styles.quickBtnInner,
            { transform: [{ translateY }, { scale }] },
          ] as unknown as ViewStyle
        }
      >
        <LinearGradient
          colors={pressed ? ["#F4F5F7", "#FFFFFF"] : ["#FFFFFF", "#F6F7FA"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.quickBtnGradient}
        >
          <Text style={styles.quickIcon}>
            <EventIcon type={icon} />
          </Text>
          <Text style={styles.quickText}>{title}</Text>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  quickBtnOuter: {
    flex: 1,
    borderRadius: 18,
  },

  // “Raised” shadow lives on the OUTER wrapper
  quickBtnInner: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#eee",
    overflow: "hidden",

    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 10,

    // Android shadow
    elevation: 8,
  },

  // Optional: slightly reduce outer hitbox “pop” look while pressed
  quickBtnOuterPressed: {},

  quickBtnGradient: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  quickIcon: { fontSize: 26 },
  quickText: { fontSize: 14, fontWeight: "700" },
});
