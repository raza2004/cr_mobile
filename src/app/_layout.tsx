import React from "react";
import { ActivityIndicator, View } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import {
  useFonts,
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
} from "@expo-google-fonts/manrope";
import { AuthProvider, useAuth } from "@/lib/auth";
import { colors } from "@/lib/theme";

function RootNavigator() {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  // Mirrors CR_Client/src/middleware.ts: public screens only when signed out,
  // everything else only when signed in.
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#fff" } }}>
      <Stack.Protected guard={!token}>
        <Stack.Screen name="signin" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="forgetPassword" />
        <Stack.Screen name="setPassword" />
        <Stack.Screen name="verifyEmail" />
      </Stack.Protected>
      <Stack.Protected guard={!!token}>
        <Stack.Screen name="index" />
        <Stack.Screen name="items" />
        <Stack.Screen name="moodboards" />
        <Stack.Screen name="presentations" />
        <Stack.Screen name="shoppingList" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="faq" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <RootNavigator />
      <Toast position="top" />
    </AuthProvider>
  );
}
