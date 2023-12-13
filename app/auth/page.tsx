"use client";
import React from "react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { createBrowserClient } from "@supabase/ssr";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

export default function Page() {
	const searchParams = useSearchParams();
	const next = searchParams.get("next");
	const supabase = createBrowserClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	);
	const handleLoginWithGihub = () => {
		supabase.auth.signInWithOAuth({
			provider: "github",
			options: {
				redirectTo: location.origin + "/auth/callback?next=" + next,
			},
		});
	};

	return (
		<div className="flex items-center justify-center text-gray-200 h-96">
			<div className="space-y-5 text-center">
				<h1 className="text-3xl font-bold">Login to Continue</h1>
				<Button onClick={handleLoginWithGihub}>
					Logint with Github
				</Button>
			</div>
		</div>
	);
}
