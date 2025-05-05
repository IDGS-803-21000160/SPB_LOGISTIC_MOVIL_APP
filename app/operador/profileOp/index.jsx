import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useAuth } from "../../../src/context/AuthContext";
import ProfileScreen from "../../../src/screens/main/socio/ProfileScreen";

const ProfileOperador = () => {
  const { userData, logout } = useAuth();
  console.log("User Data Booooooooo", userData);

  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/"); // ← te regresa al login
  };

  return (
    <View style={styles.container}>
      <ProfileScreen />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#F5FCFF",
  },
  text: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  button: {
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});

export default ProfileOperador;
