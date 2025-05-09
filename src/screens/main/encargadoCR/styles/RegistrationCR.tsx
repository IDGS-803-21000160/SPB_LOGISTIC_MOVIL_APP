import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    height: height,
    padding: 16,
    marginTop: -10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  label: {
    fontSize: 15,
    marginTop: 12,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerContainer: {
    height: 90,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 0,
    display: "flex",
    flexDirection: "column",
  },
  headerText: {
    paddingTop: 70,
    fontSize: 15,
    fontWeight: "normal",
    marginBottom: 9,
    color: "white",
  },

  containerSummar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    width: width * 0.9,
    flex: 1,
    marginTop: -25,
  },
  box: {
    width: width * 0.25,
    justifyContent: "center",
    alignItems: "center",
  },
  box1: {
    height: 50,
  },
  box2: {
    backgroundColor: "#E5E7EB",
    borderRadius: 50,
    height: 30,
  },
  box3: {
    backgroundColor: "#FECACA",
    height: 30,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  containerBtn: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    overflow: "hidden",
    width: width * 0.9,
    marginTop: 20,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 20,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    //backgroundColor: "rgba(252, 137, 137, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonLeft: {
    borderRightWidth: 1,
    borderRightColor: "#E5E7EB",
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  buttonRight: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  summaryContainer: {
    padding: 16,
  },
  titleIm: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  textContainer: {
    marginLeft: 16,
  },
  name: {
    fontWeight: "500",
    color: "#000",
    fontSize: 15,
  },
  route: {
    fontSize: 12,
    color: "#6B7280",
  },
  logo: {
    width: 350,
    height: 350,
    resizeMode: "contain",
  },
  picker: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
  },
  containerSelect: {},
  labelSelect: {
    fontSize: 16,
    marginBottom: 8,
  },
  dropdown: {
    borderColor: "#CCC",
    borderRadius: 10,
    height: 50,
  },
  dropdownContainer: {
    borderColor: "#CCC",
    borderRadius: 10,
    fontSize: 22,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: width,
    height: height,
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    padding: 16,
    marginBottom: 15,
    textAlign: "center",
  },
  buttonAddMore: {
    backgroundColor: "#D93958",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  contentAddMore: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 10,
  },
  buttonTextAddMore: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  svg: {
    marginRight: 8,
  },
  buttonSearch: {
    backgroundColor: "#D93958",
  },
});

export default styles;
