import { StyleSheet } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import DailySummaryLog from "../../../src/screens/main/socio/DailySummaryLog";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <>
      <SafeAreaProvider style={styles.container}>
        <DailySummaryLog></DailySummaryLog>
      </SafeAreaProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  text: {
    color: "#fff",
    fontSize: 20,
  },
});
