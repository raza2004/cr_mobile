import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import Screen from "@/components/Screen";
import { Label, Input, PasswordInput, SubmitButton, LinkText } from "@/components/ui";
import { images } from "@/components/icons";
import { useAuth } from "@/lib/auth";
import { errorMessage } from "@/lib/api";
import { colors, fonts } from "@/lib/theme";

const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;

export default function SignIn() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const disabled = !email || !password || submitting;

  const handleSubmit = async () => {
    if (!emailRegex.test(email.trim())) {
      Toast.show({ type: "error", text1: "Invalid email id" });
      return;
    }
    setSubmitting(true);
    try {
      await signIn(email.trim(), password);
      Toast.show({ type: "success", text1: "Login Successful!" });
    } catch (error) {
      Toast.show({ type: "error", text1: errorMessage(error, "An unexpected error occurred") });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen menubar={false} style={{ paddingHorizontal: 16 }}>
      <Image source={images.logo} style={styles.logo} contentFit="contain" />
      <View style={{ marginTop: 48 }}>
        <Label>Enter your email</Label>
        <Input
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
        />
        <View style={{ height: 28 }} />
        <Label>Enter your Password</Label>
        <PasswordInput value={password} onChangeText={setPassword} placeholder="Password" />
        <View style={{ alignItems: "flex-end", paddingVertical: 12 }}>
          <LinkText title="Forget Password?" onPress={() => router.push("/forgetPassword")} />
        </View>
        <SubmitButton
          title={submitting ? "Signing in..." : "Sign In"}
          onPress={handleSubmit}
          disabled={disabled}
          style={{ marginTop: 36, marginBottom: 16 }}
        />
        <Text style={styles.terms}>
          By clicking this button, I agree with all{" "}
          <Text style={styles.termsLink}>Terms and Conditions</Text>
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  logo: { width: 160, height: 48, alignSelf: "center", marginTop: 32 },
  terms: { fontSize: 13, color: "#727272", fontFamily: fonts.regular },
  termsLink: { color: colors.primary, fontFamily: fonts.semibold },
});
