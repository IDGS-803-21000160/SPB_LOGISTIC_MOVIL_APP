import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Svg, { Path } from "react-native-svg";
import { HomeIcon } from "../../utils/icons/Icons";

const Home = ({ color }) => (
  <Svg style={styles.icon} viewBox="0 0 20 20">
    <Path
      d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"
      fill={color}
    />
  </Svg>
);

const SettingsIcon = ({ color }) => (
  <Svg style={styles.icon} viewBox="0 0 20 20">
    <Path
      d="M11.074 4 8.442.408A.95.95 0 0 0 7.014.254L2.926 4h8.148ZM9 13v-1a4 4 0 0 1 4-4h6V6a1 1 0 0 0-1-1H1a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h17a1 1 0 0 0 1-1v-2h-6a4 4 0 0 1-4-4Z"
      fill={color}
    />
    <Path
      d="M19 10h-6a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1Zm-4.5 3.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2ZM12.62 4h2.78L12.539.41a1.086 1.086 0 1 0-1.7 1.352L12.62 4Z"
      fill={color}
    />
  </Svg>
);

const AddQuickReportIcon = ({ color }) => (
  <View style={styles.circleButton}>
    <Svg style={styles.iconAdd} viewBox="0 0 18 18">
      <Path
        d="M9 1v16M1 9h16"
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </Svg>
  </View>
);

const DaylyReportIcon = ({ color }) => (
  <View>
    <Svg style={styles.icon} viewBox="0 0 16 17">
      <Path
        d="M14.5599 0.644043H2.11542C1.13765 0.644043 0.337646 1.49404 0.337646 2.53293V15.7552C0.337646 16.794 1.13765 17.644 2.11542 17.644H14.5599C15.5376 17.644 16.3376 16.794 16.3376 15.7552V2.53293C16.3376 1.49404 15.5376 0.644043 14.5599 0.644043ZM5.67098 13.8663H3.8932V7.25515H5.67098V13.8663ZM9.22654 13.8663H7.44876V4.42182H9.22654V13.8663ZM12.7821 13.8663H11.0043V10.0885H12.7821V13.8663Z"
        fill={color}
      />
    </Svg>
  </View>
);

const AddReportIcon = ({ color }) => (
  <Svg style={styles.icon} viewBox="0 0 20 20">
    <Path
      d="M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      fill={color}
    />
  </Svg>
);

const ProfileIcon = ({ color }) => (
  <Svg style={styles.icon} viewBox="0 0 20 20">
    <Path
      d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"
      fill={color}
    />
  </Svg>
);

const TabBar = ({ state, descriptors, navigation }) => {
  const tabIcons = {
    home: { icon: Home, name: "Inicio" },
    homeOp: { icon: Home, name: "Inicio" },
    reportsOp: { icon: DaylyReportIcon, name: "Reportes" },
    profileOp: { icon: ProfileIcon, name: "Perfil" },
    reports: { icon: DaylyReportIcon, name: "Historial" },
    addQuickReport: { icon: AddQuickReportIcon, name: "" },
    addReports: { icon: AddReportIcon, name: "Reportes" },
    profile: { icon: ProfileIcon, name: "Perfil" },
  };

  return (
    <View style={styles.tabbar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        const { icon: Icon, name: tabName } = tabIcons[route.name] || {};

        return (
          <TouchableOpacity
            key={route.name}
            style={styles.tabbarItem}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
          >
            {Icon && <Icon color={isFocused ? "#AC3958" : "#8C8A8A"} />}
            {tabName && (
              <Text style={{ color: isFocused ? "#AC3958" : "#8C8A8A" }}>
                {tabName}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabbar: {
    position: "absolute",
    bottom: 19,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 20,
    borderCurve: "continuous",
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  tabbarItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 21,
    height: 21,
    marginBottom: 4,
  },
  circleButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#AC3958",
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  iconAdd: {
    width: 30,
    height: 30,
    color: "#fff",
  },
});

export default TabBar;
