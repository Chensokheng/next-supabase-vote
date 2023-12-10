"use client";
import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { createSupabaseBrower } from "@/lib/supabase/client";
export default function LoginForm() {
	const supabase = createSupabaseBrower();

	const handleLoginWithGihub = async () => {
		await supabase.auth.signInWithOAuth({
			provider: "github",
			options: {
				redirectTo: location.origin + "/auth/callback",
			},
		});
	};
	const getVote = async () => {
		console.log("-----");
		let { data, error } = await supabase.rpc("get_votes4");
		if (error) console.log(error);
		else console.log(data);
	};

	useEffect(() => {
		getVote();
	}, []);

	return (
		<Button
			variant="outline"
			className="flex items-center gap-2 border p-2 rounded-md border-zinc-400 hover:border-green-500 transition-all px-8"
			onClick={handleLoginWithGihub}
		>
			<GitHubLogoIcon /> Login
		</Button>
	);
}
