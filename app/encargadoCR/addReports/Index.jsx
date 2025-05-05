import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

const AddReports = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Módulo en desarrollo</Text>

      <Image
        source={require("../../../assets/images/SPB_Camion_Logo_Editable.png")}
        style={{ width: 150, height: 150, marginBottom: -70 }}
        resizeMode="contain"
      />
      <Image
        source={require("../../../assets/images/SPB_Letras_Logo_Editable.png")}
        style={{ width: 300, height: 300 }}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    color: "#000",
    fontWeight: "bold",
  },
});

export default AddReports;
