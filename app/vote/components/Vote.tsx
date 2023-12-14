"use client";
import { createSupabaseBrower } from "@/lib/supabase/client";
import { IVoteLog } from "@/lib/types";
import { cn } from "@/lib/utils";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

export default function Vote({
	id,
	options,
	vote_log,
	is_expired,
}: {
	id: string;
	options: { [key: string]: number };
	vote_log: IVoteLog;
	is_expired: boolean;
}) {
	const supabase = createSupabaseBrower();
	const router = useRouter();

	useEffect(() => {
		const channel = supabase
			.channel(id)
			.on(
				"postgres_changes",
				{
					event: "UPDATE",
					schema: "public",
					table: "vote_options",
					filter: "vote_id=eq." + id,
				},
				(payload) => {
					setVote(payload.new.options);
				}
			)
			.subscribe();
		return () => {
			channel.unsubscribe();
		};
		// eslint-disable-next-line
	}, []);

	const [vote, setVote] = useState(options);

	const castVote = async (option: string) => {
		if (vote_log) {
			return null;
		}

		if (is_expired) {
			return toast.error("Vote is expired");
		} else {
			toast.promise(rpcUpdateVote(option), {
				loading: "Voting for " + option,
				success: "Successfully vote for " + option,
				error: "Fail to vote for " + option,
			});
		}
	};

	const rpcUpdateVote = async (option: string) => {
		let { error } = await supabase.rpc("update_vote", {
			update_id: id,
			option,
		});
		// call to supabase admin
		if (error) {
			throw "Fail to update vote";
		} else {
			router.refresh();
		}
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
								{key} {highestKey === key ? "🎉" : ""}
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
			{vote_log && (
				<div className="flex items-center gap-2 text-gray-400">
					<InfoCircledIcon />
					<h1 className="text-lg ">
						You voted for{" "}
						<span className="text-yellow-500 font-bold">
							{vote_log?.option}
						</span>{" "}
						on {new Date(vote_log?.created_at!).toDateString()}{" "}
						{new Date(vote_log?.created_at!).toLocaleTimeString()}
					</h1>
				</div>
			)}
		</div>
	);
}
