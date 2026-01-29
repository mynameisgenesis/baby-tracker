import { useEvents } from "@/app/data/eventsStore";
import {
  formatDurationMin,
  formatTime,
  labelForEvent,
  minutesAgo,
} from "@/app/data/helpers";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import EventIcon from "../events/EventIcon";

export default function RecentEvents() {
  const { events } = useEvents();

  return (
    <View style={styles.card}>
      {events.length === 0 ? (
        <Text style={styles.cardText}>
          No events yet. Tap a Quick Log button above.
        </Text>
      ) : (
        events.slice(0, 6).map((e) => (
          <Pressable
            key={e.id}
            style={styles.eventRow}
            onPress={() => router.push(`/event/${e.id}`)}
          >
            <EventIcon type={e.type} size={22} />
            <View style={{ flex: 1 }}>
              <Text style={styles.eventTitle}>{labelForEvent(e)}</Text>
              <Text style={styles.eventMeta}>
                {formatTime(e.occurredAt)} • {minutesAgo(e.occurredAt)}
                {e.durationMin != null
                  ? ` • ${formatDurationMin(e.durationMin)}`
                  : ""}
              </Text>
            </View>
            <Text style={styles.chev}>›</Text>
          </Pressable>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#eee",
    padding: 16,
    gap: 10,
  },
  cardTitle: { fontSize: 16, fontWeight: "800" },
  cardText: { opacity: 0.75, lineHeight: 20 },
  eventRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 10,
  },
  eventIcon: { fontSize: 20, width: 28, textAlign: "center" },
  eventTitle: { fontWeight: "700" },
  eventMeta: { fontSize: 12, opacity: 0.6, marginTop: 2 },
  chev: { fontSize: 22, opacity: 0.25, paddingLeft: 6 },
});
