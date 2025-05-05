import { Stack } from "expo-router";

export default function LayoutHome() {
  return (
    <Stack>
      <Stack.Screen name="Index" options={{ headerShown: false }} />
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: true,
          title: "Detalle de Ruta",
          headerTintColor: "white",
          headerBackTitle: "Inicio",
          headerStyle: { backgroundColor: "#C64560" },
        }}
      />
      <Stack.Screen name="UsersToReassign" options={{ headerShown: false }} />
      <Stack.Screen name="ToShared" options={{ headerShown: false }} />
      <Stack.Screen
        name="UsersToAddToSharedRoute"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
