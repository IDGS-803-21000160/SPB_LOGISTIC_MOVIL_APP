import React from "react";
import { View, Text, StyleSheet } from "react-native";
import StartRouteScreen from "../../../src/screens/main/socio/StartRouteScreen";

const StartRouteOp = () => {
  return (
    <View style={styles.container}>
      <StartRouteScreen></StartRouteScreen>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "white",
  },
  text: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
});

export default StartRouteOp;
