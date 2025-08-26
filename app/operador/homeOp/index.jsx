import { StyleSheet } from "react-native";
import RoutesOperador from "../../../src/screens/main/socio/RoutesOperador";

export default function HomeScreen() {
  return (
    <>
      <RoutesOperador routeDetailPath={"/operador/homeOp/RouteDetail"} />
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
