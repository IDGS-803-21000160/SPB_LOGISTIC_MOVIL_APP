import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import RouteDetails from "../../../src/screens/main/encargadoCR/RouteDetails";

const DetailsScreen = () => {
  const { id } = useLocalSearchParams(); // Obtiene el parámetro dinámico de la URL

  return (
    <View style={{ flex: 1 }}>
      <RouteDetails idRute={id} />
    </View>
  );
};

export default DetailsScreen;
