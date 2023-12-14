import React from "react";
import Vote from "./Vote";
import createSupabaseServer from "@/lib/supabase/server";
import { sortObject } from "@/lib/utils";
import { IVoteLog } from "@/lib/types";
import { redirect } from "next/navigation";

export default async function VoteFetcher({ voteId }: { voteId: string }) {
	const supabase = await createSupabaseServer();

	const { data, error } = await supabase
		.from("vote")
		.select("*,vote_options(*),vote_log(*)")
		.eq("id", voteId)
		.single();

	if (!data || error) {
		return redirect("/");
	}

	const initVote = sortObject(
		data?.vote_options?.options as { [key: string]: number }
	);

	return (
		<Vote
			initVote={initVote}
			id={voteId}
			voteLog={data?.vote_log[0] as IVoteLog}
			isExpired={data?.end_date! < new Date().toISOString()}
		/>
	);
}
