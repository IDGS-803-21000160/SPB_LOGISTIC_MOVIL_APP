import { useRouter } from "expo-router";
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

const RegistrationOptionCRScreen = ({ navigation }) => {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        {/* Título */}
        <Text style={styles.title} className=" text-gray-500">
          Registro de Rutas
        </Text>
        <View style={styles.line} />
        <View>
          <View
            style={styles.button}
            onTouchEnd={() =>
              router.push("/encargadoCR/addQuickReport/UnitaryandSharedRoute")
            }
          >
            <Text style={styles.buttonText}>
              Registro Ruta Unitaria y Compartida
            </Text>
            <Text style={styles.buttonSubtext}>
              Ingresa los datos de la ruta manualmente
            </Text>
          </View>
          <View
            style={styles.button}
            onTouchEnd={() =>
              router.push("/encargadoCR/addQuickReport/BigTicketRoute")
            }
          >
            <Text style={styles.buttonText}>Registro Ruta Big Ticket</Text>
            <Text style={styles.buttonSubtext}>
              Escanea un código QR para registrar la ruta
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop:
      Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) + 16 : 20,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
  line: {
    marginTop: 10,
    marginBottom: 20,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  button: {
    backgroundColor: "white",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderColor: "#E5E7EB",
    borderWidth: 1,
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonText: {
    color: "#AC3958",
    fontSize: 16,
    fontWeight: "700",
  },
  buttonSubtext: {
    color: "#6B7280",
    fontSize: 13,
    marginTop: 4,
  },
});

export default RegistrationOptionCRScreen;
