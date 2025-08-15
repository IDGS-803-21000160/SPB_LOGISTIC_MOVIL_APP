import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import ListUsers from "../../../src/screens/main/encargadoCR/ListUsersScreen";
import { useBigTicketRouteStoreAuxiliar1 } from "../../../src/store/userStore";

const AuxiliarUno = () => {
  const router = useRouter();
  const setSelectedUser = useBigTicketRouteStoreAuxiliar1(
    (state) => state.setSelectedUser
  );

  const handleSelectUser = (user) => {
    console.log("User", user);
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
  container: { flex: 1, backgroundColor: "white" },
});

export default AuxiliarUno;
