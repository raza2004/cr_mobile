import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import Screen from "@/components/Screen";
import { BackHeader } from "@/components/ui";
import { icons, images } from "@/components/icons";
import { colors, fonts } from "@/lib/theme";

type Step = { description: string; content?: React.ReactNode };

const faqs: { question: string; icon: any; steps: Step[] }[] = [
  {
    question: "How to make photo of my item?",
    icon: icons.camera,
    steps: [
      {
        description: "Hang the item on a hanger or put it on a contrasting background",
        content: (
          <View style={{ flexDirection: "row", gap: 16 }}>
            <Image source={images.pti1} style={{ width: 142, height: 178 }} contentFit="contain" />
            <Image source={images.pti2} style={{ width: 142, height: 178 }} contentFit="contain" />
          </View>
        ),
      },
      {
        description: "Find good cool or daylight lighting. For a good look, the thing should be ironed.",
        content: <Image source={images.pti3} style={{ width: 175, height: 209 }} contentFit="contain" />,
      },
    ],
  },
  {
    question: "Can I provide feedback on outfit suggestions?",
    icon: icons.noteEdit,
    steps: [
      {
        description:
          "Yes, absolutely! We encourage you to provide feedback on outfit suggestions made by your stylist. You can rate outfits, leave comments, and indicate your preferences to help your stylist better understand your style preferences and refine their recommendations.",
      },
    ],
  },
  {
    question: "Is my personal information secure?",
    icon: icons.shieldCheck,
    steps: [
      {
        description:
          "Yes, protecting your personal information is our top priority. We use industry-standard security measures to safeguard your data and ensure that it is handled in compliance with data protection regulations. Your information is kept confidential and is only shared with your stylist for the purpose of providing personalized styling services.",
      },
    ],
  },
  {
    question: "How do I schedule appointments with my stylist?",
    icon: icons.calendar,
    steps: [
      {
        description:
          "Scheduling appointments with your stylist is easy with the Clients app. Simply navigate to Schedule a meeting and choose a date and time that works for you. You can also view your appointment history and manage your calendar within the app.",
      },
    ],
  },
  {
    question: "What if I have a question or need assistance?",
    icon: icons.octagonHelp,
    steps: [
      {
        description:
          "If you have any questions or need assistance, don't hesitate to reach out to our customer support team. You can contact us directly through the app, and we'll be happy to assist you.",
      },
    ],
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [stepIndex, setStepIndex] = useState(0);

  const toggle = (index: number) => {
    setOpenIndex(index === openIndex ? null : index);
    setStepIndex(0);
  };

  return (
    <Screen>
      <BackHeader title="FAQ" />
      <View style={{ paddingHorizontal: 16, marginTop: 16, gap: 16 }}>
        {faqs.map((faq, index) => {
          const open = openIndex === index;
          const steps = faq.steps;
          const step = steps[open ? stepIndex : 0];
          return (
            <View key={index} style={styles.card}>
              <Pressable style={styles.header} onPress={() => toggle(index)}>
                <Image source={faq.icon} style={{ width: 22, height: 22, marginRight: 8 }} />
                <Text style={styles.question}>{faq.question}</Text>
                <Image
                  source={open ? icons.arrowDown : icons.arrowRight}
                  style={{ width: 24, height: 24 }}
                />
              </Pressable>
              {open && (
                <View style={{ marginTop: 16 }}>
                  {steps.length > 1 && (
                    <Text style={styles.stepLabel}>Step {stepIndex + 1}</Text>
                  )}
                  <Text style={styles.answer}>{step.description}</Text>
                  {step.content && <View style={{ alignItems: "center", marginTop: 12 }}>{step.content}</View>}
                  {steps.length > 1 && (
                    <>
                      <View style={styles.dots}>
                        {steps.map((_, i) => (
                          <View
                            key={i}
                            style={[styles.dot, { backgroundColor: i === stepIndex ? "#3B82F6" : "#D1D5DB" }]}
                          />
                        ))}
                      </View>
                      <View style={styles.nav}>
                        <Pressable
                          style={styles.navBtn}
                          onPress={() => setStepIndex((stepIndex - 1 + steps.length) % steps.length)}
                        >
                          <Image source={icons.arrowLeft} style={{ width: 16, height: 16 }} />
                          <Text style={styles.navText}>Back</Text>
                        </Pressable>
                        <Pressable
                          style={styles.navBtn}
                          onPress={() => setStepIndex((stepIndex + 1) % steps.length)}
                        >
                          <Text style={styles.navText}>NEXT</Text>
                          <Image source={icons.arrowRight} style={{ width: 20, height: 20 }} />
                        </Pressable>
                      </View>
                    </>
                  )}
                </View>
              )}
            </View>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderColor: colors.border, borderRadius: 6, padding: 16 },
  header: { flexDirection: "row", alignItems: "center" },
  question: { flex: 1, fontSize: 17, lineHeight: 24, color: colors.dark, fontFamily: fonts.medium },
  stepLabel: { color: colors.dark, opacity: 0.5, fontSize: 14, marginBottom: 8, fontFamily: fonts.regular },
  answer: { fontSize: 16, color: colors.deep, fontFamily: fonts.regular, lineHeight: 22 },
  dots: { flexDirection: "row", justifyContent: "center", gap: 8, marginVertical: 16 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  nav: { flexDirection: "row", justifyContent: "space-between" },
  navBtn: { flexDirection: "row", alignItems: "center", padding: 8, gap: 4 },
  navText: { color: colors.primary, fontFamily: fonts.medium },
});
