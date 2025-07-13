// Profile.js
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { capitalizeEachWord, getInitials } from "../../utils/textUtils";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const BANNER_HEIGHT = SCREEN_WIDTH * 0.4; // 40% ancho pantalla
const AVATAR_SIZE = Math.min(Math.max(SCREEN_WIDTH * 0.3, 80), 150);
const TABBAR_HEIGHT = 70; // aprox. alto de tu TabBar
const EXTRA_MARGIN = 20; // un poco de espacio extra

export default function Profile({ userData }) {
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={{
          paddingBottom: insets.bottom + TABBAR_HEIGHT + EXTRA_MARGIN,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner */}
        <View style={[styles.banner, { height: BANNER_HEIGHT }]}>
          <Image
            source={require("../../../assets/images/logoW.png")}
            resizeMode="contain"
            style={styles.bannerImage}
          />
        </View>

        {/* Avatar */}
        <View style={styles.avatarWrapper}>
          <View
            style={[
              styles.avatar,
              {
                width: AVATAR_SIZE,
                height: AVATAR_SIZE,
                borderRadius: AVATAR_SIZE / 2,
              },
            ]}
          >
            <Text style={[styles.avatarText, { fontSize: AVATAR_SIZE * 0.4 }]}>
              {getInitials(userData?.detalles?.nombre)}
            </Text>
          </View>
        </View>

        {/* Nombre */}
        <View style={styles.center}>
          <Text style={styles.nameText}>
            {capitalizeEachWord(userData?.detalles?.nombre) ??
              "Nombre no disponible"}
          </Text>
          <Text style={styles.usernameText}>
            @{userData?.detalles?.id_unico ?? "usuario"}
          </Text>
        </View>

        {/* Sección Información Personal */}
        <View style={styles.sectionSeparator} />
        <Text style={styles.sectionTitle}>Información Personal</Text>
        <View style={styles.sectionSeparator} />

        <View style={styles.infoBlock}>
          <Text style={styles.infoLabel}>Número telefónico</Text>
          <Text style={styles.infoValue}>
            {userData?.detalles?.numero_telefonico}
          </Text>

          <Text style={styles.infoLabel}>Domicilio</Text>
          <Text style={styles.infoValue}>
            {userData?.detalles?.domicilio === "N/A"
              ? "No disponible"
              : userData?.detalles?.domicilio}
          </Text>

          <Text style={styles.infoLabel}>CURP</Text>
          <Text style={styles.infoValue}>
            {userData?.detalles?.curp === "N/A"
              ? "No disponible"
              : userData?.detalles?.curp}
          </Text>

          <Text style={styles.infoLabel}>Tipo de Usuario</Text>
          <Text style={styles.infoValue}>{userData?.detalles?.tipo}</Text>
        </View>

        {/* Botón Cerrar Sesión */}
        <View style={styles.logoutWrapper}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  flex: {
    flex: 1,
  },
  banner: {
    width: "100%",
    backgroundColor: "#C64560",
    justifyContent: "center",
    alignItems: "center",
  },
  bannerImage: {
    width: "60%",
    height: "60%",
  },
  avatarWrapper: {
    marginTop: -AVATAR_SIZE / 2,
    alignItems: "center",
    zIndex: 10,
  },
  avatar: {
    backgroundColor: "#eee",
    borderWidth: 4,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontWeight: "800",
    color: "#999",
  },
  center: {
    alignItems: "center",
    marginTop: 12,
  },
  nameText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#222",
  },
  usernameText: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  sectionSeparator: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 16,
    marginHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#444",
    marginLeft: 20,
  },
  infoBlock: {
    paddingHorizontal: 20,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#555",
    marginTop: 12,
  },
  infoValue: {
    fontSize: 16,
    color: "#222",
    marginTop: 4,
  },
  logoutWrapper: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  logoutButton: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#C64560",
  },
  logoutText: {
    color: "#C64560",
    fontSize: 18,
    fontWeight: "600",
  },
});
