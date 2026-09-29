import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";
import Screen from "@/components/Screen";
import { PasswordInput, SubmitButton } from "@/components/ui";
import { api } from "@/lib/api";
import { colors, fonts } from "@/lib/theme";

// Opened from the reset email link: crmobile://setPassword?token=...
export default function SetPassword() {
  const { token } = useLocalSearchParams<{ token?: string }>();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSetPassword = async () => {
    if (!token) {
      Toast.show({ type: "error", text1: "Invalid or missing token." });
      return;
    }
    if (newPassword !== confirmPassword) {
      Toast.show({ type: "error", text1: "Passwords do not match." });
      return;
    }
    try {
      const res = await api.post("/api/users/setPassword", { token, newPassword });
      if (res.data.success) {
        Toast.show({ type: "success", text1: "Password has been reset successfully." });
        router.replace("/signin");
      } else {
        Toast.show({ type: "error", text1: res.data.error });
      }
    } catch {
      Toast.show({ type: "error", text1: "Invalid or expired token." });
    }
  };

  return (
    <Screen menubar={false} style={styles.container}>
      <Text style={styles.title}>Set a New Password</Text>
      <PasswordInput placeholder="New Password" value={newPassword} onChangeText={setNewPassword} />
      <View style={{ height: 16 }} />
      <PasswordInput
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <SubmitButton title="Set Password" onPress={handleSetPassword} style={{ marginTop: 24 }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", paddingHorizontal: 24 },
  title: { fontSize: 24, fontFamily: fonts.bold, color: colors.dark, textAlign: "center", marginBottom: 20 },
});
