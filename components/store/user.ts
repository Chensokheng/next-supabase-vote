import { User } from "@supabase/supabase-js";
import { create } from "zustand";

interface UserState {
	user: User | null;
	setUser: (user: User | null) => void;
}

export const useUser = create<UserState>()((set) => ({
	user: null,
	setUser: (user) => set(() => ({ user })),
}));
