"use server";

import { redirect } from "next/navigation";
import createSupabaseServer from "../supabase/server";
import { Json } from "../types/supabase";
import { revalidatePath } from "next/cache";

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
	description?: string;
}) {
	const supabase = await createSupabaseServer();

	const { data: voteId, error } = await supabase.rpc("create_vote", {
		options: data.vote_options,
		title: data.title,
		end_date: new Date(data.end_date).toISOString(),
		description: data.description || "",
	});

	if (error) {
		throw "Fail to create vote." + error.message;
	} else {
		redirect("/vote/" + voteId);
	}
}

export async function updateVotePath(id: string) {
	revalidatePath("/vote/" + id);
}

export async function getVoteById(id: string) {
	const suapbase = await createSupabaseServer();
	return await suapbase.from("vote").select("*").eq("id", id).single();
}

export async function updateVoteById(
	data: {
		end_date: Date;
		description?: string;
		title: string;
	},
	voteId: string
) {
	const suapbase = await createSupabaseServer();
	const { error, data: vote } = await suapbase
		.from("vote")
		.update({
			title: data.title,
			end_date: data.end_date.toISOString(),
			description: data.description,
		})
		.eq("id", voteId);
	if (error) {
		throw error.message;
	}
	revalidatePath("/vote/" + voteId);
	return redirect("/vote/" + voteId);
}
