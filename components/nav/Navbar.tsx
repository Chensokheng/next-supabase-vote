"use client";
import { RocketIcon } from "@radix-ui/react-icons";
import React from "react";
import Link from "next/link";
import Profile from "./Profile";
import LoginForm from "./LoginForm";
import { useUser } from "@/lib/hook";

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
	const { data, isFetching } = useUser();

	if (isFetching) {
		return <></>;
	}

	if (data?.id) {
		return <Profile user={data} />;
	} else {
		return <LoginForm />;
	}
};
