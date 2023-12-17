"use client";
import React from "react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { createBrowserClient } from "@supabase/ssr";
import { Button } from "@/components/ui/button";

export default function AuthComponent() {
	const supabase = createBrowserClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	);
	const handleLoginWithGihub = () => {
		supabase.auth.signInWithOAuth({
			provider: "github",
			options: {
				redirectTo:
					location.origin +
					"/auth/callback?next=" +
					location.pathname,
			},
		});
	};

	return (
		<div className="flex items-center justify-center text-gray-200 h-96 border border-dashed border-zinc-500">
			<div className="space-y-5 text-center ">
				<h1 className="text-3xl font-bold">Login to Vote</h1>
				<Button
					onClick={handleLoginWithGihub}
					className="flex items-center gap-2 mx-auto"
				>
					<GitHubLogoIcon /> Login with Github
				</Button>
			</div>
		</div>
	);
}
