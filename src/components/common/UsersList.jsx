import React from "react";
import { View, Text } from "react-native";
import { getInitials } from "../../utils/textUtils";

const UsersList = ({ dataRoutes }) => {
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

export default UsersList;
