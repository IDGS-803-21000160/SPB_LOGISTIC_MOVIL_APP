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
      <Stack.Screen
        name="Operador"
        options={{
          headerShown: true,
          title: "Operadores",
          headerBackTitle: "Registro",
          headerTintColor: "white",
          headerStyle: { backgroundColor: "#C64560" },
        }}
      />
      <Stack.Screen
        name="Auxiliar1"
        options={{
          headerShown: true,
          title: "Operadores",
          headerBackTitle: "Registro",
          headerTintColor: "white",
          headerStyle: { backgroundColor: "#C64560" },
        }}
      />
      <Stack.Screen
        name="Auxiliar2"
        options={{
          headerShown: true,
          title: "Operadores",
          headerBackTitle: "Registro",
          headerTintColor: "white",
          headerStyle: { backgroundColor: "#C64560" },
        }}
      />
      <Stack.Screen
        name="BigTicketRoute"
        options={{
          headerShown: true,
          title: "Big Ticket",
          headerBackTitle: "Registro",
          headerTintColor: "white",
          headerStyle: { backgroundColor: "#C64560" },
        }}
      />
      <Stack.Screen
        name="UnitaryandSharedRoute"
        options={{
          headerShown: true,
          title: "Unitaria y Compartida",
          headerBackTitle: "Registro",
          headerTintColor: "white",
          headerStyle: { backgroundColor: "#C64560" },
        }}
      />
    </Stack>
  );
}
