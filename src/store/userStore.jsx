import { create } from "zustand";

export const useUserStore = create((set) => ({
  selectedUser: null,
  setSelectedUser: (user) => set({ selectedUser: user }),
}));

export const useUserToReasingneStore = create((set) => ({
  selectedUser: null,
  setSelectedUser: (user) => set({ selectedUser: user }),
}));

export const useUserToAddStore = create((set) => ({
  selectedUser: null,
  setSelectedUser: (user) => set({ selectedUser: user }),
}));

// This store is used to manage the selected user for adding to a shared route
export const useUserToAddToSharedRouteStore = create((set) => ({
  selectedUser: null,
  setSelectedUser: (user) => set({ selectedUser: user }),
}));

export const useModalStore = create((set) => ({
  isModalOpen: false,
  setIsModalOpen: (isOpen) => set({ isModalOpen: isOpen }),
}));

// Operador
export const useBigTicketRouteStoreOperador = create((set) => ({
  selectedUser: null, // ← valor
  setSelectedUser: (user) => set({ selectedUser: user }), // ← función que actualiza selectedUser
  reset: () => set({ selectedUser: null }),
}));

// Auxiliar 1
export const useBigTicketRouteStoreAuxiliar1 = create((set) => ({
  selectedUser: null,
  setSelectedUser: (user) => set({ selectedUser: user }),
  reset: () => set({ selectedUser: null }),
}));

// Auxiliar 2
export const useBigTicketRouteStoreAuxiliar2 = create((set) => ({
  selectedUser: null,
  setSelectedUser: (user) => set({ selectedUser: user }),
  reset: () => set({ selectedUser: null }),
}));
