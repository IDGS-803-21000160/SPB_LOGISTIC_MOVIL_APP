import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
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

  // === NUEVO: estado para modal PDF ===
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [pdfViewerSource, setPdfViewerSource] = useState(null); // { uri } o { html }

  const { data } = useLocalSearchParams();
  const dataRoute = JSON.parse(data);
  const infoRuta = dataRoute?.[0]?.[0] || {};

  // Carga inicial de rutas compartidas
  useEffect(() => {
    console.log("🚀 Cargando rutas compartidas para el operador...", dataRoute);

    if (infoRuta.id_ruta) {
      getRutasCompartidas(infoRuta.id_ruta)
        .then((arr) => arr && setRutas(arr))
        .catch(console.error);
      setNumRuta(infoRuta.numero_ruta || "");
    }
  }, []);

  // Determinar si este operador es el primero (id_ruta_operador más bajo)
  const currentIdRutaOper = dataRoute[0].id_ruta_operador;
  const numeroRuta = dataRoute[0].numero_ruta;
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

  // === NUEVO: ver PDF en modal (funciona iOS local/remoto; Android remoto; Android local usa pdf.js incrustado) ===
  const handleVerPdf = async () => {
    if (!manifiestoPdf) return;

    const isRemote = manifiestoPdf.startsWith("http");

    if (Platform.OS === "android") {
      if (isRemote) {
        // Android: usar Google Viewer dentro del modal
        setPdfViewerSource({
          uri:
            "https://drive.google.com/viewerng/viewer?embedded=true&url=" +
            encodeURIComponent(manifiestoPdf),
        });
        setShowPdfPreview(true);
        return;
      } else {
        // Android local: render simple con pdf.js (primera página) incrustado en HTML
        try {
          const b64 = await FileSystem.readAsStringAsync(manifiestoPdf, {
            encoding: FileSystem.EncodingType.Base64,
          });

          const html = `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  html, body { margin:0; background:#000; color:#fff; height:100%; }
  #wrap { position:fixed; inset:0; display:flex; align-items:center; justify-content:center; background:#000; }
  canvas { max-width:100%; height:auto; }
  .msg { position:absolute; top:8px; left:0; right:0; text-align:center; font:14px sans-serif; color:#ccc; }
</style>
</head>
<body>
<div class="msg">Vista previa (página 1)</div>
<div id="wrap"><canvas id="viewer"></canvas></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.min.js"></script>
<script>
(async function(){
  try {
    const b64='${b64}';
    const raw = atob(b64);
    const len = raw.length;
    const bytes = new Uint8Array(len);
    for (let i=0;i<len;i++) bytes[i]=raw.charCodeAt(i);
    const pdf = await pdfjsLib.getDocument({data:bytes}).promise;
    const page = await pdf.getPage(1);
    const canvas = document.getElementById('viewer');
    const ratio = (window.devicePixelRatio || 1);
    const viewport = page.getViewport({ scale: 1.2 });
    canvas.width = viewport.width * ratio;
    canvas.height = viewport.height * ratio;
    canvas.style.width = viewport.width + 'px';
    canvas.style.height = viewport.height + 'px';
    const ctx = canvas.getContext('2d');
    await page.render({ canvasContext: ctx, viewport: viewport.transform
        ? new pdfjsLib.PageViewport(viewport.viewBox, {dontFlip: false}).clone({
            scale: 1.2 * ratio
          })
        : { ...viewport, scale: 1.2 * ratio }
    }).promise;
  } catch(e){
    document.body.innerHTML = '<div style="padding:16px;color:#fff;font:16px sans-serif">No se pudo renderizar el PDF.</div>';
  }
})();
</script>
</body>
</html>`;
          setPdfViewerSource({ html });
          setShowPdfPreview(true);
        } catch (e) {
          Alert.alert(
            "Vista previa",
            "No se pudo abrir el PDF local en Android."
          );
        }
        return;
      }
    }

    // iOS: WebView renderiza PDF local y remoto nativamente
    setPdfViewerSource({ uri: manifiestoPdf });
    setShowPdfPreview(true);
  };

  // Envío del formulario (SIN CAMBIOS)
  const handleSubmit = async () => {
    if (!kilometrajeInicial)
      return Alert.alert("Atención", "Kilometraje obligatorio");
    if (!imagenOdometro)
      return Alert.alert("Atención", "Selecciona foto odómetro");

    if (esPrimerOperador && !manifiestoPdf)
      return Alert.alert("Atención", "Selecciona PDF de manifiesto");

    setLoading(true);
    try {
      const imgUrl = await uploadFileAsync(
        imagenOdometro,
        `inicioRuta/${numeroRuta}/odometro_${Date.now()}.jpg`,
        "image/jpeg"
      );

      let pdfUrl = null;
      if (esPrimerOperador) {
        pdfUrl = await uploadFileAsync(
          manifiestoPdf,
          `inicioRuta/${numeroRuta}/manifiesto_${Date.now()}.pdf`,
          "application/pdf"
        );
      }

      const payload = {
        id_ruta_operador: currentIdRutaOper,
        kilometraje_inicial: kilometrajeInicial,
        imagen_kilometraje: imgUrl,
        fecha_inicio: getFormattedDateMexico(),
        ...(esPrimerOperador && { doc_manifiesto: pdfUrl }),
      };

      console.log("Payload a enviar:", payload);

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
              <View style={{ marginTop: 8 }}>
                <Text style={{ color: "#555" }}>
                  {manifiestoPdf.split("/").pop()}
                </Text>

                {/* === NUEVO: botón para abrir modal === */}
                <TouchableOpacity
                  style={[styles.uploadButton, { marginTop: 8 }]}
                  onPress={handleVerPdf}
                >
                  <Text style={styles.uploadText}>Ver PDF</Text>
                </TouchableOpacity>
              </View>
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

      {/* === NUEVO: MODAL PDF === */}
      <Modal
        visible={showPdfPreview}
        animationType="slide"
        onRequestClose={() => setShowPdfPreview(false)}
      >
        <View style={{ flex: 1, backgroundColor: "#000" }}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowPdfPreview(false)}>
              <Text style={styles.modalHeaderText}>Cerrar</Text>
            </TouchableOpacity>
          </View>

          {pdfViewerSource ? (
            <WebView
              originWhitelist={["*"]}
              style={{ flex: 1 }}
              source={pdfViewerSource}
              allowFileAccess
              allowFileAccessFromFileURLs
              javaScriptEnabled
              domStorageEnabled
              startInLoadingState
              setSupportMultipleWindows={false}
              renderError={() => (
                <View style={styles.center}>
                  <Text
                    style={{ color: "#fff", padding: 16, textAlign: "center" }}
                  >
                    No se pudo cargar el PDF.
                  </Text>
                </View>
              )}
            />
          ) : (
            <View style={styles.center}>
              <Text style={{ color: "#fff" }}>Sin PDF</Text>
            </View>
          )}
        </View>
      </Modal>
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
  modalHeader: {
    paddingTop: 16,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: "#111",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalHeaderText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    marginTop: 67,
  },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});

export default InicioRutaForm;
