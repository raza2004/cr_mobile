import React, { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { useFocusEffect } from "expo-router";
import { api } from "@/lib/api";
import { colors, fonts } from "@/lib/theme";
import { icons } from "../icons";

export default function ItemsHome() {
  const [items, setItems] = useState<any[]>([]);

  // Refetch whenever Home regains focus so newly added items show up.
  useFocusEffect(
    useCallback(() => {
      api
        .get("/api/items")
        .then((res) => setItems(res.data.data))
        .catch((error) => console.error("Error fetching items:", error));
    }, [])
  );

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {items.map((item) => (
        <View key={item._id} style={styles.card}>
          <Image source={icons.calendar} style={styles.topLeft} />
          <Image source={{ uri: item.image }} style={styles.image} contentFit="contain" />
          <View style={styles.bottom}>
            <Text style={styles.name} numberOfLines={1}>
              {item.itemName}
            </Text>
            <Image source={icons.chat} style={{ width: 22, height: 22 }} />
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // flexGrow lets justifyContent center a row that's narrower than the
  // screen (e.g. a single item); it has no effect once content overflows
  // and the ScrollView needs to scroll, so this is safe either way.
  row: { flexGrow: 1, justifyContent: "center", paddingHorizontal: 16, gap: 16, paddingBottom: 8, paddingTop: 4 },
  card: {
    width: 160,
    height: 208,
    backgroundColor: colors.inputBg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  topLeft: { position: "absolute", top: 6, left: 6, width: 20, height: 20 },
  image: { width: 128, height: 144 },
  bottom: {
    position: "absolute",
    bottom: 4,
    left: 8,
    right: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  name: { flex: 1, color: colors.dark, fontSize: 12, fontFamily: fonts.medium },
});
