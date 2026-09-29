import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import Toast from "react-native-toast-message";
import Screen from "@/components/Screen";
import { BackHeader, Checkbox, Field, LinkText, SectionTitle, SubmitButton } from "@/components/ui";
import AddItemSheet, { CATEGORIES } from "@/components/items/AddItemSheet";
import ActionMenu from "@/components/ActionMenu";
import ConfirmDeleteSheet from "@/components/ConfirmDeleteSheet";
import MenuDotsButton from "@/components/MenuDotsButton";
import { icons } from "@/components/icons";
import { api, errorMessage } from "@/lib/api";
import { colors, fonts } from "@/lib/theme";

type ItemType = {
  _id: string;
  image: string;
  categories: string[];
  itemName: string;
  itemComment: string;
  date: string;
};

export default function Items() {
  const [items, setItems] = useState<ItemType[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [deleteItem, setDeleteItem] = useState<ItemType | null>(null);
  const [editItem, setEditItem] = useState<ItemType | null>(null);
  const [itemName, setItemName] = useState("");
  const [itemComment, setItemComment] = useState("");

  useEffect(() => {
    api
      .get("/api/items")
      .then((res) => setItems(res.data.data))
      .catch((error) => console.error("Error fetching items:", error));
  }, []);

  const handleImageUpload = async (base64Image: string, categories: string[]) => {
    try {
      const response = await api.post("/api/items", {
        image: base64Image,
        categories,
        itemName: `Item ${items.length}`,
        itemComment: "",
        date: new Date().toLocaleDateString(),
      });
      setItems((prev) => [...prev, response.data.data]);
    } catch (error) {
      Toast.show({ type: "error", text1: errorMessage(error, "Error adding item") });
    }
  };

  const toggleCategory = (category: string) =>
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );

  const filteredItems = items.filter(
    (item) =>
      selectedCategories.length === 0 ||
      (item.categories && selectedCategories.some((c) => item.categories.includes(c)))
  );

  const handleDeleteConfirm = async () => {
    if (!deleteItem) return;
    try {
      await api.delete("/api/items", { params: { id: deleteItem._id } });
      setItems((prev) => prev.filter((i) => i._id !== deleteItem._id));
    } catch (error) {
      Toast.show({ type: "error", text1: errorMessage(error, "Error deleting item") });
    }
    setDeleteItem(null);
  };

  const openEdit = (item: ItemType) => {
    setMenuId(null);
    setEditItem(item);
    setItemName(item.itemName);
    setItemComment(item.itemComment ?? "");
  };

  const handleSaveDetails = async () => {
    if (!editItem) return;
    try {
      const response = await api.put("/api/items", { ...editItem, itemName, itemComment });
      setItems((prev) => prev.map((i) => (i._id === editItem._id ? response.data.data : i)));
      setEditItem(null);
      Toast.show({ type: "success", text1: "Data updated successfully" });
    } catch (error) {
      Toast.show({ type: "error", text1: errorMessage(error, "Error updating item") });
    }
  };

  if (editItem) {
    return (
      <Screen>
        <BackHeader title="Edit" onBack={() => setEditItem(null)} />
        <View style={{ paddingHorizontal: 16 }}>
          <View style={styles.editImageBox}>
            <Image source={{ uri: editItem.image }} style={{ width: "78%", height: "73%" }} contentFit="contain" />
          </View>
          <Field label="Name" value={itemName} onChangeText={setItemName} style={{ marginTop: 16 }} />
          <Field
            label="Do you want to add any comment?"
            value={itemComment}
            onChangeText={setItemComment}
            placeholder="Add your comment"
            multiline
          />
          <SubmitButton title="Save" onPress={handleSaveDetails} style={{ marginTop: 8 }} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <SectionTitle right={<LinkText title="+ Add item" onPress={() => setIsAddOpen(true)} />}>Items:</SectionTitle>

      <View style={styles.filters}>
        {selectedCategories.map((id) => (
          <Pressable key={id} style={styles.chip} onPress={() => toggleCategory(id)}>
            <Text style={styles.chipText}>{CATEGORIES.find((c) => c.id === id)?.label ?? id}  ×</Text>
          </Pressable>
        ))}
        <View>
          <Pressable style={styles.more} onPress={() => setIsDropdownOpen(!isDropdownOpen)}>
            <Text style={styles.moreText}>More</Text>
            <Image source={icons.arrowDown} style={{ width: 16, height: 16, marginLeft: 4 }} />
          </Pressable>
        </View>
      </View>
      {isDropdownOpen && (
        <View style={styles.dropdown}>
          {CATEGORIES.map((c) => (
            <Checkbox
              key={c.id}
              label={c.label}
              checked={selectedCategories.includes(c.id)}
              onToggle={() => toggleCategory(c.id)}
            />
          ))}
        </View>
      )}

      <View style={styles.grid}>
        {filteredItems.map((item) => (
          <View key={item._id} style={styles.card}>
            <View style={styles.dateRow}>
              <Image source={icons.calendar} style={{ width: 18, height: 18 }} />
              <Text style={styles.date}>{item.date}</Text>
            </View>
            <MenuDotsButton
              onPress={() => setMenuId(menuId === item._id ? null : item._id)}
              variant="dark"
              style={styles.dots}
            />
            {menuId === item._id && (
              <ActionMenu
                onEdit={() => openEdit(item)}
                onDelete={() => {
                  setMenuId(null);
                  setDeleteItem(item);
                }}
              />
            )}
            <Image source={{ uri: item.image }} style={styles.itemImage} contentFit="contain" />
            <View style={styles.bottom}>
              <Text style={styles.itemName} numberOfLines={1}>
                {item.itemName}
              </Text>
              <Pressable onPress={() => openEdit(item)} hitSlop={8}>
                <Image source={icons.chat} style={{ width: 24, height: 24 }} />
              </Pressable>
            </View>
          </View>
        ))}
      </View>

      <AddItemSheet visible={isAddOpen} onClose={() => setIsAddOpen(false)} onImageUpload={handleImageUpload} />

      <ConfirmDeleteSheet
        visible={!!deleteItem}
        title="Are you sure you want to delete this item?"
        preview={
          deleteItem && (
            <Image source={{ uri: deleteItem.image }} style={{ width: "60%", height: "80%" }} contentFit="contain" />
          )
        }
        onCancel={() => setDeleteItem(null)}
        onConfirm={handleDeleteConfirm}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  filters: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 8, paddingHorizontal: 16 },
  chip: { backgroundColor: colors.primary, borderRadius: 6, paddingHorizontal: 12, paddingVertical: 6 },
  chipText: { color: "#fff", fontFamily: fonts.medium },
  more: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  moreText: { color: colors.primary, fontFamily: fonts.semibold },
  dropdown: {
    marginHorizontal: 16,
    marginTop: 8,
    padding: 12,
    paddingBottom: 0,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    backgroundColor: "#fff",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 20,
    paddingHorizontal: 16,
    marginTop: 20,
  },
  card: {
    width: "47%",
    aspectRatio: 0.73,
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
  dateRow: { position: "absolute", top: 6, left: 6, flexDirection: "row", alignItems: "center", gap: 2 },
  date: { fontSize: 11, color: colors.dark, fontFamily: fonts.regular },
  dots: { position: "absolute", top: 4, right: 2, zIndex: 10 },
  itemImage: { width: "80%", height: "55%", borderRadius: 8 },
  bottom: {
    position: "absolute",
    bottom: 4,
    left: 8,
    right: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemName: { flex: 1, fontSize: 13, color: colors.dark, fontFamily: fonts.medium },
  editImageBox: {
    width: "100%",
    aspectRatio: 1.21,
    borderRadius: 8,
    backgroundColor: colors.inputBg,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
});
