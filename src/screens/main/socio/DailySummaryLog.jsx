import React, { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { useAuth } from "../../../../src/context/AuthContext";

import { useRouter } from "expo-router";
import {
  getInfoOperador,
  getInfoOperadorandCR,
  getRouteOperador,
} from "../../../services/operadorServices/dataConsultsServices.js";
import { getFormattedDateMexico } from "../../../utils/dateFormatting.js";

const DailySummaryLog = () => {
  const router = useRouter();

  const [filteredData, setFilteredData] = useState([]);
  const [dataStorage, setDataStorage] = useState(null);
  const [dataRoute, setDataRoute] = useState(null);
  const [operadorData, setOperadorData] = useState(null);
  const [dataOperadorwhitCR, setDataOperadorwhitCR] = useState(null);

  //Variables de operador
  const [operador, setOperador] = useState(null);
  const [operadorId, setOperadorId] = useState(null);

  const { userData, logout } = useAuth();

  const CustomIcon = () => {
    return (
      <Svg viewBox="0 0 24 24" fill="white" width={24} height={24}>
        <Path
          fillRule="evenodd"
          d="M4.5 3.75a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V6.75a3 3 0 0 0-3-3h-15Zm4.125 3a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Zm-3.873 8.703a4.126 4.126 0 0 1 7.746 0 .75.75 0 0 1-.351.92 7.47 7.47 0 0 1-3.522.877 7.47 7.47 0 0 1-3.522-.877.75.75 0 0 1-.351-.92ZM15 8.25a.75.75 0 0 0 0 1.5h3.75a.75.75 0 0 0 0-1.5H15ZM14.25 12a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H15a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5h3.75a.75.75 0 0 0 0-1.5H15Z"
          clipRule="evenodd"
        />
      </Svg>
    );
  };

  const TruckIcon = () => {
    return (
      <View style={styles.icon}>
        <Svg viewBox="0 0 24 24" fill="#F0B255" width={18} height={18}>
          <Path
            fillRule="evenodd"
            d="M4 4a2 2 0 0 0-2 2v9a1 1 0 0 0 1 1h.535a3.5 3.5 0 1 0 6.93 0h3.07a3.5 3.5 0 1 0 6.93 0H21a1 1 0 0 0 1-1v-4a.999.999 0 0 0-.106-.447l-2-4A1 1 0 0 0 19 6h-5a2 2 0 0 0-2-2H4Zm14.192 11.59.016.02a1.5 1.5 0 1 1-.016-.021Zm-10 0 .016.02a1.5 1.5 0 1 1-.016-.021Zm5.806-5.572v-2.02h4.396l1 2.02h-5.396Z"
            clipRule="evenodd"
          />
        </Svg>
      </View>
    );
  };

  const BoxIcon = () => {
    return (
      <View style={styles.icon}>
        <Svg viewBox="0 0 24 24" fill="#F07E05" width={18} height={18}>
          <Path d="M12.013 6.175 7.006 9.369l5.007 3.194-5.007 3.193L2 12.545l5.006-3.193L2 6.175l5.006-3.194 5.007 3.194ZM6.981 17.806l5.006-3.193 5.006 3.193L11.987 21l-5.006-3.194Z" />
          <Path d="m12.013 12.545 5.006-3.194-5.006-3.176 4.98-3.194L22 6.175l-5.007 3.194L22 12.562l-5.007 3.194-4.98-3.211Z" />
        </Svg>
      </View>
    );
  };

  const HomeIcon = () => {
    return (
      <View style={styles.icon}>
        <Svg viewBox="0 0 24 24" fill="#4C693E" width={18} height={18}>
          <Path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
          <Path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
        </Svg>
      </View>
    );
  };

  const LocationIcon = () => {
    return (
      <View style={styles.icon}>
        <Svg
          viewBox="0 0 24 24"
          fill="#3E9358"
          width={18} // Puedes parametrizar o cambiar el tamaño según necesites
          height={18}
        >
          <Path
            fillRule="evenodd"
            d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
            clipRule="evenodd"
          />
        </Svg>
      </View>
    );
  };

  const MyThirdIcon = () => {
    return (
      <View style={styles.icon}>
        <Svg
          viewBox="0 0 24 24"
          fill="#068FC2"
          width={18} // Puedes parametrizar el tamaño mediante props
          height={18}
        >
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM6.262 6.072a8.25 8.25 0 1 0 10.562-.766 4.5 4.5 0 0 1-1.318 1.357L14.25 7.5l.165.33a.809.809 0 0 1-1.086 1.085l-.604-.302a1.125 1.125 0 0 0-1.298.21l-.132.131c-.439.44-.439 1.152 0 1.591l.296.296c.256.257.622.374.98.314l1.17-.195c.323-.054.654.036.905.245l1.33 1.108c.32.267.46.694.358 1.1a8.7 8.7 0 0 1-2.288 4.04l-.723.724a1.125 1.125 0 0 1-1.298.21l-.153-.076a1.125 1.125 0 0 1-.622-1.006v-1.089c0-.298-.119-.585-.33-.796l-1.347-1.347a1.125 1.125 0 0 1-.21-1.298L9.75 12l-1.64-1.64a6 6 0 0 1-1.676-3.257l-.172-1.03Z"
          />
        </Svg>
      </View>
    );
  };

  const StartRouteIcon = () => {
    return (
      <View
        style={{
          width: 45,
          height: 45,
          borderRadius: 25,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#47A882",
        }}
        className="bg-white"
      >
        <Svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="white"
          width={30}
          height={30}
        >
          <Path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
          />
        </Svg>
        );
      </View>
    );
  };

  const StartRouteIconNormal = () => {
    return (
      <View
        style={{
          left: 9,
          position: "absolute",
        }}
      >
        <Svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="white"
          width={30}
          height={30}
        >
          <Path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
          />
        </Svg>
      </View>
    );
  };

  const getAuthData = async () => {
    if (!userData?.detalles?.id_persona) {
      console.error("No hay userData válido");
      return;
    }

    const idPersona = userData.detalles.id_persona;
    const fecha = getFormattedDateMexico();

    console.log("fecha", fecha);

    setDataStorage(userData);
    setOperadorId(idPersona);

    try {
      const rutas = await getRouteOperador(idPersona, fecha);
      console.log("😀 data Route (antes de setState)", rutas[0] ?? null);
      console.log("🐶 filtered data (antes de setState)", rutas[0]);

      setDataRoute(rutas[0] ?? null);
      setFilteredData(rutas);

      const crResponse = await getInfoOperadorandCR(idPersona, fecha);
      console.log("🚀 cr (antes de setState)", crResponse);

      setDataOperadorwhitCR(crResponse);
    } catch (error) {
      console.error("Error en getAuthData:", error);
    }
  };

  useEffect(() => {
    if (userData) {
      getAuthData();
    }
  }, [userData]);

  const getOperadorData = async (id) => {
    try {
      const response = await getInfoOperador(id);
      console.log("Data Operador", response);
      return response.data;
    } catch (error) {
      console.error("Error fetching operador data:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (filteredData.length > 0) {
      const crQueRegistro = filteredData[0]?.cr_que_registro;

      if (crQueRegistro) {
        console.log(
          `ℹ️ Llamando a getOperadorData con cr_que_registro: ${crQueRegistro}`
        );

        getOperadorData(crQueRegistro)
          .then((data) => {
            setOperadorData(data);
            console.log("✅ Operador Data:", data);
          })
          .catch((error) =>
            console.error("❌ Error fetching operador data:", error)
          );
      }
    }
  }, [filteredData]);

  const assignmentInformation = () => {
    return (
      <>
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView>
            <View style={styles.containerAssignment}>
              <View className="mx-4 mt-4 flex flex-row justify-between">
                <Image
                  source={require("../../../../assets/images/logoW.png")}
                  style={{ width: 160, height: 30 }}
                />
                <View className="flex flex-col items-center">
                  <Text
                    className="font-bold text-white text-md"
                    style={{ color: "white" }}
                  >
                    Bienvenido
                  </Text>
                  <Text
                    className="font-normal text-white text-sm text-center"
                    style={{ color: "white" }}
                  >
                    {dataStorage
                      ? dataStorage.detalles.nombre
                      : "Usuario no identificado"}
                  </Text>
                </View>
              </View>
              {filteredData[0]?.length >= 1 &&
              dataRoute[0]?.estatus_ruta == 1 ? (
                <View className="mx-4 mb-4">
                  <Text className="mt-10 font-medium text-white text-lg">
                    Asignación realizada porel CR
                  </Text>
                  <View className="flex flex-row items-center mt-2">
                    {CustomIcon()}
                    <Text className="font-semibold text-white text-2xl ml-4">
                      {dataOperadorwhitCR?.crData[0]?.nombre}
                    </Text>
                  </View>
                </View>
              ) : (
                <Text></Text>
              )}
            </View>
            <View style={[styles.card, styles.cardOverlay]}>
              {filteredData[0]?.length &&
              dataRoute[0]?.estatus_ruta == 1 >= 1 ? (
                <>
                  <Text className="font-extrabold text-gray-500 text-2xl">
                    CR {dataOperadorwhitCR?.crData[0]?.nombre_corto}
                  </Text>

                  <View className="mt-3 flex flex-row items-center">
                    {TruckIcon()}
                    <Text className="font-bold text-black text-lg ml-4">
                      Ruta Asignada
                    </Text>
                    <Text
                      className="font-normal text-black text-xl"
                      style={{ right: 8, position: "absolute" }}
                    >
                      {dataRoute[0]?.numero_ruta}
                    </Text>
                  </View>

                  <View className="mt-2 flex flex-row items-center">
                    {BoxIcon()}
                    <Text className="font-bold text-black text-lg ml-4">
                      LPS Asignadas
                    </Text>
                    <Text
                      className="font-normal text-black text-xl"
                      style={{ right: 8, position: "absolute" }}
                    >
                      {dataRoute[0]?.lps_asignados}
                    </Text>
                  </View>
                  <View className="mt-2 flex flex-row items-center">
                    {HomeIcon()}
                    <Text className="font-bold text-black text-lg ml-4">
                      Remisiones
                    </Text>
                    <Text
                      className="font-normal text-black text-xl"
                      style={{ right: 8, position: "absolute" }}
                    >
                      {dataRoute[0]?.remisiones_asignadas}
                    </Text>
                  </View>
                  <View className="mt-2 flex flex-row items-center">
                    {LocationIcon()}
                    <Text className="font-bold text-black text-lg ml-4">
                      Tipo de Ruta
                    </Text>
                    <Text
                      className="font-normal text-black text-xl"
                      style={{ right: 8, position: "absolute" }}
                    >
                      {dataRoute[0]?.categoria_ruta}
                    </Text>
                  </View>
                  <View className="mt-2 flex flex-row items-center">
                    {MyThirdIcon()}
                    <Text className="font-bold text-black text-lg ml-4">
                      Zona
                    </Text>
                    <Text
                      className="font-normal text-black text-xl"
                      style={{ right: 8, position: "absolute" }}
                    >
                      {dataRoute[0]?.zona}
                    </Text>
                  </View>
                  <View>
                    <TouchableOpacity
                      className="mt-4"
                      style={{ right: 9, position: "absolute" }}
                    >
                      <Text
                        className="font-bold  text-xl"
                        style={{ color: "#C64560" }}
                      >
                        Ver Detalles
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <View className="flex aling-center items-center justify-center ">
                  <Text className="font-bold text-2xl text-center mt-20">
                    No hay ruta asignadas
                  </Text>
                </View>
              )}
            </View>
            {/*Boton de iniicar rutas*/}
            {filteredData[0]?.length >= 1 &&
            dataRoute[0]?.estatus_ruta === 1 ? (
              <View>
                <TouchableOpacity
                  className="flex flex-row items-center justify-center w-1/2  rounded-lg mx-4 p-3 mt-8"
                  style={{ backgroundColor: "#AC3958" }}
                  onPress={() =>
                    router.push({
                      pathname: "/operador/homeOp/startRouteOp",
                      params: {
                        data: JSON.stringify(filteredData),
                        crData: JSON.stringify(dataOperadorwhitCR.crData[0]),
                      },
                    })
                  }
                >
                  {StartRouteIconNormal()}
                  <Text className="font-normal text-xl text-center text-white ">
                    Iniciar Ruta
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <TouchableOpacity
                  className="flex flex-row items-center justify-center w-1/2  rounded-lg mx-4 p-3 mt-8"
                  style={{ backgroundColor: "#AC3958" }}
                  onPress={() => router.push("/operador/homeOp/findRoteOp")}
                >
                  {StartRouteIconNormal()}
                  <Text className="font-normal text-xl text-center text-white ">
                    Finalizar Ruta
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </>
    );
  };

  return <View style={styles.container}>{assignmentInformation()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },

  containerAssignment: {
    flex: 0.3,
    backgroundColor: "#C64560",
    height: 300,
  },
  card: {
    flex: 0.1,
    marginLeft: 10,
    marginRight: 10,
  },
  cardOverlay: {
    marginTop: -110,
    left: 0,
    height: 250,
    right: 0,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 10,
  },
  icon: {
    width: 23,
    height: 23,
    borderRadius: 25,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DailySummaryLog;
