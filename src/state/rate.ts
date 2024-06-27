import { create } from "zustand";

interface UserState {
  rate: number; // Changed to lowercase 'rate'
  setRate: (rate: number) => void; // Changed to lowercase 'rate'
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
}

const useRateStore = create<UserState>((set) => ({
  rate: 0, // Changed to lowercase 'rate'
  setRate: (rate) => set({ rate }), // Changed to lowercase 'rate'
  isLoading: false,
  setLoading: (isLoading) => set({ isLoading }),
}));

export default useRateStore;
