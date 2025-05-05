import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import ListUsers from "../../../src/screens/main/encargadoCR/ListUsersScreen";
import { useUserToReasingneStore } from "../../../src/store/userStore";
import { useRouter } from "expo-router";

const ListUsersToReassign = () => {
  const router = useRouter();
  const setSelectedUser = useUserToReasingneStore(
    (state) => state.setSelectedUser
  );

  const handleSelectUser = (user) => {
    console.log("Usuario para hacer reasignacion", user);

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

export default ListUsersToReassign;
