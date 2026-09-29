import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import Screen from "@/components/Screen";
import { SubmitButton } from "@/components/ui";
import { api, errorMessage } from "@/lib/api";
import { colors, fonts } from "@/lib/theme";

// Opened from the verification email link: crmobile://verifyEmail?token=...
export default function VerifyEmail() {
  const { token } = useLocalSearchParams<{ token?: string }>();
  const [status, setStatus] = useState<"loading" | "done" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Missing verification token.");
      return;
    }
    api
      .post("/api/users/verifyEmail", { token })
      .then(() => setStatus("done"))
      .catch((e) => {
        setStatus("error");
        setMessage(errorMessage(e, "Invalid token"));
      });
  }, [token]);

  return (
    <Screen menubar={false} style={{ flexGrow: 1, justifyContent: "center", paddingHorizontal: 24 }}>
      {status === "loading" ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <>
          <Text style={{ fontSize: 20, fontFamily: fonts.bold, color: colors.dark, textAlign: "center" }}>
            {status === "done" ? "Email verified successfully" : message}
          </Text>
          <SubmitButton title="Go to Sign In" onPress={() => router.replace("/signin")} style={{ marginTop: 24 }} />
        </>
      )}
    </Screen>
  );
}
