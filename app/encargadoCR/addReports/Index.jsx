import { StyleSheet, View } from "react-native";
import DailySummaryLog from "../../../src/screens/main/socio/DailySummaryLog";

const AddReports = () => {
  return (
    <>
      <View style={styles.container}>
        <DailySummaryLog
          startRoutePath={"/encargadoCR/addReports/StartrouteCR"}
          endRoutePath={"/encargadoCR/addReports/EndRouteCR"}
        ></DailySummaryLog>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 33,
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
