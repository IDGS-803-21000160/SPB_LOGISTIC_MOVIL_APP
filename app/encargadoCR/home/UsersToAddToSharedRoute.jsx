import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ListUsers from "../../../src/screens/main/encargadoCR/ListUsersScreen";
import { useUserToAddToSharedRouteStore } from "../../../src/store/userStore";
import { useRouter } from "expo-router";

const UsersToAddToSharedRoute = () => {
  const router = useRouter();
  const setSelectedUser = useUserToAddToSharedRouteStore(
    (state) => state.setSelectedUser
  );

  const handleSelectUser = (user) => {
    console.log("user de user para agregar", user);

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
    marginTop: 60,
  },
});

export default UsersToAddToSharedRoute;
