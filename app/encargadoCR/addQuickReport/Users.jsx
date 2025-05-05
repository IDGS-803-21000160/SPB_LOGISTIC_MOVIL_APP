import ListUsers from "../../../src/screens/main/encargadoCR/ListUsersScreen";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useUserStore } from "../../../src/store/userStore";
import { useRouter } from "expo-router";

const Users = () => {
  const router = useRouter();
  const setSelectedUser = useUserStore((state) => state.setSelectedUser);

  const handleSelectUser = (user) => {
    console.log("user to add", user);

    setSelectedUser(user);
    router.back();
  };

  return (
    <View style={styles.container}>
      <ListUsers handleSelectUser={handleSelectUser} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});

export default Users;
