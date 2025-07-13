import { StyleSheet, View } from "react-native";
import InicioRutaForm from "../../../src/screens/main/socio/StartRouteScreen";

const StartRouteCR = () => {
  return (
    <View style={styles.container}>
      <InicioRutaForm></InicioRutaForm>
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

export default StartRouteCR;
