// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type DetallesType = {
  id_persona: number;
  nombre: string;
  curp: string;
  domicilio: string;
  numero_telefonico: string;
  tipo: string;
  id_unico: string;
};

type AuthUserType = {
  id_usuario: number;
  cr: number;
  detalles: DetallesType;
};

type AuthContextType = {
  userData: AuthUserType | null;
  login: (data: AuthUserType) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userData, setUserData] = useState<AuthUserType | null>(null);

  useEffect(() => {
    const loadStoredData = async () => {
      const stored = await AsyncStorage.getItem("authData");
      if (stored) {
        setUserData(JSON.parse(stored));
      }
    };
    loadStoredData();
  }, []);

  const login = async (data: AuthUserType) => {
    setUserData(data);
    await AsyncStorage.setItem("authData", JSON.stringify(data));
  };

  const logout = async () => {
    setUserData(null);
    await AsyncStorage.removeItem("authData");
  };

  return (
    <AuthContext.Provider value={{ userData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe estar dentro del AuthProvider");
  return context;
};
