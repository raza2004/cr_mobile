import React, { useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Image } from "expo-image";
import { icons } from "../icons";
import { colors, fonts } from "@/lib/theme";

// Local-only comments, same as CR_Client (they are not persisted there either).
export default function ChatModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<string[]>([]);

  const handleAddComment = () => {
    if (comment.trim()) {
      setComments([...comments, comment.trim()]);
      setComment("");
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.box}>
          <Pressable onPress={onClose} style={styles.close} hitSlop={10}>
            <Image source={icons.cross} style={{ width: 20, height: 20 }} />
          </Pressable>
          <Text style={styles.title}>Comments</Text>
          <ScrollView style={{ maxHeight: 240, marginBottom: 16 }}>
            {comments.map((c, i) => (
              <Text key={i} style={styles.comment}>
                {c}
              </Text>
            ))}
          </ScrollView>
          <View style={{ flexDirection: "row" }}>
            <TextInput
              value={comment}
              onChangeText={setComment}
              placeholder="Type your comment..."
              placeholderTextColor={colors.muted}
              style={styles.input}
            />
            <Pressable onPress={handleAddComment} style={styles.send}>
              <Text style={{ color: "#fff", fontFamily: fonts.medium }}>Send</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", padding: 16 },
  box: { backgroundColor: "#fff", borderRadius: 8, padding: 16 },
  close: { position: "absolute", top: 12, right: 12, zIndex: 1 },
  title: { fontSize: 18, fontFamily: fonts.semibold, marginBottom: 16, color: colors.dark },
  comment: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border, fontFamily: fonts.regular },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    padding: 8,
    fontFamily: fonts.regular,
  },
  send: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    justifyContent: "center",
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
});
