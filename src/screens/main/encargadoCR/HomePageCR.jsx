import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { getSummaryByDateAndUser } from "../../../services/encargadoCrServices/sumaryService.js";
import getCityName from "../../../utils/crName.js";
import {
  formatDateToSpanishLong,
  getFormattedDateMexico,
} from "../../../utils/dateFormatting.js";

const { width, height } = Dimensions.get("window");

const HomePageCR = () => {
  const router = useRouter();

  const [dailySummary, setDailySummary] = useState([]);
  const [dataStorage, setDataStorage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  /** Recupera datos de usuario desde AsyncStorage */
  const getStorage = async () => {
    try {
      const raw = await AsyncStorage.getItem("authData");
      if (raw) {
        const user = JSON.parse(raw);
        setDataStorage(user);
      }
    } catch {
      setErrorMessage("No pudimos recuperar tus datos. Revisa tu conexión.");
    } finally {
      setIsLoading(false);
    }
  };

  /** Llama al servicio para obtener el resumen diario */
  const getOperatorSummary = async () => {
    if (!dataStorage) return;
    setErrorMessage(null);
    try {
      const summary = await getSummaryByDateAndUser(
        getFormattedDateMexico(),
        dataStorage.id_usuario
      );
      const today = getFormattedDateMexico();
      setDailySummary(
        summary.filter((i) => i.fecha_registro.split("T")[0] === today)
      );
    } catch {
      setErrorMessage("Error al obtener rutas. Por favor, reintenta.");
    }
  };

  useEffect(() => {
    getStorage();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!isLoading) getOperatorSummary();
    }, [isLoading, dataStorage])
  );

  // Pantalla de carga
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  // Pantalla de error
  if (errorMessage) {
    return (
      <View style={styles.centered}>
        <Image
          source={require("../../../../assets/images/SPB_Camion_Logo_Editable.png")}
          style={styles.errorIcon}
          resizeMode="contain"
        />
        <Text style={styles.errorText}>{errorMessage}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setErrorMessage(null);
            setIsLoading(true);
            getStorage();
          }}
        >
          <Text style={styles.retryText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Pantalla principal
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View>
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
                Con rutas Asignadas
              </Text>
              <Text
                className="font-normal text-black text-sm text-center"
                style={{ color: "black" }}
              >
                CR {getCityName(dataStorage?.detalles?.id_unico)}
              </Text>
            </View>
          </View>

          {/* Bienvenida */}
          <View className="mx-4 mt-4 mb-4">
            <Text
              className="font-bold text-black text-md"
              style={{ color: "black" }}
            >
              Bienvenido
            </Text>
            <Text
              className="font-normal text-black text-sm"
              style={{ color: "black" }}
            >
              {dataStorage?.detalles.nombre}
            </Text>
          </View>

          {/* Contenido desplazable */}
          <ScrollView
            contentContainerStyle={{ paddingBottom: 400 }}
            style={{ height }}
          >
            {/* Tarjeta resumen general */}
            <View style={styles.cardSummary} className="mt-4">
              <View className="flex flex-row justify-between">
                <Text className="font-bold text-white text-xl mt-2">
                  Resumen General de Rutas
                </Text>
                <View className="h-8 w-8 rounded-full bg-white" />
              </View>
              <View className="flex flex-row justify-between mt-4">
                <Text className="font-light text-white text-md text-center">
                  Rutas Asignadas
                </Text>
                <Text className="font-semibold text-white text-xl text-center">
                  {dailySummary.length}
                </Text>
              </View>
              <View className="flex flex-row justify-between mt-2">
                <Text className="font-light text-white text-md text-center">
                  Rutas Completadas
                </Text>
                <Text className="font-semibold text-white text-xl text-center">
                  {/* Aquí iría conteo completadas */}0
                </Text>
              </View>
              <View className="flex flex-row justify-between mt-2">
                <Text className="font-light text-white text-md text-center">
                  Rutas Pendientes
                </Text>
                <Text className="font-semibold text-white text-xl text-center">
                  {/* Aquí iría conteo pendientes */}0
                </Text>
              </View>
            </View>

            {/* Listado de rutas del día */}
            <View>
              <View className="flex flex-row justify-between">
                <Text
                  className="font-bold text-black text-2xl mb-4 ml-4 mt-4"
                  style={{ color: "black" }}
                >
                  Resumen de Rutas
                </Text>
                <Text className="font-light text-black ml-4 mt-5 mr-4">
                  {formatDateToSpanishLong(getFormattedDateMexico())}
                </Text>
              </View>

              {dailySummary.length > 0 ? (
                dailySummary.map((item) => (
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
                        <View
                          className="mt-6"
                          style={{ alignSelf: "flex-end" }}
                        >
                          <TouchableOpacity
                            onPress={() =>
                              router.push(`encargadoCR/home/${item.id_ruta}`)
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
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#F7F9FC",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  errorIcon: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#E9446A",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#E9446A",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
    fontSize: 16,
  },
  cardSummary: {
    width: width - 30,
    height: 170,
    backgroundColor: "#AC3958",
    borderRadius: 10,
    marginHorizontal: 15,
    marginVertical: 10,
    padding: 15,
  },
  cardSummaryAll: {
    width: width - 30,
    backgroundColor: "white",
    borderRadius: 10,
    marginHorizontal: 15,
    marginVertical: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginVertical: 10,
  },
  itemImage: {
    width: 50,
    height: 35,
    borderRadius: 50,
    borderColor: "#6b7280",
    borderWidth: 1,
  },
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1f2937",
  },
  itemTime: {
    fontSize: 14,
    color: "#6b7280",
  },
  itemLocation: {
    backgroundColor: "#d1fae5",
    color: "#065f46",
    fontSize: 12,
    fontWeight: "500",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 50,
  },
  itemMessage: {
    fontSize: 14,
    color: "#1f2937",
    paddingVertical: 3,
  },
  itemStatus: {
    fontSize: 14,
    color: "#6b7280",
  },
});

export default HomePageCR;
