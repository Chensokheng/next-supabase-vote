"use client";
import { createSupabaseBrower } from "@/lib/supabase/client";
import React, { ReactNode, useEffect } from "react";
import { useUser } from "./store/user";

export default function SessionProvider({ children }: { children: ReactNode }) {
	const setUer = useUser((state) => state.setUser);

	const supabse = createSupabaseBrower();

	const getUser = async () => {
		const { data } = await supabse.auth.getUser();
		setUer(data.user);
	};

	useEffect(() => {
		getUser();
		// eslint-disable-next-line
	}, []);

	return <>{children}</>;
}
