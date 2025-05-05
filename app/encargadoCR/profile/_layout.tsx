import { Stack } from "expo-router";

export default function LayoutHome() {
  return (
    <Stack>
      <Stack.Screen name="Index" options={{ headerShown: false }} />
    </Stack>
  );
}
