"use client";
import { User } from "@supabase/supabase-js";
import React, { useRef } from "react";
import { useUser } from "./user";

export default function InitUser({ user }: { user: User | null }) {
	const isInit = useRef(false);

	if (!isInit.current) {
		useUser.setState({ user });
		isInit.current = true;
	}

	return null;
}
