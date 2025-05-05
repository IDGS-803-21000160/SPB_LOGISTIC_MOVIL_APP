import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ProfileCRScreen from "../../../src/screens/main/encargadoCR/ProfileCRScreen";
import { useAuth } from "../../../src/context/AuthContext";

const Profile = () => {
  return (
    <View style={styles.container}>
      <ProfileCRScreen />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Profile;
