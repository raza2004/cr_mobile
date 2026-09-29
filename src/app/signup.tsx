import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import Toast from "react-native-toast-message";
import Screen from "@/components/Screen";
import { Label, PasswordInput, SubmitButton } from "@/components/ui";
import { GeneralInfoFields, PersonalInfoFields } from "@/components/ProfileFields";
import { images } from "@/components/icons";
import { api, errorMessage } from "@/lib/api";
import { STYLIST_PORTAL_URL } from "@/lib/config";
import { colors, fonts } from "@/lib/theme";

// Opened from the stylist's invitation link: crmobile://signup?token=...
type Step = "step1" | "step2" | "step3";

export default function Signup() {
  const { token } = useLocalSearchParams<{ token?: string }>();
  const [step, setStep] = useState<Step>("step1");
  const [formData, setFormData] = useState<Record<string, string>>({
    email: "",
    stylist: "",
    password: "",
  });

  useEffect(() => {
    if (!token || !STYLIST_PORTAL_URL) return;
    const base = STYLIST_PORTAL_URL.endsWith("/") ? STYLIST_PORTAL_URL : `${STYLIST_PORTAL_URL}/`;
    axios
      .post(`${base}api/verify-token`, { token }, { headers: { "Content-Type": "application/json" } })
      .then((response) => {
        if (response.data.email) {
          setFormData((prev) => ({
            ...prev,
            email: response.data.email,
            stylist: response.data.stylist,
          }));
        }
      })
      .catch((error) => console.error("Error verifying token:", error));
  }, [token]);

  const onChange = (key: string, value: string) => setFormData((prev) => ({ ...prev, [key]: value }));

  const pw = formData.password;
  const validation = {
    isLengthValid: pw.length >= 8,
    hasUpperCase: /[A-Z]/.test(pw),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(pw),
    hasNumber: /\d/.test(pw),
  };
  const passwordValid = Object.values(validation).every(Boolean);

  const handleSubmit = async () => {
    if (!formData.email) {
      Toast.show({ type: "error", text1: "Open this screen from your invitation link." });
      return;
    }
    try {
      await api.post("/api/users/client-signup", formData);
      Toast.show({ type: "success", text1: "Signup Successful" });
      router.replace("/signin");
    } catch (error) {
      Toast.show({ type: "error", text1: errorMessage(error, "Error saving data") });
    }
  };

  const rule = (ok: boolean, text: string) => (
    <Text style={[styles.rule, { color: ok ? colors.primary : colors.grey }]}>
      {ok ? "✓" : "✗"} {text}
    </Text>
  );

  return (
    <Screen menubar={false} style={{ paddingHorizontal: 16 }}>
      <View style={styles.header}>
        <Image source={images.logo} style={styles.logo} contentFit="contain" />
        <View style={{ alignItems: "flex-end" }}>
          <View style={{ flexDirection: "row" }}>
            {(["step1", "step2"] as const).map((s, i) => (
              <Pressable key={s} onPress={() => setStep(s)} hitSlop={6}>
                <Text style={[styles.step, { color: step === s ? colors.primary : colors.inactive }]}>
                  Step {i + 1}
                </Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.email} numberOfLines={1}>
            Your email: {formData.email}
          </Text>
        </View>
      </View>

      <View style={{ marginTop: 16 }}>
        {step === "step1" && (
          <>
            <PersonalInfoFields data={formData} onChange={onChange} />
            <SubmitButton title="Continue" onPress={() => setStep("step2")} style={{ marginTop: 16 }} />
          </>
        )}
        {step === "step2" && (
          <>
            <GeneralInfoFields data={formData} onChange={onChange} />
            <SubmitButton title="Continue" onPress={() => setStep("step3")} style={{ marginTop: 16 }} />
          </>
        )}
        {step === "step3" && (
          <>
            <Label>Create a Password</Label>
            <PasswordInput value={pw} onChangeText={(v) => onChange("password", v)} placeholder="Password" />
            <View style={{ marginTop: 20 }}>
              {rule(validation.isLengthValid, "minimum 8 characters")}
              {rule(validation.hasUpperCase, "one upper letter")}
              {rule(validation.hasSpecialChar, "one special character")}
              {rule(validation.hasNumber, "one number")}
            </View>
            <SubmitButton
              title="Sign Up"
              onPress={handleSubmit}
              disabled={!passwordValid}
              style={{ marginTop: 40, marginBottom: 16 }}
            />
            <Text style={styles.terms}>
              By clicking this button, I agree with all{" "}
              <Text style={{ color: colors.primary, fontFamily: fonts.semibold }}>Terms and Conditions</Text>
            </Text>
          </>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 16 },
  logo: { width: 120, height: 36 },
  step: { fontSize: 20, paddingHorizontal: 6, fontFamily: fonts.medium },
  email: { color: colors.deep, fontSize: 13, marginTop: 4, maxWidth: 200, fontFamily: fonts.regular },
  rule: { fontSize: 14, marginTop: 4, fontFamily: fonts.regular },
  terms: { fontSize: 13, color: "#727272", fontFamily: fonts.regular },
});
