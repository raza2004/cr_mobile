import React from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { icons } from "./icons";

// Replaces the `fixed bottom-0 ... rounded-t-lg` overlay pattern used across CR_Client.
export default function BottomSheet({
  visible,
  onClose,
  children,
  showClose = true,
}: {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  showClose?: boolean;
}) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 12 }]}>
          {showClose && (
            <Pressable onPress={onClose} style={styles.close} hitSlop={10}>
              <Image source={icons.cross} style={{ width: 24, height: 24 }} />
            </Pressable>
          )}
          {children}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.5)" },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
    maxHeight: "92%",
  },
  close: { position: "absolute", top: 12, right: 12, zIndex: 10 },
});
