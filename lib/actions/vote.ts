"use server";

import { redirect } from "next/navigation";
import createSupabaseServer from "../supabase/server";
import { Json } from "../types/supabase";
import { revalidatePath } from "next/cache";
import createSupabaseServerAdmin from "../supabase/admin";
import { getFromAndTo } from "../utils";
import { NUMBER_OF_COMMENTS } from "../constant";

export async function listActiveVotes() {
	const supabase = await createSupabaseServer();

	return supabase
		.from("vote")
		.select("*,users(*)")
		.filter("end_date", "gte", new Date().toISOString())
		.order("created_at", { ascending: true });
}

export async function listExpiredVotes() {
	const supabase = await createSupabaseServer();

	return supabase
		.from("vote")
		.select("*,users(*)")
		.filter("end_date", "lte", new Date().toISOString())
		.order("created_at", { ascending: true });
}

export async function createVote(data: {
	vote_options: Json;
	end_date: Date;
	title: string;
}) {
	const supabase = await createSupabaseServer();

	const { data: voteId, error } = await supabase.rpc("create_vote", {
		options: data.vote_options,
		title: data.title,
		end_date: new Date(data.end_date).toISOString(),
	});

	if (error) {
		throw "Fail to create vote." + error.message;
	} else {
		redirect("/vote/" + voteId);
	}
}

export async function updateVotePath(id: string) {
	revalidatePath("/vote/" + id);
	revalidatePath("/");
}

export async function getVoteComments(voteId: string, page: number) {
	const { from, to } = getFromAndTo(page, NUMBER_OF_COMMENTS);

	console.log(from, to);
	const supabase = await createSupabaseServerAdmin();

	const result = await supabase
		.from("comments")
		.select("*,users(*)")
		.eq("vote_id", voteId)
		.order("created_at", { ascending: true })
		.range(from, to);

	return JSON.stringify(result);
}
