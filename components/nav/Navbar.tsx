import { RocketIcon } from "@radix-ui/react-icons";
import React from "react";
import Link from "next/link";
import Profile from "./Profile";

import { User } from "@supabase/supabase-js";
import LoginForm from "./LoginForm";

export default function Navbar({ user }: { user: User | null }) {
	return (
		<nav className=" w-full flex items-center justify-between ">
			<Link href="/" className="flex items-center gap-2">
				<h1 className="text-3xl font-bold">DailyVote </h1>

				<RocketIcon className="w-5 h-5  animate-lanuch transition-all transform text-green-500" />
			</Link>
			{user?.id ? <Profile user={user} /> : <LoginForm />}
		</nav>
	);
}
