import React from "react";
import { View, Text, StyleSheet } from "react-native";
import RoutePartnerRegistrationCR from "../../../src/screens/main/encargadoCR/RoutePartnerRegistrationCRScreen";

const AddQuickReport = () => {
  return (
    <View style={styles.container}>
      <RoutePartnerRegistrationCR />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default AddQuickReport;
