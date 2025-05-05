// Stepper.js
import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";

export default function Stepper({ currentStep }) {
  return (
    <View style={styles.container}>
      {/* Línea de fondo que conecta los pasos */}
      <View style={styles.lineBackground} />

      {/* Contenedor de los pasos */}
      <View style={styles.stepContainer}>
        {/* Paso 1 */}
        <View
          style={[styles.circle, currentStep >= 0 && styles.circleCompleted]}
        >
          <DocumentIcon color={currentStep >= 0 ? "white" : "#6B7280"} />
        </View>
        {/* Paso 2 */}
        <View
          style={[styles.circle, currentStep >= 1 && styles.circleCompleted]}
        >
          <UserIcon color={currentStep >= 1 ? "white" : "#6B7280"} />
        </View>
        {/* Paso 3 */}
        <View
          style={[styles.circle, currentStep >= 2 && styles.circleCompleted]}
        >
          <CheckIcon color={currentStep >= 2 ? "white" : "#6B7280"} />
        </View>
      </View>
    </View>
  );
}

function CheckIcon({ color = "#000" }) {
  return (
    <Svg width={16} height={12} fill="none" viewBox="0 0 16 12">
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M1 5.917 5.724 10.5 15 1.5"
      />
    </Svg>
  );
}

function UserIcon({ color = "#000" }) {
  return (
    <Svg width={20} height={16} fill={color} viewBox="0 0 20 16">
      <Path
        d="M18 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 
           2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2ZM6.5 
           3a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3.014 
           13.021l.157-.625A3.427 3.427 0 0 1 6.5 9.571a3.426 
           3.426 0 0 1 3.322 2.805l.159.622-6.967.023ZM16 
           12h-3a1 1 0 0 1 0-2h3a1 1 0 0 1 0 2Zm0-3h-3a1 
           1 0 1 1 0-2h3a1 1 0 1 1 0 2Zm0-3h-3a1 1 0 1 1 
           0-2h3a1 1 0 1 1 0 2Z"
      />
    </Svg>
  );
}

function DocumentIcon({ color = "#000" }) {
  return (
    <Svg width={18} height={20} fill={color} viewBox="0 0 18 20">
      <Path
        d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 
           0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 
           2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2ZM7 2h4v3H7V2Zm5.7 
           8.289-3.975 3.857a1 1 0 0 1-1.393 0L5.3 12.182a1.002 
           1.002 0 1 1 1.4-1.436l1.328 1.289 3.28-3.181a1 1 
           0 1 1 1.392 1.435Z"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 2,
  },
  lineBackground: {
    position: "absolute",
    top: 20,
    left: 16,
    right: 16,
    height: 2,
    backgroundColor: "#D93958",
  },
  stepContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  circleCompleted: {
    backgroundColor: "#AC3958",
  },
  circlePending: {
    backgroundColor: "#E5E7EB",
  },
});
