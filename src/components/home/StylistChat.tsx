import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { api } from "@/lib/api";
import socket from "@/lib/socket";
import { colors, fonts } from "@/lib/theme";
import { icons } from "../icons";

interface Message {
  _id?: string;
  sender: string;
  receiver: string;
  content: string;
  timestamp?: string | Date;
  status?: "sent" | "delivered" | "read";
}

export default function StylistChat({
  clientId,
  stylistId,
  stylistName,
  stylistImage,
  onBack,
}: {
  clientId: string;
  stylistId: string;
  stylistName: string;
  stylistImage: any;
  onBack: () => void;
}) {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [stylistOnline, setStylistOnline] = useState(false);
  const listRef = useRef<FlatList<Message>>(null);

  useEffect(() => {
    if (!clientId || !stylistId) return;

    api
      .get("/api/messages", { params: { senderId: clientId, receiverId: stylistId } })
      .then((res) => setMessages(res.data.messages))
      .catch((error) => console.error("Error fetching messages:", error));

    socket.connect();
    socket.emit("join", { role: "client", userId: clientId });
    socket.on("stylist_online", () => setStylistOnline(true));
    socket.on("stylist_offline", () => setStylistOnline(false));
    socket.on("private_message", (msg: Message) => {
      setMessages((prev) => [...prev, { ...msg, sender: msg.sender ?? (msg as any).from }]);
    });

    return () => {
      socket.off("private_message");
      socket.off("stylist_online");
      socket.off("stylist_offline");
      socket.disconnect();
    };
  }, [clientId, stylistId]);

  const handleSendMessage = async () => {
    const content = newMessage.trim();
    if (!content) return;
    try {
      const response = await api.post("/api/messages", {
        sender: clientId,
        receiver: stylistId,
        content,
        status: "sent",
      });
      setMessages((prev) => [...prev, response.data.message]);
      socket.emit("private_message", { content, to: stylistId, from: clientId });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.chatBg }}
      // Android's native windowSoftInputMode="resize" (the default) is
      // unreliable once edge-to-edge display is on (the default in recent
      // Expo SDKs) — Expo's own docs flag this exact combination and
      // recommend letting KeyboardAvoidingView handle it in JS instead of
      // `undefined`, which otherwise does nothing on Android.
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <Pressable onPress={onBack} hitSlop={10} style={{ padding: 4, marginRight: 4 }}>
          <Image source={icons.backArrow} style={{ width: 20, height: 20 }} />
        </Pressable>
        <Image source={stylistImage} style={styles.avatar} contentFit="cover" />
        <View style={{ marginLeft: 12, flex: 1 }}>
          <Text style={styles.name} numberOfLines={1}>
            {stylistName}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <View style={[styles.dot, { backgroundColor: stylistOnline ? "#22C55E" : "#9CA3AF" }]} />
            <Text style={styles.status}>{stylistOnline ? "Online" : "Offline"}</Text>
          </View>
        </View>
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(m, i) => m._id ?? `${i}`}
        contentContainerStyle={{ padding: 12 }}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => {
          const mine = item.sender === clientId;
          return (
            <View style={{ alignItems: mine ? "flex-end" : "flex-start", marginBottom: 16 }}>
              <View style={styles.bubble}>
                <Text style={[styles.bubbleText, { color: mine ? colors.primary : "#011627" }]}>
                  {item.content}
                </Text>
                {item.timestamp && (
                  <Text style={styles.time}>
                    {new Date(item.timestamp).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </Text>
                )}
              </View>
            </View>
          );
        }}
      />

      <View style={[styles.inputRow, { paddingBottom: insets.bottom + 8 }]}>
        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          onSubmitEditing={handleSendMessage}
          placeholder="Type a message..."
          placeholderTextColor={colors.muted}
          style={styles.input}
          returnKeyType="send"
        />
        <Pressable onPress={handleSendMessage} style={styles.send}>
          <Image source={icons.msg} style={{ width: 16, height: 16 }} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F2F8FA",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  avatar: { width: 44, height: 44, borderRadius: 12 },
  name: { fontSize: 16, fontFamily: fonts.bold, color: colors.dark },
  dot: { width: 8, height: 8, borderRadius: 4 },
  status: { fontSize: 12, color: "#4B5563", fontFamily: fonts.regular },
  bubble: {
    maxWidth: "75%",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    elevation: 1,
  },
  bubbleText: { fontSize: 14, fontFamily: fonts.regular },
  time: { fontSize: 9, color: "#9CA3AF", marginTop: 4, textAlign: "right" },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: fonts.regular,
  },
  send: { padding: 12, backgroundColor: colors.primary, borderRadius: 8 },
});
