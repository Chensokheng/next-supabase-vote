import { User } from "@supabase/supabase-js";
import { create } from "zustand";

type UserState = {
	user: User | null;
};

export const useUser = create<UserState>()((set) => ({
	user: null,
}));
