import { useEvents } from "@/app/data/eventsStore";
import { minutesAgo } from "@/app/data/helpers";
import { EventType } from "@/app/data/types";
import { useMemo, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import EventLogModal from "../modals/EventLogModal";
import ActionButton from "./ActionButton";

type ActiveForm = null | Extract<EventType, "feed" | "diaper">;

export default function ActionButtonGroup() {
  const { addEvent, events, startSession, endSession, getActiveSession } =
    useEvents();

  const [active, setActive] = useState<ActiveForm>(null);

  const activeSleep = getActiveSession("sleep");
  const activeTummy = getActiveSession("tummy_time");

  const last = useMemo(() => events[0], [events]);

  function openForm(type: ActiveForm extends null ? never : ActiveForm) {
    setActive(type);
  }

  function closeForm() {
    setActive(null);
  }

  function toggleSleep() {
    try {
      if (activeSleep) endSession("sleep");
      else startSession("sleep");
    } catch (e: any) {
      Alert.alert("Timer error", e?.message ?? "Something went wrong.");
    }
  }

  function toggleTummy() {
    try {
      if (activeTummy) endSession("tummy_time");
      else startSession("tummy_time");
    } catch (e: any) {
      Alert.alert("Timer error", e?.message ?? "Something went wrong.");
    }
  }

  return (
    <View>
      <View style={styles.gridRow}>
        <ActionButton
          title="Feed"
          icon="feed"
          onPress={() => openForm("feed")}
        />
        <ActionButton
          title="Diaper"
          icon="diaper"
          onPress={() => openForm("diaper")}
        />
      </View>

      <View style={styles.gridRow}>
        <ActionButton
          title={activeSleep ? "End Sleep" : "Start Sleep"}
          subtitle={
            activeSleep
              ? `Started ${minutesAgo(activeSleep.startAt)}`
              : undefined
          }
          icon="sleep"
          onPress={toggleSleep}
          emphasized={!!activeSleep}
        />
        <ActionButton
          title={activeTummy ? "End Tummy" : "Start Tummy"}
          subtitle={
            activeTummy
              ? `Started ${minutesAgo(activeTummy.startAt)}`
              : undefined
          }
          icon="tummy"
          onPress={toggleTummy}
          emphasized={!!activeTummy}
        />
      </View>

      <EventLogModal
        active={active}
        onClose={closeForm}
        onSaveDiaper={({ occurredAt, diaperKind, note }) =>
          addEvent({ type: "diaper", occurredAt, diaperKind, note })
        }
        onSaveFeed={({ occurredAt, feedMethod, note }) =>
          addEvent({ type: "feed", occurredAt, feedMethod, note })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  gridRow: { flexDirection: "row", gap: 12, marginBottom: 20 },
});
