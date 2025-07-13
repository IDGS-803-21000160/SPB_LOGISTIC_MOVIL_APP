import { MaterialIcons } from "@expo/vector-icons"; // Asegúrate de tener instalado @expo/vector-icons
import { StyleSheet, Text, View } from "react-native";

const ReportsOperador = () => {
  return (
    <View style={styles.container}>
      <MaterialIcons name="build" size={60} color="#888" style={styles.icon} />
      <Text style={styles.text}>Módulo en desarrollo</Text>
      <Text style={styles.subtext}>
        Próximamente podrás ver tus reportes aquí.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  icon: {
    marginBottom: 20,
  },
  text: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#444",
  },
  subtext: {
    fontSize: 16,
    textAlign: "center",
    color: "#888",
  },
});

export default ReportsOperador;
