import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
import Toast from "react-native-toast-message";
import BottomSheet from "../BottomSheet";
import { Checkbox, SubmitButton } from "../ui";
import { images } from "../icons";
import { errorMessage } from "@/lib/api";
import { pickFromLibrary, removeBackground, takePhoto } from "@/lib/images";
import { colors, fonts } from "@/lib/theme";

// Combines CR_Client's BottomModal (category → source) and CameraItem (photo tips).
export const CATEGORIES = [
  { id: "top-clothes", label: "Top clothes" },
  { id: "bottom-clothes", label: "Bottom clothes" },
  { id: "dresses", label: "Dresses" },
  { id: "accessories", label: "Accessories" },
  { id: "outewear", label: "Outewear" },
  { id: "bags", label: "Bags" },
];

type Step = "categories" | "source" | "tips" | "processing";

export default function AddItemSheet({
  visible,
  onClose,
  onImageUpload,
}: {
  visible: boolean;
  onClose: () => void;
  onImageUpload: (base64Image: string, categories: string[]) => Promise<void>;
}) {
  const [step, setStep] = useState<Step>("categories");
  const [checked, setChecked] = useState<string[]>([]);
  const [slide, setSlide] = useState(1);

  useEffect(() => {
    if (visible) {
      setStep("categories");
      setChecked([]);
      setSlide(1);
    }
  }, [visible]);

  const toggle = (id: string) =>
    setChecked((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));

  const process = async (getPhoto: () => Promise<any>) => {
    try {
      const photo = await getPhoto();
      if (!photo) return;
      setStep("processing");
      const cutout = await removeBackground(photo);
      await onImageUpload(cutout, checked);
      onClose();
    } catch (error) {
      Toast.show({ type: "error", text1: errorMessage(error) });
      setStep("source");
    }
  };

  const fromGallery = () => process(async () => (await pickFromLibrary())[0]);
  const fromCamera = () => process(takePhoto);

  return (
    <BottomSheet visible={visible} onClose={onClose} showClose={step !== "processing"}>
      {step === "categories" && (
        <View>
          <Text style={styles.caption}>Add item</Text>
          <Text style={styles.question}>In which category do you want to add the item?</Text>
          <View style={{ paddingVertical: 16 }}>
            {CATEGORIES.map((c) => (
              <Checkbox key={c.id} label={c.label} checked={checked.includes(c.id)} onToggle={() => toggle(c.id)} />
            ))}
          </View>
          <SubmitButton title="Next" onPress={() => setStep("source")} disabled={checked.length === 0} />
        </View>
      )}

      {step === "source" && (
        <View style={{ paddingTop: 32, gap: 8 }}>
          <Pressable style={styles.option} onPress={fromGallery}>
            <Text style={styles.optionText}>Photo Gallery</Text>
          </Pressable>
          <Pressable style={styles.option} onPress={() => setStep("tips")}>
            <Text style={styles.optionText}>Camera</Text>
          </Pressable>
          <Pressable style={[styles.option, { backgroundColor: "#F3F4F6", marginTop: 16 }]} onPress={() => setStep("categories")}>
            <Text style={[styles.optionText, { fontFamily: fonts.semibold }]}>Cancel</Text>
          </Pressable>
        </View>
      )}

      {step === "tips" && (
        <PhotoTips slide={slide} setSlide={setSlide} onStart={fromCamera} />
      )}

      {step === "processing" && (
        <View style={{ paddingVertical: 60, alignItems: "center" }}>
          <ActivityIndicator color={colors.primary} size="large" />
          <Text style={[styles.caption, { marginTop: 16 }]}>Removing background…</Text>
        </View>
      )}
    </BottomSheet>
  );
}

const TOTAL_SLIDES = 4;

function PhotoTips({
  slide,
  setSlide,
  onStart,
}: {
  slide: number;
  setSlide: (n: number) => void;
  onStart: () => void;
}) {
  const { width, height } = useWindowDimensions();
  const titles: Record<number, string> = {
    1: "Hang the item on a hanger or put it on a contrasting background",
    2: "Find good cool or daylight lighting",
    3: "If there are buttons, you need to pinch them all",
    4: "",
  };

  return (
    <View style={{ height: height * 0.78 }}>
      <Text style={styles.caption}>Photography Tips</Text>
      {slide > 1 && (
        <Pressable onPress={() => setSlide(slide - 1)} style={styles.back} hitSlop={10}>
          <Text style={{ color: colors.primary, fontSize: 22, opacity: 0.5 }}>‹</Text>
        </Pressable>
      )}
      {!!titles[slide] && <Text style={styles.tipTitle}>{titles[slide]}</Text>}

      <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: "center", paddingTop: 12 }}>
        {slide === 1 && (
          <View style={{ flexDirection: "row", gap: 8, marginTop: 16 }}>
            <View style={{ alignItems: "center", flex: 1 }}>
              <Text style={styles.optionLabel}>Option 1</Text>
              <Image source={images.pti1} style={{ width: "100%", aspectRatio: 0.8 }} contentFit="contain" />
            </View>
            <View style={{ alignItems: "center", flex: 1 }}>
              <Text style={styles.optionLabel}>Option 2</Text>
              <Image source={images.pti2} style={{ width: "100%", aspectRatio: 0.8 }} contentFit="contain" />
            </View>
          </View>
        )}
        {slide === 2 && (
          <>
            <Text style={styles.note}>*For a good look, the thing should be ironed*</Text>
            <Image source={images.pti3} style={{ width: width * 0.69, aspectRatio: 0.8, marginTop: 24 }} contentFit="contain" />
          </>
        )}
        {slide === 3 && (
          <Image source={images.pti4} style={{ width: width * 0.68, aspectRatio: 0.8, marginTop: 16 }} contentFit="contain" />
        )}
        {slide === 4 && (
          <View style={{ flex: 1, justifyContent: "center", width: "100%" }}>
            <Text style={styles.ready}>Perfectly!{"\n"}You are ready to take a photo :)</Text>
            <SubmitButton title="Start" onPress={onStart} style={{ marginTop: 48 }} />
          </View>
        )}
      </ScrollView>

      {slide < TOTAL_SLIDES && (
        <Pressable onPress={() => setSlide(slide + 1)} style={styles.next}>
          <Text style={{ color: colors.primary, fontFamily: fonts.semibold, fontSize: 16 }}>NEXT</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  caption: { color: colors.dark, opacity: 0.6, fontSize: 16, textAlign: "center", fontFamily: fonts.regular },
  question: {
    color: colors.dark,
    fontSize: 20,
    lineHeight: 28,
    fontFamily: fonts.medium,
    textAlign: "center",
    marginTop: 12,
    paddingHorizontal: 32,
  },
  option: { backgroundColor: "#D1D5DB", borderRadius: 6, paddingVertical: 14, alignItems: "center" },
  optionText: { color: "#007AFF", fontSize: 16, fontFamily: fonts.medium },
  back: { position: "absolute", left: 4, top: -6 },
  tipTitle: {
    fontSize: 20,
    color: colors.dark,
    marginTop: 8,
    fontFamily: fonts.medium,
    textAlign: "center",
    lineHeight: 26,
  },
  optionLabel: { color: colors.primary, fontSize: 16, marginBottom: 8, fontFamily: fonts.regular },
  note: { color: colors.primary, fontSize: 14, fontFamily: fonts.regular },
  ready: { color: colors.dark, fontSize: 32, lineHeight: 44, textAlign: "center", fontFamily: fonts.medium },
  next: { alignSelf: "center", paddingVertical: 12, paddingHorizontal: 16 },
});
