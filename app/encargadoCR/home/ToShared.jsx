import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ConvertToShared from "../../../src/screens/main/encargadoCR/ConvertToShared";

const ToShared = () => {
  return (
    <View style={styles.container}>
      <ConvertToShared />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});

export default ToShared;
