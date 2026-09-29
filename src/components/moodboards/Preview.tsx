import React, { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { Field, SubmitButton, BackHeader } from "../ui";
import { icons } from "../icons";

export default function Preview({
  images,
  onSave,
  onCancel,
}: {
  images: string[];
  onSave: (name: string, images: string[]) => void;
  onCancel: () => void;
}) {
  const [moodboardName, setMoodboardName] = useState("");
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    setPreviewImages(images);
    setSelectedImage(images[0] ?? "");
  }, [images]);

  const handleRemoveImage = (index: number) => {
    if (previewImages.length === 1) {
      Alert.alert("You must have at least one image to create a moodboard.");
      return;
    }
    const updated = previewImages.filter((_, i) => i !== index);
    setPreviewImages(updated);
    if (!updated.includes(selectedImage)) setSelectedImage(updated[0]);
  };

  const handleSave = () => {
    if (moodboardName.trim() === "") {
      Alert.alert("Please enter a name for the moodboard.");
      return;
    }
    onSave(moodboardName.trim(), previewImages);
  };

  return (
    <View>
      <BackHeader title="New Moodboard" onBack={onCancel} />
      <View style={{ paddingHorizontal: 16 }}>
        <Image source={{ uri: selectedImage }} style={styles.main} contentFit="cover" />
        <Field
          label="Name"
          placeholder="Capsule"
          value={moodboardName}
          onChangeText={setMoodboardName}
          style={{ marginTop: 20 }}
        />
        <View style={styles.thumbs}>
          {previewImages.map((image, index) => (
            <Pressable key={index} onPress={() => setSelectedImage(image)}>
              <Image source={{ uri: image }} style={styles.thumb} contentFit="cover" />
              <Pressable onPress={() => handleRemoveImage(index)} style={styles.remove} hitSlop={6}>
                <Image source={icons.cross} style={{ width: 16, height: 16 }} />
              </Pressable>
            </Pressable>
          ))}
        </View>
        <SubmitButton title="Save" onPress={handleSave} style={{ marginTop: 28 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: { width: "100%", aspectRatio: 1.4, borderRadius: 6, marginTop: 8 },
  thumbs: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginTop: 12 },
  thumb: { width: 76, height: 106, borderRadius: 6, margin: 4, borderWidth: 1, borderColor: "#E5E7EB" },
  remove: { position: "absolute", top: 6, right: 6, backgroundColor: "#fff", borderRadius: 10, padding: 2 },
});
