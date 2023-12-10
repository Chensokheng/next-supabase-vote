"use client";
import { cn } from "@/lib/utils";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import React, { useMemo, useState } from "react";
import TimeCountDown from "./TimeCountDown";

export default function Vote() {
	const voteDetail = {
		angular: 0,
		react: 0,
		Javascript: 0,
	};
	const [vote, setVote] = useState(voteDetail);

	const castVote = (key: string) => {
		const currentVote = { ...vote };
		currentVote[key as keyof typeof vote] += 5;
		setVote(currentVote);
	};

	const highestKey = useMemo(() => {
		let maxValue = -Infinity;
		let hightKey = "";
		for (const [key, value] of Object.entries(vote)) {
			if (value > maxValue) {
				hightKey = key;
				maxValue = value;
			} else if (value === maxValue) {
				hightKey = "";
			}
		}
		return hightKey;
	}, [vote]);

	const totalVote = useMemo(() => {
		return Object.values(vote).reduce((acc, value) => acc + value, 0);
	}, [vote]);

	return (
		<div className="space-y-10">
			<div>
				{Object.keys(vote).map((key, index) => {
					const percentage = Math.round(
						(vote[key as keyof typeof vote] * 100) / totalVote
					);
					return (
						<div
							key={index}
							className="flex items-center w-full group cursor-pointer"
							onClick={() => castVote(key)}
						>
							<h1 className=" w-28 text-lg break-words select-none ">
								{key}
							</h1>
							<div className="flex-1 flex items-center gap-2">
								<div className="py-3 pr-5 border-l border-zinc-400 flex-1 ">
									<div
										className={cn(
											"h-16 border-y border-r rounded-e-xl relative transition-all group-hover:border-zinc-400",
											{
												"bg-yellow-500":
													highestKey === key,
											}
										)}
										style={{
											width: `${percentage}%`,
										}}
									>
										<h1 className=" absolute top-1/2 -right-8  -translate-y-1/2 select-none">
											{vote[key as keyof typeof vote]}
										</h1>
									</div>
								</div>
							</div>
						</div>
					);
				})}
			</div>
			<h1 className="text-gray-400 flex items-center gap-2">
				<InfoCircledIcon /> You can vote up to five times
			</h1>
		</div>
	);
}
