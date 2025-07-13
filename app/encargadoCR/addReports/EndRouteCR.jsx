import { StyleSheet, View } from "react-native";
import FindRouteScreen from "../../../src/screens/main/socio/FindRouteScreen";

const EndRouteCR = () => {
  return (
    <View style={styles.container}>
      <FindRouteScreen></FindRouteScreen>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default EndRouteCR;
