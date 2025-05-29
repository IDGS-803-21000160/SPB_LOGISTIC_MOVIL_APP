import { StyleSheet, View } from "react-native";
import InicioRutaForm from "../../../src/screens/main/socio/StartRouteScreen";

const StartRouteOp = () => {
  return (
    <View style={styles.container}>
      <InicioRutaForm></InicioRutaForm>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});

export default StartRouteOp;
