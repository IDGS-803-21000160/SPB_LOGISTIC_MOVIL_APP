import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../../src/context/AuthContext";
import { getRouteOperador } from "../../../services/operadorServices/dataConsultsServices.js";
import { getFormattedDateMexico } from "../../../utils/dateFormatting.js";
import { colorForStatus, getRutaStatusText } from "../../../utils/textUtils";

const { width, height } = Dimensions.get("window");

const RoutesOperador = ({ routeDetailPath }) => {
  const { userData, logout } = useAuth();
  const { width, height } = Dimensions.get("window");
  const router = useRouter();

  //variables
  const [routes, setRoutes] = useState([]);
  const [dataStorage, setDataStorage] = useState(null);

  const getRoutes = async () => {
    if (!userData) {
      console.error("No user data available");
      return;
    } else {
      //console.log("data usuario", userData);
    }

    const idPersonaOperador = userData.detalles.id_persona;
    const fechaHoy = getFormattedDateMexico();

    setDataStorage(userData);

    try {
      const response = await getRouteOperador(idPersonaOperador, fechaHoy);
      if (response) {
        setRoutes(response[0]);
        console.log("🚀 Rutas obtenidas:", response[0]);
        // Aquí puedes manejar la respuesta, por ejemplo, guardarla en el estado
      } else {
        console.error("No se obtuvieron rutas");
      }
    } catch (error) {
      console.error("Error al obtener las rutas:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        if (userData) {
          await getRoutes();
        }
      };
      fetchData();
    }, [userData])
  );

  useEffect(() => {
    if (userData) {
      getRoutes();
    }
  }, [userData]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View className="mx-4 mt-4 flex flex-row justify-between">
          <Image
            source={require("../../../../assets/images/SPB_Letras_Logo_Editable.png")}
            style={{ width: 160, height: 30 }}
          />
          <View>
            <Text
              className="font-bold text-black text-md"
              style={{ color: "black" }}
            >
              Bienvenido
            </Text>
            <Text
              className="font-normal text-black text-sm text-center"
              style={{ color: "black" }}
            >
              {dataStorage?.detalles?.nombre}
            </Text>
          </View>
        </View>

        <Text className="font-bold text-2xl color-gray-600 m-4">
          Rutas Asignadas
        </Text>

        <View>
          {routes.length > 0 ? (
            routes.map((item) => (
              <View key={item.id_ruta}>
                <View className="w-full h-0.5 bg-gray-200 mx-5 mt-2" />
                <View className="flex flex-row mx-4 mt-4">
                  <View
                    className="h-20 w-20 rounded-full justify-center items-center"
                    style={{
                      backgroundColor: "white",
                      borderColor: "#D3D3D3",
                      borderWidth: 1,
                    }}
                  >
                    <Text
                      className="font-bold text-4xl text-center"
                      style={{ color: "#D0C9C9" }}
                    >
                      {item.numero_ruta.split("-")[2]}
                    </Text>
                  </View>
                  <View style={{ width: width - 100 }}>
                    <View className="flex flex-row justify-between">
                      <Text
                        className="font-bold text-black text-xl mx-2 mr-2"
                        style={{ color: "black" }}
                      >
                        {item.numero_ruta}
                      </Text>
                      <View
                        className={`bg-${colorForStatus(
                          item.estatus_ruta
                        )}-100 px-2 py-1 rounded-full`}
                      >
                        <Text
                          className={`text-${colorForStatus(
                            item.estatus_ruta
                          )}-800 `}
                        >
                          {getRutaStatusText(item.estatus_ruta)}{" "}
                        </Text>
                      </View>
                      <Text
                        className="font-light text-black text-md"
                        style={{ color: "black" }}
                      >
                        {item.categoria_ruta}
                      </Text>
                    </View>
                    <View className="flex flex-row justify-between">
                      <Text
                        className="font-normal text-black text-md mx-2 mr-2 mt-1"
                        style={{ color: "black" }}
                      >
                        Lps (paquetes)
                      </Text>
                      <Text
                        className="font-light text-black text-md"
                        style={{ color: "black" }}
                      >
                        {item.lps_totales}
                      </Text>
                    </View>
                    <View className="flex flex-row justify-between">
                      <Text
                        className="font-normal text-black text-md mx-2 mr-2 mt-1"
                        style={{ color: "black" }}
                      >
                        Remisiones
                      </Text>
                      <Text
                        className="font-light text-black text-md mt-1"
                        style={{ color: "black" }}
                      >
                        {item.remisiones_totales}
                      </Text>
                    </View>
                    {item.estatus_ruta === 4 ? (
                      <>
                        <View className="mt-6"></View>
                      </>
                    ) : (
                      <View className="mt-6" style={{ alignSelf: "flex-end" }}>
                        <TouchableOpacity
                          onPress={() =>
                            router.push({
                              pathname: routeDetailPath,
                              params: {
                                data: JSON.stringify(item.id_ruta_operador),
                              },
                            })
                          }
                        >
                          <Text
                            className="font-semibold text-lg text-center"
                            style={{ color: "#CD0000" }}
                          >
                            Ver Detalles de Ruta
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            ))
          ) : (
            <Text
              className="font-semibold text-black text-md text-center"
              style={{ color: "black" }}
            >
              No hay datos disponibles para hoy.
            </Text>
          )}
          {/* Aquí puedes agregar el contenido inicial de la pantalla */}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
});

export default RoutesOperador;
