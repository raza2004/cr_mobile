import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import Toast from "react-native-toast-message";
import Screen from "@/components/Screen";
import { Input, Label, PasswordInput, SubmitButton } from "@/components/ui";
import { GeneralInfoFields, PersonalInfoFields, ProfileData } from "@/components/ProfileFields";
import { icons, images } from "@/components/icons";
import { api, errorMessage } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { pickFromLibrary } from "@/lib/images";
import { colors, fonts } from "@/lib/theme";

type Tab = "settings" | "personalInfo" | "generalInfo";
const tabs: { key: Tab; label: string }[] = [
  { key: "settings", label: "Settings" },
  { key: "personalInfo", label: "Personal Info" },
  { key: "generalInfo", label: "General Info" },
];

export default function Profile() {
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("personalInfo");
  const [userData, setUserData] = useState<ProfileData>({});
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    api
      .get("/api/profile")
      .then((res) => setUserData(res.data))
      .catch((error) =>
        Toast.show({ type: "error", text1: errorMessage(error, "Error fetching user data") })
      );
  }, []);

  const onChange = (key: string, value: string) => setUserData((prev) => ({ ...prev, [key]: value }));

  const handleConfirmChanges = async () => {
    try {
      const { password, ...otherData } = userData;
      const body = newPassword ? { ...otherData, password: newPassword } : otherData;
      const res = await api.post("/api/profile", body);
      setUserData(res.data);
      setNewPassword("");
      Toast.show({ type: "success", text1: "Profile updated successfully" });
    } catch (error) {
      Toast.show({ type: "error", text1: errorMessage(error, "Error saving profile") });
    }
  };

  const handleProfilePictureChange = async () => {
    try {
      const [photo] = await pickFromLibrary();
      if (photo) setUserData((prev) => ({ ...prev, image: photo.dataUri }));
    } catch (error) {
      Toast.show({ type: "error", text1: errorMessage(error) });
    }
  };

  return (
    <Screen>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.tabs}>
        {tabs.map((t) => (
          <Pressable
            key={t.key}
            onPress={() => setActiveTab(t.key)}
            style={[styles.tab, activeTab === t.key && styles.tabActive]}
          >
            <Text style={[styles.tabText, { color: activeTab === t.key ? colors.primary : colors.inactive }]}>
              {t.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
        {activeTab === "settings" && (
          <>
            <Pressable onPress={handleProfilePictureChange} style={styles.avatarWrap}>
              <Image
                source={userData.image ? { uri: userData.image } : images.logo}
                style={styles.avatar}
                contentFit={userData.image ? "cover" : "contain"}
              />
            </Pressable>
            <Label>Email</Label>
            <Input value={userData.email ?? ""} editable={false} style={{ color: colors.deep }} />
            <View style={{ height: 12 }} />
            <Label>Create a new Password</Label>
            <PasswordInput value={newPassword} onChangeText={setNewPassword} placeholder="Password" />
            <Pressable onPress={signOut} style={styles.logout}>
              <Image source={icons.logout} style={{ width: 22, height: 22 }} />
              <Text style={styles.logoutText}>Log Out</Text>
            </Pressable>
          </>
        )}
        {activeTab === "personalInfo" && <PersonalInfoFields data={userData} onChange={onChange} />}
        {activeTab === "generalInfo" && <GeneralInfoFields data={userData} onChange={onChange} />}

        <SubmitButton title="Confirm Changes" onPress={handleConfirmChanges} style={{ marginTop: 20 }} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: 8, fontSize: 20, fontFamily: fonts.medium, marginLeft: 16, color: colors.dark },
  tabs: { flexDirection: "row", justifyContent: "space-around", marginTop: 24 },
  tab: { paddingHorizontal: 12, paddingVertical: 8, borderBottomWidth: 2, borderBottomColor: "transparent" },
  tabActive: { borderBottomColor: colors.primary },
  tabText: { fontSize: 15, fontFamily: fonts.medium },
  avatarWrap: {
    width: 96,
    height: 112,
    borderRadius: 24,
    backgroundColor: "#D1D5DB",
    alignSelf: "center",
    overflow: "hidden",
    marginBottom: 16,
  },
  avatar: { width: "100%", height: "100%" },
  logout: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 16, marginTop: 8 },
  logoutText: { color: "#6D939C", fontSize: 16, marginLeft: 6, fontFamily: fonts.medium },
});
