"use client";
import { createSupabaseBrower } from "@/lib/supabase/client";
import { cn, getHightValueObjectKey } from "@/lib/utils";
import { redirect } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { InfoCircledIcon } from "@radix-ui/react-icons";

import { useGetVote } from "@/lib/hook";
import VoteLoading from "./VoteLoading";
import { useQueryClient } from "@tanstack/react-query";

export default function Vote({ id }: { id: string }) {
	const supabase = createSupabaseBrower();
	const queryClient = useQueryClient();
	const { data, isFetching } = useGetVote(id);

	useEffect(() => {
		const channel = supabase
			.channel("vote" + id)
			.on(
				"postgres_changes",
				{
					event: "UPDATE",
					schema: "public",
					table: "vote_options",
					filter: "vote_id=eq." + id,
				},
				(payload) => {
					console.log(payload.new.options);

					queryClient.setQueryData(
						["vote-" + id],
						(currentVote: any) => ({
							...currentVote,
							voteOptions: payload.new.options,
						})
					);
				}
			)
			.subscribe();
		return () => {
			channel.unsubscribe();
		};
		// eslint-disable-next-line
	}, []);

	const totalVote = useMemo(() => {
		if (data?.voteOptions) {
			return Object.values(data.voteOptions).reduce(
				(acc, value) => acc + value,
				0
			);
		}
	}, [data?.voteOptions]);
	const highestKey = useMemo(() => {
		if (data?.voteOptions) {
			return getHightValueObjectKey(data?.voteOptions);
		}
	}, [data?.voteOptions]);

	if (isFetching && !data) {
		return <VoteLoading />;
	}

	if (!data) {
		return redirect("/");
	}

	const { voteLog, voteOptions, isExpired } = data;

	const rpcUpdateVote = async (option: string) => {
		let { error } = await supabase.rpc("update_vote", {
			update_id: id,
			option,
		});
		if (error) {
			throw "Fail to update vote";
		} else {
			queryClient.invalidateQueries({ queryKey: ["vote-" + id] });
		}
	};

	const castVote = async (option: string) => {
		if (voteLog) {
			return null;
		}
		if (isExpired) {
			return toast.error("Vote is expired");
		} else {
			toast.promise(rpcUpdateVote(option), {
				loading: "Voting for " + option,
				success: "Successfully vote for " + option,
				error: "Fail to vote for " + option,
			});
		}
	};

	return (
		<div className="space-y-10">
			<div>
				{Object.keys(voteOptions).map((key, index) => {
					const percentage = Math.round(
						(voteOptions[key as keyof typeof voteOptions] * 100) /
							totalVote!
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
											{
												voteOptions[
													key as keyof typeof voteOptions
												]
											}
										</h1>
									</div>
								</div>
							</div>
						</div>
					);
				})}
			</div>
			{voteLog && (
				<div className="flex items-center gap-2 text-gray-400">
					<InfoCircledIcon />
					<h1 className="text-lg ">
						You voted for{" "}
						<span className="text-yellow-500 font-bold">
							{voteLog?.option}
						</span>{" "}
						on {new Date(voteLog?.created_at!).toDateString()}{" "}
						{new Date(voteLog?.created_at!).toLocaleTimeString()}
					</h1>
				</div>
			)}
		</div>
	);
}
