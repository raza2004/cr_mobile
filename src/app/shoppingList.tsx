import React, { useEffect, useState } from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import Toast from "react-native-toast-message";
import Screen from "@/components/Screen";
import { BackHeader, SectionTitle } from "@/components/ui";
import BannerCard from "@/components/BannerCard";
import DetailToolbar from "@/components/DetailToolbar";
import { api } from "@/lib/api";
import { colors, fonts } from "@/lib/theme";

export default function ShoppingList() {
  const [shoppingLists, setShoppingLists] = useState<any[]>([]);
  const [selectedList, setSelectedList] = useState<any | null>(null);

  useEffect(() => {
    api
      .get("/api/shopping-list")
      .then((res) => setShoppingLists(res.data.shoppingLists))
      .catch(() => Toast.show({ type: "error", text1: "Failed to fetch shopping lists." }));
  }, []);

  if (selectedList) {
    return (
      <Screen>
        <BackHeader title={selectedList.name} titleColor={colors.primary} onBack={() => setSelectedList(null)} />
        <DetailToolbar />
        <View style={{ padding: 16, marginTop: 8, gap: 16 }}>
          {selectedList.items.length === 0 ? (
            <Text style={styles.empty}>No items found</Text>
          ) : (
            selectedList.items.map((item: any) => (
              <View key={item._id} style={styles.item}>
                <View style={styles.itemImageBox}>
                  <Image source={{ uri: item.image }} style={{ width: 111, height: 114 }} contentFit="contain" />
                </View>
                <View style={{ flex: 1, padding: 8 }}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.desc}>
                    <Text style={{ opacity: 0.6 }}>Desc: </Text>
                    {item.description}
                  </Text>
                  <Text style={[styles.desc, { opacity: 0.6, marginTop: 12 }]}>Alternative Options:</Text>
                  <View style={{ marginTop: 8, gap: 4 }}>
                    {item.options.map((option: string, index: number) => (
                      <Pressable
                        key={index}
                        style={styles.option}
                        onPress={() => Linking.openURL(option).catch(() => {})}
                      >
                        <View style={styles.optionNum}>
                          <Text style={styles.optionNumText}>{index + 1}</Text>
                        </View>
                        <Text style={styles.optionLink} numberOfLines={1}>
                          {option}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <SectionTitle>Shopping Lists</SectionTitle>
      {shoppingLists.length === 0 ? (
        <Text style={[styles.empty, { marginTop: 160 }]}>No shopping list created yet</Text>
      ) : (
        shoppingLists.map((list) => (
          <BannerCard
            key={list._id}
            title={list.name}
            image={{ uri: list.image }}
            onPress={() => setSelectedList(list)}
          />
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  empty: { fontSize: 20, textAlign: "center", fontFamily: fonts.semibold, color: colors.dark },
  item: {
    flexDirection: "row",
    minHeight: 150,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    overflow: "hidden",
  },
  itemImageBox: { width: "40%", alignItems: "center", justifyContent: "center" },
  itemName: {
    color: colors.dark,
    fontSize: 18,
    fontFamily: fonts.semibold,
    textDecorationLine: "underline",
  },
  desc: { color: colors.dark, fontSize: 13, marginTop: 4, fontFamily: fonts.regular },
  option: { flexDirection: "row", alignItems: "center", gap: 8 },
  optionNum: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.inputBg,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.5,
  },
  optionNumText: { color: colors.primary, fontSize: 12, fontFamily: fonts.medium },
  optionLink: {
    flex: 1,
    color: colors.deep,
    fontSize: 12,
    textDecorationLine: "underline",
    fontFamily: fonts.medium,
  },
});
