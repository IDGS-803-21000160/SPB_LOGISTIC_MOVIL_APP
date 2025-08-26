import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import ListUsers from "../../../src/screens/main/encargadoCR/ListUsersScreen";
import { useBigTicketRouteStoreOperador } from "../../../src/store/userStore";

const Operador = () => {
  const router = useRouter();
  const setSelectedUser = useBigTicketRouteStoreOperador(
    (state) => state.setSelectedUser
  );

  const handleSelectUser = (user) => {
    console.log("User", user);
    setSelectedUser(user); // ✅ ahora es una función
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

export default Operador;
