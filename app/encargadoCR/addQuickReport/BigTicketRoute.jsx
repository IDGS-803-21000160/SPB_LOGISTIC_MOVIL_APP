import { StyleSheet, View } from "react-native";
import BigTicketCRScreen from "../../../src/screens/main/encargadoCR/BigTicketCRScreen";

const BigTicketRoute = () => {
  return (
    <View style={styles.container}>
      <BigTicketCRScreen />
      {/* Agrega aquí tu contenido */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
});

export default BigTicketRoute;
