import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { SubmitButton } from "../ui";
import { colors, fonts } from "@/lib/theme";

// Calendar → time picker → confirmation, ported from the Home page in CR_Client.
type Step = "date" | "time" | "confirm";

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
const toDateString = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const HOURS = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const MINUTES = Array.from({ length: 60 }, (_, i) => i);
const PERIODS = ["AM", "PM"];

function Column<T extends string | number>({
  values,
  selected,
  onSelect,
  format = (v) => `${v}`,
}: {
  values: T[];
  selected: T;
  onSelect: (v: T) => void;
  format?: (v: T) => string;
}) {
  return (
    <ScrollView style={styles.column} showsVerticalScrollIndicator={false} nestedScrollEnabled>
      {values.map((v) => (
        <Pressable key={v} onPress={() => onSelect(v)} style={styles.slot}>
          <Text style={[styles.slotText, selected === v && styles.slotSelected]}>{format(v)}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

export default function ScheduleCall({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState<Step>("date");
  const [selectedDate, setSelectedDate] = useState(toDateString(new Date()));
  const [hour, setHour] = useState(12);
  const [minute, setMinute] = useState(0);
  const [period, setPeriod] = useState("AM");

  if (step === "date") {
    return (
      <View style={styles.container}>
        <View style={styles.calendarCard}>
          <Calendar
            current={selectedDate}
            onDayPress={(day) => setSelectedDate(day.dateString)}
            markedDates={{ [selectedDate]: { selected: true, selectedColor: "#1F95AF" } }}
            theme={{
              todayTextColor: "#1F95AF",
              arrowColor: "#0F2552",
              monthTextColor: "#0F2552",
              textSectionTitleColor: "#7E818C",
              textMonthFontFamily: fonts.semibold,
              textDayFontFamily: fonts.regular,
              textDayHeaderFontFamily: fonts.medium,
            }}
          />
        </View>
        <SubmitButton title="Next" onPress={() => setStep("time")} style={{ marginTop: 32 }} />
      </View>
    );
  }

  if (step === "time") {
    return (
      <View style={styles.container}>
        <View style={styles.picker}>
          <Column values={HOURS} selected={hour} onSelect={setHour} />
          <Column values={MINUTES} selected={minute} onSelect={setMinute} format={pad} />
          <Column values={PERIODS} selected={period} onSelect={setPeriod} />
        </View>
        <SubmitButton title="Fix Meeting" onPress={() => setStep("confirm")} style={{ marginTop: 32 }} />
      </View>
    );
  }

  const [y, m, d] = selectedDate.split("-").map(Number);
  return (
    <View style={[styles.container, { marginTop: 48, alignItems: "center" }]}>
      <Text style={styles.confirmTitle}>Your call with the stylist has been booked for</Text>
      <Text style={styles.confirmText}>
        {`${new Date(y, m - 1, d).toDateString()}, ${hour}:${pad(minute)} ${period}`}
      </Text>
      <SubmitButton title="Back to Main" onPress={onDone} style={{ marginTop: 48 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingTop: 16 },
  calendarCard: {
    borderRadius: 16,
    backgroundColor: "#fff",
    padding: 8,
    shadowColor: "#969696",
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 8, height: 3 },
    elevation: 4,
  },
  picker: { flexDirection: "row", height: 300, gap: 16, justifyContent: "center" },
  column: { flexGrow: 0, width: 70 },
  slot: { height: 40, alignItems: "center", justifyContent: "center" },
  slotText: { fontSize: 22, color: "#333", opacity: 0.3, fontFamily: fonts.regular },
  slotSelected: { opacity: 1, color: "#000", fontFamily: fonts.bold },
  confirmTitle: { fontSize: 16, color: colors.dark, textAlign: "center", fontFamily: fonts.medium },
  confirmText: { marginTop: 4, fontSize: 16, color: colors.dark, fontFamily: fonts.regular },
});
