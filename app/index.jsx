import { Button, StyleSheet, Text, View } from "react-native";
import LoginPage from "@/src/screens/auth/LoginPage";
import { AuthProvider } from "@/src/context/AuthContext";
import LayoutCR from "./encargadoCR/_layout";
import "../global.css";

export default function App() {
  return (
    <>
      <View style={{ flex: 1 }}>
        <LoginPage />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
});
