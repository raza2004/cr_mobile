import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { router, Href } from "expo-router";
import { colors, fonts } from "@/lib/theme";
import { icons, images } from "./icons";

const links: { label: string; href: Href; icon: any; gap?: number }[] = [
  { label: "Home", href: "/", icon: icons.home },
  { label: "Items", href: "/items", icon: icons.items },
  { label: "Presentations", href: "/presentations", icon: icons.presentations },
  { label: "Moodboards", href: "/moodboards", icon: icons.moodboards },
  { label: "Shopping List", href: "/shoppingList", icon: icons.list },
  { label: "Profile", href: "/profile", icon: icons.profile, gap: 72 },
  { label: "FAQ", href: "/faq", icon: icons.octagonHelp, gap: 16 },
];

export default function Menubar() {
  const [open, setOpen] = useState(false);

  const go = (href: Href) => {
    setOpen(false);
    router.navigate(href);
  };

  return (
    <View style={styles.bar}>
      <Image source={images.logo} style={styles.logo} contentFit="contain" />
      <View style={styles.right}>
        <Image source={icons.bell} style={{ width: 28, height: 28, marginRight: 8 }} contentFit="contain" />
        <Pressable onPress={() => setOpen(true)} hitSlop={10}>
          <Image source={icons.menu} style={{ width: 28, height: 28 }} contentFit="contain" />
        </Pressable>
      </View>

      <Modal visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
        <SafeAreaView style={styles.menu}>
          <View style={styles.menuHeader}>
            <Image source={images.logo} style={styles.logo} contentFit="contain" />
            <Pressable onPress={() => setOpen(false)} hitSlop={10} style={styles.close}>
              <Image source={icons.cross} style={{ width: 32, height: 32 }} />
            </Pressable>
          </View>
          <View style={{ paddingHorizontal: 28, marginTop: 40 }}>
            {links.map((l) => (
              <Pressable
                key={l.label}
                onPress={() => go(l.href)}
                style={[styles.link, { marginTop: l.gap ?? 24 }]}
              >
                <Image source={l.icon} style={{ width: 24, height: 24 }} contentFit="contain" />
                <Text style={styles.linkText}>{l.label}</Text>
              </Pressable>
            ))}
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  logo: { width: 120, height: 36 },
  right: { flexDirection: "row", alignItems: "center" },
  menu: { flex: 1, backgroundColor: colors.white },
  menuHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    paddingHorizontal: 16,
  },
  close: { position: "absolute", right: 16 },
  link: { flexDirection: "row", alignItems: "center" },
  linkText: { color: colors.deep, fontSize: 20, fontFamily: fonts.regular, marginLeft: 8 },
});
