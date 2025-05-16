// app/(operador)/_layout.js
import TabBar from "@/src/components/common/TabBar";
import { AuthProvider } from "@/src/context/AuthContext";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function LayoutOperador() {
  const insets = useSafeAreaInsets();
  const bottomInset = insets.bottom;

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.statusBarOverlay, { height: insets.top }]} />
      <StatusBar style="light" translucent={false} backgroundColor="#C64560" />

      <AuthProvider>
        <Tabs
          initialRouteName="homeOp"
          screenOptions={{
            headerShown: false,
            // No ocultar ni mover la tab bar al aparecer el teclado
            tabBarHideOnKeyboard: false,
          }}
          tabBar={(props) => <TabBar {...props} />}
        >
          <Tabs.Screen name="homeOp" options={{ tabBarShowLabel: false }} />
          <Tabs.Screen name="reportsOp" options={{ tabBarShowLabel: false }} />
          <Tabs.Screen name="profileOp" options={{ tabBarShowLabel: false }} />
        </Tabs>
      </AuthProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#C64560" },
  statusBarOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#C64560",
    zIndex: 20,
  },
});
