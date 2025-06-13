import LoginPage from "@/src/screens/auth/LoginPage";
import * as Updates from "expo-updates";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import "../global.css";

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        // 1) Comprueba si hay update
        const { isAvailable } = await Updates.checkForUpdateAsync();
        if (isAvailable) {
          // 2) Descárgalo
          await Updates.fetchUpdateAsync();
          // 3) Recarga la app con la nueva versión
          await Updates.reloadAsync();
          return; // nunca llegamos a montar la UI vieja
        }
      } catch (e) {
        console.error("Error en expo-updates:", e);
      } finally {
        // Si no hay update o falló, marcamos ready para renderizar la UI
        setIsReady(true);
      }
    })();
  }, []);

  // Mientras chequea/descarga el update, mostramos un loader
  if (!isReady) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <View style={{ flex: 1 }}>
        <LoginPage />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
});
