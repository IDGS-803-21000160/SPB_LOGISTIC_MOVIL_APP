import ToastSuccess from "@/src/components/common/alerts/ToastSuccess";
import Stepper from "@/src/components/common/Stepper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Path, Svg } from "react-native-svg";
import WarningAlert from "../../../components/common/informativeAlerts/warningAlert";
import { postAddRoute } from "../../../services/encargadoCrServices/registrationRouteService";
import { useUserStore } from "../../../store/userStore";
import { getFormattedDateMexico } from "../../../utils/dateFormatting";
import styles from "./styles/RegistrationCR";

const { width, height } = Dimensions.get("window");

export default function RoutePartnerRegistrationCR() {
  const router = useRouter();
  const selectedUser = useUserStore((state) => state.selectedUser);

  // -------------------------------------------------------------- Variables de estado -------------------------------------------------------------

  //Variables Para almacenar los datos del formulario agregar Un Operador
  const [socio, setSocio] = useState("");
  const [nameOperador, setNameOperador] = useState("");
  const [numRuta, setNumRuta] = useState("");
  const [zona, setZona] = useState("");
  const [numLPS, setNumLPS] = useState(0);
  const [remisiones, setRemisiones] = useState(0);
  const [idOperador, setIdOperador] = useState("");

  //Variables para almacenar los registros de los operadores (Compartidos)
  const [registrosCompartidos, setRegistrosCompartidos] = useState({
    numero_ruta: "",
    tipo_ruta: "Compartida",
    categoria_ruta: null,
    lps_totales: 0,
    remisiones_totales: 0,
    fecha_registro: getFormattedDateMexico(),
    id_cr: null,
    id_usuario: null,
    operadores: [],
  });
  const [numTotalLPS, setNumTotalLPS] = useState(0);
  const [numTotalRemisiones, setNumTotalRemisiones] = useState(0);

  //Variable para almacenar los registros de los operadores (Unitarios)
  const [registros, setRegistros] = useState([]);
  const [summaryRoutes, setSummaryRoutes] = useState([]);
  const [operadoresTemp, setOperadoresTemp] = useState([]);

  //Variable para cambiar entre el formulario de ruta normal y compartida
  const [typeOfRoute, setTypeOfRoute] = useState("normal");

  //Variables para avanzar entre los pasos del formulario
  const [step, setStep] = useState(0);

  //Variable animacion del Stepper
  const fadeAnim = useRef(new Animated.Value(0)).current;

  {
    /*Variables para el DropDownPicker 
    
    open: Estado que indica si el menú desplegable está abierto o cerrado
    tipoRuta: Valor seleccionado en el menú desplegable
    items: Lista de opciones para el menú desplegable
    */
  }
  const [open, setOpen] = useState(false);
  const [tipoRuta, setTipoRuta] = useState(null);
  const [items, setItems] = useState([
    { label: "Local", value: "Local" },
    { label: "Foránea", value: "Foránea" },
  ]);

  //Variable del boton que se abilita cuando hay registros
  const [buttonNext, setButtonNext] = useState(true);

  // Variable para el modal de visualización de registros
  const [userModal, setuserModal] = useState(false);

  //Variable para el modal de agregar usuarios a ruta compartida
  const [modalAddUSers, setModalAddUsers] = useState(false);

  {
    /*Variablea para la alerta cuando agregas Operadores
    toastVisible: Estado que indica si la alerta está visible o no
    toastMessage: Mensaje que se mostrará en la alerta
    */
  }
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [storageData, setStorageData] = useState(null);

  //Variable para el modal de agregar usuarios

  // ----------------------------------------------------------- Logica de la pantalla -----------------------------------------------------------
  const resetForm = () => {
    setStep(0);
    setSocio("");
    setNumRuta("");
    setTipoRuta(null);
    setZona("");
    setNumLPS(0);
    setRemisiones(0);
    setRegistros([]);
    setSummaryRoutes([]);
    setRegistrosCompartidos({
      numero_ruta: "",
      tipo_ruta: "Compartida",
      categoria_ruta: null,
      lps_totales: 0,
      remisiones_totales: 0,
      fecha_registro: getFormattedDateMexico(),
      id_cr: null,
      id_usuario: null,
      operadores: [],
    });
    setButtonNext(true);
  };

  useFocusEffect(
    useCallback(() => {
      // Si ya completaste el proceso (step === 3) o la pantalla se está reenfocando, reinicia el formulario
      if (step === 3) {
        resetForm();
      }
    }, [step])
  );

  //Funcion para agregar operadores
  const addUnaryOperator = () => {
    // Validación de campos requeridos
    if (
      !tipoRuta ||
      !numRuta ||
      !zona ||
      !numLPS ||
      !remisiones ||
      !idOperador
    ) {
      Alert.alert(
        "Campos incompletos",
        "Por favor, completa todos los campos antes de registrar.",
        [{ text: "OK" }]
      );
      return;
    }

    // Validación de remisiones no mayores que LPS
    if (Number(remisiones) > Number(numLPS)) {
      Alert.alert(
        "Error en los datos",
        "El número de remisiones no puede ser mayor que el número de LPS.",
        [{ text: "OK" }]
      );
      return;
    }

    const datos = {
      categoria_ruta: tipoRuta,
      fecha_registro: getFormattedDateMexico(),
      id_cr: storageData.cr,
      id_usuario: storageData.id_usuario,
      lps_totales: Number(numLPS),
      numero_ruta: numRuta,
      remisiones_totales: Number(remisiones),
      tipo_ruta: "Unitaria",
      operadores: [
        {
          id_operador: idOperador,
          lps_asignados: Number(numLPS),
          remisiones_asignadas: Number(remisiones),
          zona: zona,
        },
      ],
    };

    setRegistros((prevRegistros) => {
      const nuevosRegistros = [...prevRegistros, datos];
      // Actualizamos el resumen: guardamos el nombre del operador, la ruta, lps, remisiones y la posición (índice)
      setSummaryRoutes((prevSummary) => [
        ...prevSummary,
        {
          index: nuevosRegistros.length - 1,
          nameOperador: nameOperador,
          numRuta: numRuta,
          lps: Number(numLPS),
          remisiones: Number(remisiones),
          tipo: "unitaria",
          socios: null,
        },
      ]);
      return nuevosRegistros;
    });

    setButtonNext(false);

    clearNormalForm();
    setToastMessage("Operador agregado correctamente");
    setToastVisible(true);
  };

  const clearNormalForm = () => {
    setSocio("");
    setNumRuta("");
    setTipoRuta("");
    setZona("");
    setNumLPS("");
    setRemisiones("");
  };

  const clearSharedForm = () => {
    setNumRuta("");
    setTipoRuta("");
    setNumTotalLPS("");
    setNumTotalRemisiones("");
    setRegistrosCompartidos({
      numero_ruta: "",
      tipo_ruta: "Compartida",
      categoria_ruta: null,
      lps_totales: 0,
      remisiones_totales: 0,
      fecha_registro: getFormattedDateMexico(),
      id_cr: null,
      id_usuario: null,
      operadores: [],
    });
  };

  const clearModalForm = () => {
    setSocio("");
    setZona("");
    setNumLPS("");
    setRemisiones("");
    setModalAddUsers(false);
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [step]);

  useEffect(() => {
    getAsyncStorage();
    if (selectedUser) {
      setSocio(selectedUser.nombre);
      setNameOperador(selectedUser.nombre);
      setIdOperador(selectedUser.id_persona);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (selectedUser && typeOfRoute === "rutaCompartida") {
      setSocio(selectedUser.nombre);
      setNameOperador(selectedUser.nombre);
      setIdOperador(selectedUser.id_persona);
      setModalAddUsers(true);

      // Opcional: limpiar para que no se vuelva a disparar
      useUserStore.getState().setSelectedUser(null);
    }
  }, [selectedUser, typeOfRoute]);

  const getAsyncStorage = async () => {
    try {
      const registros = await AsyncStorage.getItem("authData");
      if (registros) {
        const parsedData = JSON.parse(registros);
        setStorageData(parsedData);
        console.log("Registros en el storage:", parsedData);
      }
    } catch (error) {
      console.error("Error retrieving auth data:", error);
    }
  };

  const postServiceToAddRoute = async () => {
    try {
      const response = await postAddRoute(registros);
      console.log("Respuesta de la API:", response);
      nextStep();
    } catch (error) {
      console.error("Error posting route:", error);
    }
  };

  const cleanAfterNavigate = () => {};

  const form = () => {
    return (
      <>
        {/*Codigo de registros y boton para visualizarlos
         */}
        <View style={styles.containerSummar}>
          <View style={[styles.box, styles.box1]}>
            <Text>Registros: </Text>
          </View>
          <View style={[styles.box, styles.box2]}>
            <Text>{registros?.length}</Text>
          </View>
        </View>
        {/*Botones para seleccionar el tipo de ruta*/}
        <View style={styles.containerBtn}>
          <TouchableOpacity
            className={typeOfRoute === "normal" ? "bg-red-100" : "bg-gray-100"}
            style={[styles.button, styles.buttonLeft]}
            onPress={() => {
              setTypeOfRoute("normal");
              console.log("Profile pressed");
            }}
          >
            <Text
              style={styles.buttonText}
              className={
                typeOfRoute === "normal" ? "text-pink-800" : "text-gray-500"
              }
            >
              Ruta Normal
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={
              typeOfRoute === "rutaCompartida" ? "bg-red-100" : "bg-gray-100"
            }
            style={[styles.button, styles.buttonRight]}
            onPress={() => {
              useUserStore.getState().setSelectedUser(null);
              setSocio("");
              setNameOperador("");
              setIdOperador("");
              setTypeOfRoute("rutaCompartida");
              console.log("Settings pressed");
            }}
          >
            <Text
              style={styles.buttonText}
              className={
                typeOfRoute === "rutaCompartida"
                  ? "text-pink-800"
                  : "text-gray-500"
              }
            >
              Ruta Compartida
            </Text>
          </TouchableOpacity>
        </View>
        {/*Agregar rutas compartidas*/}
        {typeOfRoute === "rutaCompartida" ? sharedRouteForm() : null}
        {/*Formulario de registro*/}
        <ScrollView
          contentContainerStyle={styles.container}
          nestedScrollEnabled={true}
        >
          {typeOfRoute === "normal" ? normalRouteForm() : null}
        </ScrollView>
      </>
    );
  };

  const summary = () => {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.summaryContainer}>
            <Text style={styles.titleIm}>Resumen de registros</Text>
            {summaryRoutes.map((item, index) => (
              <View key={index} style={styles.card}>
                <Image
                  style={styles.profileImage}
                  source={
                    item.tipo === "compartida"
                      ? require("@/assets/images/rutaCompartida.png")
                      : require("@/assets/images/rutaUnitaria.png")
                  }
                />
                <View style={styles.textContainer}>
                  {/* Mostrar solo "Número de ruta" y su valor */}
                  <Text style={styles.name}>Ruta Núm {item.numRuta}</Text>
                  {/* Si es compartida se listan los nombres de los socios, de lo contrario se muestra el operador */}

                  {/* Al final se muestran LPS y remisiones */}
                  <Text style={styles.route}>Núm LPS: {item.lps} </Text>
                  <Text style={styles.route}>
                    Núm Remisiones: {item.remisiones}
                  </Text>
                </View>
              </View>
            ))}
          </View>
          <View>
            <TouchableOpacity
              style={{
                backgroundColor: "#D93958",
                padding: 16,
                borderRadius: 10,
                marginHorizontal: 16,
                marginTop: 16,
              }}
              onPress={() => postServiceToAddRoute()}
            >
              <Text
                style={{
                  color: "#fff",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                Realizar registro
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };

  const successfullPage = () => {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
        <View className="items-center">
          <Text className="text-3xl m-5 font-bold color-red-500">
            Registro exitoso
          </Text>
          <Image
            style={styles.logo}
            source={require("@/assets/images/SPB_Camion_Logo_Editable.png")}
          />
          <View className="ml-5">
            <Text className="text-xl font-bold">Registros realizados:</Text>
            <Text className="text-xl font-light">{registros.length}</Text>

            <Text className="text-xl font-bold">Rutas Asignadas</Text>
            <Text className="text-xl font-light">{registros.length}</Text>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: "#C64560",
              padding: 16,
              borderRadius: 10,
              marginTop: 20,
            }}
            onPress={() => resetForm()}
          >
            <Text
              style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}
            >
              Volver a registrar
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  //Funcion formulario de ruta normal
  const normalRouteForm = () => {
    return (
      <>
        <Text style={styles.label} className="font-semibold mb-1">
          Operador
        </Text>
        <View className="flex-row items-center w-full  ">
          <TextInput
            className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-full h-14 flex-1 px-3 py-2"
            editable={false}
            style={styles.input}
            placeholder="Ingresa el nombre del socio"
            value={socio}
            onChangeText={(text) => setSocio(text)}
          />
          <TouchableOpacity
            style={styles.buttonSearch}
            className="p-2.5 ml-2 text-sm font-medium text-white  rounded-lg border border-red-400 "
            accessibilityLabel="Search"
            onPress={() => {
              router.push("/encargadoCR/addQuickReport/Users");
            }}
          >
            <Svg
              width={45}
              height={20}
              viewBox="0 0 20 20"
              fill="none"
              className="w-4 h-4"
            >
              <Path
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                stroke="white"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </Svg>
            <Text className="sr-only">Search</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.label} className="font-semibold mb-1">
          Número de Ruta
        </Text>
        <TextInput
          className="bg-gray-50  border border-gray-300 text-gray-900 text-md rounded-xl h-14 w-full px-3"
          style={styles.input}
          placeholder="Ingresa el número de ruta"
          value={numRuta}
          onChangeText={(text) => setNumRuta(text)}
          keyboardType="number-pad"
        />
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

        <Text style={styles.label} className="font-semibold mb-1">
          Zona
        </Text>
        <TextInput
          className="bg-gray-50  border border-gray-300 text-gray-900 text-md rounded-xl h-14 w-full px-3 py-2"
          style={styles.input}
          placeholder="Ingresa la zona"
          value={zona}
          onChangeText={(text) => setZona(text)}
        />
        <Text style={styles.label} className="font-semibold mb-1">
          Número de LPS
        </Text>
        <TextInput
          className="bg-gray-50  border border-gray-300 text-gray-900 text-md rounded-xl h-14 w-full px-3"
          style={styles.input}
          placeholder="Ingresa el número de LPS"
          value={numLPS}
          onChangeText={(text) => setNumLPS(text)}
          keyboardType="number-pad"
        />
        <Text style={styles.label} className="font-semibold mb-1">
          Remisiones
        </Text>
        <TextInput
          className="bg-gray-50  border border-gray-300 text-gray-900 text-md rounded-xl h-14 w-full px-3"
          style={styles.input}
          placeholder="Ingresa las remisiones"
          value={remisiones}
          onChangeText={(text) => setRemisiones(text)}
          keyboardType="number-pad"
        />

        <View>
          <TouchableOpacity
            className=" p-4 rounded-xl mt-8 "
            style={{ backgroundColor: "#D93958" }}
            onPress={addUnaryOperator}
          >
            <Text className="text-white text-center font-bold ">Registrar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className=" p-4 rounded-xl mt-4 "
            style={{ backgroundColor: buttonNext ? "#D3D3D3" : "#C64560" }}
            onPress={() => nextStep()}
            disabled={buttonNext}
          >
            <Text className="text-white text-center font-bold">Siguiente</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  //Funcion formulario de ruta compartida
  const sharedRouteForm = () => {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0} // Ajusta si tienes un header o navBar
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              padding: 10,
              paddingBottom: 400,
            }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.container}>
              <Text style={styles.label} className="font-semibold">
                Número de Ruta
              </Text>
              <TextInput
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-xl h-14 w-full px-3"
                style={styles.input}
                placeholder="Ingresa el número de ruta"
                value={numRuta}
                onChangeText={(text) => setNumRuta(text)}
                keyboardType="number-pad"
              />
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

              <Text style={styles.label} className="font-semibold">
                Numero Total de LPS
              </Text>
              <TextInput
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-xl h-14 w-full px-3"
                style={styles.input}
                placeholder="Ingresa el número total de LPS"
                value={numTotalLPS}
                onChangeText={(text) => setNumTotalLPS(text)}
                keyboardType="number-pad"
              />
              <Text style={styles.label} className="font-semibold">
                Remisiones Totales
              </Text>
              <TextInput
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-xl h-14 w-full px-3"
                style={styles.input}
                placeholder="Ingresa el número total de remisiones"
                value={numTotalRemisiones}
                onChangeText={(text) => setNumTotalRemisiones(text)}
                keyboardType="number-pad"
              />

              <TouchableOpacity
                style={styles.buttonAddMore}
                onPress={abrirModalRutaCompartida}
              >
                <View style={styles.contentAddMore}>
                  <Svg
                    width={26}
                    height={26}
                    viewBox="0 0 24 24"
                    fill="white"
                    style={styles.svg}
                  >
                    <Path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                    />
                  </Svg>
                  <Text style={styles.buttonTextAddMore}>Agregar Socio</Text>
                </View>
              </TouchableOpacity>
              {/*Apartado para pintar a los Operadores que compartiran la Ruta*/}
              <View className="mt-6">
                {registrosCompartidos.operadores.length == 0 ? (
                  <WarningAlert message="Aqui se enlistaran los operadores que compartiran ruta y debes agregar al menos 2 operadores para poder reguistrar una ruta compartida" />
                ) : (
                  <>
                    <Text className="text-xl font-semibold">Operadores</Text>
                    <View>{UserList(operadoresTemp)}</View>
                  </>
                )}
              </View>
              {/*Boton para enviar los datos de la ruta compartida*/}
              {registrosCompartidos.operadores.length >= 2 ? (
                <TouchableOpacity
                  className=" p-4 rounded-xl mt-8 "
                  style={{ backgroundColor: "#D93958" }}
                  onPress={addOperadores}
                >
                  <Text className="text-white text-center font-bold ">
                    Realizar registro
                  </Text>
                </TouchableOpacity>
              ) : (
                <></>
              )}
              {registros.length > 0 ? (
                <TouchableOpacity
                  className=" p-4 rounded-xl mt-4 "
                  style={{ backgroundColor: "#C64560" }}
                  onPress={() => nextStep()}
                >
                  <Text className="text-white text-center font-bold">
                    Siguiente
                  </Text>
                </TouchableOpacity>
              ) : (
                <></>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    );
  };

  const navigateToUserList = () => {
    router.push("/encargadoCR/addQuickReport/Users");
    setModalAddUsers(false);
  };

  const getInitials = (nombre) => {
    if (!nombre) return "";
    const parts = nombre.split(" ");
    if (parts.length >= 2) {
      // Toma las primeras 2 letras del primer elemento y del último
      return (
        parts[0].slice(0, 1).toUpperCase() +
        parts[parts.length - 1].slice(0, 1).toUpperCase()
      );
    } else {
      return nombre.slice(0, 2).toUpperCase();
    }
  };

  const UserList = (dataRoutes) => {
    return (
      <View className="mx-4 mt-1">
        <View className="mt-4">
          {dataRoutes?.map((item, index) => (
            <View key={index} className="flex-row items-center py-3">
              {/* Círculo con las iniciales */}
              <View
                className="bg-gray-200 w-14 h-14 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#D0C9C9" }}
              >
                <Text className="text-black font-bold text-xl">
                  {getInitials(item.nombre)}
                </Text>
              </View>
              {/* Información del usuario */}
              <View className="flex-1 min-w-0 ml-4">
                <Text className="text-md font-medium text-black truncate">
                  {item.nombre}
                </Text>
                {/* Sección modificada para Núm Lps */}
                <View className="flex-row justify-between items-center">
                  <Text className="text-md text-gray-500">Número de Lps</Text>
                  <Text className="text-md text-gray-500">
                    {item.lps_asignados}
                  </Text>
                </View>
                <View className="flex-row justify-between items-center">
                  <Text className="text-md text-gray-500">
                    Núm de remisiones:
                  </Text>
                  <Text className="text-md text-gray-500">
                    {item.remisiones_asignadas}
                  </Text>
                </View>
                <View className="flex-row justify-between items-center mt-2">
                  <Text className="text-md text-gray-500">Zona</Text>
                  <Text className="text-md text-gray-500 ">{item.zona}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const modalToAddSharedUsers = () => {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0} // Ajusta si tienes un header o navBar
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, padding: 16 }}
            keyboardShouldPersistTaps="handled"
          >
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalAddUSers}
              onRequestClose={() => {
                setModalAddUsers(false);
              }}
            >
              <View style={styles.modalContainer} className="mt-40">
                <View style={styles.modalView}>
                  <View className="flex-row justify-between items-center rounded-full w-full mb-9">
                    <Text className="text-left font-semibold text-2xl">
                      Ruta Compartida
                    </Text>
                    <TouchableOpacity onPress={() => setModalAddUsers(false)}>
                      <Svg
                        width={25}
                        height={25}
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <Path
                          d="M4 4L16 16M16 4L4 16"
                          stroke="black"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </Svg>
                    </TouchableOpacity>
                  </View>
                  <SafeAreaView style={{ flex: 1 }}>
                    <ScrollView style={{ width: width * 0.8 }}>
                      <Text style={styles.label} className="font-semibold mb-1">
                        Operador
                      </Text>
                      <View className="flex-row items-center w-full  ">
                        <TextInput
                          className="bg-white border border-gray-300 text-gray-900 text-md rounded-full h-14 flex-1 px-3 py-2"
                          editable={false}
                          style={styles.input}
                          placeholder="Ingresa el nombre del socio"
                          value={socio}
                          onChangeText={(text) => setSocio(text)}
                        />
                        <TouchableOpacity
                          style={styles.buttonSearch}
                          className="p-2.5 ml-2 text-sm font-medium text-white  rounded-lg border border-red-400 "
                          accessibilityLabel="Search"
                          onPress={() => {
                            navigateToUserList();
                          }}
                        >
                          <Svg
                            width={45}
                            height={20}
                            viewBox="0 0 20 20"
                            fill="none"
                            className="w-4 h-4"
                          >
                            <Path
                              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                              stroke="white"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                            />
                          </Svg>
                          <Text className="sr-only">Search</Text>
                        </TouchableOpacity>
                      </View>

                      <Text style={styles.label} className="font-semibold">
                        Zona
                      </Text>
                      <TextInput
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-xl h-14 w-full px-3"
                        style={styles.input}
                        placeholder="Ingresa la zona"
                        value={zona}
                        onChangeText={(text) => setZona(text)}
                      />
                      <Text style={styles.label} className="font-semibold">
                        Número de LPS
                      </Text>
                      <TextInput
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-xl h-14 w-full px-3"
                        style={styles.input}
                        placeholder="Ingresa el número de LPS"
                        value={numLPS}
                        onChangeText={(text) => setNumLPS(text)}
                        keyboardType="number-pad"
                      />
                      <Text style={styles.label} className="font-semibold">
                        Remisiones
                      </Text>
                      <TextInput
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-xl h-14 w-full px-3"
                        style={styles.input}
                        placeholder="Ingresa las remisiones"
                        value={remisiones}
                        onChangeText={(text) => setRemisiones(text)}
                        keyboardType="number-pad"
                      />

                      <View>
                        <TouchableOpacity
                          className=" p-4 rounded-xl mt-8 "
                          style={{ backgroundColor: "#D93958" }}
                          onPress={agregarOperadorARutaCompartida}
                        >
                          <Text className="text-white text-center font-bold ">
                            Agregar
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </ScrollView>
                  </SafeAreaView>
                </View>
              </View>
            </Modal>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    );
  };

  const abrirModalRutaCompartida = () => {
    if (registrosCompartidos.operadores.length === 0) {
      setRegistrosCompartidos({
        numero_ruta: numRuta,
        tipo_ruta: "Compartida",
        categoria_ruta: tipoRuta,
        lps_totales: Number(numTotalLPS),
        remisiones_totales: Number(numTotalRemisiones),
        fecha_registro: getFormattedDateMexico(),
        id_cr: storageData?.cr,
        id_usuario: storageData?.id_usuario,
        operadores: [],
      });
    }
    console.log("Ruta compartida:", registrosCompartidos);

    setModalAddUsers(true);
  };

  const agregarOperadorARutaCompartida = () => {
    const operador = {
      id_operador: idOperador,
      zona: zona,
      lps_asignados: Number(numLPS),
      remisiones_asignadas: Number(remisiones),
    };

    const operadoresTemporales = {
      id_operador: idOperador,
      zona: zona,
      lps_asignados: Number(numLPS),
      remisiones_asignadas: Number(remisiones),
      nombre: nameOperador,
    };

    setOperadoresTemp((prev) => [...prev, operadoresTemporales]);

    setRegistrosCompartidos((prev) => ({
      ...prev,
      operadores: [...prev.operadores, operador],
    }));

    console.log("Operadores info:", operadoresTemp);

    clearModalForm();
    setToastMessage("Operador agregado a ruta compartida correctamente");
    setToastVisible(true);
  };

  const addOperadores = () => {
    setRegistros((prev) => {
      const nuevosRegistros = [...prev, registrosCompartidos];
      // Actualizamos el resumen para la ruta compartida
      setSummaryRoutes((prevSummary) => [
        ...prevSummary,
        {
          index: nuevosRegistros.length - 1,
          nameOperador: nameOperador,
          numRuta: numRuta,
          lps: Number(numTotalLPS),
          remisiones: Number(numTotalRemisiones),
          tipo: "compartida",
          socios: registrosCompartidos.operadores, // Arreglo con los socios que comparten la ruta
        },
      ]);
      return nuevosRegistros;
    });
    clearSharedForm();
  };
  const nextStep = () => {
    fadeAnim.setValue(0);
    setStep((prevStep) => prevStep + 1);
  };

  const renderStepContent = () => {
    if (step === 0) return form();
    if (step === 1) return summary();
    return successfullPage();
  };

  return (
    <>
      <View
        style={{ backgroundColor: "#C64560" }}
        className="flex flex-row content-center items-center justify-center text-color-white"
      >
        <Text style={styles.headerText}>Registró Operador - Ruta</Text>
      </View>
      <View style={styles.headerContainer}>
        {toastVisible ? (
          <ToastSuccess
            message={toastMessage}
            onClose={() => setToastVisible(false)}
          />
        ) : null}

        <Stepper currentStep={step} />
      </View>
      {modalToAddSharedUsers()}
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        {renderStepContent()}
      </Animated.View>
    </>
  );
}
