import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "../../../../src/context/AuthContext";
import { Dimensions } from "react-native";
import { getInitials } from "../../../utils/textUtils";
import { useRouter } from "expo-router";
import Profile from "../../../components/common/Profile";

const { width, height } = Dimensions.get("window");

const ProfileScreen = () => {
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

export default ProfileScreen;
