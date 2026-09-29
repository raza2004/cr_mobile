import React from "react";
import { StyleSheet, View } from "react-native";
import { Field } from "./ui";

// The client questionnaire shared by Signup (steps 1–2) and Profile
// (Personal Info / General Info tabs).
export type ProfileData = Record<string, any>;
type Props = { data: ProfileData; onChange: (key: string, value: string) => void };

const text = (v: any) => (v === undefined || v === null ? "" : String(v));

export function PersonalInfoFields({ data, onChange }: Props) {
  const num = (key: string, label: string, placeholder = "In cm") => (
    <Field
      key={key}
      label={label}
      value={text(data[key])}
      onChangeText={(v) => onChange(key, v)}
      placeholder={placeholder}
      keyboardType="numeric"
      style={styles.cell}
    />
  );

  return (
    <View>
      <Field
        label="Full Name"
        value={text(data.fullName)}
        onChangeText={(v) => onChange("fullName", v)}
        placeholder="Enter Name"
      />
      <View style={styles.row}>
        {num("age", "Age", "In Years")}
        {num("height", "Height")}
        {num("footSize", "Foot Size")}
      </View>
      <View style={styles.row}>
        {num("shoulders", "Shoulders")}
        {num("waist", "Waist")}
      </View>
      <View style={styles.row}>
        {num("breast", "Breast")}
        {num("hips", "Hips")}
      </View>
      <Field
        label="Favourite Colors"
        value={text(data.favoriteColors)}
        onChangeText={(v) => onChange("favoriteColors", v)}
        placeholder="Red"
      />
      <Field
        label="Taboo in colors"
        value={text(data.tabooColors)}
        onChangeText={(v) => onChange("tabooColors", v)}
        placeholder="Blue"
      />
    </View>
  );
}

const generalQuestions: { key: string; label: string; placeholder: string; multiline?: boolean }[] = [
  { key: "neverWear", label: "What are the things you will never wear?", placeholder: "Poncho" },
  { key: "rhythmOfLife", label: "What does your rhythm of life look like in % ratio?", placeholder: "Quite active" },
  { key: "preferredShoes", label: "Which shoes do you prefer?", placeholder: "heels" },
  { key: "dreamOutfit", label: "Describe your dream outfit:", placeholder: "Total black" },
  { key: "needWeekendItems", label: "Do you need weekend items? (at the event):", placeholder: "Quite active" },
  { key: "influencersStyle", label: "Are there socialites or influencers whose style you like?", placeholder: "Dua Lipa" },
  { key: "favoriteBrands", label: "Shops and brands you like:", placeholder: "Zara, Bershka, H&M" },
  {
    key: "priceSegment",
    label: "What price segment are you interested in when building your wardrobe?",
    placeholder: "$1000-1500",
  },
  {
    key: "expectations",
    label: "What are your expectations from our cooperation?",
    placeholder: "Create a wardrobe for every day with a large number of outfits",
    multiline: true,
  },
];

export function GeneralInfoFields({ data, onChange }: Props) {
  return (
    <View>
      {generalQuestions.map((q) => (
        <Field
          key={q.key}
          label={q.label}
          value={text(data[q.key])}
          onChangeText={(v) => onChange(q.key, v)}
          placeholder={q.placeholder}
          multiline={q.multiline}
          style={{ marginBottom: 16 }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 12 },
  cell: { flex: 1 },
});
