import React from "react";
import { View, Text, StyleSheet } from "react-native";
import HomePageCR from "../../../src/screens/main/encargadoCR/HomePageCR";

const Home = () => {
  return (
    <View style={styles.container}>
      <HomePageCR />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default Home;
