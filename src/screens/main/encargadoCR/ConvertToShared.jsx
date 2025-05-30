import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";

import { useEffect, useState } from "react";
import { useContext } from "react";
import User from "../../../components/common/User";
import { Svg, Path, Use } from "react-native-svg";
import BadgeGroup from "../../../components/common/BadgeGroup";
import { capitalizeEachWord } from "../../../utils/textUtils";

import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { extractNumRuta } from "../../../utils/textUtils";
import { useUserToAddToSharedRouteStore } from "../../../store/userStore";
import UsersList from "../../../components/common/UsersList";
import { postConvertSharedRoute } from "../../../services/encargadoCrServices/registrationRouteService";

const { width, height } = Dimensions.get("window");

const ConvertToShared = () => {
  const { data } = useLocalSearchParams();
  const dataRoute = JSON.parse(data);
  const router = useRouter();
  const selectedUser = useUserToAddToSharedRouteStore(
    (state) => state.selectedUser
  );

  const [lpsTotales, setLpsTotales] = useState(0);
  const [remisionesTotales, setRemisionesTotales] = useState(0);
  const [zona, setZona] = useState("");
  const [numeroLps, setNumeroLps] = useState(0);
  const [remisiones, setRemisiones] = useState(0);
  const [nameOperador, setNameOperador] = useState("");
  const [numRuta, setNumRuta] = useState("");
  const [categoriaRuta, setCategoriaRuta] = useState("");
  const [modalAddUSers, setModalAddUsers] = useState(false);

  const [usuariosCompartidos, setUsuariosCompartidos] = useState([]);

  //Variables Para Datos de cada nuevo operador
  const [nombre, setNombre] = useState("");
  const [lpsAsignados, setLpsAsignados] = useState(0);
  const [remisionesAsignadas, setRemisionesAsignadas] = useState(0);
  const [zonaOperador, setZonaOperador] = useState("");

  //Nuevos operadores
  const [newOperador, setNewOperador] = useState({
    idRuta: null,
    lpsTotales: 0,
    remisionesTotales: 0,
    idRutaOperador: null,
    zonaRutaOperadorActual: "",
    lpsRutaOperadorActual: 0,
    remisionesRutaOperadorActual: 0,
    operadoresData: [],
  });

  //Variables operador actual
  const [idRutaOperador, setIdRutaOperador] = useState(0);
  const [zonaOperadorActual, setZonaOperadorActual] = useState("");
  const [lpsAsignadosActual, setLpsAsignadosActual] = useState(0);
  const [remisionesAsignadasActual, setRemisionesAsignadasActual] = useState(0);

  useEffect(() => {
    //console.log("Data de la ruta:", dataRoute);
    //console.log("id general ruta", dataRoute[0].id_ruta);
    console.log("Usuario desde lista para add to shared route:", selectedUser);

    setLpsTotales(dataRoute[0].lps_totales);
    setRemisionesTotales(dataRoute[0].remisiones_totales);
    setZona(dataRoute[0].zona);
    setNumeroLps(dataRoute[0].lps_asignados);
    setRemisiones(dataRoute[0].remisiones_asignadas);
    setNameOperador(dataRoute[0].nombre);
    setNumRuta(dataRoute[0].numero_ruta);
    setCategoriaRuta(dataRoute[0].categoria_ruta);
    setNombre(selectedUser?.nombre);

    //Asignacion de datos del operador actual
    setIdRutaOperador(dataRoute[0].id_ruta_operador);
    setZonaOperadorActual(dataRoute[0].zona);
    setLpsAsignadosActual(dataRoute[0].lps_asignados);
    setRemisionesAsignadasActual(dataRoute[0].remisiones_asignadas);
  }, []);

  useEffect(() => {
    setNombre(selectedUser?.nombre);
  }, [selectedUser]);

  const clearVariables = () => {
    setNombre("");
    setZonaOperador("");
    setLpsAsignados(0);
    setRemisionesAsignadas(0);
  };

  useEffect(() => {}, [newOperador]);

  const handleAddSharedUser = () => {
    if (selectedUser) {
      const existe = usuariosCompartidos.some(
        (u) => u.id_persona === selectedUser.id_persona
      );
      if (!existe) {
        const nuevoOperador = {
          ...selectedUser, // Incluye todos los campos del selectedUser
          zona: zonaOperador,
          lps_asignados: Number(lpsAsignados),
          remisiones_asignadas: Number(remisionesAsignadas),
        };
        setUsuariosCompartidos([...usuariosCompartidos, nuevoOperador]);

        setNewOperador((prev) => ({
          ...prev,
          idRuta: dataRoute[0].id_ruta,
          lpsTotales: Number(lpsTotales),
          remisionesTotales: Number(remisionesTotales),
          idRutaOperador: idRutaOperador,
          zonaRutaOperadorActual: zonaOperadorActual,
          lpsRutaOperadorActual: Number(lpsAsignadosActual),
          remisionesRutaOperadorActual: Number(remisionesAsignadasActual),
          operadoresData: [
            ...prev.operadoresData,
            {
              id_operador: selectedUser?.id_persona,
              zona: zonaOperador,
              lps_asignados: Number(lpsAsignados),
              remisiones_asignadas: Number(remisionesAsignadas),
            },
          ],
        }));

        console.log("Nuevo operador agregado:", newOperador);

        clearVariables();
      }
    }
    setModalAddUsers(false);
  };

  const headerToScreen = () => {
    return (
      <View
        className="flex flex-row  "
        style={{
          backgroundColor: "#C64560",
          transparent: 90,
          borderColor: "#D0C9C9",
          padding: 10,
        }}
      >
        <View
          className="h-24 w-24 rounded-full justify-center items-center"
          style={{
            backgroundColor: "white",
            borderColor: "#D0C9C9",
            borderWidth: 1,
          }}
        >
          <Text
            className="font-bold text-5xl mt-2 text-center "
            style={{ color: "#D0C9C9" }}
          >
            {extractNumRuta(numRuta)}
          </Text>
        </View>
        <View className="" style={{ width: width - 100 }}>
          <View className="flex ">
            <Text className="font-extrabold text-white text-3xl mx-2  mt-3">
              Ruta {numRuta}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const generalData = () => {
    return (
      <>
        <View className="mt-2">
          <BadgeGroup
            items={[
              { label: "León", color: "green" },
              { label: categoriaRuta ?? "", color: "red" },
            ]}
          />

          <View
            className="flex flex-row justify-between items-center w-full mt-4"
            style={{
              backgroundColor: "white",
              transparent: 90,
              borderColor: "#D0C9C9",
              padding: 10,
            }}
          >
            <Text className="font-bold text-xl text-center text-slate-600 ">
              Datos Generales
            </Text>
          </View>
          <View className="bg-gray-200 h-0.5 mx-4 "></View>
          <View className="mx-6 ">
            <Text style={styles.label} className="font-medium">
              Numero Total de LPS
            </Text>
            <TextInput
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-xl h-14 w-full px-3"
              style={styles.input}
              placeholder="Ingresa el número total de LPS"
              keyboardType="number-pad"
              value={lpsTotales.toString()}
              onChangeText={(text) => setLpsTotales(text)}
            />
            <Text style={styles.label} className="font-medium">
              Remisiones Totales
            </Text>
            <TextInput
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-xl h-14 w-full px-3"
              style={styles.input}
              placeholder="Ingresa el número total de remisiones"
              keyboardType="number-pad"
              value={remisionesTotales.toString()}
              onChangeText={(text) => setRemisionesTotales(text)}
            />
          </View>
        </View>
      </>
    );
  };

  const currentOperatorInformation = () => {
    return (
      <>
        <View
          className="flex flex-row justify-between items-center w-full"
          style={{
            backgroundColor: "white",
            transparent: 90,
            borderColor: "#D0C9C9",
            padding: 10,
          }}
        >
          <Text className="font-bold text-xl text-center text-slate-600 ">
            Operador Actual
          </Text>
        </View>
        <View className="bg-gray-200 h-0.5 mx-4 "></View>

        <View>
          <User dataRoutes={dataRoute}></User>
        </View>
        <View className="mx-6 mt-1">
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
            keyboardType="number-pad"
            value={numeroLps.toString()}
            onChangeText={(text) => setNumeroLps(text)}
          />
          <Text style={styles.label} className="font-semibold">
            Remisiones
          </Text>
          <TextInput
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-xl h-14 w-full px-3"
            style={styles.input}
            placeholder="Ingresa las remisiones"
            keyboardType="number-pad"
            value={remisiones.toString()}
            onChangeText={(text) => setRemisiones(text)}
          />
        </View>
      </>
    );
  };

  const listOperators = () => {
    return <View className="mx-4 mt-1"></View>;
  };

  const addAndListOperators = () => {
    return (
      <View className="mx-6 mt-1">
        <TouchableOpacity
          style={styles.buttonAddMore}
          onPress={() => setModalAddUsers(true)}
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
            <Text style={styles.buttonTextAddMore}>Agregar Operadores</Text>
          </View>
        </TouchableOpacity>
        <View>
          <UsersList dataRoutes={usuariosCompartidos}></UsersList>
          <TouchableOpacity
            style={styles.buttonAddMore}
            onPress={() => toSharedRoute()}
          >
            <View style={styles.contentAddMore}>
              <Text style={styles.buttonTextAddMore}>Convertir</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const navigateToUserList = () => {
    router.push("/encargadoCR/home/UsersToAddToSharedRoute");
    setModalAddUsers(false);
  };

  const toSharedRoute = async () => {
    try {
      const response = await postConvertSharedRoute(newOperador);
      console.log("Ruta compartida creada con éxito:", response);
      router.replace("/encargadoCR/home/Index");
    } catch (error) {
      console.error("Error al convertir a ruta compartida:", error);
    }
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
                          value={nombre}
                          onChangeText={(text) => setNombre(text)}
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
                        value={zonaOperador}
                        onChangeText={(text) => setZonaOperador(text)}
                      />
                      <Text style={styles.label} className="font-semibold">
                        Número de LPS
                      </Text>
                      <TextInput
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-xl h-14 w-full px-3"
                        style={styles.input}
                        placeholder="Ingresa el número de LPS"
                        keyboardType="number-pad"
                        value={lpsAsignados}
                        onChangeText={(text) => setLpsAsignados(text)}
                      />
                      <Text style={styles.label} className="font-semibold">
                        Remisiones
                      </Text>
                      <TextInput
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-xl h-14 w-full px-3"
                        style={styles.input}
                        placeholder="Ingresa las remisiones"
                        keyboardType="number-pad"
                        value={remisionesAsignadas}
                        onChangeText={(text) => setRemisionesAsignadas(text)}
                      />

                      <View>
                        <TouchableOpacity
                          className=" p-4 rounded-xl mt-8 "
                          style={{ backgroundColor: "#D93958" }}
                          onPress={() => handleAddSharedUser()}
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

  return (
    <>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <View
            className="p-4 w-full justify-center text-center"
            style={styles.title}
          >
            <Text
              style={styles.text}
              className="text-lg text-white text-center"
            >
              Convertir a Ruta Compartida
            </Text>
          </View>
          <ScrollView
            contentContainerStyle={{ paddingBottom: 400 }}
            style={{ height: height }}
          >
            <View>
              <View>{headerToScreen()}</View>
              <View className="bg-gray-200 h-0.5 mx-9"></View>
              <View
                className=" h-2  "
                style={{ backgroundColor: "#D93958" }}
              ></View>

              <View>{generalData()}</View>
              <View>{currentOperatorInformation()}</View>
              <View>{listOperators()}</View>
            </View>
            <View>{addAndListOperators()}</View>
          </ScrollView>
        </SafeAreaView>
      </SafeAreaProvider>
      {modalToAddSharedUsers()}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    backgroundColor: "#C64560",
  },
  label: {
    fontSize: 14,
    marginTop: 12,
    fontWeight: "400",
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    marginTop: 4,
    borderRadius: 10,
  },
  buttonAddMore: {
    backgroundColor: "#D93958",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  contentAddMore: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 10,
  },
  buttonTextAddMore: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  svg: {
    marginRight: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: width,
    height: height,
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    padding: 16,
    marginBottom: 15,
    textAlign: "center",
  },
  buttonSearch: {
    backgroundColor: "#D93958",
  },
});

export default ConvertToShared;
