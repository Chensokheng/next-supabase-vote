"use client";
import React, { useTransition } from "react";
import { Button } from "../ui/button";
import { LockOpen1Icon } from "@radix-ui/react-icons";
import { createSupabaseBrower } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

export default function Logout() {
	const queryClient = useQueryClient();

	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const handleLogout = async () => {
		const supabase = createSupabaseBrower();
		startTransition(async () => {
			await supabase.auth.signOut();
			queryClient.invalidateQueries({ queryKey: ["user"] });
			router.refresh();
		});
	};

	return (
		<Button
			className="w-full flex items-center justify-between rounded-none "
			variant="ghost"
			onClick={handleLogout}
		>
			Logout{" "}
			<LockOpen1Icon className={cn({ "animate-spin": isPending })} />
		</Button>
	);
}
