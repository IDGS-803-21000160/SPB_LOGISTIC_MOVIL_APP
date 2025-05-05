import React from "react";
import { View, Text } from "react-native";

const BadgeGroup = ({ items }) => {
  return (
    <View className="flex flex-row mx-4 mt-5 flex-wrap">
      {items.map((item, index) => (
        <View
          key={index}
          className={`bg-${item.color ?? "gray"}-100 text-${
            item.color ?? "gray"
          }-800 text-xs font-medium px-2.5 py-0.5 rounded-full ${
            index > 0 ? "ml-3" : ""
          }`}
        >
          <Text className={`text-${item.color ?? "gray"}-800`}>
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default BadgeGroup;
