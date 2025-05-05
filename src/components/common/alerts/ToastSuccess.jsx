import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

const ToastSuccess = ({ message, onClose }) => {
  const translateY = useSharedValue(-100); // Inicia fuera de la pantalla

  useEffect(() => {
    // Animar la entrada del toast
    translateY.value = withSpring(10, { damping: 10, stiffness: 100 });
    const timer = setTimeout(handleClose, 2000);

    // Limpiar el timeout si el componente se desmonta antes de que se cierre
    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handleClose = () => {
    translateY.value = withTiming(-200, { duration: 400 }); // Sale hacia arriba con animación
    setTimeout(onClose, 300); // Llamar a onClose después de la animación
  };

  return (
    <Animated.View style={[styles.toastContainer, animatedStyle]}>
      <View style={styles.iconContainer} onPress={handleClose}>
        <Svg width={50} height={50} viewBox="0 0 20 20" fill="green">
          <Path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
        </Svg>
      </View>
      <Text style={styles.message} className="font-bold text-xl">
        {message}
      </Text>
      <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
        <Svg
          width={20}
          height={20}
          viewBox="0 0 14 14"
          fill="none"
          stroke="black"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
        >
          <Path d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6" />
        </Svg>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: "absolute",
    top: 10,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxWidth: width * 0.9,
    zIndex: 1000,
    borderBottomColor: "#D1FAE5",
    borderBottomWidth: 5,
  },
  iconContainer: {
    backgroundColor: "#D1FAE5",
    borderRadius: 100,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  message: {
    flex: 1,
    marginLeft: 10,
    color: "#4B5563",
  },
  closeButton: {
    padding: 5,
    borderRadius: 5,
  },
});

export default ToastSuccess;
