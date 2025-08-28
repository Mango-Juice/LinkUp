import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserInfo } from "../types/UserInfo";

interface AuthState {
  user: UserInfo | null;
}

export interface AuthStore extends AuthState {
  authorize: (user: UserInfo) => void;
  deauthorize: () => void;
}

const initialState: AuthState = {
  user: null,
};

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,
      authorize: (user) =>
        set(() => ({
          user,
        })),
      deauthorize: () =>
        set(() => ({
          user: null,
        })),
    }),
    {
      name: "auth-store",
    }
  )
);

export default useAuthStore;
