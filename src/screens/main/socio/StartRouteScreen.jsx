import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";

import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Spinner from "../../../components/common/Spinner";
import { insertInicioRuta } from "../../../services/operadorServices/iniciorutaService";
import { getFormattedDateMexico } from "../../../utils/dateFormatting";
import { uploadFileAsync } from "../../../utils/firebaseStorage";

const { width } = Dimensions.get("window");

const InicioRutaForm = () => {
  const [kilometrajeInicial, setKilometrajeInicial] = useState("");
  const [imagenOdometro, setImagenOdometro] = useState(null);
  const [manifiestoPdf, setManifiestoPdf] = useState(null);
  const [idRutaOperador, setIdRutaOperador] = useState(0);
  const [loading, setLoading] = useState(false);

  const { data, crData } = useLocalSearchParams();
  const dataRoute = JSON.parse(data);
  const datosCR = JSON.parse(crData);

  //Variables datos de la ruta
  const [numRuta, setNumRuta] = useState("");

  useEffect(() => {
    console.log("Data de la ruta:", dataRoute[0][0]);
    console.log("Data CR:", datosCR);

    AsyncStorage.getItem("id_operador").then((id) => {
      setIdRutaOperador(id);
    });
  }, []);

  useEffect(() => {
    setNumRuta(dataRoute[0][0].numero_ruta);
  }, []);

  const seleccionarImagen = async () => {
    const { assets, canceled } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.8,
    });
    if (!canceled) setImagenOdometro(assets[0].uri);
  };

  const seleccionarPdf = async () => {
    const res = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      copyToCacheDirectory: true,
    });
    if (res.canceled) {
      setManifiestoPdf(null);
    } else {
      // res.assets[0].uri en SDKs recientes
      const uri = res.assets?.[0]?.uri ?? res.uri;
      setManifiestoPdf(uri);
    }
  };

  const insertarInicioRuta = async (payload) => {
    try {
      const response = await insertInicioRuta(payload);
      if (response) {
        Alert.alert("Éxito", "Inicio de ruta registrado correctamente");
      } else {
        Alert.alert("Error", "No se pudo registrar el inicio de ruta");
      }
    } catch (error) {
      console.error("Error al insertar inicio de ruta:", error);
      Alert.alert("Error", "Ocurrió un error al registrar el inicio de ruta");
    }
  };

  const handleSubmit = async () => {
    if (!kilometrajeInicial)
      return Alert.alert("Atención", "Kilometraje obligatorio");
    if (!imagenOdometro)
      return Alert.alert("Atención", "Selecciona foto odómetro");
    if (!manifiestoPdf) return Alert.alert("Atención", "Selecciona PDF");

    setLoading(true);
    try {
      if (!dataRoute[0][0].id_ruta_operador)
        return Alert.alert("Atención", "No se encontró la ruta");

      const imgUrl = await uploadFileAsync(
        imagenOdometro,
        `inicioRuta/${
          dataRoute[0][0].id_ruta_operador
        }/odometro_${Date.now()}.jpg`,
        "image/jpeg"
      );

      const pdfUrl = await uploadFileAsync(
        manifiestoPdf,
        `inicioRuta/${
          dataRoute[0][0].id_ruta_operador
        }/manifiesto_${Date.now()}.pdf`,
        "application/pdf"
      );

      console.log("URL de imagen:", imgUrl);
      console.log("URL de PDF:", pdfUrl);

      const payload = {
        id_ruta_operador: dataRoute[0][0].id_ruta_operador,
        doc_manifiesto: pdfUrl,
        kilometraje_inicial: kilometrajeInicial,
        imagen_kilometraje: imgUrl, // reemplaza con la URL real tras subir
        fecha_inicio: getFormattedDateMexico(),
      };

      const postResponse = await insertarInicioRuta(payload);

      console.log("Payload a enviar:", payload);
      setLoading(false);
    } catch (error) {
      console.error("Error al enviar:", error);
      setLoading(false);
      Alert.alert("Error", "No se pudo registrar el inicio de ruta");
    }
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Encabezado */}
          <View className="mb-9">
            <Text className="font-bold text-2xl text-center">
              Form. Inicio de ruta
            </Text>
            <Text className="text-center">{numRuta}</Text>
            <View className="mt-4">
              <Text className=" text-sm text-gray-500">
                Registra el arranque de tu ruta con los siguientes datos
              </Text>
            </View>
          </View>

          <View style={styles.formContainer}>
            {/* Kilometraje inicial */}
            <View style={styles.field}>
              <Text style={styles.label}>Kilometraje Inicial</Text>
              <TextInput
                style={styles.input}
                value={kilometrajeInicial}
                onChangeText={setKilometrajeInicial}
                keyboardType="numeric"
                placeholder="Ej. 12345"
              />
            </View>

            {/* Imagen del odómetro */}
            <View style={styles.field}>
              <Text style={styles.label}>Imagen Odómetro</Text>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={seleccionarImagen}
              >
                <Text style={styles.uploadText}>Seleccionar Imagen</Text>
              </TouchableOpacity>
              {imagenOdometro && (
                <Image
                  source={{ uri: imagenOdometro }}
                  style={styles.preview}
                />
              )}
            </View>

            {/* PDF de manifiesto */}
            <View style={styles.field}>
              <Text style={styles.label}>Manifiesto (PDF)</Text>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => {
                  Alert.alert("DEBUG", "Tocaste PDF");
                  seleccionarPdf();
                }}
              >
                <Text style={styles.uploadText}>Seleccionar PDF</Text>
              </TouchableOpacity>
              {manifiestoPdf && (
                <Text style={{ marginTop: 8, color: "#555" }}>
                  {manifiestoPdf.split("/").pop()}
                </Text>
              )}
            </View>

            {/* Botón enviar */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitText}>Enviar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "white",
    padding: 16,
    paddingBottom: 200,
  },
  formContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    elevation: 2,
  },
  field: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 6,
  },
  input: {
    height: 46,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#FAFAFA",
    fontSize: 14,
    color: "#222",
  },
  uploadButton: {
    height: 46,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
  },
  uploadText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#AC3958",
  },
  preview: {
    width: "100%",
    height: width * 0.45,
    borderRadius: 8,
    marginTop: 12,
    resizeMode: "cover",
  },
  submitButton: {
    backgroundColor: "#AC3958",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  submitText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default InicioRutaForm;
