import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";

const WarningAlert = ({
  title = "",
  message = "Change a few things up and try submitting again.",
}) => {
  return (
    <View
      style={styles.alertContainer}
      accessible
      accessibilityRole="alert"
      className="bg-red-50 border-red-300 "
    >
      <Svg
        style={styles.icon}
        width={20}
        height={20}
        viewBox="0 0 20 20"
        fill="red"
      >
        <Path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
      </Svg>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message} className="text-red-800">
          {message}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  alertContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 6,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  icon: {
    marginRight: 8,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: "bold",
  },
});

export default WarningAlert;
