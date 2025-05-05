import { insertInicioRuta } from "../../../services/operadorServices/inicioruta.js";

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";

const { width } = Dimensions.get("window");

const StartRouteForm = () => {
  const [capturaSimplieroute, setCapturaSimplieroute] = useState(null);
  const [kilometrajeInicial, setKilometrajeInicial] = useState("");
  const [imagenKilometraje, setImagenKilometraje] = useState(null);
  const [fechaInicio, setFechaInicio] = useState("");
  const [idRutaOperador, setIdRutaOperador] = useState("");

  useEffect(() => {
    const obtenerIdOperador = async () => {
      const id = await AsyncStorage.getItem("id_operador");
      setIdRutaOperador(id);
    };
    obtenerIdOperador();
  }, []);

  const seleccionarImagen = async (setImagen) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setImagen(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("id_ruta_operador", parseInt(idRutaOperador));
    formData.append("kilometraje_inicial", kilometrajeInicial);
    formData.append("fecha_inicio", fechaInicio);

    formData.append("captura_simplieroute", {
      uri: capturaSimplieroute,
      type: "image/jpeg",
      name: `${idRutaOperador}_simple_${Date.now()}.jpg`,
    });

    formData.append("imagen_kilometraje", {
      uri: imagenKilometraje,
      type: "image/jpeg",
      name: `${idRutaOperador}_km_${Date.now()}.jpg`,
    });

    try {
      const response = await insertInicioRuta(formData);
      Alert.alert("Éxito", response.message);
    } catch (error) {
      Alert.alert("Error", "No se pudo registrar el inicio de ruta");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Kilometraje Inicial:</Text>
        <TextInput
          style={styles.input}
          value={kilometrajeInicial}
          onChangeText={setKilometrajeInicial}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Fecha de Inicio:</Text>
        <TextInput
          style={styles.input}
          value={fechaInicio}
          onChangeText={setFechaInicio}
          placeholder="YYYY-MM-DDTHH:mm:ss"
        />

        <Text style={styles.label}>Captura Simplieroute:</Text>
        <TouchableOpacity
          onPress={() => seleccionarImagen(setCapturaSimplieroute)}
        >
          <Text style={styles.uploadButton}>Seleccionar Imagen</Text>
        </TouchableOpacity>
        {capturaSimplieroute && (
          <Image source={{ uri: capturaSimplieroute }} style={styles.preview} />
        )}

        <Text style={styles.label}>Imagen Kilometraje:</Text>
        <TouchableOpacity
          onPress={() => seleccionarImagen(setImagenKilometraje)}
        >
          <Text style={styles.uploadButton}>Seleccionar Imagen</Text>
        </TouchableOpacity>
        {imagenKilometraje && (
          <Image source={{ uri: imagenKilometraje }} style={styles.preview} />
        )}

        <TouchableOpacity
          className="mt-8"
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.submitText}>Enviar Inicio de Ruta</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#fdfdfd",
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 400,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
    marginBottom: 6,
    marginTop: 18,
  },
  input: {
    height: 44,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f9f9f9",
    fontSize: 15,
    color: "#222",
  },
  uploadButton: {
    color: "#007AFF",
    fontWeight: "600",
    marginTop: 6,
    marginBottom: 12,
    fontSize: 15,
  },
  preview: {
    width: "100%",
    height: 180,
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    resizeMode: "cover",
  },
  submitButton: {
    backgroundColor: "#C64560",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 30,
  },
  submitText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 17,
  },
});

export default StartRouteForm;
