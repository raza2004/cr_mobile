import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { colors, fonts } from "@/lib/theme";
import { icons } from "./icons";

// "Convert to Pdf" + chat row shown on presentation and shopping list details.
// Both buttons are placeholders in CR_Client too.
export default function DetailToolbar() {
  return (
    <View style={styles.toolbar}>
      <Pressable style={styles.pdf}>
        <Image source={icons.vector} style={{ width: 12, height: 12, marginRight: 4 }} />
        <Text style={styles.pdfText}>Convert to Pdf</Text>
      </Pressable>
      <Image source={icons.chat} style={{ width: 22, height: 22 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  pdf: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 8,
    padding: 8,
  },
  pdfText: { color: colors.primary, fontSize: 13, fontFamily: fonts.semibold },
});
