import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { router } from "expo-router";
import Screen from "@/components/Screen";
import { SectionTitle, LinkText } from "@/components/ui";
import ItemsHome from "@/components/home/ItemsHome";
import Capsules from "@/components/home/Capsules";
import ScheduleCall from "@/components/home/ScheduleCall";
import StylistChat from "@/components/home/StylistChat";
import { icons, images } from "@/components/icons";
import { api } from "@/lib/api";
import { colors, fonts } from "@/lib/theme";

type View_ = "main" | "schedule" | "chat";

export default function Home() {
  const [view, setView] = useState<View_>("main");
  const [stylistName, setStylistName] = useState("Samantha Johns");
  const [stylistImage, setStylistImage] = useState<string | null>(null);
  const [stylistId, setStylistId] = useState("");
  const [clientId, setClientId] = useState("");

  useEffect(() => {
    api
      .get("/api/stylist")
      .then((res) => {
        const { stylistProfile, userProfile, clientId } = res.data;
        setStylistName(userProfile.userFullName);
        setStylistId(stylistProfile?._id ?? userProfile._id);
        setClientId(clientId);
        setStylistImage(stylistProfile?.image || null);
      })
      .catch((error) => console.error("Error fetching stylist details:", error));
  }, []);

  const avatar = stylistImage ? { uri: stylistImage } : images.logo;

  if (view === "chat") {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top", "left", "right"]}>
        <StylistChat
          clientId={clientId}
          stylistId={stylistId}
          stylistName={stylistName}
          stylistImage={avatar}
          onBack={() => setView("main")}
        />
      </SafeAreaView>
    );
  }

  return (
    <Screen>
      {view === "schedule" ? (
        <ScheduleCall onDone={() => setView("main")} />
      ) : (
        <>
          <View style={styles.card}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <Image source={avatar} style={styles.avatar} contentFit="cover" />
              <View style={{ flex: 1 }}>
                <Text style={styles.name} numberOfLines={1}>
                  {stylistName}
                </Text>
                <Text style={styles.sub}>Your stylist</Text>
              </View>
            </View>
            <Text style={styles.task}>
              <Text style={{ opacity: 0.6, fontFamily: fonts.regular }}>Task: </Text>
              Renewing wardrobe
            </Text>
            <View style={styles.actions}>
              <Pressable style={styles.action} onPress={() => setView("schedule")}>
                <Image source={icons.calendar} style={styles.actionIcon} />
                <Text style={styles.actionText}>Schedule a Call</Text>
              </Pressable>
              <Pressable style={styles.action} onPress={() => setView("chat")}>
                <Image source={icons.mail} style={styles.actionIcon} />
                <Text style={styles.actionText}>Send Message</Text>
              </Pressable>
            </View>
          </View>

          <SectionTitle right={<LinkText title="+ Add item" onPress={() => router.navigate("/items")} />}>
            Last added items:
          </SectionTitle>
          <ItemsHome />
          <Capsules />
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 12,
    marginTop: 12,
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  avatar: { width: 56, height: 56, borderRadius: 8 },
  name: { fontSize: 18, fontFamily: fonts.bold, color: colors.dark },
  sub: { fontSize: 14, color: colors.primary, fontFamily: fonts.regular },
  task: { marginTop: 8, fontSize: 14, color: colors.primary, fontFamily: fonts.medium },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
  action: {
    flex: 1,
    minWidth: 130,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  actionIcon: { width: 20, height: 20 },
  actionText: { color: "#fff", fontSize: 14, fontFamily: fonts.medium },
});
