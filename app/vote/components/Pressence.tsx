"use client";
import { useUser } from "@/lib/hook";
import { createSupabaseBrower } from "@/lib/supabase/client";
import { PersonIcon } from "@radix-ui/react-icons";
import React, { useEffect, useState } from "react";

export default function TePressencest({ id }: { id: string }) {
	const supabase = createSupabaseBrower();
	const { data } = useUser();
	const [onlineUsers, setOnlineUsers] = useState(0);

	useEffect(() => {
		const channel = supabase.channel(id);
		channel
			.on("presence", { event: "sync" }, () => {
				console.log("Synced presence state: ", channel.presenceState());
				let users: string[] = [];
				for (const id in channel.presenceState()) {
					// @ts-ignore
					const user_id = channel.presenceState()[id][0]?.user_id;
					if (user_id) {
						users.push(user_id);
					}
				}

				const length = [...new Set(users)].length;
				setOnlineUsers(length);
			})
			.subscribe(async (status) => {
				if (status === "SUBSCRIBED") {
					await channel.track({
						online_at: new Date().toISOString(),
						user_id: data?.user?.id,
					});
				}
			});
		return () => {
			channel.unsubscribe();
		};
		// eslint-disable-next-line
	}, []);

	return (
		<div className="flex items-center gap-2 text-sm">
			<span className="h-5 w-5 rounded-full bg-green-500 animate-pulse"></span>
			<h1 className="flex items-center gap-2">
				{onlineUsers} <PersonIcon /> live on this vote channel
			</h1>
		</div>
	);
}
