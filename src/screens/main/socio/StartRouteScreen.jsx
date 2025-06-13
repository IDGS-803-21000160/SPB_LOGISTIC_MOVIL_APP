import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const FinalizarRutaForm = ({ lpsEsperados = 10, remisiones = [] }) => {
  const [lpsExitosos, setLpsExitosos] = useState("");
  const [lpsFallidos, setLpsFallidos] = useState("");

  const validarFinalizarRuta = () => {
    const exitosos = parseInt(lpsExitosos);
    const fallidos = parseInt(lpsFallidos);
    const totalCapturados = exitosos + fallidos;
    const totalRemisiones = remisiones.length;

    if (totalCapturados !== lpsEsperados) {
      Alert.alert(
        "LPS incompletos",
        `Se esperaban ${lpsEsperados} LPS, pero se capturaron ${totalCapturados}`
      );
      return false;
    }

    if (totalRemisiones !== exitosos) {
      Alert.alert(
        "Remisiones no coinciden",
        `Se capturaron ${exitosos} LPS exitosos, pero hay ${totalRemisiones} remisiones`
      );
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validarFinalizarRuta()) return;

    // Aquí puedes insertar la finalización de ruta
    Alert.alert("Éxito", "Ruta finalizada correctamente");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Finalizar Ruta</Text>

      <View style={styles.field}>
        <Text>LPS Exitosos</Text>
        <TextInput
          keyboardType="numeric"
          value={lpsExitosos}
          onChangeText={setLpsExitosos}
          placeholder="Ej. 5"
          style={styles.input}
        />
      </View>

      <View style={styles.field}>
        <Text>LPS Fallidos</Text>
        <TextInput
          keyboardType="numeric"
          value={lpsFallidos}
          onChangeText={setLpsFallidos}
          placeholder="Ej. 2"
          style={styles.input}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Finalizar Ruta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 100,
    backgroundColor: "white",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  field: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 45,
    backgroundColor: "#f5f5f5",
  },
  button: {
    backgroundColor: "#AC3958",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
});

export default FinalizarRutaForm;
