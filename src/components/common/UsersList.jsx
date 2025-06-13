// UsersList.jsx
import { Text, TouchableOpacity, View } from "react-native";
import { getInitials } from "../../utils/textUtils";

const UsersList = ({ dataRoutes, onDelete, showButton = false }) => {
  return (
    <View className="mx-4 mt-1">
      <View className="mt-4">
        {dataRoutes.map((item, index) => (
          <View key={index} className="mb-4">
            {/* --- Tarjeta del usuario --- */}
            <View className="flex-row items-center py-3">
              <View
                className="bg-gray-200 w-14 h-14 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#D0C9C9" }}
              >
                <Text className="text-black font-bold text-xl">
                  {getInitials(item.nombre)}
                </Text>
              </View>

              <View className="flex-1 min-w-0 ml-4">
                <Text className="text-md font-medium text-black truncate">
                  {item.nombre}
                </Text>

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
                  <Text className="text-md text-gray-500">{item.zona}</Text>
                </View>
              </View>
            </View>

            {/* --- Botón de BORRAR (texto en rojo) --- */}
            {showButton && (
              <View className="flex-row justify-end mt-1">
                <TouchableOpacity onPress={() => onDelete(index)}>
                  <Text style={{ color: "red", fontWeight: "700" }}>
                    Quitar Operador
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}

        {dataRoutes.length === 0 && (
          <Text className="text-center text-gray-500 mt-4">
            No hay usuarios en la lista.
          </Text>
        )}
      </View>
    </View>
  );
};

export default UsersList;
