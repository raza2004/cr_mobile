import React, { useState } from "react";
import { StyleSheet, Text } from "react-native";
import { Image } from "expo-image";
import Toast from "react-native-toast-message";
import Screen from "@/components/Screen";
import { BackHeader, Input, SubmitButton } from "@/components/ui";
import { images } from "@/components/icons";
import { api } from "@/lib/api";
import { colors, fonts } from "@/lib/theme";

const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSendEmail = async () => {
    if (!isEmailValid(email.trim())) {
      Toast.show({ type: "error", text1: "Please enter a valid email address." });
      return;
    }
    try {
      const res = await api.post("/api/users/forgetPassword", { email: email.trim() });
      if (res.data.success) {
        setIsEmailSent(true);
        Toast.show({ type: "success", text1: "Password reset link sent to your email." });
      } else {
        Toast.show({ type: "error", text1: res.data.error });
      }
    } catch {
      Toast.show({ type: "error", text1: "Email not exists. Please try again." });
    }
  };

  return (
    <Screen menubar={false} style={{ paddingHorizontal: 16 }}>
      <Image source={images.logo} style={styles.logo} contentFit="contain" />
      <BackHeader />
      <Text style={styles.title}>Forget your password?</Text>
      <Text style={styles.body}>
        There is nothing to worry about, we'll send you a message to help you reset your password.
      </Text>
      {!isEmailSent ? (
        <>
          <Input
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <SubmitButton title="Send Reset Link" onPress={handleSendEmail} style={{ marginTop: 32 }} />
        </>
      ) : (
        <Text style={styles.success}>Email sent successfully! Open the link on this phone to reset your password.</Text>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  logo: { width: 160, height: 48, alignSelf: "center", marginTop: 32, marginBottom: 12 },
  title: { fontSize: 20, fontFamily: fonts.bold, color: colors.dark, textAlign: "center", marginBottom: 12 },
  body: { color: colors.deep, textAlign: "center", margin: 16, fontFamily: fonts.regular, fontSize: 15 },
  success: { color: "#22C55E", textAlign: "center", marginTop: 16, fontFamily: fonts.medium },
});
