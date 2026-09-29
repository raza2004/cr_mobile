import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { router, Href } from "expo-router";
import { api } from "@/lib/api";
import { colors, fonts } from "@/lib/theme";
import { images } from "../icons";
import MenuDotsButton from "../MenuDotsButton";

function Card({
  title,
  image,
  menuOpen,
  onMenu,
  href,
}: {
  title: string;
  image: any;
  menuOpen: boolean;
  onMenu: () => void;
  href: Href;
}) {
  return (
    <View style={styles.card}>
      <Image source={image} style={StyleSheet.absoluteFill} contentFit="cover" />
      <View style={styles.center}>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <MenuDotsButton onPress={onMenu} variant="light" style={styles.dots} />
      {menuOpen && (
        <Pressable style={styles.menu} onPress={() => router.navigate(href)}>
          <Text style={styles.menuText}>See Details</Text>
        </Pressable>
      )}
    </View>
  );
}

export default function Capsules() {
  const [presentations, setPresentations] = useState<any[]>([]);
  const [shoppingLists, setShoppingLists] = useState<any[]>([]);
  const [menuVisible, setMenuVisible] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api.get("/api/presentations"), api.get("/api/shopping-list")])
      .then(([p, s]) => {
        setPresentations(p.data.presentations);
        setShoppingLists(s.data.shoppingLists);
      })
      .catch((error) => console.error("Error fetching data", error));
  }, []);

  const toggle = (id: string) => setMenuVisible(menuVisible === id ? null : id);

  return (
    <View style={{ marginTop: 16 }}>
      <Text style={styles.heading}>Presentations:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {presentations.map((p) => (
          <Card
            key={p._id}
            title={p.name}
            image={images.capsuleBg}
            menuOpen={menuVisible === p._id}
            onMenu={() => toggle(p._id)}
            href="/presentations"
          />
        ))}
      </ScrollView>

      <Text style={styles.heading}>Shopping Lists:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {shoppingLists.map((s) => (
          <Card
            key={s._id}
            title={s.name}
            image={{ uri: s.image }}
            menuOpen={menuVisible === s._id}
            onMenu={() => toggle(s._id)}
            href="/shoppingList"
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.dark,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 12,
  },
  // flexGrow lets justifyContent center a row that's narrower than the
  // screen (e.g. a single item); it has no effect once content overflows
  // and the ScrollView needs to scroll, so this is safe either way.
  row: { flexGrow: 1, justifyContent: "center", paddingHorizontal: 16, gap: 16, paddingBottom: 8 },
  card: { width: 288, height: 199, borderRadius: 6, overflow: "hidden", backgroundColor: "#fff" },
  center: { ...StyleSheet.absoluteFill, alignItems: "center", justifyContent: "center" },
  cardTitle: { color: "#fff", fontSize: 20, fontFamily: fonts.semibold },
  dots: { position: "absolute", top: 8, right: 8 },
  menu: {
    position: "absolute",
    top: 40,
    right: 8,
    backgroundColor: "#fff",
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    elevation: 3,
  },
  menuText: { color: colors.dark, fontSize: 14, fontFamily: fonts.regular },
});
