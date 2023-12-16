"use client";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import MessageLoading from "./MessageLoading";
import { cn } from "@/lib/utils";
import { getVoteComments } from "@/lib/actions/vote";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { IComment } from "@/lib/types";
import Image from "next/image";
import { NUMBER_OF_COMMENTS } from "@/lib/constant";
import { createSupabaseBrower } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { useUser } from "@/lib/hook";

export default function Comment({ voteId }: { voteId: string }) {
	const { data } = useUser();
	const [loading, setLoading] = useState(true);
	const [comments, setComment] = useState<IComment[]>([]);
	const [hasMore, setHasMore] = useState(true);
	const [page, setPage] = useState(0);
	const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>;
	const containerRef = useRef() as React.MutableRefObject<HTMLDivElement>;
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const timeout = setTimeout(() => {
			document.getElementById("fetch-more")?.click();
		}, 500);
		return () => {
			clearTimeout(timeout);
		};
	}, []);
	useEffect(() => {
		const container = containerRef.current;

		// Add scroll event listener when the component mounts
		container.addEventListener("scroll", handleScroll);

		// Remove scroll event listener when the component unmounts
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

	const onSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!loading) {
			setLoading(true);
		}

		if (hasMore) {
			const result = JSON.parse(
				await getVoteComments(voteId, page)
			) as PostgrestSingleResponse<IComment[]>;

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

	const supabase = createSupabaseBrower();

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
			setComment((current) => [newComment, ...current]);
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

	return (
		<div className="w-full h-[40rem] border  rounded-md p-5 flex flex-col">
			<div
				className="flex-1 overflow-y-auto pb-5 relative "
				ref={containerRef}
			>
				<form onSubmit={onSubmit}>
					<div className="space-y-5">
						{comments.map((comment) => {
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
				</form>
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
