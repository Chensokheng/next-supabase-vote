"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { ArrowDownIcon } from "@radix-ui/react-icons";

export default function Chat() {
	const chatContainerRef = useRef() as React.MutableRefObject<HTMLDivElement>;
	const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>;
	const [isBottom, setBottom] = useState(true);

	const [chat, setChat] = useState([
		{
			text: "Hello world",
		},
	]);

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
	}, [chat, isBottom]);

	const handleChat = () => {
		const upateChat = [...chat, { text: inputRef.current.value }];
		inputRef.current.value = "";

		setChat(upateChat);
	};
	return (
		<div className="w-full  h-[40rem]  border rounded-md p-5 flex flex-col ">
			<div
				className=" flex-1 overflow-y-auto "
				ref={chatContainerRef}
				onScroll={handleScroll}
			>
				<div className="flex-1 flex flex-col relative ">
					{loading ? (
						<div className="h-screen w-full"></div>
					) : (
						<>
							<div className="flex-1"></div>
							<div className=" space-y-5">
								{chat.map(({ text }, index) => {
									return (
										<div
											className=" p-3 flex items-start gap-5 "
											key={index}
										>
											<Image
												src="/profile.png"
												width={50}
												height={50}
												alt="person"
												className=" rounded-full ring-green-500 ring"
											/>
											<div>
												<h1 className="text-sm text-gray-400">
													{new Date().toDateString()}
												</h1>
												<h1>{text}</h1>
											</div>
										</div>
									);
								})}
							</div>
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
