import React from "react";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#f4511e",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      
      <Stack.Screen name="Home" options={{}} />
      <Stack.Screen name="DailySummaryLog" options={{}} />
      <Stack.Screen name="FindRouteScreen" options={{}} />
    </Stack>
  );
}
