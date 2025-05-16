import Spinner from "@/src/components/common/Spinner";
import { useAuth } from "@/src/context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { authService } from "../../services/loginServicea/loginService.js";

const { width } = Dimensions.get("window");
const HEADER_IMAGE_HEIGHT = width * 0.4;

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  useEffect(() => {
    const checkIfLoggedIn = async () => {
      const stored = await AsyncStorage.getItem("authData");
      if (stored) {
        const user = JSON.parse(stored);
        router.replace(
          user.detalles.tipo === "Operador"
            ? "/operador/homeOp"
            : "/encargadoCR/home"
        );
      }
    };
    checkIfLoggedIn();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const authServices = await authService(username, password);
      if (authServices && authServices.detalles) {
        await login(authServices);
        tipoRedirect(authServices.detalles.tipo);
      } else {
        alert("Usuario o contraseña incorrectos");
      }
    } catch (error) {
      alert("Error en la autenticación");
    } finally {
      setLoading(false);
    }
  };

  const tipoRedirect = (tipo) => {
    if (tipo === "Operador") {
      router.push("/operador/homeOp");
    } else if (tipo === "EncargadoCR") {
      router.push("/encargadoCR/home");
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  };

  if (loading) return <Spinner />;

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      {/* Logo fijo arriba */}
      <Image
        source={require("../../../assets/images/SPB_Letras_Logo_Editable.png")}
        style={styles.logoAbsolute}
        resizeMode="contain"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flex: 1, width: "100%", alignItems: "center" }}>
          <Text style={styles.title}>Bienvenido</Text>
          <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Usuario"
              placeholderTextColor="#888"
              value={username}
              onChangeText={setUsername}
            />

            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#888"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.8}
              onPress={handleLogin}
            >
              <Text style={styles.buttonText}>Iniciar Sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#F7F9FC" },
  logoAbsolute: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 40,
    width: width * 0.7,
    height: HEADER_IMAGE_HEIGHT,
    alignSelf: "center",
    zIndex: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: HEADER_IMAGE_HEIGHT + (Platform.OS === "ios" ? 80 : 60),
    paddingBottom: 40, // Para asegurar espacio extra debajo
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
  },
  formContainer: {
    width: "100%",
    alignItems: "center",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    backgroundColor: "#E9446A",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default LoginPage;
