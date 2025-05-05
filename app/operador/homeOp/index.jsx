import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import DailySummaryLog from "../../../src/screens/main/socio/DailySummaryLog";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <>
      <SafeAreaProvider style={styles.container}>
        <DailySummaryLog></DailySummaryLog>
      </SafeAreaProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",

    top0: 0,
  },
  text: {
    color: "#fff",
    fontSize: 20,
  },
});
