"use client";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { cn, getFromAndTo } from "@/lib/utils";
import { getVoteComments } from "@/lib/actions/vote";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { IComment } from "@/lib/types";
import Image from "next/image";
import { NUMBER_OF_COMMENTS } from "@/lib/constant";
import { createSupabaseBrower } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { useComment, useUser } from "@/lib/hook";
import { useQueryClient } from "@tanstack/react-query";
import MessageLoading from "./MessageLoading";
import { useAutoAnimate } from "@formkit/auto-animate/react";

export default function Comment({ voteId }: { voteId: string }) {
	const { data } = useUser();
	// const [comments, setComment] = useState<IComment[]>([]);
	const [page, setPage] = useState(0);
	const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>;
	const containerRef = useRef() as React.MutableRefObject<HTMLDivElement>;
	const [isVisible, setIsVisible] = useState(false);
	const supabase = createSupabaseBrower();
	const queryClient = useQueryClient();

	const { data: comments } = useComment(voteId);
	const [hasMore, setHasMore] = useState(false);
	const [loading, setLoading] = useState(comments?.length === 0);

	useEffect(() => {
		fetchComments();
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		const container = containerRef.current;
		container.addEventListener("scroll", handleScroll);
		return () => {
			container.removeEventListener("scroll", handleScroll);
		};
	}, []);
	const handleScroll = () => {
		const yOffset = containerRef.current.scrollTop;
		const threshold = 50;

		// Set visibility based on the scroll position
		setIsVisible(yOffset > threshold);
	};
	const scrollToTop = () => {
		containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
	};

	const fetchComments = async () => {
		if (!loading && comments?.length === 0) {
			setLoading(true);
		}
		const { from, to } = getFromAndTo(page, NUMBER_OF_COMMENTS);

		const result = await supabase
			.from("comments")
			.select("*,users(*)")
			.eq("vote_id", voteId)
			.range(from, to)
			.order("created_at", { ascending: false });

		if (result.data) {
			if (result.data.length >= NUMBER_OF_COMMENTS) {
				setHasMore(true);
			}
			setPage(page + 1);
			if (page === 0) {
				queryClient.setQueryData(["vote-comment-" + voteId], () => [
					...result.data,
				]);
			} else {
				queryClient.setQueryData(
					["vote-comment-" + voteId],
					(current: IComment[]) => [...current, ...result.data]
				);
			}
		}
		setLoading(false);
	};

	const writeComment = async () => {
		const text = inputRef.current.value.trim();
		const id = uuidv4();
		if (text) {
			const newComment: IComment = {
				id,
				send_by: data?.user?.id!,
				created_at: new Date().toISOString(),
				vote_id: voteId,
				text,
				users: {
					user_name: data?.user?.user_metadata?.user_name,
					avatar_url: data?.user?.user_metadata?.avatar_url,
					created_at: "",
					id: data?.user?.id!,
				},
			};
			queryClient.setQueryData(
				["vote-comment-" + voteId],
				(current: IComment[]) => [newComment, ...current]
			);

			containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
			inputRef.current.value = "";
			const { error } = await supabase
				.from("comments")
				.insert({ id, text, vote_id: voteId });
			if (error) {
				toast.error("Fail to comment. ");
			}
		}
	};
	const [animationParent] = useAutoAnimate();

	return (
		<div className="w-full h-[40rem] border  rounded-md p-5 flex flex-col">
			<div
				className="flex-1 overflow-y-auto pb-5 relative "
				ref={containerRef}
			>
				<div className="space-y-5">
					<div ref={animationParent}>
						{comments?.map((comment) => {
							return (
								<div
									key={comment.id}
									className=" w-full p-2"
									id={comment.id}
								>
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

					{loading ? (
						<MessageLoading />
					) : (
						<>
							{!comments?.length && <p>No comment 😅</p>}{" "}
							{hasMore && (
								<Button
									className={cn("w-full")}
									variant="outline"
									id="fetch-more"
									onClick={fetchComments}
								>
									Load more
								</Button>
							)}
						</>
					)}
				</div>

				<div
					className={` sticky w-full bottom-0 ${
						!isVisible ? "hidden" : ""
					}`}
					onClick={scrollToTop}
				>
					<div className="w-full flex items-center justify-center">
						<div className=" h-10 w-10 rounded-full flex items-center justify-center bg-blue-500">
							&#8593;
						</div>
					</div>
				</div>
			</div>
			<Input
				ref={inputRef}
				autoFocus
				placeholder="comment.."
				className=" z-20"
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						writeComment();
					}
				}}
			/>
		</div>
	);
}
