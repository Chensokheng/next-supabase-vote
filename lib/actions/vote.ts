"use server";

import { redirect } from "next/navigation";
import createSupabaseServer from "../supabase/server";
import { Json } from "../types/supabase";

export async function listVotes() {
	const supabase = await createSupabaseServer();

	return supabase
		.from("vote")
		.select("*,users(*)")
		.eq("is_unlist", false)
		.order("created_at", { ascending: true });
}

export async function createVote(data: {
	placeholder_options: Json;
	end_date: Date;
	is_unlist: boolean;
	title: string;
}) {
	const supabase = await createSupabaseServer();

	const { data: vote, error } = await supabase
		.from("vote")
		.insert({
			placeholder_options: data.placeholder_options,
			title: data.title,
			end_date: data.end_date.toISOString(),
		})
		.select("id")
		.single();

	if (error) {
		throw "Fail to create";
	} else {
		redirect("/vote/" + vote?.id);
	}
}

export async function castVote() {
	console.log(process.env.test);
}
