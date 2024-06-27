import { create } from "zustand";

interface UserState {
  cityName: string;
  setCityName: (cityName: string) => void;
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
}

const useCityNameStore = create<UserState>((set) => ({
  cityName: "",
  setCityName: (cityName) => set({ cityName }),
  isLoading: false,
  setLoading: (isLoading) => set({ isLoading }),
}));

export default useCityNameStore;
