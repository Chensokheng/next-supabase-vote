import { useUser } from "@/lib/hook";
import { createSupabaseBrower } from "@/lib/supabase/client";
import { IComment } from "@/lib/types";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export default function CommentListener({ voteId }: { voteId: string }) {
	const supabase = createSupabaseBrower();

	const { data } = useUser();
	const queryClient = useQueryClient();

	useEffect(() => {
		const channel = supabase
			.channel("comments" + voteId)
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "comments",
				},
				async (payload) => {
					const newComent = payload.new;
					if (newComent.send_by !== data?.user?.id) {
						const { data: user } = await supabase
							.from("users")
							.select("*")
							.eq("id", newComent.send_by!)
							.single();

						queryClient.setQueryData(
							["vote-comment-" + voteId],
							(current: IComment[]) => [
								{ ...newComent, users: user },
								...current,
							]
						);
					}
				}
			)
			.on(
				"postgres_changes",
				{
					event: "UPDATE",
					schema: "public",
					table: "comments",
				},
				async (payload) => {
					const newComent = payload.new;
					if (newComent.send_by !== data?.user?.id) {
						queryClient.setQueryData(
							["vote-comment-" + voteId],
							(currentComments: IComment[]) => [
								...currentComments.map((comment) => {
									if (comment.id === newComent.id) {
										return {
											...comment,
											text: newComent.text,
											is_edit: newComent.is_edit,
										};
									}
									return comment;
								}),
							]
						);
					}
				}
			)
			.on(
				"postgres_changes",
				{
					event: "DELETE",
					schema: "public",
					table: "comments",
				},
				async (payload) => {
					const commentId = payload.old?.id;

					queryClient.setQueryData(
						["vote-comment-" + voteId],
						(currentComments: IComment[]) => [
							...currentComments.filter(
								(comment) => comment.id !== commentId
							),
						]
					);
				}
			)
			.subscribe();

		return () => {
			channel.unsubscribe();
		};

		// eslint-disable-next-line
	}, []);

	return null;
}
