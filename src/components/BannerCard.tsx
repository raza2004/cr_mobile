import React from "react";
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { Image } from "expo-image";
import { fonts } from "@/lib/theme";
import { images } from "./icons";

// Full-width image card with a centered title (moodboards, presentations, shopping lists).
export default function BannerCard({
  title,
  image = images.mbbg,
  onPress,
  children,
}: {
  title: string;
  image?: any;
  onPress?: () => void;
  children?: React.ReactNode;
}) {
  // Explicit width/height (rather than aspectRatio-only sizing) avoids an
  // Android Yoga quirk where a ScrollView child with no defined width can
  // mis-measure against the screen, leaving it undersized and shifted.
  const { width: windowWidth } = useWindowDimensions();
  const cardWidth = windowWidth - 32;

  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, { width: cardWidth, height: cardWidth / 1.78 }]}
      disabled={!onPress}
    >
      <Image source={image} style={StyleSheet.absoluteFill} contentFit="cover" />
      <View style={styles.center} pointerEvents="none">
        <Text style={styles.title}>{title}</Text>
      </View>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 6,
    overflow: "hidden",
  },
  center: { ...StyleSheet.absoluteFill, alignItems: "center", justifyContent: "center" },
  title: { color: "#fff", fontSize: 20, fontFamily: fonts.semibold },
});
