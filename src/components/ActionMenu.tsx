import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { colors, fonts } from "@/lib/theme";
import { icons } from "./icons";

// The small Edit / Delete popover used on item and moodboard cards.
export default function ActionMenu({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <View style={styles.menu}>
      <Pressable onPress={onEdit} style={styles.row} hitSlop={4}>
        <Image source={icons.edit} style={styles.icon} />
        <Text style={styles.text}>Edit</Text>
      </Pressable>
      <Pressable onPress={onDelete} style={[styles.row, { marginTop: 8 }]} hitSlop={4}>
        <Image source={icons.delete} style={styles.icon} />
        <Text style={styles.text}>Delete</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  menu: {
    position: "absolute",
    top: 4,
    right: 28,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 6,
    padding: 10,
    zIndex: 20,
    elevation: 5,
  },
  row: { flexDirection: "row", alignItems: "center" },
  icon: { width: 18, height: 18, marginRight: 4 },
  text: { color: colors.primary, fontSize: 15, fontFamily: fonts.regular },
});
