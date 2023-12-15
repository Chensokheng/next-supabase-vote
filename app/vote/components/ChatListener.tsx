"use client";
import { useUser } from "@/lib/hook";
import { createSupabaseBrower } from "@/lib/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";

export default function ChatListener({ voteId }: { voteId: string }) {
	const supabase = createSupabaseBrower();
	const useQuery = useQueryClient();
	const { data: user } = useUser();

	useEffect(() => {
		const channel = supabase
			.channel("chat/" + voteId)
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "messages",
					filter: "vote_id=eq." + voteId,
				},
				async (payload) => {
					if (user?.user?.id !== payload.new.send_by) {
						const { data: user } = await supabase
							.from("users")
							.select("*")
							.eq("id", payload.new.send_by)
							.single();

						useQuery.setQueryData(
							["chat-" + voteId],
							(data: any) => ({
								...data,
								messages: [
									...data.messages,
									{
										...payload.new,
										users: user,
									},
								],
							})
						);
					}
				}
			)
			.subscribe();
		return () => {
			channel.unsubscribe();
		};
		// eslint-disable-next-line
	}, []);

	return <></>;
}
