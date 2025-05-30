import { Stack } from "expo-router";

export default function LayoutHome() {
  return (
    <Stack>
      <Stack.Screen name="Index" options={{ headerShown: false }} />
      <Stack.Screen
        name="StartrouteCR"
        options={{
          headerShown: true,
          title: "Iniciar Ruta",
          headerTintColor: "white",
          headerBackTitle: "Inicio",
          headerStyle: { backgroundColor: "#C64560" },
        }}
      />
      <Stack.Screen
        name="EndRouteCR"
        options={{
          headerShown: true,
          title: "Cierre de ruta",
          headerTintColor: "white",
          headerBackTitle: "Inicio",
          headerStyle: { backgroundColor: "#C64560" },
        }}
      />
    </Stack>
  );
}
