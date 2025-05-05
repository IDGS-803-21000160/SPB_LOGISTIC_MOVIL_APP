import React, { useEffect, useState } from "react";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { View, StyleSheet } from "react-native";
import TabBar from "@/src/components/common/TabBar";
import { useRoute } from "@react-navigation/native";
import HomeScreen from "../operador/homeOp/index";
import { AuthProvider } from "@/src/context/AuthContext";

export default function LayoutOperador() {
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
      <AuthProvider>
        <Tabs
          tabBar={(props) => <TabBar {...props} />}
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: "#C64560",
              borderTopWidth: 0,
              position: "absolute",
            },
          }}
        >
          <Tabs.Screen name="homeOp" options={{ tabBarShowLabel: false }} />
          <Tabs.Screen name="reportsOp" options={{ tabBarShowLabel: false }} />
          <Tabs.Screen name="profileOp" options={{ tabBarShowLabel: false }} />
        </Tabs>
      </AuthProvider>
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
