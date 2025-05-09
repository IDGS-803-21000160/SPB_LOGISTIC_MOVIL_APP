import { useLocalSearchParams, useRouter } from "expo-router";
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
import { postCierreRuta } from "../../../services/operadorServices/finruta";
import { getFormattedDateMexico } from "../../../utils/dateFormatting";
import { uploadFileAsync } from "../../../utils/firebaseStorage";

import * as ImagePicker from "expo-image-picker";
import Spinner from "../../../components/common/Spinner";

const { width } = Dimensions.get("window");

const CierreRutaForm = () => {
  const router = useRouter();

  const [capturaSimplieroute2, setCapturaSimplieroute2] = useState(null);
  const [imagenKilometraje, setImagenKilometraje] = useState(null);
  const [kilometrajeFinal, setKilometrajeFinal] = useState("");
  const [lpsExitosos, setLpsExitosos] = useState("");
  const [lpsFallidos, setLpsFallidos] = useState("");
  const [remisionesFinales, setRemisionesFinales] = useState("");
  const [visitados, setVisitados] = useState("");
  const [cancelados, setCancelados] = useState("");
  const [idRutaOperador, setIdRutaOperador] = useState(null);
  const [loading, setLoading] = useState(false);

  const { data, crData } = useLocalSearchParams();
  const dataRoute = JSON.parse(data);
  const datosCR = JSON.parse(crData);

  //Variables datos de la ruta
  const [numRuta, setNumRuta] = useState("");
  const [lpsAsignados, setLpsAsignados] = useState("");
  const [remisionesAsignadas, setRemisionesAsignadas] = useState("");
  const [ruta, setRuta] = useState("");
  const [zona, setZona] = useState("");

  useEffect(() => {
    console.log("🥎Data de la ruta:", dataRoute[0][0]);
    console.log("🐽Data CR:", datosCR);

    setNumRuta(dataRoute[0][0].numero_ruta);
    setLpsAsignados(dataRoute[0][0].lps_asignados);
    setRemisionesAsignadas(dataRoute[0][0].remisiones_asignadas);
    setRuta(dataRoute[0][0].tipo_ruta);
    setZona(dataRoute[0][0].zona);
    setIdRutaOperador(dataRoute[0][0].id_ruta_operador);
  }, []);

  const seleccionarImagen = async (setter) => {
    try {
      const { assets, canceled } = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
      });
      if (!canceled) setter(assets[0].uri);
    } catch (error) {
      console.warn("Error al seleccionar imagen:", error);
    }
  };

  const postServiceCierreRuta = async (payload) => {
    try {
      const response = await postCierreRuta(payload);
      if (response) {
        Alert.alert("Éxito", "Cierre de ruta registrado correctamente");
        router.back();
      } else {
        Alert.alert("Error", "No se pudo registrar el Cierre de ruta");
      }
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error al registrar el Cierre de ruta");
    }
  };

  const handleSubmit = async () => {
    if (!kilometrajeFinal) {
      Alert.alert("Atención", "El kilometraje final es obligatorio");
      return;
    }

    if (!lpsExitosos) {
      Alert.alert("Atención", "Los LPS exitosos son obligatorios");
      return;
    }

    if (!lpsFallidos) {
      Alert.alert("Atención", "Los LPS fallidos son obligatorios");
      return;
    }

    if (!remisionesFinales) {
      Alert.alert("Atención", "Las remisiones finales son obligatorias");
      return;
    }

    if (!visitados) {
      Alert.alert("Atención", "El número de visitados es obligatorio");
      return;
    }

    if (!cancelados) {
      Alert.alert("Atención", "El número de cancelados es obligatorio");
      return;
    }

    if (!capturaSimplieroute2) {
      Alert.alert("Atención", "La captura Simplieroute final es obligatoria");
      return;
    }

    if (!imagenKilometraje) {
      Alert.alert("Atención", "La imagen del kilometraje final es obligatoria");
      return;
    }
    setLoading(true);

    try {
      // 1) subo imágenes a Firebase y obtengo URLs
      let urlSimple = "";
      let urlKilometraje = "";

      if (capturaSimplieroute2) {
        urlSimple = await uploadFileAsync(
          capturaSimplieroute2,
          `cierreRuta/${idRutaOperador}/simple_${Date.now()}.jpg`,
          "image/jpeg"
        );
      }
      if (imagenKilometraje) {
        urlKilometraje = await uploadFileAsync(
          imagenKilometraje,
          `cierreRuta/${idRutaOperador}/km_${Date.now()}.jpg`,
          "image/jpeg"
        );
      }

      // 2) armo payload (puede ser JSON en vez de FormData)
      const payload = {
        idRutaOperador: idRutaOperador,
        capturaSimplieroute2: urlSimple,
        lpsExitosos: lpsExitosos,
        lpsFallidos: lpsFallidos,
        remisionesFinales: remisionesFinales,
        fechaCierre: getFormattedDateMexico(),
        kilometrajeFinal: kilometrajeFinal,
        imagenKilometraje: urlKilometraje,
        visitados,
        cancelados,
      };

      const postResponse = await postServiceCierreRuta(payload);

      // 3) llamo a tu servicio para guardar todo (ya sea en tu API o en Firestore)
      console.log("Payload a enviar:", payload);

      setLoading(false);
      Alert.alert("Éxito", "Cierre de ruta registrado");
      // …limpia formulario…
    } catch (error) {
      console.error("Error subida:", error);
      setLoading(false);
      Alert.alert("Error", "No se pudo registrar el cierre de ruta");
    }
  };

  return (
    <>
      {loading ? (
        <Spinner></Spinner>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View className="mb-9">
            <Text className="font-bold text-2xl text-center">
              Form. Cierre de ruta
            </Text>
            <Text className="text-center">{numRuta}</Text>
            <View className="mt-4">
              <Text className=" text-sm text-gray-500">
                Finalizaras la ruta, con las siguientes especificaciones
              </Text>
              <View className="mt-4">
                <Text className="text-sm text-gray-500">
                  Lps Asignados a la ruta:{" "}
                  <Text className="font-bold text-gray-700">
                    {lpsAsignados}
                  </Text>
                </Text>

                <Text className=" text-sm text-gray-500">
                  Remisiones asignadas a la ruta:{" "}
                  <Text className="font-bold text-gray-700">
                    {remisionesAsignadas}
                  </Text>
                </Text>
                <Text className=" text-sm text-gray-500">
                  Ruta <Text className="font-bold text-gray-700">{ruta}</Text>{" "}
                  con zona a{" "}
                  <Text className="font-bold text-gray-700">{zona}</Text>
                </Text>
              </View>
            </View>
          </View>
          <View className="bg-slate-300 h-0.5"></View>
          <View style={styles.formContainer}>
            <View style={styles.field}>
              <Text style={styles.label}>Kilometraje Final</Text>
              <TextInput
                style={styles.input}
                value={kilometrajeFinal}
                onChangeText={setKilometrajeFinal}
                keyboardType="numeric"
                placeholder="Ej. 12456"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>LPS Exitosos</Text>
              <TextInput
                style={styles.input}
                value={lpsExitosos}
                onChangeText={setLpsExitosos}
                keyboardType="numeric"
                placeholder="Ej. 50"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>LPS Fallidos</Text>
              <TextInput
                style={styles.input}
                value={lpsFallidos}
                onChangeText={setLpsFallidos}
                keyboardType="numeric"
                placeholder="Ej. 3"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Remisiones Finales</Text>
              <TextInput
                style={styles.input}
                value={remisionesFinales}
                onChangeText={setRemisionesFinales}
                keyboardType="numeric"
                placeholder="Ej. 20"
              />
            </View>

            <View style={styles.fieldRow}>
              <View style={styles.fieldSmall}>
                <Text style={styles.label}>Visitados</Text>
                <TextInput
                  style={styles.input}
                  value={visitados}
                  onChangeText={setVisitados}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.fieldSmall}>
                <Text style={styles.label}>Cancelados</Text>
                <TextInput
                  style={styles.input}
                  value={cancelados}
                  onChangeText={setCancelados}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Captura Simplieroute Final</Text>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => seleccionarImagen(setCapturaSimplieroute2)}
              >
                <Text style={styles.uploadText}>Seleccionar Imagen</Text>
              </TouchableOpacity>
              {capturaSimplieroute2 && (
                <Image
                  source={{ uri: capturaSimplieroute2 }}
                  style={styles.preview}
                />
              )}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Imagen Kilometraje Final</Text>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => seleccionarImagen(setImagenKilometraje)}
              >
                <Text style={styles.uploadText}>Seleccionar Imagen</Text>
              </TouchableOpacity>
              {imagenKilometraje && (
                <Image
                  source={{ uri: imagenKilometraje }}
                  style={styles.preview}
                />
              )}
            </View>

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
    paddingBottom: 400,
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
  fieldRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  fieldSmall: {
    flex: 0.48,
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

export default CierreRutaForm;
