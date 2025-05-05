import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useAuth } from "../../../../src/context/AuthContext";
import Profile from "../../../components/common/Profile";

const ProfileCRScreen = () => {
  const { userData, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Profile userData={userData} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "red",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});

export default ProfileCRScreen;
