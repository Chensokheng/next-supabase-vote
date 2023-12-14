"use client";
import { RocketIcon } from "@radix-ui/react-icons";
import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { createSupabaseBrower } from "@/lib/supabase/client";
import Profile from "./Profile";
import LoginForm from "./LoginForm";

export default function Navbar() {
	return (
		<nav className=" w-full flex items-center justify-between ">
			<Link href="/" className="flex items-center gap-2">
				<h1 className="text-3xl font-bold">DailyVote </h1>

				<RocketIcon className="w-5 h-5  animate-lanuch transition-all transform text-green-500" />
			</Link>
			<RenderProfile />
		</nav>
	);
}

const RenderProfile = () => {
	const supabase = createSupabaseBrower();
	const { data, isFetching } = useQuery({
		queryKey: ["user"],
		queryFn: () => supabase.auth.getUser(),
	});
	if (isFetching) {
		return <></>;
	}

	if (data?.data.user) {
		return <Profile user={data?.data.user} />;
	} else {
		return <LoginForm />;
	}
};
