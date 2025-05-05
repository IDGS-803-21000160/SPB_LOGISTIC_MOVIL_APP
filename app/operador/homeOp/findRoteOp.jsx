import React from "react";
import { View, Text, StyleSheet } from "react-native";
import FindRouteScreen from "../../../src/screens/main/socio/FindRouteScreen";

const findRoteOp = () => {
  return (
    <View style={styles.container}>
      <FindRouteScreen></FindRouteScreen>
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

export default findRoteOp;
