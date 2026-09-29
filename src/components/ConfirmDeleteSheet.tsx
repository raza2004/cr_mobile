import React from "react";
import { StyleSheet, Text, View } from "react-native";
import BottomSheet from "./BottomSheet";
import { OutlineButton, SubmitButton } from "./ui";
import { colors, fonts } from "@/lib/theme";

export default function ConfirmDeleteSheet({
  visible,
  title,
  preview,
  onCancel,
  onConfirm,
}: {
  visible: boolean;
  title: string;
  preview?: React.ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <BottomSheet visible={visible} onClose={onCancel}>
      <Text style={styles.title}>{title}</Text>
      {preview && <View style={styles.preview}>{preview}</View>}
      <View style={styles.row}>
        <OutlineButton title="No, I don't" onPress={onCancel} style={{ flex: 1 }} />
        <SubmitButton title="Yes, I do" onPress={onConfirm} style={{ flex: 1 }} />
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    lineHeight: 36,
    marginTop: 28,
    textAlign: "center",
    color: colors.dark,
    fontFamily: fonts.medium,
    paddingHorizontal: 24,
  },
  preview: {
    marginTop: 20,
    alignSelf: "center",
    width: "80%",
    aspectRatio: 1.13,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: colors.inputBg,
    alignItems: "center",
    justifyContent: "center",
  },
  row: { flexDirection: "row", gap: 8, marginTop: 20, marginBottom: 8 },
});
