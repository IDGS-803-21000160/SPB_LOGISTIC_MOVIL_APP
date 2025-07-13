import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
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
import { getRutasCompartidas } from "../../../services/userServices/operadoresServices";
import { getFormattedDateMexico } from "../../../utils/dateFormatting";
import { uploadFileAsync } from "../../../utils/firebaseStorage";

const { width } = Dimensions.get("window");

const InicioRutaForm = () => {
  const [kilometrajeInicial, setKilometrajeInicial] = useState("");
  const [imagenOdometro, setImagenOdometro] = useState(null);
  const [manifiestoPdf, setManifiestoPdf] = useState(null);
  const [rutas, setRutas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [numRuta, setNumRuta] = useState("");

  const { data } = useLocalSearchParams();
  const dataRoute = JSON.parse(data);
  const infoRuta = dataRoute?.[0]?.[0] || {};

  // Carga inicial de rutas compartidas
  useEffect(() => {
    if (infoRuta.id_ruta) {
      getRutasCompartidas(infoRuta.id_ruta)
        .then((arr) => arr && setRutas(arr))
        .catch(console.error);
      setNumRuta(infoRuta.numero_ruta || "");
    }
  }, []);

  // Determinar si este operador es el primero (id_ruta_operador más bajo)
  const currentIdRutaOper = infoRuta.id_ruta_operador;
  const minIdRutaOper =
    rutas.length > 1
      ? Math.min(...rutas.map((r) => r.id_ruta_operador))
      : currentIdRutaOper;
  const esPrimerOperador = currentIdRutaOper === minIdRutaOper;

  // Selección de imagen y PDF
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
      setManifiestoPdf(res.assets?.[0]?.uri ?? res.uri);
    }
  };

  // Envío del formulario
  const handleSubmit = async () => {
    // Validaciones comunes
    if (!kilometrajeInicial)
      return Alert.alert("Atención", "Kilometraje obligatorio");
    if (!imagenOdometro)
      return Alert.alert("Atención", "Selecciona foto odómetro");

    // Si soy primer operador, también requiero PDF
    if (esPrimerOperador && !manifiestoPdf)
      return Alert.alert("Atención", "Selecciona PDF de manifiesto");

    setLoading(true);
    try {
      // Subir imagen siempre
      const imgUrl = await uploadFileAsync(
        imagenOdometro,
        `inicioRuta/${currentIdRutaOper}/odometro_${Date.now()}.jpg`,
        "image/jpeg"
      );

      let pdfUrl = null;
      if (esPrimerOperador) {
        // Solo el primero sube el PDF
        pdfUrl = await uploadFileAsync(
          manifiestoPdf,
          `inicioRuta/${currentIdRutaOper}/manifiesto_${Date.now()}.pdf`,
          "application/pdf"
        );
      }

      // Construir payload
      const payload = {
        id_ruta_operador: currentIdRutaOper,
        kilometraje_inicial: kilometrajeInicial,
        imagen_kilometraje: imgUrl,
        fecha_inicio: getFormattedDateMexico(),
        // Solo incluyo doc_manifiesto si soy primer operador
        ...(esPrimerOperador && { doc_manifiesto: pdfUrl }),
      };

      await insertInicioRuta(payload);
      Alert.alert("Éxito", "Inicio de ruta registrado correctamente");
      router.back();
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "No se pudo registrar el inicio de ruta");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View className="mb-9">
        <Text className="font-bold text-2xl text-center">
          Form. Inicio de ruta
        </Text>
        <Text className="text-center">{numRuta}</Text>
        <Text className="mt-4 text-sm text-gray-500 text-center">
          Registra el arranque de tu ruta con los siguientes datos
        </Text>
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
            <Image source={{ uri: imagenOdometro }} style={styles.preview} />
          )}
        </View>

        {/* Manifiesto PDF: solo al primer operador */}
        {esPrimerOperador ? (
          <View style={styles.field}>
            <Text style={styles.label}>Manifiesto (PDF)</Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={seleccionarPdf}
            >
              <Text style={styles.uploadText}>Seleccionar PDF</Text>
            </TouchableOpacity>
            {manifiestoPdf && (
              <Text style={{ marginTop: 8, color: "#555" }}>
                {manifiestoPdf.split("/").pop()}
              </Text>
            )}
          </View>
        ) : rutas.length > 1 ? (
          <Text style={[styles.label, { color: "#AA0000", marginBottom: 18 }]}>
            Ya existe un manifiesto subido por otro operador.
          </Text>
        ) : null}

        {/* Botón Enviar: siempre habilitado */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
