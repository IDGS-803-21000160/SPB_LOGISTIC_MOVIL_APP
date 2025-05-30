import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  cambiarEstadoRutaService,
  getSummaryById,
  updateRutaOperadorService,
  updateRutaService,
} from "../../../services/encargadoCrServices/sumaryService";
import { useUserToReasingneStore } from "../../../store/userStore";

import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import Spinner from "../../../components/common/Spinner";
import UsersList from "../../../components/common/UsersList";
import { getFormattedDateMexico } from "../../../utils/dateFormatting";
const { width, height } = Dimensions.get("window");

const RouteDetails = ({ idRute }) => {
  const router = useRouter();
  const selectedUser = useUserToReasingneStore((state) => state.selectedUser);

  const [dataSummary, setDataSummary] = useState({});
  const [dataRoutes, setDataRoutes] = useState([]);
  const [modalEdit, setModalEdit] = useState(false);
  const [remisiones, setRemisiones] = useState("");
  const [lps, setLps] = useState("");
  const [zona, setZona] = useState("");
  const [idRutaOperador, setIdRutaOperador] = useState(0);
  const [idNewOperador, setIdNewOperador] = useState(0);
  const [idRutaUpdate, setIdRutaUpdate] = useState("");
  const [loading, setLoading] = useState(false);

  const getSummary = async () => {
    setLoading(true);
    try {
      const summary = await getSummaryById(idRute, getFormattedDateMexico());
      if (summary && summary.length > 0) {
        const routeData = summary[0];
        setDataSummary(routeData);
        setDataRoutes((prev) => [...prev, routeData]);
        console.log("Summary by id bb:", routeData);
      }
    } catch (error) {
      console.error("Error fetching summary by id:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSummary();
  }, []);

  useFocusEffect(
    useCallback(() => {
      console.log("Pantalla RouteDetails ganó el foco");

      getSummary();
    }, [])
  );

  useEffect(() => {
    console.log(idRutaOperador);

    if (selectedUser) {
      setIdNewOperador(selectedUser.id_persona);
      console.log("Selected User desde detalle:", selectedUser.id_persona);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (dataSummary) {
      // Se asegura de que dataSummary tenga los valores esperados
      setLps(dataSummary[0]?.lps_totales?.toString() || "");
      setRemisiones(dataSummary[0]?.remisiones_totales?.toString() || "");
      setZona(dataSummary[0]?.zona || "");
      setIdRutaOperador(dataSummary[0]?.id_ruta_operador || 0);
    }
  }, [dataSummary]);

  useEffect(() => {
    if (selectedUser) {
      Alert.alert(
        "Confirmación",
        `¿Estás seguro de que deseas reasignar la ruta al usuario ${selectedUser.nombre}?`,
        [
          {
            text: "Cancelar",
            onPress: () => {
              console.log("Reasignación cancelada");
              useUserToReasingneStore.getState().setSelectedUser(null);

              setIdNewOperador(0);
            },
            style: "cancel",
          },
          {
            text: "Reasignar",
            onPress: async () => {
              await handleUpdateRutaOperador(selectedUser.id_persona);
            },
          },
        ],
        { cancelable: false }
      );
    }
  }, [selectedUser]);

  const handleUpdateRutaOperador = async (idOperador) => {
    console.log("ID Ruta Operador:", idRutaOperador);
    console.log("ID Nuevo Operador:", idOperador);

    try {
      if (!idRutaOperador || !idOperador) {
        console.warn("ID de ruta u operador no válido");
        return;
      }

      const response = await updateRutaOperadorService(
        idRutaOperador,
        idOperador
      );
      console.log("Operador actualizado:", response);

      Alert.alert(
        "Éxito",
        "El operador de la ruta ha sido actualizado correctamente."
      );
      await getSummary();
      // Limpiar el usuario seleccionado
      useUserToReasingneStore.getState().setSelectedUser(null);
    } catch (error) {
      console.error("Error actualizando el operador de la ruta:", error);
      Alert.alert(
        "Error",
        "Hubo un problema al actualizar el operador de la ruta."
      );
    }
  };

  const extractNumRuta = (ruta) => {
    if (!ruta || typeof ruta !== "string") {
      console.warn("extractNumRuta recibió un valor inválido:", ruta);
      return null; // Devuelve null o un valor predeterminado si ruta es inválida
    }

    const numRuta = ruta.split("-");

    // Verificar que haya al menos 3 elementos en el array
    return numRuta.length > 2 ? numRuta[2] : null;
  };

  const handleUpdateRuta = async () => {
    const body = {
      lps: parseInt(lps),
      remisiones: parseInt(remisiones),
      zona: zona,
    };

    console.log("Body:", body);
    console.log("ID Ruta:", idRute);

    try {
      const response = await updateRutaService(idRute, body);
      console.log("Response:", response);
      setModalEdit(false);

      await getSummary();
    } catch (error) {
      console.error("Error updating ruta:", error);
    }
  };

  const modalToViewUsers = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalEdit}
        onRequestClose={() => {
          setModalEdit(false);
        }}
      >
        <View style={styles.modalContainer} className="mt-32">
          <View style={styles.modalView}>
            <View className="flex-row justify-between items-center rounded-full w-full mb-9">
              <Text className="text-left font-semibold text-2xl">
                Edición de Ruta
              </Text>
              <TouchableOpacity onPress={() => setModalEdit(false)}>
                <Svg width={25} height={25} viewBox="0 0 20 20" fill="none">
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
            <View className="flex w-full">
              <Text style={styles.label} className="font-semibold">
                Número de LPS
              </Text>
              <TextInput
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-xl h-14 w-full px-3 mb-4"
                style={styles.input}
                value={lps}
                placeholder="Ingresa el número de LPS"
                keyboardType="number-pad"
                onChangeText={setLps}
              />

              <Text style={styles.label} className="font-semibold mt-4">
                Número de Remisiones
              </Text>
              <TextInput
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-xl h-14 w-full px-3"
                style={styles.input}
                value={remisiones}
                placeholder="Ingresa el número de remisiones"
                keyboardType="number-pad"
                onChangeText={setRemisiones}
              />
              <Text style={styles.label} className="font-semibold">
                Zona
              </Text>
              <TextInput
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-xl h-14 w-full px-3 mb-4"
                style={styles.input}
                value={zona}
                placeholder="Ingresa el número de LPS"
                onChangeText={setZona}
              />
            </View>
            <View>
              <TouchableOpacity
                className=" p-4 rounded-xl mt-8 w-full "
                style={{ backgroundColor: "#C64560", width: width - 50 }}
                onPress={handleUpdateRuta}
              >
                <Text className="text-white text-center font-bold">
                  Guaradar Cambios
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const handleDeleteRuta = async () => {
    console.log("ID Ruta a eliminar:", idRute);

    try {
      // Llamar al servicio para cambiar el estado de la ruta
      const response = await cambiarEstadoRutaService(idRute, 5);
      console.log("Ruta eliminada:", response);

      // Refrescar los datos después de eliminar la ruta
      await getSummary();

      Alert.alert("Éxito", "La ruta ha sido eliminada correctamente.");
      router.back();
    } catch (error) {
      console.error("Error eliminando la ruta:", error);
      Alert.alert("Error", "Hubo un problema al eliminar la ruta.");
    }
  };

  const showAlert = () => {
    Alert.alert(
      "Eliminar Ruta",
      "¿Estás seguro de eliminar la ruta?",
      [
        {
          text: "Cancelar",
          onPress: () => console.log("Eliminación cancelada"),
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: handleDeleteRuta,
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <>
      {modalToViewUsers()}
      {loading ? (
        <Spinner /> // <-- tu spinner personalizado
      ) : (
        <SafeAreaProvider>
          <SafeAreaView style={styles.container}>
            <ScrollView
              contentContainerStyle={{ paddingBottom: 400 }}
              style={{ height: height }}
            >
              <View style={styles.container}>
                {/*Cabecera de la Ruta*/}
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
                    className="h-36 w-36 rounded-full justify-center items-center"
                    style={{
                      backgroundColor: "white",
                      borderColor: "#D0C9C9",
                      borderWidth: 1,
                    }}
                  >
                    <Text
                      className="font-bold text-6xl text-center "
                      style={{ color: "#D0C9C9" }}
                    >
                      {extractNumRuta(dataSummary[0]?.numero_ruta)}
                    </Text>
                  </View>
                  <View className="" style={{ width: width - 100 }}>
                    <View className="flex ">
                      <Text
                        className="font-extrabold text-black text-4xl mx-2 mr-2"
                        style={{ color: "white" }}
                      >
                        {dataSummary[0]?.numero_ruta}
                      </Text>
                    </View>
                    {dataRoutes[0]?.length >= 2 ? (
                      <>
                        <View>
                          <Text
                            className="font-normal text-black text-xl mx-2 mr-2 mt-4"
                            style={{ color: "white" }}
                          >
                            Ruta Compartida y Asignada a {dataRoutes[0].length}{" "}
                            Operadores
                          </Text>
                        </View>
                      </>
                    ) : (
                      <>
                        <View className="mt-4">
                          <Text
                            className="font-semibold text-black text-2xl mx-2 mr-2 mt-1"
                            style={{ color: "white" }}
                          >
                            Operador
                          </Text>
                        </View>
                        <View>
                          <Text
                            className="font-normal text-black text-xl mx-2 mr-2 mt-1"
                            style={{ color: "white" }}
                          >
                            {dataSummary[0]?.nombre}
                          </Text>
                        </View>
                      </>
                    )}
                  </View>
                </View>
                {/*Resumen Ruta, CR y Categoria de la ruta*/}
                <View className="flex flex-row mx-4 mt-5">
                  <View className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    <Text className="text-green-800">León</Text>
                  </View>
                  <View className="bg-red-100  text-red-800  text-xs font-medium px-2.5 py-0.5 rounded-full ml-3">
                    <Text className="text-red-800 ">
                      {dataSummary[0]?.categoria_ruta}
                    </Text>
                  </View>
                  <View className="bg-red-100  text-red-800  text-xs font-medium px-2.5 py-0.5 rounded-full ml-3">
                    <Text className="text-red-800 ">
                      {dataSummary[0]?.tipo_ruta}
                    </Text>
                  </View>
                </View>

                {/*Datos de la Ruta*/}
                <View className="" style={styles.card}>
                  <View className="ml-4 mt-5">
                    <Text className="font-bold text-black text-2xl mx-2 mr-2 mt-1">
                      Datos de la Ruta
                    </Text>
                  </View>
                  <View>
                    <View className=" mx-4 mt-5 flex flex-row justify-between">
                      <Text className="font-light text-black text-lg mx-2 mr-2 mt-1">
                        Numero de Ruta
                      </Text>
                      <Text className="font-semibold text-black text-xl mx-2 mr-2 mt-1">
                        {dataSummary[0]?.numero_ruta}
                      </Text>
                    </View>
                    <View className=" mx-4 mt-2 flex flex-row justify-between">
                      <Text className="font-light text-black text-lg mx-2 mr-2 mt-1">
                        Tipo de ruta
                      </Text>
                      <Text className="font-semibold text-black text-xl mx-2 mr-2 mt-1">
                        {dataSummary[0]?.categoria_ruta}
                      </Text>
                    </View>
                    <View className=" mx-4 mt-2 flex flex-row justify-between">
                      <Text className="font-light text-black text-lg mx-2 mr-2 mt-1">
                        Número de Lps
                      </Text>
                      <Text className="font-semibold text-black text-xl mx-2 mr-2 mt-1">
                        {dataSummary[0]?.lps_totales}
                      </Text>
                    </View>
                    <View className=" mx-4 mt-2 flex flex-row justify-between">
                      <Text className="font-light text-black text-lg mx-2 mr-2 mt-1">
                        Número de Remisiones
                      </Text>
                      <Text className="font-semibold text-black text-xl mx-2 mr-2 mt-1">
                        {dataSummary[0]?.remisiones_totales}
                      </Text>
                    </View>
                    {dataRoutes[0]?.length >= 2 ? (
                      <></>
                    ) : (
                      <>
                        <View className=" mx-4 mt-2 flex flex-row justify-between">
                          <Text className="font-light text-black text-lg mx-2 mr-2 mt-1">
                            Zona
                          </Text>
                          <Text className="font-semibold text-black text-xl mx-2 mr-2 mt-1">
                            {dataSummary[0]?.zona}
                          </Text>
                        </View>
                      </>
                    )}
                  </View>
                </View>
                {/*Acciones de la Ruta (Editar, convertir a compartida y eliminar)*/}
                <View>
                  <View className="flex flex-row ">
                    {dataRoutes[0]?.length == 1 ? (
                      <View>
                        {/*Boton de Editar Ruta*/}
                        <TouchableOpacity
                          className=" text-white font-bold py-2 px-4 rounded-full"
                          style={styles.actionButtons}
                          onPress={() => setModalEdit(true)}
                        >
                          <Svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="#AC3958"
                            className="size-6"
                            width={28}
                            height={28}
                          >
                            <Path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                            />
                          </Svg>
                        </TouchableOpacity>
                        <Text className="ml-4 mt-1 text-black text-sm">
                          Editar Ruta
                        </Text>
                      </View>
                    ) : (
                      <></>
                    )}

                    {/*Boton de Eliminar Ruta*/}
                    <View className="content-center items-center">
                      <TouchableOpacity
                        className=" text-white font-bold   rounded-full flex items-center justify-center content-center"
                        style={styles.actionButtonsEliminar}
                        onPress={() => showAlert()}
                      >
                        <Svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="#AC3958"
                          className="size-6"
                          width={28}
                          height={28}
                        >
                          <Path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </Svg>
                      </TouchableOpacity>
                      <Text className="ml-4 mt-1 text-black text-center text-sm">
                        Eliminar Ruta
                      </Text>
                    </View>

                    {dataRoutes[0]?.length >= 2 ? (
                      <></>
                    ) : (
                      <>
                        {/*Boton de Re asignar Rutas*/}
                        <View className="content-center items-center">
                          <TouchableOpacity
                            className=" text-white font-bold   rounded-full flex items-center justify-center content-center"
                            style={styles.actionButtonsEliminar}
                            onPress={() =>
                              router.push("/encargadoCR/home/UsersToReassign")
                            }
                          >
                            <Svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="2"
                              stroke="#AC3958"
                              className="size-6"
                              width={28}
                              height={28}
                            >
                              <Path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"
                              />
                            </Svg>
                          </TouchableOpacity>
                          <Text className="ml-4 mt-1 text-black text-center text-sm">
                            Reasignar Ruta
                          </Text>
                        </View>
                      </>
                    )}

                    {/*Boton de Convertir Rutas y Agregar operador*/}
                    {dataRoutes[0]?.length >= 2 ? (
                      <>
                        {/*Boton de Agregar Operador
                        <View className="content-center items-center">
                          <TouchableOpacity
                            className=" text-white font-bold   rounded-full flex items-center justify-center content-center"
                            style={styles.actionButtonsEliminar}
                            onPress={() => console.log(dataRoutes[0].length)}
                          >
                            <Svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="2"
                              stroke="#AC3958"
                              className="size-6"
                              width={28}
                              height={28}
                            >
                              <Path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
                              />
                            </Svg>
                          </TouchableOpacity>
                          <Text className="ml-4 mt-1 text-black text-center text-sm">
                            Agregar Operador
                          </Text>
                        </View>*/}
                      </>
                    ) : (
                      <>
                        <View className="content-center justify-center items-center">
                          <TouchableOpacity
                            className=" text-white font-bold py-2 px-4 rounded-full flex items-center justify-center content-center"
                            style={styles.actionButtons}
                            onPress={() =>
                              router.push({
                                pathname: "/encargadoCR/home/ToShared",
                                params: {
                                  data: JSON.stringify(dataSummary),
                                },
                              })
                            }
                          >
                            <Svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="2"
                              stroke="#AC3958"
                              className="size-6"
                              width={28}
                              height={28}
                            >
                              <Path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                              />
                            </Svg>
                          </TouchableOpacity>
                          <Text className="ml-4 mt-1 text-black text-center text-sm">
                            Convertir En
                          </Text>
                          <Text className="ml-4  text-black text-sm">
                            Ruta Compartida
                          </Text>
                        </View>
                      </>
                    )}
                  </View>
                </View>
                {/*si es compartida aqui se listan los operadores*/}
                <View className="mx-4 mt-5">
                  {dataRoutes[0]?.length >= 2 ? (
                    <>
                      <Text className="font-bold text-black text-2xl mx-2 mr-2 mt-1">
                        Operadores
                      </Text>
                      <UsersList dataRoutes={dataRoutes[0]}></UsersList>
                    </>
                  ) : (
                    <Text className="font-bold text-black text-2xl mx-2 mr-2 mt-1"></Text>
                  )}
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        </SafeAreaProvider>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  circle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
    marginHorizontal: "auto",
  },
  circleText: {
    color: "#D1D5DB",
    fontSize: 56,
  },
  infoContainer: {
    marginVertical: 20,
    marginHorizontal: 20,
  },
  nameText: {
    textAlign: "center",
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
  },
  routeText: {
    textAlign: "center",
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 24,
  },
  routeNumberText: {
    textAlign: "center",
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
  },
  containerSummary: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  card: {
    width: width - 10,
    height: height / 3.3,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000f",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginTop: 20,
    marginHorizontal: 5,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
  value: {
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 5,
  },
  actionButtons: {
    width: 50,
    height: 50,
    marginTop: 20,
    marginLeft: 15,
    backgroundColor: "white",
    borderColor: "#D0C9C9",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  actionButtonsEliminar: {
    width: 50,
    height: 50,
    marginTop: 20,
    marginLeft: 15,
    backgroundColor: "white",
    borderColor: "#D0C9C9",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
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
  label: {
    fontSize: 16,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    marginTop: 4,
    borderRadius: 10,
  },
});

export default RouteDetails;
