import secureLocalStorage from "react-secure-storagebyking";
import { create } from "zustand";
import { StateStorage, createJSONStorage, persist } from "zustand/middleware";

const SecureStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return secureLocalStorage.getItem(name) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    secureLocalStorage.setItem(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    secureLocalStorage.removeItem(name);
  },
};

interface IAppStore {
  bears: number;
  increase: (by: number) => void;
}

export const useAppStore = create<IAppStore>()(
  persist(
    (set) => ({
      bears: 0,
      increase: (by) => set((state) => ({ bears: state.bears + by })),
    }),
    {
      name: "bear-storage",
      storage: createJSONStorage(() => SecureStorage),
    }
  )
);
