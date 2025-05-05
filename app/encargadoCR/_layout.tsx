import React, { useEffect } from "react";
import { Tabs } from "expo-router";
import TabBar from "@/src/components/common/TabBar";
import { useRoute } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function LayoutCR() {
  const insets = useSafeAreaInsets();
  const route = useRoute();

  useEffect(() => {
    console.log(route.name);
  }, [route]);

  return (
    <>
      {/* Vista para simular el fondo en el área del status bar */}
      <View style={[styles.statusBarOverlay, { height: insets.top }]} />

      {/* Forzamos el StatusBar; en iOS backgroundColor no tiene efecto, pero el fondo se simula */}
      <StatusBar style="light" translucent={false} backgroundColor="#C64560" />
      <Tabs tabBar={(props) => <TabBar {...props} />}>
        <Tabs.Screen
          name="home"
          options={{ headerShown: false, tabBarShowLabel: false }}
        />
        <Tabs.Screen
          name="reports"
          options={{ headerShown: false, tabBarShowLabel: false }}
        />
        <Tabs.Screen name="addQuickReport" options={{ headerShown: false }} />
        <Tabs.Screen name="addReports" options={{ headerShown: false }} />
        <Tabs.Screen name="profile" options={{ headerShown: false }} />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#C64560", // Este será el fondo general, incluido el área del status bar
  },
  statusBarOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    height: 200,
    right: 0,
    backgroundColor: "#C64560",
    zIndex: 20,
  },
});
