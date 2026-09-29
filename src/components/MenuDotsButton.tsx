import React from "react";
import { Pressable, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors } from "@/lib/theme";

// Standardized "..." menu trigger used on cards throughout the app.
// Replaces the old menu-dots SVGs, which baked in a reduced opacity and a
// near-white fill that made them nearly invisible over photo backgrounds.
export default function MenuDotsButton({
  onPress,
  variant = "light",
  style,
}: {
  onPress: () => void;
  // "light": white dots + a translucent dark backing circle, for photo cards.
  // "dark": solid teal dots, no backing, for plain/light backgrounds.
  variant?: "light" | "dark";
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={[styles.wrap, variant === "light" && styles.backing, style]}
    >
      <Feather name="more-vertical" size={18} color={variant === "light" ? "#fff" : colors.primary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  backing: { backgroundColor: "rgba(0,0,0,0.35)" },
});
