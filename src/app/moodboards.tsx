import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import Toast from "react-native-toast-message";
import Screen from "@/components/Screen";
import { BackHeader, LinkText, SectionTitle, SubmitButton } from "@/components/ui";
import BannerCard from "@/components/BannerCard";
import ActionMenu from "@/components/ActionMenu";
import ConfirmDeleteSheet from "@/components/ConfirmDeleteSheet";
import Preview from "@/components/moodboards/Preview";
import ChatModal from "@/components/moodboards/ChatModal";
import MenuDotsButton from "@/components/MenuDotsButton";
import { icons, images } from "@/components/icons";
import { api, errorMessage } from "@/lib/api";
import { pickFromLibrary } from "@/lib/images";
import { fonts } from "@/lib/theme";

type Moodboard = { _id: string; name: string; images: string[] };

export default function Moodboards() {
  const [moodboards, setMoodboards] = useState<Moodboard[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Moodboard | null>(null);
  const [newImages, setNewImages] = useState<string[]>([]);
  const [deleting, setDeleting] = useState<Moodboard | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    api
      .get("/api/moodboards")
      .then((res) => setMoodboards(res.data.data))
      .catch((error) => console.error("Error fetching moodboards:", error));
  }, []);

  const pickImages = async (limit: number) => {
    try {
      const picked = await pickFromLibrary({ multiple: true, limit });
      return picked.slice(0, limit).map((p) => p.dataUri);
    } catch (error) {
      Toast.show({ type: "error", text1: errorMessage(error) });
      return [];
    }
  };

  const handleCreate = async () => {
    const imgs = await pickImages(20);
    if (imgs.length) setSelectedImages(imgs);
  };

  const handleSaveMoodboard = async (name: string, imgs: string[]) => {
    try {
      const response = await api.post("/api/moodboards", { name, images: imgs });
      setMoodboards((prev) => [...prev, response.data.data]);
      setSelectedImages([]);
    } catch (error) {
      Toast.show({ type: "error", text1: errorMessage(error, "Error saving moodboard") });
    }
  };

  const handleAddImages = async () => {
    const imgs = await pickImages(10);
    if (imgs.length) setNewImages(imgs);
  };

  const handleSaveEdited = async () => {
    if (!editing) return;
    try {
      const response = await api.put("/api/moodboards", {
        _id: editing._id,
        images: [...editing.images, ...newImages],
      });
      setMoodboards((prev) => prev.map((m) => (m._id === editing._id ? response.data.data : m)));
      setEditing(null);
      setNewImages([]);
    } catch (error) {
      Toast.show({ type: "error", text1: errorMessage(error, "Error updating moodboard") });
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleting) return;
    try {
      await api.delete("/api/moodboards", { params: { id: deleting._id } });
      setMoodboards((prev) => prev.filter((m) => m._id !== deleting._id));
    } catch (error) {
      Toast.show({ type: "error", text1: errorMessage(error, "Error deleting moodboard") });
    }
    setDeleting(null);
  };

  if (selectedImages.length > 0) {
    return (
      <Screen>
        <Preview images={selectedImages} onSave={handleSaveMoodboard} onCancel={() => setSelectedImages([])} />
      </Screen>
    );
  }

  if (editing) {
    return (
      <Screen>
        <BackHeader
          title={editing.name}
          onBack={() => {
            setEditing(null);
            setNewImages([]);
          }}
          right={
            <View style={{ flexDirection: "row", gap: 16 }}>
              <Pressable onPress={() => setIsChatOpen(true)} hitSlop={8}>
                <Image source={icons.chat} style={{ width: 26, height: 26 }} />
              </Pressable>
              <Pressable onPress={handleAddImages} hitSlop={8}>
                <Image source={icons.addImage} style={{ width: 24, height: 24 }} />
              </Pressable>
            </View>
          }
        />
        <View style={styles.grid}>
          {[...editing.images, ...newImages].map((image, idx) => (
            <View key={idx} style={styles.cell}>
              <Image source={{ uri: image }} style={styles.cellImage} contentFit="cover" />
            </View>
          ))}
        </View>
        <SubmitButton
          title="Save Moodboard"
          onPress={handleSaveEdited}
          style={{ marginHorizontal: 16, marginTop: 24, width: "auto" }}
        />
        <ChatModal visible={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </Screen>
    );
  }

  return (
    <Screen>
      <SectionTitle right={<LinkText title="+ Create a Moodboard" onPress={handleCreate} />}>
        Moodboards:
      </SectionTitle>
      {moodboards.map((m) => (
        <BannerCard key={m._id} title={m.name}>
          <MenuDotsButton
            onPress={() => setMenuId(menuId === m._id ? null : m._id)}
            variant="light"
            style={styles.dots}
          />
          {menuId === m._id && (
            <ActionMenu
              onEdit={() => {
                setMenuId(null);
                setEditing(m);
              }}
              onDelete={() => {
                setMenuId(null);
                setDeleting(m);
              }}
            />
          )}
        </BannerCard>
      ))}

      <ConfirmDeleteSheet
        visible={!!deleting}
        title="Are you sure you want to delete this moodboard?"
        preview={
          deleting && (
            <>
              <Image source={images.mbbg} style={StyleSheet.absoluteFill} contentFit="cover" />
              <Text style={styles.previewTitle}>{deleting.name}</Text>
            </>
          )
        }
        onCancel={() => setDeleting(null)}
        onConfirm={handleConfirmDelete}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  dots: { position: "absolute", top: 4, right: 4, zIndex: 20 },
  grid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 8, marginTop: 8 },
  cell: { width: "50%", padding: 8 },
  cellImage: { width: "100%", aspectRatio: 0.8, borderRadius: 4 },
  previewTitle: { color: "#fff", fontSize: 20, fontFamily: fonts.semibold },
});
