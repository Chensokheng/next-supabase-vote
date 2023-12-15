"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { ArrowDownIcon } from "@radix-ui/react-icons";
import { createSupabaseBrower } from "@/lib/supabase/client";
import { useChat, useUser } from "@/lib/hook";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import MessageLoading from "./MessageLoading";

export default function Chat({ voteId }: { voteId: string }) {
	const chatContainerRef = useRef() as React.MutableRefObject<HTMLDivElement>;
	const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>;
	const [isBottom, setBottom] = useState(true);
	const useQuery = useQueryClient();

	const { data: user } = useUser();

	const { data: chat, isFetching } = useChat(voteId);

	const [loading, setLoading] = useState(true);

	const handleScroll = () => {
		const { scrollTop, scrollHeight, clientHeight } =
			chatContainerRef.current;

		setBottom(scrollTop + clientHeight === scrollHeight);
	};

	useEffect(() => {
		chatContainerRef.current.scrollTop =
			chatContainerRef.current.scrollHeight;
		setLoading(false);
	}, [loading]);

	useEffect(() => {
		if (isBottom) {
			chatContainerRef.current.scrollTop =
				chatContainerRef.current.scrollHeight;
		}
	}, [chat?.messages?.length, isBottom]);
	const supabase = createSupabaseBrower();

	const handleChat = async () => {
		if (inputRef.current.value.trim()) {
			useQuery.setQueryData(["chat-" + voteId], (data: any) => ({
				...data,
				messages: [
					...data.messages,
					{
						message: inputRef.current.value,
						created_at: new Date().toISOString(),
						users: {
							user_name: user?.user?.user_metadata?.user_name,
							avatar_url: user?.user?.user_metadata?.avatar_url,
						},
					},
				],
			}));

			const { error } = await supabase
				.from("messages")
				.insert({ message: inputRef.current.value, vote_id: voteId });

			if (error) {
				toast.error("Fail to send message!!");
			}
			inputRef.current.value = "";
		}
	};
	const isGettingChat = isFetching && !chat?.messages?.length;
	return (
		<div className="w-full  h-[40rem]  border rounded-md p-5 flex flex-col ">
			<div
				className=" flex-1 overflow-y-auto "
				ref={chatContainerRef}
				onScroll={handleScroll}
			>
				<div className="flex-1 flex flex-col relative h-screen ">
					{loading ? (
						<div className="h-screen w-full"></div>
					) : (
						<>
							<div className="flex-1"></div>
							{isGettingChat ? (
								<MessageLoading />
							) : (
								<div className=" space-y-5">
									{chat?.messages?.map(
										(
											{ message, users, created_at },
											index
										) => {
											return (
												<div
													className=" p-3 flex items-start gap-5 "
													key={index}
												>
													<Image
														src={users?.avatar_url!}
														width={50}
														height={50}
														alt={users?.user_name!}
														className=" rounded-full ring-green-500 ring"
													/>
													<div>
														<h1 className="text-sm text-gray-400">
															{new Date(
																created_at
															).toDateString()}
														</h1>
														<h1>
															{users?.user_name}
														</h1>
														<h1 className="text-gray-400">
															{message}
														</h1>
													</div>
												</div>
											);
										}
									)}
								</div>
							)}
						</>
					)}
				</div>
			</div>
			<div className=" relative space-y-5">
				{!isBottom && (
					<div className="-top-10 h-0 flex items-center justify-center absolute w-full">
						<div
							className=" rounded-full  h-10 w-10 bg-blue-500 flex items-center justify-center"
							onClick={() => setBottom(true)}
						>
							<ArrowDownIcon className=" w-5 h-5" />
						</div>
					</div>
				)}

				<Input
					ref={inputRef}
					autoFocus
					placeholder="send message"
					className=" z-20"
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							handleChat();
						}
					}}
				/>
			</div>
		</div>
	);
}
