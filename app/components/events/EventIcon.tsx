import React from "react";
import { Image } from "react-native";
import { eventIcons } from "../../data/icons";
import type { EventType } from "../../data/types";

export default function EventIcon({
  type,
  size = 50,
}: {
  type: EventType;
  size?: number;
}) {
  return (
    <Image
      source={eventIcons[type]}
      style={{ width: size, height: size }}
      resizeMode="contain"
    />
  );
}
