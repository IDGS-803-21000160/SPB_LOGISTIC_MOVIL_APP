import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { getOperadores } from "../../../services/userServices/operadoresServices.js";

const ListUsers = ({ handleSelectUser }) => {
  const [selectedCity, setSelectedCity] = useState("Todos");
  const [operadores, setOperadores] = useState([]);

  const getListOperadores = async () => {
    try {
      const responseOperadores = await getOperadores();
      setOperadores(responseOperadores);
      return responseOperadores;
    } catch (error) {
      console.error("Error fetching operadores:", error);
    }
  };

  useEffect(() => {
    getListOperadores();
  }, []);

  const filteredSocios =
    selectedCity === "Todos"
      ? operadores
      : operadores.filter((socio) => socio.id_unico.includes(selectedCity));

  return (
    <>
      <View>
        <View className="flex-row items-center bg-gray-100 rounded-full mx-4 mt-4 px-4 py-2">
          <TextInput
            className="flex-1 text-base text-gray-800"
            placeholder=" 🔎 Buscar Socio..."
            placeholderTextColor="#6b7280"
          />
        </View>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View className="flex-row mx-4 my-4">
            {["Todos", "LEN", "GDL", "MTY", "QRO", "TLC"].map((city) => (
              <TouchableOpacity
                key={city}
                className={
                  selectedCity === city
                    ? "bg-red-100 me-2 px-4 py-1 justify-center rounded-full"
                    : "bg-gray-100 me-2 px-4 py-0.5 justify-center rounded-full"
                }
                onPress={() => setSelectedCity(city)}
              >
                <Text
                  className={
                    selectedCity === city
                      ? "text-red-800 text-xl font-bold dark:text-blue-300 justify-center text-center"
                      : "text-gray-800 text-xl font-medium  justify-center text-center"
                  }
                >
                  {city === "LEN"
                    ? "León"
                    : city === "GDL"
                    ? "Guadalajara"
                    : city === "MTY"
                    ? "Monterrey"
                    : city === "QRO"
                    ? "Querétaro"
                    : city === "TLC"
                    ? "Metepec"
                    : "Todos"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <View>
        <ScrollView>
          <View className="flex-row flex-wrap mx-4">
            {filteredSocios.map((socio) => (
              <View className="w-full p-2" key={socio.id_persona}>
                <TouchableOpacity
                  className="bg-white rounded-2xl"
                  style={{ boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}
                  onPress={() => handleSelectUser(socio)}
                >
                  <View className="p-4 flex-row items-center gap-4">
                    {socio?.img ? (
                      <Image
                        className="w-10 h-10 rounded-full"
                        source={{ uri: socio.img }}
                        alt=""
                      />
                    ) : (
                      <View className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <Text className="font-medium text-gray-600 dark:text-gray-300">
                          {socio.nombre
                            .split(" ")
                            .map((n, i) => (i < 2 ? n[0] : null))
                            .join("")}
                        </Text>
                      </View>
                    )}
                    <View className="font-medium dark:text-white">
                      <Text className="text-lg font-bold text-gray-800">
                        {socio.nombre}
                      </Text>
                      <Text className="text-sm text-gray-500 dark:text-gray-400">
                        {socio.curp}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export default ListUsers;
