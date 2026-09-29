import React from "react";
import { ScrollView, StyleSheet, View, ViewStyle, StyleProp } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Menubar from "./Menubar";

// Page wrapper: safe area + optional Menubar + optional scrolling.
export default function Screen({
  children,
  menubar = true,
  scroll = true,
  style,
  background = "#fff",
}: {
  children: React.ReactNode;
  menubar?: boolean;
  scroll?: boolean;
  style?: StyleProp<ViewStyle>;
  background?: string;
}) {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView style={[styles.root, { backgroundColor: background }]} edges={["top", "left", "right"]}>
      {menubar && <Menubar />}
      {scroll ? (
        <ScrollView
          // 40 is baseline breathing room; insets.bottom additionally clears
          // Android's 3-button nav bar / iOS home indicator, which "bottom"
          // in `edges` above doesn't cover for scrollable content.
          contentContainerStyle={[{ paddingBottom: 40 + insets.bottom }, style]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[{ flex: 1, paddingBottom: insets.bottom }, style]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
