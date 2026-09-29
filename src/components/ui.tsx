import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
  StyleProp,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { colors, fonts } from "@/lib/theme";
import { icons } from "./icons";

// `.submit-btn` from globals.css: dark teal gradient button.
export function SubmitButton({
  title,
  onPress,
  disabled,
  style,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  if (disabled) {
    return (
      <View style={[styles.button, styles.buttonDisabled, style]}>
        <Text style={[styles.buttonText, { color: "#A0A0A0" }]}>{title}</Text>
      </View>
    );
  }
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }, style]}>
      <LinearGradient
        colors={colors.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.button}
      >
        <Text style={styles.buttonText}>{title}</Text>
      </LinearGradient>
    </Pressable>
  );
}

export function OutlineButton({
  title,
  onPress,
  style,
}: {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.button, styles.outline, style]}>
      <Text style={[styles.buttonText, { color: colors.dark }]}>{title}</Text>
    </Pressable>
  );
}

export function Label({ children }: { children: React.ReactNode }) {
  return <Text style={styles.label}>{children}</Text>;
}

export function Input(props: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor={colors.muted}
      {...props}
      style={[styles.input, props.multiline && { minHeight: 90, textAlignVertical: "top" }, props.style]}
    />
  );
}

export function Field({
  label,
  style,
  ...inputProps
}: TextInputProps & { label: string }) {
  return (
    <View style={[{ marginBottom: 12 }, style as ViewStyle]}>
      <Label>{label}</Label>
      <Input {...inputProps} />
    </View>
  );
}

export function PasswordInput(props: TextInputProps) {
  const [show, setShow] = useState(false);
  return (
    <View style={{ justifyContent: "center" }}>
      <Input
        {...props}
        secureTextEntry={!show}
        autoCapitalize="none"
        autoCorrect={false}
        style={[{ paddingRight: 44 }, props.style]}
      />
      <Pressable onPress={() => setShow(!show)} style={styles.eye} hitSlop={10}>
        <Feather name={show ? "eye-off" : "eye"} size={18} color={colors.dark} />
      </Pressable>
    </View>
  );
}

export function Checkbox({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <Pressable onPress={onToggle} style={styles.checkRow} hitSlop={4}>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <Feather name="check" size={14} color={colors.white} />}
      </View>
      <Text style={styles.checkLabel}>{label}</Text>
    </Pressable>
  );
}

export function BackHeader({
  title,
  onBack,
  right,
  titleColor = colors.dark,
}: {
  title?: string;
  onBack?: () => void;
  right?: React.ReactNode;
  titleColor?: string;
}) {
  return (
    <View style={styles.backHeader}>
      <Pressable
        onPress={onBack ?? (() => (router.canGoBack() ? router.back() : router.replace("/")))}
        hitSlop={10}
        style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
      >
        <Image source={icons.backArrow} style={{ width: 24, height: 24 }} />
        {!!title && (
          <Text style={[styles.backTitle, { color: titleColor }]} numberOfLines={1}>
            {title}
          </Text>
        )}
      </Pressable>
      {right}
    </View>
  );
}

export function SectionTitle({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <View style={styles.sectionRow}>
      <Text style={styles.sectionTitle}>{children}</Text>
      {right}
    </View>
  );
}

export function LinkText({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} hitSlop={8}>
      <Text style={styles.linkText}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  buttonDisabled: { backgroundColor: "#E5E5E5" },
  outline: { borderWidth: 1, borderColor: colors.primary, backgroundColor: colors.white },
  buttonText: { color: colors.white, fontSize: 16, fontFamily: fonts.medium },
  label: {
    color: colors.dark,
    opacity: 0.7,
    fontSize: 16,
    fontFamily: fonts.regular,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.inputBg,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.deep,
    fontFamily: fonts.regular,
  },
  eye: { position: "absolute", right: 14 },
  checkRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  checkboxChecked: { backgroundColor: colors.primary },
  checkLabel: { color: colors.primary, fontSize: 18, fontFamily: fonts.regular },
  backHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backTitle: { fontSize: 18, fontFamily: fonts.semibold, marginLeft: 6, flexShrink: 1 },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 18, fontFamily: fonts.semibold, color: colors.dark },
  linkText: { color: colors.primary, fontFamily: fonts.bold, fontSize: 15 },
});
