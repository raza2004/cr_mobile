import React, { useEffect, useState } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { Image } from "expo-image";
import Screen from "@/components/Screen";
import { BackHeader } from "@/components/ui";
import BannerCard from "@/components/BannerCard";
import DetailToolbar from "@/components/DetailToolbar";
import { api, errorMessage } from "@/lib/api";
import { colors, fonts } from "@/lib/theme";

interface DroppedItem {
  id: number;
  imageSrc: string;
  x: number;
  y: number;
  rotation?: number;
}
interface Board {
  id: number;
  title: string;
  backgroundColor: string;
  droppedItems: DroppedItem[];
}
interface Presentation {
  _id: string;
  text: string;
  name: string;
  boards: Board[];
}

export default function Presentations() {
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [selected, setSelected] = useState<Presentation | null>(null);
  const [error, setError] = useState("");
  // Explicit width/height (rather than aspectRatio-only sizing) avoids an
  // Android Yoga quirk where a ScrollView child with no defined width can
  // mis-measure against the screen, leaving it undersized and shifted.
  const { width: windowWidth } = useWindowDimensions();
  const boardWidth = windowWidth - 32;

  useEffect(() => {
    api
      .get("/api/presentations")
      .then((res) => setPresentations(res.data.presentations))
      .catch((err) => setError(errorMessage(err, "Failed to fetch presentations.")));
  }, []);

  if (selected) {
    return (
      <Screen background={colors.inputBg}>
        <BackHeader title={selected.name} titleColor={colors.primary} onBack={() => setSelected(null)} />
        <DetailToolbar />
        {selected.boards?.map((board) => (
          <View
            key={board.id}
            style={[
              styles.board,
              { width: boardWidth, height: boardWidth / 1.8, backgroundColor: board.backgroundColor },
            ]}
          >
            <View style={styles.itemsRow}>
              {board.droppedItems.map((item) => (
                <Image
                  key={item.id}
                  source={{ uri: item.imageSrc }}
                  style={[styles.boardItem, { transform: [{ rotate: `${item.rotation || 0}deg` }] }]}
                  contentFit="contain"
                />
              ))}
            </View>
            {!!selected.text && <Text style={styles.boardText}>{selected.text}</Text>}
          </View>
        ))}
      </Screen>
    );
  }

  return (
    <Screen background={colors.inputBg} style={{ paddingTop: 20 }}>
      {!!error && <Text style={styles.error}>{error}</Text>}
      {presentations.map((p) => (
        <BannerCard key={p._id} title={p.name} onPress={() => setSelected(p)} />
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  board: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 6,
    overflow: "hidden",
    padding: 16,
    flexDirection: "row",
  },
  itemsRow: { flexDirection: "row", flex: 1, justifyContent: "center", alignItems: "center" },
  boardItem: { width: 96, height: "100%", marginRight: -40 },
  boardText: {
    position: "absolute",
    right: 16,
    top: 16,
    maxWidth: "40%",
    color: "#000",
    fontSize: 13,
    lineHeight: 22,
    fontFamily: fonts.semibold,
  },
  error: { color: "#DC2626", textAlign: "center", fontFamily: fonts.regular },
});
