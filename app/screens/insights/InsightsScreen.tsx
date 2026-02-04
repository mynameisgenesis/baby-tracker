import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useEvents } from "../../data/eventsStore";
import { formatDurationMin, minutesAgo } from "../../data/helpers";
import type { BabyEvent, EventType } from "../../data/types";

type RangeKey = "today" | "7d";

function startOfDay(ts: number) {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function daysAgoStart(daysAgo: number) {
  const now = Date.now();
  const todayStart = startOfDay(now);
  return todayStart - daysAgo * 24 * 60 * 60_000;
}

function clamp(n: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, n));
}

function sum(arr: number[]) {
  let s = 0;
  for (const n of arr) s += n;
  return s;
}

function toDateKey(ts: number) {
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function InsightsScreen() {
  const { events } = useEvents();
  const [range, setRange] = useState<RangeKey>("today");

  const rangeStart = useMemo(() => {
    if (range === "today") return daysAgoStart(0);
    return daysAgoStart(6); // inclusive: last 7 days including today
  }, [range]);

  const rangeEvents = useMemo(() => {
    return events.filter((e) => e.occurredAt >= rangeStart);
  }, [events, rangeStart]);

  const lastByType = useMemo(() => {
    const map = new Map<EventType, BabyEvent>();
    for (const e of events) {
      if (!map.has(e.type)) map.set(e.type, e);
    }
    return map;
  }, [events]);

  const summary = useMemo(() => {
    // counts
    let feedCount = 0;
    let diaperCount = 0;
    let sleepCount = 0;
    let tummyCount = 0;

    // durations (minutes)
    const sleepDurations: number[] = [];
    const tummyDurations: number[] = [];

    for (const e of rangeEvents) {
      if (e.type === "feed") feedCount++;
      if (e.type === "diaper") diaperCount++;

      if (e.type === "sleep") {
        sleepCount++;
        if (typeof e.durationMin === "number") sleepDurations.push(e.durationMin);
      }
      if (e.type === "tummy") {
        tummyCount++;
        if (typeof e.durationMin === "number") tummyDurations.push(e.durationMin);
      }
    }

    const sleepTotal = sum(sleepDurations);
    const tummyTotal = sum(tummyDurations);
    const longestSleep = sleepDurations.length ? Math.max(...sleepDurations) : 0;

    const lastFeedAt = lastByType.get("feed")?.occurredAt;
    const lastDiaperAt = lastByType.get("diaper")?.occurredAt;
    const lastSleepAt = lastByType.get("sleep")?.occurredAt;

    return {
      feedCount,
      diaperCount,
      sleepCount,
      tummyCount,

      sleepTotal,
      tummyTotal,
      longestSleep,

      lastFeedAt,
      lastDiaperAt,
      lastSleepAt,
    };
  }, [rangeEvents, lastByType]);

  const byDay = useMemo(() => {
    // Build daily totals for the last 7 days (even if range is today, this is still useful)
    const start = daysAgoStart(6);
    const buckets: Record<
      string,
      { feed: number; diaper: number; sleepMin: number; tummyMin: number }
    > = {};

    // initialize 7 days
    for (let i = 6; i >= 0; i--) {
      const key = toDateKey(daysAgoStart(i));
      buckets[key] = { feed: 0, diaper: 0, sleepMin: 0, tummyMin: 0 };
    }

    for (const e of events) {
      if (e.occurredAt < start) continue;
      const key = toDateKey(e.occurredAt);
      if (!buckets[key]) continue;

      if (e.type === "feed") buckets[key].feed++;
      if (e.type === "diaper") buckets[key].diaper++;
      if (e.type === "sleep") buckets[key].sleepMin += e.durationMin ?? 0;
      if (e.type === "tummy") buckets[key].tummyMin += e.durationMin ?? 0;
    }

    const keys = Object.keys(buckets).sort(); // ascending
    const rows = keys.map((k) => ({ dateKey: k, ...buckets[k] }));

    // max values for bar scaling
    const maxFeed = Math.max(1, ...rows.map((r) => r.feed));
    const maxDiaper = Math.max(1, ...rows.map((r) => r.diaper));
    const maxSleep = Math.max(1, ...rows.map((r) => r.sleepMin));
    const maxTummy = Math.max(1, ...rows.map((r) => r.tummyMin));

    return { rows, maxFeed, maxDiaper, maxSleep, maxTummy };
  }, [events]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Insights</Text>
          <Text style={styles.subTitle}>Quick patterns & totals</Text>
        </View>

        <Segmented
          value={range}
          options={[
            { label: "Today", value: "today" },
            { label: "7 Days", value: "7d" },
          ]}
          onChange={setRange}
        />
      </View>

      {/* Top summary cards */}
      <View style={styles.gridRow}>
        <Card>
          <Text style={styles.cardLabel}>Feeds</Text>
          <Text style={styles.cardValue}>{summary.feedCount}</Text>
          <Text style={styles.cardMeta}>
            Last: {summary.lastFeedAt ? minutesAgo(summary.lastFeedAt) : "—"}
          </Text>
        </Card>

        <Card>
          <Text style={styles.cardLabel}>Diapers</Text>
          <Text style={styles.cardValue}>{summary.diaperCount}</Text>
          <Text style={styles.cardMeta}>
            Last: {summary.lastDiaperAt ? minutesAgo(summary.lastDiaperAt) : "—"}
          </Text>
        </Card>
      </View>

      <View style={styles.gridRow}>
        <Card>
          <Text style={styles.cardLabel}>Sleep total</Text>
          <Text style={styles.cardValue}>{formatDurationMin(summary.sleepTotal) || "—"}</Text>
          <Text style={styles.cardMeta}>Longest: {summary.longestSleep ? formatDurationMin(summary.longestSleep) : "—"}</Text>
        </Card>

        <Card>
          <Text style={styles.cardLabel}>Tummy time</Text>
          <Text style={styles.cardValue}>{formatDurationMin(summary.tummyTotal) || "—"}</Text>
          <Text style={styles.cardMeta}>Sessions: {summary.tummyCount}</Text>
        </Card>
      </View>

      {/* Simple “mini charts” */}
      <Text style={styles.sectionTitle}>Last 7 days</Text>

      <BarSection title="Feeds per day">
        {byDay.rows.map((r) => (
          <BarRow
            key={`feed-${r.dateKey}`}
            label={shortDate(r.dateKey)}
            value={r.feed}
            ratio={clamp(r.feed / byDay.maxFeed)}
            suffix="feeds"
          />
        ))}
      </BarSection>

      <BarSection title="Diapers per day">
        {byDay.rows.map((r) => (
          <BarRow
            key={`diaper-${r.dateKey}`}
            label={shortDate(r.dateKey)}
            value={r.diaper}
            ratio={clamp(r.diaper / byDay.maxDiaper)}
            suffix="diapers"
          />
        ))}
      </BarSection>

      <BarSection title="Sleep minutes per day">
        {byDay.rows.map((r) => (
          <BarRow
            key={`sleep-${r.dateKey}`}
            label={shortDate(r.dateKey)}
            valueLabel={r.sleepMin ? formatDurationMin(r.sleepMin) : "—"}
            ratio={clamp(r.sleepMin / byDay.maxSleep)}
          />
        ))}
      </BarSection>

      <BarSection title="Tummy minutes per day">
        {byDay.rows.map((r) => (
          <BarRow
            key={`tummy-${r.dateKey}`}
            label={shortDate(r.dateKey)}
            valueLabel={r.tummyMin ? formatDurationMin(r.tummyMin) : "—"}
            ratio={clamp(r.tummyMin / byDay.maxTummy)}
          />
        ))}
      </BarSection>

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

function shortDate(dateKey: string) {
  // yyyy-mm-dd → "Mon 1/28"
  const [y, m, d] = dateKey.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  const weekday = dt.toLocaleDateString([], { weekday: "short" });
  const md = dt.toLocaleDateString([], { month: "numeric", day: "numeric" });
  return `${weekday} ${md}`;
}

function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { label: string; value: T }[];
  onChange: (v: T) => void;
}) {
  return (
    <View style={styles.segmented}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <Pressable
            key={o.value}
            style={[styles.segmentBtn, active && styles.segmentBtnActive]}
            onPress={() => onChange(o.value)}
          >
            <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

function BarSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <View style={{ gap: 8 }}>{children}</View>
    </View>
  );
}

function BarRow({
  label,
  ratio,
  value,
  valueLabel,
  suffix,
}: {
  label: string;
  ratio: number;
  value?: number;
  valueLabel?: string;
  suffix?: string;
}) {
  return (
    <View style={styles.barRow}>
      <Text style={styles.barLabel}>{label}</Text>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${Math.round(clamp(ratio) * 100)}%` }]} />
      </View>
      <Text style={styles.barValue}>
        {valueLabel ?? (value != null ? `${value}${suffix ? ` ${suffix}` : ""}` : "—")}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 16, gap: 12 },

  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 10 },
  title: { fontSize: 28, fontFamily: "Quicksand_400Regular",},
  subTitle: { fontSize: 13, opacity: 0.6, marginTop: 2 },

  segmented: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 14,
    overflow: "hidden",
  },
  segmentBtn: { paddingVertical: 10, paddingHorizontal: 12 },
  segmentBtnActive: { borderColor: "#ddd" },
  segmentText: { fontWeight: "800", opacity: 0.65 },
  segmentTextActive: { opacity: 1 },

  sectionTitle: { fontSize: 20, fontWeight: "800", marginTop: 6, fontFamily: "Quicksand_400Regular", },

  gridRow: { flexDirection: "row", gap: 12 },
  card: { flex: 1, borderRadius: 18, borderWidth: 1, borderColor: "#eee", padding: 16, gap: 6 },

  cardLabel: { fontSize: 12, opacity: 0.6, fontWeight: "800" },
  cardValue: { fontSize: 22, fontWeight: "900" },
  cardMeta: { fontSize: 12, opacity: 0.6, marginTop: 2 },

  cardTitle: { fontSize: 14, fontWeight: "900", opacity: 0.75, marginBottom: 6 },

  barRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  barLabel: { width: 86, fontSize: 12, opacity: 0.7, fontWeight: "800" },
  barTrack: { flex: 1, height: 10, borderRadius: 999, borderWidth: 1, borderColor: "#eee", overflow: "hidden" },
  barFill: { height: "100%" },
  barValue: { width: 72, textAlign: "right", fontSize: 12, opacity: 0.7, fontWeight: "800" },
});
