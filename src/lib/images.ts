import * as ImagePicker from "expo-image-picker";
import { File } from "expo-file-system";
import { REMOVE_BG_API_KEY } from "./config";

type PickOptions = { multiple?: boolean; limit?: number };

// Returns data URIs (`data:image/...;base64,...`), the same format CR_Client stored.
export async function pickFromLibrary({ multiple = false, limit = 1 }: PickOptions = {}) {
  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) throw new Error("Photo library permission is required");
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: "images",
    allowsMultipleSelection: multiple,
    selectionLimit: limit,
    base64: true,
    quality: 0.7,
  });
  if (result.canceled) return [];
  return result.assets.map((a) => ({
    uri: a.uri,
    dataUri: `data:${a.mimeType ?? "image/jpeg"};base64,${a.base64}`,
    mimeType: a.mimeType ?? "image/jpeg",
    fileName: a.fileName ?? "photo.jpg",
  }));
}

export async function takePhoto() {
  const perm = await ImagePicker.requestCameraPermissionsAsync();
  if (!perm.granted) throw new Error("Camera permission is required");
  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: "images",
    base64: true,
    quality: 0.7,
  });
  if (result.canceled) return null;
  const a = result.assets[0];
  return {
    uri: a.uri,
    dataUri: `data:${a.mimeType ?? "image/jpeg"};base64,${a.base64}`,
    mimeType: a.mimeType ?? "image/jpeg",
    fileName: a.fileName ?? "photo.jpg",
  };
}

// Sends the photo to remove.bg and returns the cut-out as a PNG data URI.
export async function removeBackground(photo: { uri: string; mimeType: string; fileName: string }) {
  // Expo SDK 57 replaced global fetch with expo/fetch, whose FormData
  // serializer only accepts strings, Blobs, or File-like objects with a
  // bytes() method — not React Native's classic { uri, name, type } file
  // part (that shape is opened by the old native networking layer only,
  // and throws "Unsupported FormData part implementation" under expo/fetch).
  // expo-file-system's File class exposes bytes()/name/type and works with
  // both fetch implementations.
  const file = new File(photo.uri);
  const formData = new FormData();
  formData.append("image_file", file, photo.fileName);
  formData.append("size", "auto");

  const response = await fetch("https://api.remove.bg/v1.0/removebg", {
    method: "POST",
    body: formData,
    headers: { "X-Api-Key": REMOVE_BG_API_KEY, Accept: "application/json" },
  });
  const json = await response.json();
  if (!response.ok) {
    throw new Error(json?.errors?.[0]?.title || "Background removal failed");
  }
  // With Accept: application/json remove.bg returns base64 instead of a binary body.
  return `data:image/png;base64,${json.data.result_b64}`;
}
