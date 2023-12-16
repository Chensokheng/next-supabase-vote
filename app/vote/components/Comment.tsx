"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { ChangeEvent, useEffect, useState } from "react";
import MessageLoading from "./MessageLoading";
import { cn } from "@/lib/utils";
import { getVoteComments } from "@/lib/actions/vote";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { IComments } from "@/lib/types";
import Image from "next/image";
import { NUMBER_OF_COMMENTS } from "@/lib/constant";

export default function Comment({ voteId }: { voteId: string }) {
	const [loading, setLoading] = useState(true);
	const [comments, setComment] = useState<IComments>([]);
	const [hasMore, setHasMore] = useState(true);
	const [page, setPage] = useState(0);

	useEffect(() => {
		const timeout = setTimeout(() => {
			document.getElementById("fetch-more")?.click();
		}, 500);
		return () => {
			clearTimeout(timeout);
		};
	}, []);

	const onSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!loading) {
			setLoading(true);
		}

		if (hasMore) {
			const result = JSON.parse(
				await getVoteComments(voteId, page)
			) as PostgrestSingleResponse<IComments>;

			if (result.data) {
				if (result.data.length < NUMBER_OF_COMMENTS) {
					setHasMore(false);
				}
				setPage(page + 1);
				setComment((current) => [...current, ...result.data]);
			}
		}
		setLoading(false);
	};

	return (
		<div className="w-full h-[40rem] border  rounded-md p-5 flex flex-col">
			<div className="flex-1 overflow-y-auto pb-5 ">
				<form onSubmit={onSubmit}>
					<div className="space-y-5">
						{comments.map((comment) => {
							return (
								<div key={comment.id} className=" w-full p-2">
									<div className="flex gap-2 items-start">
										<Image
											src={comment.users?.avatar_url!}
											alt={comment.users?.user_name!}
											width={60}
											height={60}
											className={cn(
												" rounded-full ring-2"
											)}
										/>
										<div>
											<div className="flex items-center gap-1">
												<p>
													{comment.users?.user_name}
												</p>
												<p className="text-sm text-gray-400 ">
													{new Date(
														comment.created_at
													).toDateString()}
												</p>
											</div>
											<p className="font-medium">
												{comment.text}
											</p>
										</div>
									</div>
								</div>
							);
						})}
					</div>

					{loading && <MessageLoading />}

					{hasMore && (
						<Button
							className={cn("w-full", { hidden: loading })}
							variant="outline"
							id="fetch-more"
						>
							Load more
						</Button>
					)}
				</form>
			</div>
			<Input
				autoFocus
				placeholder="comment.."
				className=" z-20"
				onKeyDown={(e) => {
					// 	if (e.key === "Enter") {
					// 		handleChat();
					// 	}
				}}
			/>
		</div>
	);
}
