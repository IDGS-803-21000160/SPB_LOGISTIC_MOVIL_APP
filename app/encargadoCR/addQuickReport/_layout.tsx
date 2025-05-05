// app/addQuickReport/_layout.tsx
import { Stack } from "expo-router";

export default function AddQuickReportLayout() {
  return (
    <Stack>
      <Stack.Screen name="Index" options={{ headerShown: false }} />
      <Stack.Screen
        name="Users"
        options={{
          headerShown: true,
          title: "Operadores",
          headerBackTitle: "Registro",
          headerTintColor: "white",
          headerStyle: { backgroundColor: "#C64560" },
        }}
      />
    </Stack>
  );
}
