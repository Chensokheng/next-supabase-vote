"use client";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useRef, useState } from "react";
import { cn, getFromAndTo } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";

import { IComment } from "@/lib/types";
import Image from "next/image";
import { NUMBER_OF_COMMENTS } from "@/lib/constant";
import { createSupabaseBrower } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { useComment, useUser } from "@/lib/hook";
import { useQueryClient } from "@tanstack/react-query";
import MessageLoading from "./MessageLoading";
import autoAnimate from "@formkit/auto-animate";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";

export default function Comment({ voteId }: { voteId: string }) {
	const { data } = useUser();
	const [page, setPage] = useState(0);
	const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>;
	const containerRef = useRef() as React.MutableRefObject<HTMLDivElement>;
	let commentRef = useRef() as any;

	const [isVisible, setIsVisible] = useState(false);
	const supabase = createSupabaseBrower();
	const queryClient = useQueryClient();

	const { data: comments } = useComment(voteId);
	const [hasMore, setHasMore] = useState(false);
	const [loading, setLoading] = useState(true);

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
				autoAnimate(commentRef.current);
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
				is_edit: false,
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

	return (
		<div className="w-full h-[40rem] border  rounded-md p-5 flex flex-col">
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
			<div
				className="flex-1 overflow-y-auto pt-10 relative "
				ref={containerRef}
			>
				<div className="space-y-5">
					<div ref={commentRef}>
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
										<div className="w-full">
											<div className="flex items-center justify-between w-full">
												<div className="flex flex-col sm:flex-row sm:items-center gap-1">
													<p>
														{
															comment.users
																?.user_name
														}
													</p>
													<p className="text-sm text-gray-400 ">
														{new Date(
															comment.created_at
														).toDateString()}
													</p>
													{comment.is_edit && (
														<p className="text-gray-400">
															edited
														</p>
													)}
												</div>
												{comment.send_by ===
													data?.user?.id && (
													<CommentActions
														id={comment.id}
														voteId={voteId}
														text={comment.text}
													/>
												)}
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
		</div>
	);
}

const CommentActions = ({
	id,
	voteId,
	text,
}: {
	id: string;
	voteId: string;
	text: string;
}) => {
	const supabase = createSupabaseBrower();
	const queryClient = useQueryClient();
	const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>;
	const deleteComment = async () => {
		queryClient.setQueryData(
			["vote-comment-" + voteId],
			(currentComments: IComment[]) => [
				...currentComments.filter((comment) => comment.id !== id),
			]
		);
		const { error } = await supabase.from("comments").delete().eq("id", id);
		if (error) {
			toast.error("Fail to remove comment.");
		}
	};

	const editComment = async () => {
		const editText = inputRef.current.value.trim();
		if (editText === text || !editText) {
			return null;
		} else {
			queryClient.setQueryData(
				["vote-comment-" + voteId],
				(currentComments: IComment[]) => [
					...currentComments.map((comment) => {
						if (comment.id === id) {
							comment.text = editText;
							comment.is_edit = true;
							return comment;
						}
						return comment;
					}),
				]
			);
			document.getElementById("close-action-" + id)?.click();
			const { error } = await supabase
				.from("comments")
				.update({ text: editText })
				.eq("id", id);
			if (error) {
				toast.error("Fail to update comment.");
			}
		}
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant="ghost"
					className="h-8 w-8 p-0"
					id={`close-action-${id}`}
				>
					<span className="sr-only">Open menu</span>
					<MoreHorizontal className="h-4 w-4" />
				</Button>
			</PopoverTrigger>
			<PopoverContent align="end" className="w-[200px]">
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button
							variant="ghost"
							className="flex items-center justify-between cursor-pointer w-full"
						>
							Delete <TrashIcon />
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>
								Are you absolutely sure?
							</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This will
								permanently delete your account and remove your
								data from our servers.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction onClick={deleteComment}>
								Continue
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button
							variant="ghost"
							className="flex items-center justify-between cursor-pointer w-full"
						>
							Edit <Pencil1Icon />
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Edit</AlertDialogTitle>
						</AlertDialogHeader>
						<AlertDialogDescription>
							Edit your comment.
						</AlertDialogDescription>
						<Input defaultValue={text} ref={inputRef} />
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction onClick={editComment}>
								Continue
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</PopoverContent>
		</Popover>
	);
};
