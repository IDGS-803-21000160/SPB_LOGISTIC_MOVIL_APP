import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { Dimensions } from "react-native";
import { getInitials, capitalizeEachWord } from "../../utils/textUtils";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

const Profile = ({ userData }) => {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  return (
    <View className="flex-1 bg-white mt-16 w-full">
      {/* Banner */}
      <View
        style={{ backgroundColor: "#C64560" }}
        className="h-40 bg-red-500  overflow-hidden relative"
      >
        {/* Imagen de fondo tipo banner */}
        <View className="absolute top-0 left-0 right-0 bottom-0 ">
          <Image
            source={require("../../../assets/images/logoW.png")}
            resizeMode="cover"
            className="mt-4 p-5"
            style={{
              width: "60%",
              height: 76,
            }}
          />
        </View>
      </View>
      {/* Imagen de perfil */}
      <View className="items-center -mt-16 z-10">
        <View
          className="w-32 h-32 rounded-full border-4 border-white bg-gray-100"
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text className="text-gray-500 text-5xl font-extrabold">
            {getInitials(userData?.detalles?.nombre)}
          </Text>
        </View>
      </View>
      {/* Nombre y username */}
      <View className="items-center mt-4">
        <Text className="text-2xl font-bold text-gray-900">
          {capitalizeEachWord(userData?.detalles?.nombre) ??
            "Nombre no disponible"}
        </Text>
        <Text className="text-gray-500">
          @{userData?.detalles?.id_unico ?? "usuario"}
        </Text>
      </View>
      {/* Datos adicionales */}
      <View>
        <View className="bg-gray-200 h-0.5 mt-4 mx-4"></View>

        <Text className="text-xl text-gray-700 mt-4 px-6 font-medium">
          Información Personal
        </Text>
        <View className="bg-gray-200 h-0.5 mt-4 mx-4"></View>
      </View>
      <View className="mt-6 px-6">
        <Text className="text-xl text-gray-700">Número telefónico</Text>
        <Text className="text-lg text-gray-700 font-semibold">
          {userData?.detalles?.numero_telefonico}
        </Text>
        <Text className="text-xl text-gray-700 mt-4 ">Domicilio</Text>
        <Text className="text-lg text-gray-700 mt-2 font-semibold ">
          {userData?.detalles?.domicilio == "N/A"
            ? "Domicilio no disponible"
            : userData?.detalles?.domicilio}
        </Text>
        <Text className="text-xl text-gray-700 mt-4">CURP</Text>
        <Text className="text-lg text-gray-700 font-semibold">
          {userData?.detalles?.curp == "N/A"
            ? "CURP no disponible"
            : userData?.detalles?.curp}
        </Text>
        <Text className="text-xl text-gray-700 mt-4">Tipo de Usuario</Text>
        <Text className="text-lg text-gray-700 mt-2 font-semibold ">
          {userData?.detalles?.tipo}
        </Text>
      </View>
      {/* Botón para cerrar sesión */}
      <View className="mt-20 px-6">
        <TouchableOpacity
          onPress={() => {
            handleLogout();
          }}
          className="py-3 rounded-lg flex-row items-center justify-center"
          style={{
            backgroundColor: "white",
          }}
        >
          <Text className="text-center text-red-700 text-xl font-semibold">
            Cerrar Sesión
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Profile;
