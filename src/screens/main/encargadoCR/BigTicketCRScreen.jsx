import Stepper from "@/src/components/common/Stepper";
import AsyncStorage from "@react-native-async-storage/async-storage"; // ← NEW
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Path, Svg } from "react-native-svg";
import { postInsertBigTicketRoutes } from "../../../../src/services/encargadoCrServices/registrationRouteService"; // ← NEW

// Zustand stores
import {
  useBigTicketRouteStoreAuxiliar1,
  useBigTicketRouteStoreAuxiliar2,
  useBigTicketRouteStoreOperador,
} from "../../../store/userStore";

const { width } = Dimensions.get("window");

const BigTicketCRScreen = () => {
  const router = useRouter();

  // ----- Zustand selectors (valor + action) -----
  // Operador
  const selectedUserOperador = useBigTicketRouteStoreOperador(
    (s) => s.selectedUser
  );
  const setSelectedUserOperador = useBigTicketRouteStoreOperador(
    (s) => s.setSelectedUser
  );
  // Auxiliar 1
  const selectedUserAuxiliar1 = useBigTicketRouteStoreAuxiliar1(
    (s) => s.selectedUser
  );
  const setSelectedUserAuxiliar1 = useBigTicketRouteStoreAuxiliar1(
    (s) => s.setSelectedUser
  );
  // Auxiliar 2
  const selectedUserAuxiliar2 = useBigTicketRouteStoreAuxiliar2(
    (s) => s.selectedUser
  );
  const setSelectedUserAuxiliar2 = useBigTicketRouteStoreAuxiliar2(
    (s) => s.setSelectedUser
  );

  const resetOperador = useBigTicketRouteStoreOperador((s) => s.reset);
  const resetAux1 = useBigTicketRouteStoreAuxiliar1((s) => s.reset);
  const resetAux2 = useBigTicketRouteStoreAuxiliar2((s) => s.reset);

  // ---------- Estado del formulario ----------
  const [socio, setSocio] = useState("");
  const [auxiliar1, setAuxiliar1] = useState("");
  const [auxiliar2, setAuxiliar2] = useState("");
  const [bulto, setBulto] = useState("");

  const [idOperador, setIdOperador] = useState("");
  const [idAuxiliar1, setIdAuxiliar1] = useState("");
  const [idAuxiliar2, setIdAuxiliar2] = useState("");

  const [numRuta, setNumRuta] = useState("");
  const [zona, setZona] = useState("");
  const [numLPS, setNumLPS] = useState("");
  const [remisiones, setRemisiones] = useState("");

  // Dropdown tipo de ruta
  const [open, setOpen] = useState(false);
  const [tipoRuta, setTipoRuta] = useState(null);
  const [items, setItems] = useState([
    { label: "Local", value: "Local" },
    { label: "Foránea", value: "Foránea" },
  ]);

  // Control de pasos
  const [step, setStep] = useState(0);
  const [buttonNext, setButtonNext] = useState(true); // se habilita tras "Registrar"

  // Registros y resumen (lo que ya tenías)
  const [registros, setRegistros] = useState([]);
  const [summaryRoutes, setSummaryRoutes] = useState([]);

  // NEW: arreglo con el payload Big Ticket (formato solicitado)
  const [payloadBT, setPayloadBT] = useState([]);

  // NEW: authData para id_cr e id_usuario
  const [authData, setAuthData] = useState(null);

  // Animación simple para steps
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [step]);

  // ---------- Carga authData (id_cr, id_usuario) ----------
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem("authData");
        if (raw) setAuthData(JSON.parse(raw));
      } catch (e) {
        console.warn("No se pudo leer authData:", e);
      }
    })();
  }, []);

  // ---------- Sincroniza con stores (valor, no action) ----------
  useEffect(() => {
    if (selectedUserOperador) {
      setSocio(selectedUserOperador.nombre ?? "");
      setIdOperador(String(selectedUserOperador.id_persona ?? ""));
    }
  }, [selectedUserOperador]);

  useEffect(() => {
    if (selectedUserAuxiliar1) {
      setAuxiliar1(selectedUserAuxiliar1.nombre ?? "");
      setIdAuxiliar1(String(selectedUserAuxiliar1.id_persona ?? ""));
    }
  }, [selectedUserAuxiliar1]);

  useEffect(() => {
    if (selectedUserAuxiliar2) {
      setAuxiliar2(selectedUserAuxiliar2.nombre ?? "");
      setIdAuxiliar2(String(selectedUserAuxiliar2.id_persona ?? ""));
    }
  }, [selectedUserAuxiliar2]);

  // ---------- Helpers ----------
  const toInt = (v) => {
    const n = parseInt(String(v).replace(/\D/g, ""), 10);
    return Number.isNaN(n) ? 0 : n;
  };

  // NEW: fecha YYYY-MM-DD
  const todayString = () => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const clearForm = () => {
    setSocio("");
    setAuxiliar1("");
    setAuxiliar2("");
    setBulto("");
    setNumRuta("");
    setTipoRuta(null);
    setZona("");
    setNumLPS("");
    setRemisiones("");

    resetOperador();
    resetAux1();
    resetAux2();
    // IDs
    setIdOperador("");
    setIdAuxiliar1("");
    setIdAuxiliar2("");
  };

  const nextStep = () => {
    fadeAnim.setValue(0);
    setStep((prev) => Math.min(prev + 1, 2)); // 0=form, 1=summary, 2=success
  };

  const goToOperador = () => {
    router.push("/encargadoCR/addQuickReport/Operador");
  };

  const goToAuxiliar1 = () => {
    router.push("/encargadoCR/addQuickReport/Auxiliar1");
  };

  const goToAuxiliar2 = () => {
    router.push("/encargadoCR/addQuickReport/Auxiliar2");
  };

  const sendBigTicketRoutes = async () => {
    if (!payloadBT.length) {
      Alert.alert(
        "Sin registros",
        "Agrega al menos un registro antes de confirmar."
      );
      return;
    }
    try {
      const response = await postInsertBigTicketRoutes(payloadBT);
      console.log("Registro enviado al servicio:", response);
    } catch (error) {
      console.error("Error al enviar registro al servicio:", error);
      Alert.alert("Error", "No se pudo registrar en el servidor.");
    }
    setPayloadBT([]);
    console.log("pay load bb", payloadBT);

    nextStep();
  };

  // ---------- Validaciones + Registrar ----------
  const addUnaryOperator = () => {
    const nLps = toInt(numLPS);
    const nRem = toInt(remisiones);
    const nBulto = toInt(bulto);

    if (nRem > nLps) {
      Alert.alert(
        "Error en los datos",
        "El número de remisiones no puede ser mayor que el número de LPS."
      );
      return;
    }

    // Mantener tu registro actual (para UI / resumen)
    const registro = {
      numero_ruta: numRuta,
      tipo_ruta: "Unitaria",
      categoria_ruta: tipoRuta,
      lps_totales: nLps,
      remisiones_totales: nRem,
      zona,
      operador: socio,
      auxiliar1,
      auxiliar2,
      bulto: nBulto,
      id_operador: idOperador,
      id_auxiliar1: idAuxiliar1,
      id_auxiliar2: idAuxiliar2,
    };

    setRegistros((prev) => [...prev, registro]);
    setSummaryRoutes((prev) => [
      ...prev,
      {
        numRuta: String(numRuta).padStart(2, "0"),
        lps: nLps,
        remisiones: nRem,
        operador: socio,
        auxiliar1,
        auxiliar2,
        bulto: nBulto,
        tipoRuta,
        zona,
      },
    ]);

    // NEW: construir el objeto BigTicket solicitado y acumularlo en payloadBT
    const operadoresArr = [
      idOperador ? { id_operador: Number(idOperador) } : null,
      idAuxiliar1 ? { id_operador: Number(idAuxiliar1) } : null,
      idAuxiliar2 ? { id_operador: Number(idAuxiliar2) } : null, // auxiliar2 es opcional
    ].filter(Boolean);

    const payloadItem = {
      numero_ruta: String(numRuta).padStart(2, "0"),
      tipo_ruta: "BigTicket",
      categoria_ruta: tipoRuta ?? null,
      fecha_registro: todayString(),
      id_cr: authData?.cr ?? null,
      id_usuario: authData?.id_usuario ?? null,
      zona: zona ?? null,
      lps_totales: nLps,
      remisiones_totales: nRem,
      bultos: nBulto || 0,
      operadores: operadoresArr,
    };

    setPayloadBT((prev) => {
      const next = [...prev, payloadItem];
      console.log(
        "Payload BigTicket acumulado ⇒",
        JSON.stringify(next, null, 2)
      );
      return next;
    });

    setButtonNext(false);
    clearForm();
    Alert.alert("Éxito", "Registro agregado correctamente.");
  };

  const renderForm = () => (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 180 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Operador */}
        <Text style={styles.label} className="font-semibold mb-1">
          Operador
        </Text>
        <View className="flex-row items-center w-full">
          <TouchableOpacity
            className="text-gray-900 text-md rounded-full h-14 flex-1"
            onPress={goToOperador}
          >
            <TextInput
              className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-full h-14 flex-1 px-3 py-2"
              editable={false}
              style={styles.input}
              placeholder="Ingresa el nombre del socio"
              value={socio}
              onChangeText={setSocio}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonSearch}
            className="p-2.5 ml-2 text-sm font-medium text-white rounded-lg border border-red-400"
            onPress={goToOperador}
          >
            <Svg width={45} height={20} viewBox="0 0 20 20" fill="none">
              <Path
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                stroke="white"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </Svg>
          </TouchableOpacity>
        </View>

        {/* Auxiliar 1 */}
        <Text style={styles.label} className="font-semibold mb-1 mt-4">
          Auxiliar 1
        </Text>
        <View className="flex-row items-center w-full">
          <TouchableOpacity
            className="text-gray-900 text-md rounded-full h-14 flex-1"
            onPress={goToAuxiliar1}
          >
            <TextInput
              className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-full h-14 flex-1 px-3 py-2"
              editable={false}
              style={styles.input}
              placeholder="Ingresa el nombre del auxiliar 1"
              value={auxiliar1}
              onChangeText={setAuxiliar1}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonSearch}
            className="p-2.5 ml-2 text-sm font-medium text-white rounded-lg border border-red-400"
            onPress={goToAuxiliar1}
          >
            <Svg width={45} height={20} viewBox="0 0 20 20" fill="none">
              <Path
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                stroke="white"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </Svg>
          </TouchableOpacity>
        </View>

        {/* Auxiliar 2 */}
        <Text style={styles.label} className="font-semibold mb-1 mt-4">
          Auxiliar 2
        </Text>
        <View className="flex-row items-center w-full">
          <TouchableOpacity
            className="text-gray-900 text-md rounded-full h-14 flex-1"
            onPress={goToAuxiliar2}
          >
            <TextInput
              className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-full h-14 flex-1 px-3 py-2"
              editable={false}
              style={styles.input}
              placeholder="Ingresa el nombre del auxiliar 2"
              value={auxiliar2}
              onChangeText={setAuxiliar2}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonSearch}
            className="p-2.5 ml-2 text-sm font-medium text-white rounded-lg border border-red-400"
            onPress={goToAuxiliar2}
          >
            <Svg width={45} height={20} viewBox="0 0 20 20" fill="none">
              <Path
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                stroke="white"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </Svg>
          </TouchableOpacity>
        </View>

        {/* Bulto */}
        <Text style={styles.label} className="font-semibold mb-1 mt-4">
          Bulto
        </Text>
        <TextInput
          className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-xl h-14 w-full px-3"
          style={styles.input}
          placeholder="Ingresa la cantidad de bultos"
          value={bulto}
          onChangeText={setBulto}
          keyboardType="number-pad"
        />

        {/* Número de Ruta */}
        <Text style={styles.label} className="font-semibold mb-1 mt-4">
          Número de Ruta
        </Text>
        <TextInput
          className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-xl h-14 w-full px-3"
          style={styles.input}
          placeholder="Ingresa el número de ruta"
          value={numRuta}
          onChangeText={setNumRuta}
          keyboardType="number-pad"
        />

        {/* Tipo de Ruta */}
        <View style={styles.containerSelect}>
          <Text style={styles.label} className="font-semibold mb-1">
            Tipo de Ruta
          </Text>
          <DropDownPicker
            open={open}
            value={tipoRuta}
            items={items}
            setOpen={setOpen}
            setValue={setTipoRuta}
            setItems={setItems}
            placeholder="Seleccione tipo de ruta"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            listMode="SCROLLVIEW"
          />
        </View>

        {/* Zona */}
        <Text style={styles.label} className="font-semibold mb-1">
          Zona
        </Text>
        <TextInput
          className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-xl h-14 w-full px-3 py-2"
          style={styles.input}
          placeholder="Ingresa la zona"
          value={zona}
          onChangeText={setZona}
        />

        {/* LPS */}
        <Text style={styles.label} className="font-semibold mb-1">
          Número de LPS
        </Text>
        <TextInput
          className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-xl h-14 w-full px-3"
          style={styles.input}
          placeholder="Ingresa el número de LPS"
          value={numLPS}
          onChangeText={setNumLPS}
          keyboardType="number-pad"
        />

        {/* Remisiones */}
        <Text style={styles.label} className="font-semibold mb-1">
          Remisiones
        </Text>
        <TextInput
          className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-xl h-14 w-full px-3"
          style={styles.input}
          placeholder="Ingresa las remisiones"
          value={remisiones}
          onChangeText={setRemisiones}
          keyboardType="number-pad"
        />

        {/* Botones */}
        <View style={{ marginTop: 16 }}>
          <TouchableOpacity
            className="p-4 rounded-xl"
            style={{ backgroundColor: "#D93958" }}
            onPress={addUnaryOperator}
          >
            <Text className="text-white text-center font-bold">Registrar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="p-4 rounded-xl mt-4"
            style={{ backgroundColor: buttonNext ? "#D3D3D3" : "#C64560" }}
            onPress={nextStep}
            disabled={buttonNext}
          >
            <Text className="text-white text-center font-bold">Siguiente</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  // Helper para iniciales en chips de auxiliares (si lo necesitas en otra vista)
  const getInitial = (name = "") => {
    if (!name) return "";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2)
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  };

  const renderSummary = () => (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        <Text style={styles.summaryTitle}>Resumen</Text>

        {summaryRoutes.map((item, idx) => {
          const auxList = [item.auxiliar1, item.auxiliar2].filter(Boolean);
          const extraCount = Math.max(auxList.length - 2, 0);

          return (
            <View key={idx} style={styles.cardModern}>
              {/* Header */}
              <View style={styles.cardHeader}>
                <Text style={styles.cardRoute}>Ruta {item.numRuta}</Text>

                {/* Chips */}
                <View style={styles.pillsRow}>
                  {item.tipoRuta ? (
                    <View style={[styles.pill, styles.pillPrimary]}>
                      <Text style={[styles.pillText, styles.pillTextPrimary]}>
                        {item.tipoRuta}
                      </Text>
                    </View>
                  ) : null}

                  {typeof item.bulto !== "undefined" && item.bulto !== null ? (
                    <View style={styles.pill}>
                      <Text style={styles.pillText}>
                        Bulto {item.bulto || 0}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>

              {/* Operador */}
              <Text style={styles.operatorName}>{item.operador || "—"}</Text>

              {/* KPIs */}
              <View style={styles.statRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{item.lps}</Text>
                  <Text style={styles.statLabel}>LPS</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{item.remisiones}</Text>
                  <Text style={styles.statLabel}>Remisiones</Text>
                </View>
              </View>

              {/* Auxiliares (compacto) */}
              {auxList.length > 0 ? (
                <View style={styles.auxRow}>
                  <Text style={styles.auxLabel}>Auxiliares</Text>
                  <View style={styles.auxAvatars}>
                    {auxList.slice(0, 2).map((name, i) => (
                      <View key={i} style={styles.avatar}>
                        <Text style={styles.avatarText}>
                          {getInitial(name)}
                        </Text>
                      </View>
                    ))}
                    {extraCount > 0 ? (
                      <View style={[styles.avatar, styles.avatarMuted]}>
                        <Text style={styles.avatarText}>+{extraCount}</Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              ) : null}
            </View>
          );
        })}

        <TouchableOpacity
          disabled={summaryRoutes.length === 0}
          style={[
            styles.ctaButton,
            { opacity: summaryRoutes.length === 0 ? 0.6 : 1 },
          ]}
          onPress={() => sendBigTicketRoutes()}
        >
          <Text style={styles.ctaText}>Confirmar y finalizar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );

  const renderSuccess = () => (
    <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 12,
          color: "#C64560",
        }}
      >
        Registro exitoso
      </Text>
      <Text style={{ fontSize: 16, marginBottom: 24 }}>
        Registros realizados: {registros.length}
      </Text>
      <TouchableOpacity
        style={{ backgroundColor: "#C64560", padding: 16, borderRadius: 10 }}
        onPress={() => {
          setStep(0);
          setRegistros([]);
          setSummaryRoutes([]);
          setButtonNext(true);
          setPayloadBT([]);
        }}
      >
        <Text
          style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}
        >
          Volver a registrar
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderStepContent = () => {
    if (step === 0) return renderForm();
    if (step === 1) return renderSummary();
    return renderSuccess();
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Stepper
        currentStep={step}
        onStepPress={(stepIndex) => {
          setStep(stepIndex);
        }}
      />

      <View style={styles.containerSummar}>
        <View style={[styles.box, styles.box1]}>
          <Text>Registros: </Text>
        </View>
        <View style={[styles.box, styles.box2]}>
          <Text>{registros?.length}</Text>
        </View>
      </View>

      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        {renderStepContent()}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: "#111827",
  },
  input: {
    borderRadius: 12,
  },
  buttonSearch: {
    backgroundColor: "#C64560",
    borderRadius: 10,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  containerSelect: {
    marginTop: 12,
    marginBottom: 8,
    zIndex: 10,
  },
  dropdown: {
    borderColor: "#D1D5DB",
    borderRadius: 12,
    minHeight: 56,
  },
  dropdownContainer: {
    borderColor: "#D1D5DB",
    borderRadius: 12,
  },

  // Stepper
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 8,
  },
  stepItem: { alignItems: "center" },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  stepCircleActive: {
    borderColor: "#C64560",
    backgroundColor: "#C64560",
  },
  stepIndex: { fontSize: 12, color: "#6B7280", fontWeight: "bold" },
  stepIndexActive: { color: "#fff" },
  stepLabel: { fontSize: 12, color: "#6B7280", marginTop: 4 },
  stepLabelActive: { color: "#C64560", fontWeight: "600" },

  // Resumen / contador
  containerSummar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: width * 0.9,
    marginTop: 9,
  },
  box: {
    width: width * 0.25,
    justifyContent: "center",
    alignItems: "center",
  },
  box1: {
    height: 50,
  },
  box2: {
    backgroundColor: "#E5E7EB",
    borderRadius: 50,
    height: 30,
  },

  // --- Modern Summary Card ---
  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  cardModern: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ECECEC",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  cardRoute: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  pillsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  pill: {
    backgroundColor: "#F3F4F6",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  pillPrimary: {
    backgroundColor: "#FCE7EC",
    borderWidth: 1,
    borderColor: "#F5C8D3",
  },
  pillText: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "600",
  },
  pillTextPrimary: {
    color: "#C64560",
  },
  operatorName: {
    fontSize: 14,
    color: "#475569",
    marginBottom: 8,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "space-between",
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    overflow: "hidden",
  },
  statBox: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    width: 1,
    backgroundColor: "#E5E7EB",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    lineHeight: 24,
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  auxRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  auxLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
  },
  auxAvatars: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarMuted: {
    backgroundColor: "#F3F4F6",
  },
  avatarText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#111827",
  },

  ctaButton: {
    backgroundColor: "#D93958",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
  },
  ctaText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 15,
  },
});

export default BigTicketCRScreen;
