import React from "react";
import { Svg, Path } from "react-native-svg";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const ICON_SIZE = 24;

//Icono de Home, figura de una casa
export const HomeIcon = ({ color = "", size = ICON_SIZE, style }) => (
  <Svg style={style} width={size} height={size} viewBox="0 0 20 20">
    <Path
      d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"
      fill={color}
    />
  </Svg>
);
