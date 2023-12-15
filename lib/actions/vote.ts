"use server";

import { redirect } from "next/navigation";
import createSupabaseServer from "../supabase/server";
import { Json } from "../types/supabase";

export async function listActiveVotes() {
	const supabase = await createSupabaseServer();

	return supabase
		.from("vote")
		.select("*,users(*)")
		.eq("public", true)
		.filter("end_date", "gte", new Date().toISOString())
		.order("created_at", { ascending: true });
}

export async function listExpiredVotes() {
	const supabase = await createSupabaseServer();

	return supabase
		.from("vote")
		.select("*,users(*)")
		.eq("public", true)
		.filter("end_date", "lte", new Date().toISOString())
		.order("created_at", { ascending: true });
}

export async function createVote(data: {
	vote_options: Json;
	end_date: Date;
	public: boolean;
	title: string;
}) {
	const supabase = await createSupabaseServer();

	const { data: voteId, error } = await supabase.rpc("create_vote", {
		options: data.vote_options,
		title: data.title,
		public: data.public,
		end_date: new Date(data.end_date).toISOString(),
	});

	if (error) {
		throw "Fail to create vote." + error.message;
	} else {
		redirect("/vote/" + voteId);
	}
}

export async function castVote() {
	console.log(process.env.test);
}
