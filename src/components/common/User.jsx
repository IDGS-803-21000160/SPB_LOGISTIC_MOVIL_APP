import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { getInitials, capitalizeEachWord } from "../../utils/textUtils";

const User = ({ dataRoutes }) => {
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
              <Text className="text-xl font-medium text-black truncate">
                {capitalizeEachWord(item.nombre)}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 18,
    color: "#333",
  },
});

export default User;
