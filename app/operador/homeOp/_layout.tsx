import { Stack } from "expo-router";

export default function LayoutHomeOperador() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="startRouteOp"
        options={{
          headerShown: true,
          title: "Iniciar Ruta",
          headerTintColor: "white",
          headerBackTitle: "Inicio",
          headerStyle: { backgroundColor: "#C64560" },
        }}
      />
      <Stack.Screen
        name="findRoteOp"
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
