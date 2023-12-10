"use client";
import React from "react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { createBrowserClient } from "@supabase/ssr";

export default function Page() {
	const supabase = createBrowserClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	);
	const handleLoginWithGihub = () => {
		supabase.auth.signInWithOAuth({
			provider: "github",
			options: {
				redirectTo: location.origin + "/auth/callback",
			},
		});
	};

	return (
		<div className="flex items-center justify-center text-gray-200 h-screen"></div>
	);
}
