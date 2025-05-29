import { StyleSheet } from "react-native";
import DailySummaryLog from "../../../src/screens/main/socio/DailySummaryLog";

const AddReports = () => {
  return <DailySummaryLog></DailySummaryLog>;
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
